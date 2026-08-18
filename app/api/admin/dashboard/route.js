import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Partner from '@/models/Partner';
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

    // Get all partners
    const partners = await Partner.find({});
    const totalPartners = partners.length;
    const activePartners = partners.filter(p => p.isActive).length;
    const newPartners = partners.filter(p => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return new Date(p.createdAt) >= thirtyDaysAgo;
    }).length;

    // Get all payments
    const payments = await Payment.find({}).populate('partner', 'firstName surname email');
    
    // Total Revenue - sum of all successful payments
    const successfulPayments = payments.filter(p => p.status === 'success');
    const totalRevenue = successfulPayments.reduce((sum, p) => sum + p.amount, 0);
    
    // Average donation
    const averageDonation = successfulPayments.length > 0 
      ? Math.round(successfulPayments.reduce((sum, p) => sum + p.amount, 0) / successfulPayments.length) 
      : 0;

    // Recent payments (last 5)
    const recentPayments = payments
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(p => ({
        id: p._id,
        partner: p.partner ? `${p.partner.firstName} ${p.partner.surname}` : 'Unknown',
        email: p.partner?.email || 'Unknown',
        reference: p.reference,
        amount: p.amount,
        method: p.method,
        date: new Date(p.createdAt).toISOString().split('T')[0],
        status: p.status,
      }));

    return NextResponse.json({
      stats: {
        totalPartners,
        activePartners,
        newPartners,
        totalRevenue,
        averageDonation,
      },
      recentPayments,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard data' },
      { status: 500 }
    );
  }
}