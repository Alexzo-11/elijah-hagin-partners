import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Partner from '@/models/Partner';

export async function POST(request) {
  try {
    const body = await request.json();
    const event = body.event;

    // Verify signature in production
    // const signature = request.headers.get('x-paystack-signature');
    // ... signature verification

    if (event === 'charge.success') {
      const data = body.data;
      const reference = data.reference;

      await connectToDatabase();

      const payment = await Payment.findOne({ reference });
      if (!payment) {
        return NextResponse.json(
          { error: 'Payment not found' },
          { status: 404 }
        );
      }

      // Only update if not already successful
      if (payment.status !== 'success') {
        const receiptNumber = `RCP-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        
        payment.status = 'success';
        payment.paidAt = new Date(data.paid_at);
        payment.receiptNumber = receiptNumber;

        const partner = await Partner.findById(payment.partner);
        if (partner) {
          partner.totalContributed = (partner.totalContributed || 0) + payment.amount;
          partner.lastPaymentDate = new Date();
          await partner.save();
        }

        await payment.save();
        console.log(`✅ Payment ${reference} marked as success`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}