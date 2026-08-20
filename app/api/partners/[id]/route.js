import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Partner from '@/models/Partner';
import Payment from '@/models/Payment';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    // Validate ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid partner ID format' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find partner
    const partner = await Partner.findById(id);
    
    if (!partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      );
    }

    // Get partner's payments (successful only for total)
    const allPayments = await Payment.find({ 
      partnerId: id 
    }).sort({ createdAt: -1 });

    const successfulPayments = allPayments.filter(p => p.status === 'success');
    const totalGiven = successfulPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    // Get recent payments (last 10)
    const recentPayments = allPayments.slice(0, 10);

    // Format partner data
    const formattedPartner = {
      id: partner._id,
      firstName: partner.firstName || 'N/A',
      surname: partner.surname || 'N/A',
      email: partner.email || 'N/A',
      phone: partner.phone || 'Not provided',
      gender: partner.gender || 'Not specified',
      occupation: partner.occupation || 'Not specified',
      address: partner.address || 'Not provided',
      status: partner.status || 'inactive',
      partnershipType: partner.partnershipType || 'Standard',
      monthlyCommitment: partner.monthlyCommitment || 0,
      totalGiven: Math.round(totalGiven),
      createdAt: partner.createdAt,
      updatedAt: partner.updatedAt,
    };

    const formattedPayments = recentPayments.map(p => ({
      id: p._id,
      reference: p.reference || 'N/A',
      amount: p.amount || 0,
      method: p.method || 'N/A',
      status: p.status || 'pending',
      date: p.createdAt || new Date(),
    }));

    return NextResponse.json({
      partner: formattedPartner,
      payments: formattedPayments,
    });
  } catch (error) {
    console.error('Error fetching partner:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch partner' },
      { status: 500 }
    );
  }
}