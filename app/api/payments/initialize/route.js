import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Partner from '@/models/Partner';

export async function POST(request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { amount, email, paymentMethod } = await request.json();

    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: 'Amount must be at least ₦100' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Get partner
    const partner = await Partner.findById(user.id);
    if (!partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      );
    }

    // Generate unique reference
    const reference = `EXO-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Create payment record with 'pending' status
    const payment = new Payment({
      partnerId: partner._id,
      partnerEmail: partner.email,
      reference: reference,
      amount: amount,
      status: 'pending', // Start as pending
      method: paymentMethod || 'paystack',
      createdAt: new Date(),
    });

    await payment.save();

    // Initialize Paystack transaction
    const paystackResponse = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email || partner.email,
        amount: amount * 100, // Convert to kobo
        reference: reference,
        callback_url: `${process.env.NEXTAUTH_URL}/partner/payments/success?reference=${reference}`,
        metadata: {
          partnerId: partner._id.toString(),
          partnerEmail: partner.email,
        },
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      // If Paystack fails, mark payment as failed
      payment.status = 'failed';
      await payment.save();

      return NextResponse.json(
        { error: paystackData.message || 'Failed to initialize payment' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      authorization_url: paystackData.data.authorization_url,
      reference: reference,
      paymentId: payment._id,
    });
  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}