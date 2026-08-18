import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Payment from '@/models/Payment';

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const payments = await Payment.find({})
      .populate('partner', 'firstName surname email')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      payments: payments.map(p => ({
        id: p._id,
        reference: p.reference,
        amount: p.amount,
        partner: p.partner ? `${p.partner.firstName} ${p.partner.surname}` : 'Unknown',
        date: new Date(p.createdAt).toISOString().split('T')[0],
        status: p.status,
        method: p.method || 'Card',
      })),
    });
  } catch (error) {
    console.error('Payments fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}