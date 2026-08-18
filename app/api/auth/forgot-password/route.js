import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Partner from '@/models/Partner';
import Admin from '@/models/Admin';
import { signToken } from '@/lib/auth';
import { sendEmail } from '@/lib/mailer';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let user = await Partner.findOne({ email });
    if (!user) {
      user = await Admin.findOne({ email });
    }

    if (!user) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        success: true,
        message: 'If an account exists, a reset link has been sent',
      });
    }

    // Generate reset token
    const token = signToken({
      id: user._id,
      email: user.email,
      purpose: 'password-reset',
    });

    const resetUrl = `${process.env.APP_URL}/reset-password/${token}`;

    await sendEmail({
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h1>Reset Your Password</h1>
        <p>You requested to reset your password. Click the link below to reset it:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>This link will expire in 7 days.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'If an account exists, a reset link has been sent',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}