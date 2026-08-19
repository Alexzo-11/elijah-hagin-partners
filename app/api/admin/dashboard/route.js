import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Partner from '@/models/Partner';
import Payment from '@/models/Payment';

export async function GET(request) {
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
    const activePartners = partners.filter(p => p.status === 'active').length;
    
    // Get this month's new partners
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newPartners = partners.filter(p => 
      new Date(p.createdAt) >= startOfMonth
    ).length;

    // Get all payments
    const payments = await Payment.find({});
    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
    
    // Calculate average donation
    const averageDonation = payments.length > 0 ? totalRevenue / payments.length : 0;
    
    // Get pending payments
    const pendingPayments = payments.filter(p => p.status === 'pending').length;

    // Get monthly growth (compare this month to last month)
    const startOfLastMonth = new Date();
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
    startOfLastMonth.setDate(1);
    startOfLastMonth.setHours(0, 0, 0, 0);
    
    const thisMonthRevenue = payments
      .filter(p => new Date(p.createdAt) >= startOfMonth)
      .reduce((sum, p) => sum + (p.amount || 0), 0);
      
    const lastMonthRevenue = payments
      .filter(p => new Date(p.createdAt) >= startOfLastMonth && new Date(p.createdAt) < startOfMonth)
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const monthlyGrowth = lastMonthRevenue > 0 
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100)
      : 0;

    // Get recent payments with partner details
    const recentPayments = await Payment.find({})
      .sort({ createdAt: -1 })
      .limit(15)
      .lean();

    // Populate partner details
    const populatedPayments = await Promise.all(
      recentPayments.map(async (payment) => {
        let partner = null;
        if (payment.partnerId) {
          partner = await Partner.findById(payment.partnerId);
        }
        return {
          id: payment._id,
          partner: partner ? `${partner.firstName} ${partner.surname}` : 'Unknown Partner',
          email: partner?.email || 'No email',
          reference: payment.reference || 'N/A',
          amount: payment.amount || 0,
          method: payment.method || 'N/A',
          status: payment.status || 'pending',
          date: payment.createdAt || new Date(),
        };
      })
    );

    // Get recent partners
    const recentPartners = await Partner.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const formattedPartners = recentPartners.map(p => ({
      id: p._id,
      firstName: p.firstName || 'N/A',
      surname: p.surname || 'N/A',
      email: p.email || 'N/A',
      status: p.status || 'inactive',
      createdAt: p.createdAt,
    }));

    return NextResponse.json({
      stats: {
        totalPartners,
        activePartners,
        newPartners,
        totalRevenue: Math.round(totalRevenue),
        averageDonation: Math.round(averageDonation),
        monthlyGrowth: Math.round(monthlyGrowth * 10) / 10,
        pendingPayments,
      },
      recentPayments: populatedPayments,
      recentPartners: formattedPartners,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}