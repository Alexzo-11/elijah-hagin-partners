import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Partner from '@/models/Partner';

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

    const partners = await Partner.find({})
      .select('-password -passport')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      partners: partners.map(p => ({
        id: p._id,
        surname: p.surname,
        firstName: p.firstName,
        email: p.email,
        phone: p.phone,
        occupation: p.occupation,
        partnershipType: p.partnershipType,
        isActive: p.isActive,
        createdAt: p.createdAt,
      })),
    });
  } catch (error) {
    console.error('Partners fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch partners' },
      { status: 500 }
    );
  }
}