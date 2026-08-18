'use server';

import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Partner from '@/models/Partner';

export async function getPartnerDashboardData() {
  try {
    const user = await getAuthUser();
    if (!user) {
      return { error: 'Unauthorized' };
    }

    await connectToDatabase();
    
    const partner = await Partner.findById(user.id);
    if (!partner) {
      return { error: 'Partner not found' };
    }

    // Return mock data for now
    return {
      stats: {
        totalContributions: partner.totalContributed || 0,
        monthlyCommitment: partner.monthlyCommitment || 0,
        lastPayment: 250,
        payments: 24,
        growth: 12.5
      },
      recentPayments: [
        { id: 1, reference: 'PAY-2024-001', amount: 250, status: 'success', date: '2024-12-20', purpose: 'Monthly Partnership' },
        { id: 2, reference: 'PAY-2024-002', amount: 500, status: 'success', date: '2024-12-15', purpose: 'Monthly Partnership' },
      ]
    };
  } catch (error) {
    console.error('Dashboard data error:', error);
    return { error: 'Failed to load dashboard data' };
  }
} 