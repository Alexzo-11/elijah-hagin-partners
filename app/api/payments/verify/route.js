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

    const { reference } = await request.json();

    if (!reference) {
      return NextResponse.json(
        { error: 'Reference is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the payment
    const payment = await Payment.findOne({ reference });
    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    // Get partner details
    const partner = await Partner.findById(payment.partner);
    if (!partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      );
    }

    // Check if it's a demo payment
    if (reference.includes('DEMO')) {
      const receiptNumber = `RCP-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      
      payment.status = 'success';
      payment.paidAt = new Date();
      payment.receiptNumber = receiptNumber;
      
      // Update partner
      if (partner) {
        partner.totalContributed = (partner.totalContributed || 0) + payment.amount;
        partner.lastPaymentDate = new Date();
        await partner.save();
      }
      
      await payment.save();

      return NextResponse.json({
        success: true,
        payment: {
          id: payment._id,
          reference: payment.reference,
          status: 'success',
          amount: payment.amount,
          receiptNumber: payment.receiptNumber,
          createdAt: payment.createdAt,
          purpose: payment.purpose,
          method: payment.method,
          partnerName: `${partner.firstName} ${partner.surname}`,
          partnerEmail: partner.email,
          partnerPhone: partner.phone || 'N/A',
          partnershipType: partner.partnershipType || 'SILVER',
          address: partner.residentialAddress || 'N/A',
        },
        demo: true,
      });
    }

    // Verify with Paystack
    try {
      // Dynamic import for Paystack
      const paystack = (await import('paystack')).default;
      const paystackInstance = paystack(process.env.PAYSTACK_SECRET_KEY);

      const response = await paystackInstance.transaction.verify(reference);

      if (!response.status) {
        throw new Error(response.message || 'Verification failed');
      }

      const paymentData = response.data;

      if (paymentData.status === 'success') {
        const receiptNumber = `RCP-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        
        payment.status = 'success';
        payment.paidAt = new Date(paymentData.paid_at);
        payment.receiptNumber = receiptNumber;

        // Update partner total contributions
        if (partner) {
          partner.totalContributed = (partner.totalContributed || 0) + payment.amount;
          partner.lastPaymentDate = new Date();
          await partner.save();
        }

        await payment.save();

        return NextResponse.json({
          success: true,
          payment: {
            id: payment._id,
            reference: payment.reference,
            status: 'success',
            amount: payment.amount,
            receiptNumber: payment.receiptNumber,
            createdAt: payment.createdAt,
            purpose: payment.purpose,
            method: payment.method,
            partnerName: `${partner.firstName} ${partner.surname}`,
            partnerEmail: partner.email,
            partnerPhone: partner.phone || 'N/A',
            partnershipType: partner.partnershipType || 'SILVER',
            address: partner.residentialAddress || 'N/A',
          },
        });
      } else {
        // Payment failed
        payment.status = 'failed';
        await payment.save();

        return NextResponse.json({
          success: false,
          error: 'Payment verification failed',
          payment: {
            id: payment._id,
            reference: payment.reference,
            status: 'failed',
            amount: payment.amount,
          },
        });
      }
    } catch (paystackError) {
      console.error('Paystack verification error:', paystackError);
      
      // If Paystack verification fails, mark as failed
      payment.status = 'failed';
      await payment.save();

      return NextResponse.json(
        { 
          error: 'Payment verification failed', 
          details: paystackError.message 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment: ' + error.message },
      { status: 500 }
    );
  }
}