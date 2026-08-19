import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

export async function PUT(request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
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

    const admin = await Admin.findById(user.id);
    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    // Update basic info
    admin.firstName = firstName || admin.firstName;
    admin.lastName = lastName || admin.lastName;
    admin.email = email || admin.email;
    admin.phone = phone || admin.phone;

    // Handle password change
    if (newPassword) {
      const isValid = await bcrypt.compare(currentPassword, admin.password);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      admin.password = hashedPassword;
    }

    await admin.save();

    return NextResponse.json({
      success: true,
      user: {
        id: admin._id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        phone: admin.phone,
        role: 'admin',
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