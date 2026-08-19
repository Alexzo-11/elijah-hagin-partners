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

    const { partnerIds, subject, message } = await request.json();

    if (!partnerIds || partnerIds.length === 0 || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const partners = await Partner.find({
      _id: { $in: partnerIds },
      status: 'active',
    });

    if (partners.length === 0) {
      return NextResponse.json(
        { error: 'No active partners found' },
        { status: 404 }
      );
    }

    // Send emails in parallel
    const emailPromises = partners.map(async (partner) => {
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
        type: 'bulk',
      });

      await emailRecord.save();
    });

    await Promise.all(emailPromises);

    return NextResponse.json({
      success: true,
      message: `Emails sent to ${partners.length} partners`,
      count: partners.length,
    });
  } catch (error) {
    console.error('Bulk email send error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send emails' },
      { status: 500 }
    );
  }
}