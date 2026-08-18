import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import Partner from '@/models/Partner';
import Admin from '@/models/Admin';
import { signToken, setAuthCookie } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if user is an admin first
    let user = await Admin.findOne({ email });
    let role = 'admin';
    let isAdmin = true;

    // If not admin, check if partner
    if (!user) {
      user = await Partner.findOne({ email });
      role = 'partner';
      isAdmin = false;
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token using jose
    const tokenPayload = {
      id: user._id.toString(),
      email: user.email,
      role: role,
      firstName: isAdmin ? user.firstName : user.firstName,
      lastName: isAdmin ? user.lastName : user.surname,
    };

    console.log('Login - Token payload:', tokenPayload);

    const token = await signToken(tokenPayload);

    // Set cookie
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: isAdmin ? user.firstName : user.firstName,
        lastName: isAdmin ? user.lastName : user.surname,
        role: role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}