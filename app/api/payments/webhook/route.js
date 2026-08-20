import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Partner from '@/models/Partner';

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-paystack-signature');

    // Verify webhook signature
    const crypto = require('crypto');
    const hash = crypto
      .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
      .update(body)
      .digest('hex');

    if (hash !== signature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);

    // Handle different event types
    switch (event.event) {
      case 'charge.success':
        await handleChargeSuccess(event.data);
        break;
      
      case 'charge.failed':
        await handleChargeFailed(event.data);
        break;
      
      case 'charge.pending':
        await handleChargePending(event.data);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.event}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// Handle successful charge
async function handleChargeSuccess(data) {
  await connectToDatabase();

  const reference = data.reference;
  const amount = data.amount / 100; // Convert from kobo to naira
  const email = data.customer?.email;
  const paystackId = data.id;

  console.log(`✅ Payment successful: ${reference} - ₦${amount}`);

  // Find payment by reference
  let payment = await Payment.findOne({ reference });

  if (!payment) {
    console.log(`⚠️ Payment not found for reference: ${reference}`);
    return;
  }

  // Update payment status
  payment.status = 'success';
  payment.paystackId = paystackId;
  payment.amount = amount;
  payment.paidAt = new Date();
  payment.paymentData = data;

  await payment.save();

  console.log(`✅ Payment updated: ${reference} - ${payment.status}`);

  // Update partner's total giving
  if (payment.partnerId) {
    const partner = await Partner.findById(payment.partnerId);
    if (partner) {
      partner.totalGiven = (partner.totalGiven || 0) + amount;
      await partner.save();
      console.log(`✅ Partner ${partner.email} total giving updated: ₦${partner.totalGiven}`);
    }
  }
}

// Handle failed charge
async function handleChargeFailed(data) {
  await connectToDatabase();

  const reference = data.reference;

  console.log(`❌ Payment failed: ${reference}`);

  const payment = await Payment.findOne({ reference });

  if (!payment) {
    console.log(`⚠️ Payment not found for reference: ${reference}`);
    return;
  }

  payment.status = 'failed';
  payment.paymentData = data;
  await payment.save();

  console.log(`❌ Payment marked as failed: ${reference}`);
}

// Handle pending charge
async function handleChargePending(data) {
  await connectToDatabase();

  const reference = data.reference;

  console.log(`⏳ Payment pending: ${reference}`);

  const payment = await Payment.findOne({ reference });

  if (!payment) {
    console.log(`⚠️ Payment not found for reference: ${reference}`);
    return;
  }

  payment.status = 'pending';
  payment.paymentData = data;
  await payment.save();

  console.log(`⏳ Payment marked as pending: ${reference}`);
}