import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Partner from '@/models/Partner';
import Payment from '@/models/Payment';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    console.log('🔍 Partner Detail API called');
    console.log('📝 Params:', params);
    
    const user = await getAuthUser();
    console.log('👤 User:', user?.email, 'Role:', user?.role);
    
    if (!user || user.role !== 'admin') {
      console.log('❌ Unauthorized access attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    console.log('🆔 Partner ID:', id);

    // Validate ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      console.log('❌ Invalid ObjectId format');
      return NextResponse.json(
        { error: 'Invalid partner ID format' },
        { status: 400 }
      );
    }

    await connectToDatabase();
    console.log('✅ Database connected');

    // Find partner
    const partner = await Partner.findById(id);
    console.log('📦 Partner found:', partner ? 'Yes' : 'No');
    
    if (!partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      );
    }

    // Get partner's payments
    const payments = await Payment.find({ 
      partnerId: id 
    }).sort({ createdAt: -1 }).limit(10);

    console.log('💰 Payments found:', payments.length);

    // Format response
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
      totalGiven: partner.totalGiven || 0,
      createdAt: partner.createdAt,
      updatedAt: partner.updatedAt,
    };

    const formattedPayments = payments.map(p => ({
      id: p._id,
      reference: p.reference || 'N/A',
      amount: p.amount || 0,
      method: p.method || 'N/A',
      status: p.status || 'pending',
      date: p.createdAt || new Date(),
    }));

    console.log('✅ Response prepared successfully');
    
    return NextResponse.json({
      partner: formattedPartner,
      payments: formattedPayments,
    });
  } catch (error) {
    console.error('❌ Error fetching partner:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch partner' },
      { status: 500 }
    );
  }
}