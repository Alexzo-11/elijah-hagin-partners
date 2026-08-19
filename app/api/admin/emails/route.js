import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Partner from '@/models/Partner';
import Email from '@/models/Email';
import { sendEmail } from '@/lib/mailer';

export async function POST(request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { partnerId, subject, message } = await request.json();

    if (!partnerId || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const partner = await Partner.findById(partnerId);
    if (!partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      );
    }

    // Send email
    await sendEmail({
      to: partner.email,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1a1a2e;">${subject}</h2>
          <div style="color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</div>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="color: #718096; font-size: 14px;">
            Sent from Exousia Fellowship Inc. Admin Portal
          </p>
        </div>
      `,
    });

    // Save email record
    const emailRecord = new Email({
      partnerId: partner._id,
      partnerEmail: partner.email,
      partnerName: `${partner.firstName} ${partner.surname}`,
      subject,
      message,
      sentBy: user.id,
      sentAt: new Date(),
      type: 'individual',
    });

    await emailRecord.save();

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
    });
  } catch (error) {
    console.error('Email send error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email' },
      { status: 500 }
    );
  }
}