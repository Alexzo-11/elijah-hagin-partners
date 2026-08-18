import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import Partner from '@/models/Partner';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    
    const {
      surname,
      firstName,
      otherNames,
      gender,
      dateOfBirth,
      occupation,
      maritalStatus,
      nationality,
      stateOfOrigin,
      stateOfResidence,
      residentialAddress,
      phone,
      email,
      password,
      partnershipType,
      partnershipAmount,
      passport, // This is the base64 image
    } = body;

    // Validate all required fields
    const requiredFields = [
      'surname', 'firstName', 'gender', 'dateOfBirth', 'occupation',
      'maritalStatus', 'nationality', 'stateOfOrigin', 'stateOfResidence',
      'residentialAddress', 'phone', 'email', 'password', 'partnershipType',
      'partnershipAmount', 'passport'
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if email already exists
    const existing = await Partner.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create partner with all registration data including passport
    const partner = new Partner({
      surname: surname || '',
      firstName: firstName || '',
      otherNames: otherNames || '',
      gender: gender || '',
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : new Date(),
      occupation: occupation || '',
      maritalStatus: maritalStatus || '',
      nationality: nationality || '',
      stateOfOrigin: stateOfOrigin || '',
      stateOfResidence: stateOfResidence || '',
      residentialAddress: residentialAddress || '',
      phone: phone || '',
      email: email || '',
      password: hashedPassword,
      partnershipType: partnershipType || 'SILVER',
      partnershipAmount: partnershipAmount || 5000,
      passport: passport || '', // Save the passport image
      monthlyCommitment: partnershipAmount || 5000,
      isEmailVerified: false,
      isActive: true,
      role: 'partner',
    });

    await partner.save();

    // Create JWT token for auto-login
    const tokenPayload = {
      id: partner._id.toString(),
      email: partner.email,
      role: 'partner',
      firstName: partner.firstName,
      lastName: partner.surname,
    };

    const jwtToken = await signToken(tokenPayload);
    await setAuthCookie(jwtToken);

    // Return partner data (excluding password)
    const partnerData = {
      id: partner._id,
      surname: partner.surname,
      firstName: partner.firstName,
      otherNames: partner.otherNames,
      email: partner.email,
      phone: partner.phone,
      partnershipType: partner.partnershipType,
      partnershipAmount: partner.partnershipAmount,
      role: partner.role,
    };

    return NextResponse.json({
      success: true,
      user: partnerData,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}