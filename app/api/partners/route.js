import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Partner from '@/models/Partner';
import bcrypt from 'bcryptjs';

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
      .select('-password') // Exclude password but include passport
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
        passport: p.passport || null, // Include passport
        totalContributed: p.totalContributed || 0,
        partnershipAmount: p.partnershipAmount || 0,
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

export async function POST(request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { email, password, surname, firstName, partnershipType, partnershipAmount, phone, passport } = body;

    if (!email || !password || !surname || !firstName) {
      return NextResponse.json(
        { error: 'Email, password, surname, and first name are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if email exists
    const existing = await Partner.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const partner = await Partner.create({
      surname,
      firstName,
      email,
      phone: phone || '',
      password: hashedPassword,
      partnershipType: partnershipType || 'SILVER',
      partnershipAmount: partnershipAmount || 5000,
      monthlyCommitment: partnershipAmount || 5000,
      passport: passport || '', // Save passport
      isActive: true,
      role: 'partner',
    });

    return NextResponse.json({
      success: true,
      partner: {
        id: partner._id,
        email: partner.email,
        surname: partner.surname,
        firstName: partner.firstName,
        passport: partner.passport,
      },
    });
  } catch (error) {
    console.error('Partner creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create partner' },
      { status: 500 }
    );
  }
}