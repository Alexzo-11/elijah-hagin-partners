import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Partner from '@/models/Partner';

export async function GET(request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        { error: 'Reference is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find payment
    const payment = await Payment.findOne({ reference });
    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Verify with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const paystackData = await paystackResponse.json();

    if (paystackData.status && paystackData.data.status === 'success') {
      // Update payment to success
      payment.status = 'success';
      payment.paidAt = new Date();
      payment.paymentData = paystackData.data;
      await payment.save();

      // Update partner's total giving
      const partner = await Partner.findById(payment.partnerId);
      if (partner) {
        partner.totalGiven = (partner.totalGiven || 0) + payment.amount;
        await partner.save();
      }

      return NextResponse.json({
        success: true,
        status: 'success',
        payment: {
          id: payment._id,
          amount: payment.amount,
          reference: payment.reference,
          status: payment.status,
        },
      });
    } else if (paystackData.data && paystackData.data.status === 'pending') {
      payment.status = 'pending';
      await payment.save();

      return NextResponse.json({
        success: true,
        status: 'pending',
        payment: {
          id: payment._id,
          amount: payment.amount,
          reference: payment.reference,
          status: payment.status,
        },
      });
    } else {
      payment.status = 'failed';
      await payment.save();

      return NextResponse.json({
        success: false,
        status: 'failed',
        error: 'Payment verification failed',
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
}