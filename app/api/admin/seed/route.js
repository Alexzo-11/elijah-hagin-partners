import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function POST(request) {
  try {
    const { secretKey } = await request.json();
    
    // Security - check secret key
    const ADMIN_SECRET = process.env.ADMIN_SECRET || 'your_super_secret_key_here';
    if (secretKey !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const adminEmail = 'admin@exousiafellowship.org';
    const adminPassword = 'Admin@2026';

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: 'Admin already exists',
        email: adminEmail,
        password: adminPassword,
        adminId: existingAdmin._id,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create admin
    const admin = await Admin.create({
      firstName: 'Super',
      lastName: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      phone: '+234 703 5996 162',
      role: 'admin',
      isActive: true,
    });

    return NextResponse.json({
      success: true,
      message: 'Admin created successfully',
      email: adminEmail,
      password: adminPassword,
      adminId: admin._id,
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}