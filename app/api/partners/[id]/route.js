import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Partner from '@/models/Partner';

export async function GET(request, { params }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    await connectToDatabase();

    const partner = await Partner.findById(id).select('-password');
    if (!partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      partner: {
        id: partner._id,
        surname: partner.surname,
        firstName: partner.firstName,
        email: partner.email,
        phone: partner.phone,
        gender: partner.gender,
        occupation: partner.occupation,
        maritalStatus: partner.maritalStatus,
        nationality: partner.nationality,
        stateOfOrigin: partner.stateOfOrigin,
        stateOfResidence: partner.stateOfResidence,
        residentialAddress: partner.residentialAddress,
        partnershipType: partner.partnershipType,
        partnershipAmount: partner.partnershipAmount,
        totalContributed: partner.totalContributed,
        isActive: partner.isActive,
        createdAt: partner.createdAt,
        passport: partner.passport || null, // Include passport
      },
    });
  } catch (error) {
    console.error('Partner fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch partner' },
      { status: 500 }
    );
  }
}