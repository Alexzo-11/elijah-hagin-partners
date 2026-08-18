import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Payment from '@/models/Payment';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Get all payments for this partner, sorted by newest first
    const payments = await Payment.find({ partner: user.id })
      .sort({ createdAt: -1 })
      .lean();

    // Format payments for response
    const formattedPayments = payments.map(p => ({
      id: p._id,
      reference: p.reference,
      amount: p.amount,
      status: p.status,
      date: new Date(p.createdAt).toISOString().split('T')[0],
      purpose: p.purpose || 'Monthly Partnership',
      method: p.method || 'Card',
      receiptNumber: p.receiptNumber || null,
    }));

    return NextResponse.json({
      payments: formattedPayments,
    });
  } catch (error) {
    console.error('Payment history error:', error);
    return NextResponse.json(
      { error: 'Failed to load payment history' },
      { status: 500 }
    );
  }
}