import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Payment from '@/models/Payment';

export async function GET(request, { params }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Await params before accessing
    const { id } = await params;
    await connectToDatabase();

    const payments = await Payment.find({ partner: id })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      payments: payments.map(p => ({
        id: p._id,
        reference: p.reference,
        amount: p.amount,
        method: p.method,
        status: p.status,
        date: new Date(p.createdAt).toISOString().split('T')[0],
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