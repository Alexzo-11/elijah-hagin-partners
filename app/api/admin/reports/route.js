import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Partner from '@/models/Partner';

export async function GET(request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'last30';

    await connectToDatabase();

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    if (range === 'last30') startDate.setDate(now.getDate() - 30);
    else if (range === 'last90') startDate.setDate(now.getDate() - 90);
    else if (range === 'last365') startDate.setFullYear(now.getFullYear() - 1);

    // Get payments in range
    const payments = await Payment.find({
      createdAt: { $gte: startDate, $lte: now }
    });

    const totalTransactions = payments.length;
    const successfulPayments = payments.filter(p => p.status === 'success').length;
    const failedPayments = payments.filter(p => p.status === 'failed').length;
    const totalIncome = payments
      .filter(p => p.status === 'success')
      .reduce((sum, p) => sum + p.amount, 0);

    // Get new partners in range
    const newPartners = await Partner.countDocuments({
      createdAt: { $gte: startDate, $lte: now }
    });

    return NextResponse.json({
      totalTransactions,
      newPartners,
      successfulPayments,
      failedPayments,
      totalIncome,
    });
  } catch (error) {
    console.error('Report error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}