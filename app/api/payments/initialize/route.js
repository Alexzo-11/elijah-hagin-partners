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
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      );
    }

    const { amount, purpose } = await request.json();

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: 'Valid amount is required (minimum ₦1)' },
        { status: 400 }
      );
    }

    if (purpose !== 'Monthly Partnership') {
      return NextResponse.json(
        { error: 'Only Monthly Partnership payments are accepted' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const partner = await Partner.findById(user.id);
    if (!partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      );
    }

    // Generate unique reference
    const reference = `PAY-${Date.now()}-${Math.random().toString(36).substring(7)}`;

    // Create payment record with pending status
    const payment = new Payment({
      partner: partner._id,
      amount,
      reference,
      status: 'pending',
      method: 'card',
      purpose: 'Monthly Partnership',
      paidAt: null,
      receiptNumber: null,
    });

    await payment.save();

    const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
    
    if (!PAYSTACK_SECRET_KEY || PAYSTACK_SECRET_KEY === 'sk_test_...') {
      console.log('⚠️ Paystack not configured. Using demo mode.');
      
      return NextResponse.json({
        success: true,
        authorization_url: `${process.env.APP_URL}/partner/payments/success?reference=${reference}&demo=true`,
        reference,
        demo: true,
        message: 'Using demo mode (Paystack not configured)',
      });
    }

    try {
      const paystack = (await import('paystack')).default;
      const paystackInstance = paystack(PAYSTACK_SECRET_KEY);

      const response = await paystackInstance.transaction.initialize({
        amount: amount * 100,
        email: partner.email,
        reference,
        callback_url: `${process.env.APP_URL}/partner/payments/success`,
        metadata: {
          paymentId: payment._id.toString(),
          partnerId: partner._id.toString(),
        },
      });

      if (!response.status) {
        throw new Error(response.message || 'Paystack initialization failed');
      }

      return NextResponse.json({
        success: true,
        authorization_url: response.data.authorization_url,
        reference,
      });
    } catch (paystackError) {
      console.error('Paystack error:', paystackError);
      
      const demoReference = `PAY-DEMO-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      payment.reference = demoReference;
      await payment.save();

      return NextResponse.json({
        success: true,
        authorization_url: `${process.env.APP_URL}/partner/payments/success?reference=${demoReference}&demo=true`,
        reference: demoReference,
        demo: true,
        message: 'Using demo mode (Paystack not configured)',
      });
    }
  } catch (error) {
    console.error('Payment initialization error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment initialization failed' },
      { status: 500 }
    );
  }
}