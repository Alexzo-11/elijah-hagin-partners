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

    // Get all successful payments ONLY
    const successfulPayments = await Payment.find({ status: 'success' });
    
    // Calculate total revenue from successful payments only
    const totalRevenue = successfulPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
    
    // Get pending payments count
    const pendingPayments = await Payment.countDocuments({ status: 'pending' });

    // Get monthly growth from successful payments
    const startOfLastMonth = new Date();
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
    startOfLastMonth.setDate(1);
    startOfLastMonth.setHours(0, 0, 0, 0);
    
    const thisMonthRevenue = successfulPayments
      .filter(p => new Date(p.createdAt) >= startOfMonth)
      .reduce((sum, p) => sum + (p.amount || 0), 0);
      
    const lastMonthRevenue = successfulPayments
      .filter(p => new Date(p.createdAt) >= startOfLastMonth && new Date(p.createdAt) < startOfMonth)
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const monthlyGrowth = lastMonthRevenue > 0 
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100)
      : thisMonthRevenue > 0 ? 100 : 0;

    // Get recent payments with partner details populated
    const recentPayments = await Payment.find({})
      .sort({ createdAt: -1 })
      .limit(15);

    // Populate partner details for each payment
    const populatedPayments = await Promise.all(
      recentPayments.map(async (payment) => {
        let partnerName = 'Unknown Partner';
        let partnerEmail = 'No email';

        if (payment.partnerId) {
          try {
            const partner = await Partner.findById(payment.partnerId);
            if (partner) {
              const firstName = partner.firstName || '';
              const surname = partner.surname || '';
              partnerName = `${firstName} ${surname}`.trim() || 'Unknown Partner';
              partnerEmail = partner.email || 'No email';
            }
          } catch (err) {
            console.error('Error fetching partner:', err);
          }
        }

        return {
          id: payment._id,
          partner: partnerName,
          email: partnerEmail,
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