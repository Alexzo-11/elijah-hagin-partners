import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Partner from '@/models/Partner';
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

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Partner ID is required' },
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

    // Get partner's payments
    const payments = await Payment.find({ partnerId: id })
      .sort({ createdAt: -1 })
      .limit(10);

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

// PUT - Update partner
export async function PUT(request, { params }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;
    const body = await request.json();

    await connectToDatabase();

    const partner = await Partner.findById(id);
    if (!partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      );
    }

    // Update fields
    const allowedFields = [
      'firstName', 'surname', 'email', 'phone', 'gender', 
      'occupation', 'address', 'status', 'partnershipType',
      'monthlyCommitment'
    ];

    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        partner[field] = body[field];
      }
    });

    await partner.save();

    return NextResponse.json({
      success: true,
      message: 'Partner updated successfully',
      partner: {
        id: partner._id,
        firstName: partner.firstName,
        surname: partner.surname,
        email: partner.email,
        phone: partner.phone,
        status: partner.status,
      },
    });
  } catch (error) {
    console.error('Error updating partner:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update partner' },
      { status: 500 }
    );
  }
}