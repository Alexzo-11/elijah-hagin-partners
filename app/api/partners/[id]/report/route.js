import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Partner from '@/models/Partner';
import Payment from '@/models/Payment';

export async function POST(request, { params }) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Await params before accessing
    const { id } = await params;
    await connectToDatabase();

    const partner = await Partner.findById(id);
    if (!partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      );
    }

    const payments = await Payment.find({ partner: id }).sort({ createdAt: -1 });

    // Generate HTML report
    const report = `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: Arial, sans-serif; padding: 40px; }
  .header { text-align: center; border-bottom: 3px solid #E51913; padding-bottom: 20px; }
  .title { color: #E51913; font-size: 24px; font-weight: bold; }
  .subtitle { color: #4A4C4E; font-size: 14px; }
  .section { margin: 30px 0; }
  .section-title { color: #1B2A4A; font-size: 18px; font-weight: bold; border-bottom: 1px solid #E5E6E7; padding-bottom: 10px; }
  .info-row { display: flex; padding: 8px 0; border-bottom: 1px solid #F5F6F7; }
  .info-label { width: 200px; color: #8A8C8E; font-weight: 500; }
  .info-value { color: #4A4C4E; }
  .payment-row { display: flex; padding: 10px 0; border-bottom: 1px solid #F5F6F7; }
  .payment-ref { width: 150px; font-weight: 500; }
  .payment-amount { width: 120px; color: #E51913; font-weight: bold; }
  .payment-status { width: 100px; }
  .status-success { color: #059669; }
  .status-pending { color: #D97706; }
  .status-failed { color: #DC2626; }
  .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E6E7; color: #8A8C8E; font-size: 12px; }
</style>
</head>
<body>
  <div class="header">
    <div class="title">EXOUSIA FELLOWSHIP</div>
    <div class="subtitle">Partner Report</div>
  </div>

  <div class="section">
    <div class="section-title">Partner Information</div>
    <div class="info-row"><span class="info-label">Name</span><span class="info-value">${partner.surname} ${partner.firstName}</span></div>
    <div class="info-row"><span class="info-label">Email</span><span class="info-value">${partner.email}</span></div>
    <div class="info-row"><span class="info-label">Phone</span><span class="info-value">${partner.phone || 'N/A'}</span></div>
    <div class="info-row"><span class="info-label">Partnership Type</span><span class="info-value">${partner.partnershipType}</span></div>
    <div class="info-row"><span class="info-label">Monthly Commitment</span><span class="info-value">₦${(partner.partnershipAmount || 0).toLocaleString()}</span></div>
    <div class="info-row"><span class="info-label">Total Contributed</span><span class="info-value">₦${(partner.totalContributed || 0).toLocaleString()}</span></div>
    <div class="info-row"><span class="info-label">Status</span><span class="info-value">${partner.isActive ? 'Active' : 'Inactive'}</span></div>
    <div class="info-row"><span class="info-label">Joined</span><span class="info-value">${new Date(partner.createdAt).toLocaleDateString()}</span></div>
  </div>

  <div class="section">
    <div class="section-title">Payment History (${payments.length} payments)</div>
    ${payments.length === 0 ? '<p>No payments recorded</p>' : `
    <div style="margin-top: 10px;">
      <div style="display:flex; font-weight:bold; border-bottom: 2px solid #E51913; padding: 10px 0;">
        <div style="width:150px;">Reference</div>
        <div style="width:120px;">Amount</div>
        <div style="width:100px;">Status</div>
        <div>Date</div>
      </div>
      ${payments.map(p => `
      <div class="payment-row">
        <div class="payment-ref">${p.reference}</div>
        <div class="payment-amount">₦${p.amount.toLocaleString()}</div>
        <div class="payment-status"><span class="status-${p.status}">${p.status.toUpperCase()}</span></div>
        <div>${new Date(p.createdAt).toLocaleDateString()}</div>
      </div>
      `).join('')}
    </div>
    `}
  </div>

  <div class="footer">
    Report Generated: ${new Date().toLocaleString()}<br>
    © ${new Date().getFullYear()} Exousia Fellowship Incorporated
  </div>
</body>
</html>
    `;

    return new NextResponse(report, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename=partner-report-${id}.html`,
      },
    });
  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}