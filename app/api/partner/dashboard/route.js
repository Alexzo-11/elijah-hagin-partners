import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Partner from '@/models/Partner';
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

    const partner = await Partner.findById(user.id);
    if (!partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      );
    }

    // Get all payments for this partner
    const allPayments = await Payment.find({ partner: partner._id }).sort({ createdAt: -1 });
    
    // Calculate totals from real data
    const successfulPayments = allPayments.filter(p => p.status === 'success');
    const totalContributions = successfulPayments.reduce((sum, p) => sum + p.amount, 0);
    
    const lastPayment = successfulPayments.length > 0 ? successfulPayments[0] : null;

    // Get recent payments (last 5)
    const recentPayments = allPayments.slice(0, 5).map(p => ({
      id: p._id,
      reference: p.reference,
      amount: p.amount,
      status: p.status,
      date: new Date(p.createdAt).toISOString().split('T')[0],
      purpose: p.purpose || 'Monthly Partnership',
    }));

    return NextResponse.json({
      stats: {
        totalContributions,
        monthlyCommitment: partner.monthlyCommitment || partner.partnershipAmount || 0,
        lastPayment: lastPayment ? lastPayment.amount : 0,
        lastPaymentDate: lastPayment ? lastPayment.createdAt : null,
        payments: successfulPayments.length,
        growth: 12.5, // Calculate from previous month in production
        partnershipType: partner.partnershipType || 'SILVER',
        partnershipAmount: partner.partnershipAmount || 0,
      },
      recentPayments,
    });
  } catch (error) {
    console.error('Partner dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard data' },
      { status: 500 }
    );
  }
}