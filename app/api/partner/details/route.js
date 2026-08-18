import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Partner from '@/models/Partner';

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

    return NextResponse.json({
      partnershipType: partner.partnershipType || 'SILVER',
      partnershipAmount: partner.partnershipAmount || 5000,
      monthlyCommitment: partner.monthlyCommitment || partner.partnershipAmount || 5000,
      totalContributed: partner.totalContributed || 0,
    });
  } catch (error) {
    console.error('Partner details error:', error);
    return NextResponse.json(
      { error: 'Failed to load partner details' },
      { status: 500 }
    );
  }
}