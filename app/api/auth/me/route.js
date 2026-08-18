import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Partner from '@/models/Partner';
import Admin from '@/models/Admin';

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

    let userData;
    if (user.role === 'admin') {
      userData = await Admin.findById(user.id).select('-password');
    } else {
      userData = await Partner.findById(user.id).select('-password -passport');
    }

    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: userData._id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.surname || userData.lastName,
        role: user.role,
        phone: userData.phone || '',
        address: userData.address || '',
        partnershipType: userData.partnershipType || '',
      },
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}