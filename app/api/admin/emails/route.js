import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Partner from '@/models/Partner';
import nodemailer from 'nodemailer';

// Create transporter with better configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Add timeout and connection settings
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
    tls: {
      rejectUnauthorized: false,
    },
  });
};

export async function POST(request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { to, subject, message } = await request.json();

    if (!subject || !message) {
      return NextResponse.json(
        { error: 'Subject and message are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Get partners based on recipient filter
    let filter = {};
    if (to === 'active') filter.isActive = true;
    else if (to === 'inactive') filter.isActive = false;
    else if (to === 'silver') filter.partnershipType = 'SILVER';
    else if (to === 'gold') filter.partnershipType = 'GOLD';
    else if (to === 'diamond') filter.partnershipType = 'DIAMOND';

    const partners = await Partner.find(filter).select('email firstName surname');
    
    if (partners.length === 0) {
      return NextResponse.json(
        { error: 'No partners found for the selected filter' },
        { status: 404 }
      );
    }

    // Create transporter
    const transporter = createTransporter();

    // Send emails with better error handling
    const emailPromises = partners.map(async (partner) => {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || `"Exousia Fellowship" <${process.env.EMAIL_USER}>`,
          to: partner.email,
          subject: subject,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f6f7;">
              <div style="background: white; padding: 30px; border-radius: 12px; border-top: 4px solid #E51913;">
                <div style="text-align: center; margin-bottom: 20px;">
                  <h2 style="color: #E51913; margin: 0;">Exousia Fellowship</h2>
                  <p style="color: #8A8C8E; font-size: 12px; margin: 0;">Advancing the Gospel Worldwide</p>
                </div>
                <p style="color: #4A4C4E;">Dear ${partner.firstName || 'Partner'},</p>
                <div style="color: #4A4C4E; line-height: 1.6;">
                  ${message.replace(/\n/g, '<br>')}
                </div>
                <hr style="border: none; border-top: 1px solid #E5E6E7; margin: 20px 0;">
                <p style="color: #8A8C8E; font-size: 12px; text-align: center;">
                  © ${new Date().getFullYear()} Exousia Fellowship Incorporated<br>
                  <span style="font-size: 10px;">39 Commercial Layout, Damboa Road, Maiduguri, Borno State, Nigeria</span>
                </p>
              </div>
            </div>
          `,
        });
        return { success: true, email: partner.email };
      } catch (error) {
        console.error(`Failed to send to ${partner.email}:`, error.message);
        return { success: false, email: partner.email, error: error.message };
      }
    });

    const results = await Promise.all(emailPromises);
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: true,
      message: `Email sent to ${successful} partners${failed > 0 ? `, ${failed} failed` : ''}`,
      successful,
      failed,
      total: partners.length,
    });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { error: 'Failed to send emails: ' + error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      emails: [
        {
          id: 1,
          subject: 'Monthly Partnership Update',
          recipient: 'All Partners',
          sentAt: new Date(Date.now() - 86400000 * 2),
          opens: 245,
        },
        {
          id: 2,
          subject: 'Special Prayer Request',
          recipient: 'Active Partners',
          sentAt: new Date(Date.now() - 86400000 * 4),
          opens: 189,
        },
      ],
    });
  } catch (error) {
    console.error('Fetch emails error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch emails' },
      { status: 500 }
    );
  }
}