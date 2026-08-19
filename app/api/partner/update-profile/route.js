import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Partner from '@/models/Partner';
import bcrypt from 'bcryptjs';

export async function PUT(request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { 
      firstName, 
      lastName, 
      email, 
      phone, 
      currentPassword, 
      newPassword 
    } = await request.json();

    await connectToDatabase();

    const partner = await Partner.findById(user.id);
    if (!partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      );
    }

    // Update basic info
    partner.firstName = firstName || partner.firstName;
    partner.surname = lastName || partner.surname;
    partner.email = email || partner.email;
    partner.phone = phone || partner.phone;

    // Handle password change
    if (newPassword) {
      // Verify current password
      const isValid = await bcrypt.compare(currentPassword, partner.password);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      partner.password = hashedPassword;
    }

    await partner.save();

    // Return updated user data (excluding password)
    return NextResponse.json({
      success: true,
      user: {
        id: partner._id,
        firstName: partner.firstName,
        lastName: partner.surname,
        email: partner.email,
        phone: partner.phone,
        role: 'partner',
      },
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}