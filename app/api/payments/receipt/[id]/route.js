import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Partner from '@/models/Partner';
import jsPDF from 'jspdf';

// Generate unique receipt number
function generateReceiptNumber() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${year}${month}${day}-${random}`;
}

// Format date for receipt
function formatReceiptDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}`;
}

export async function GET(request, { params }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: 'Payment ID is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const payment = await Payment.findById(id);
    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    if (user.role !== 'admin' && payment.partner.toString() !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to view this receipt' },
        { status: 403 }
      );
    }

    const partner = await Partner.findById(payment.partner);
    if (!partner) {
      return NextResponse.json(
        { error: 'Partner not found' },
        { status: 404 }
      );
    }

    const receiptNumber = payment.receiptNumber || generateReceiptNumber();

    // Generate POS-Style PDF Receipt with Logo
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let y = 20;

    // Brand Colors
    const primaryRed = '#E51913';
    const secondaryBlue = '#3BBCEB';
    const darkGray = '#4A4C4E';
    const mediumGray = '#8A8C8E';
    const lightGray = '#F5F6F7';

    // ===== HEADER WITH LOGO =====
    // Red top bar
    doc.setFillColor(229, 25, 19);
    doc.rect(0, 0, pageWidth, 6, 'F');

    // Logo - EX box
    doc.setFillColor(229, 25, 19);
    doc.roundedRect(margin, y, 30, 30, 4, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('EX', margin + 15, y + 20, { align: 'center' });

    // Ministry Name
    doc.setTextColor(74, 76, 78);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.text('EXOUSIA FELLOWSHIP', margin + 40, y + 12);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(138, 140, 142);
    doc.text('39 Commercial Layout, Damboa Road', margin + 40, y + 20);
    doc.text('Maiduguri, Borno State, Nigeria', margin + 40, y + 26);

    // Receipt Title - Right side
    doc.setTextColor(229, 25, 19);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('RECEIPT', pageWidth - margin - 10, y + 12, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(138, 140, 142);
    doc.text(`#${receiptNumber}`, pageWidth - margin - 10, y + 22, { align: 'right' });

    y += 40;

    // Divider
    doc.setDrawColor(229, 25, 19);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    // ===== RECEIPT INFO - Like the sample =====
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(74, 76, 78);

    // Date
    doc.text('Date:', margin, y + 2);
    doc.setTextColor(74, 76, 78);
    doc.setFont('helvetica', 'bold');
    doc.text(formatReceiptDate(payment.createdAt), margin + 30, y + 2);

    // Operator / Staff
    doc.setTextColor(74, 76, 78);
    doc.setFont('helvetica', 'normal');
    doc.text('Operator:', margin + 90, y + 2);
    doc.setTextColor(74, 76, 78);
    doc.setFont('helvetica', 'bold');
    doc.text('System Admin', margin + 120, y + 2);

    y += 8;

    // Partner Info
    doc.setTextColor(74, 76, 78);
    doc.setFont('helvetica', 'normal');
    doc.text('Partner:', margin, y + 2);
    doc.setTextColor(74, 76, 78);
    doc.setFont('helvetica', 'bold');
    doc.text(`${partner.surname} ${partner.firstName}`, margin + 35, y + 2);

    doc.setTextColor(74, 76, 78);
    doc.setFont('helvetica', 'normal');
    doc.text('Email:', margin + 90, y + 2);
    doc.setTextColor(74, 76, 78);
    doc.setFont('helvetica', 'bold');
    doc.text(partner.email, margin + 115, y + 2);

    y += 8;

    // Phone & Partnership Type
    doc.setTextColor(74, 76, 78);
    doc.setFont('helvetica', 'normal');
    doc.text('Phone:', margin, y + 2);
    doc.setTextColor(74, 76, 78);
    doc.setFont('helvetica', 'bold');
    doc.text(partner.phone || 'N/A', margin + 35, y + 2);

    doc.setTextColor(74, 76, 78);
    doc.setFont('helvetica', 'normal');
    doc.text('Type:', margin + 90, y + 2);
    doc.setTextColor(74, 76, 78);
    doc.setFont('helvetica', 'bold');
    doc.text(partner.partnershipType || 'SILVER', margin + 115, y + 2);

    y += 10;

    // Divider
    doc.setDrawColor(229, 229, 231);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    // ===== TABLE HEADER =====
    doc.setFillColor(229, 25, 19);
    doc.rect(margin, y, pageWidth - margin * 2, 8, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text('Description', margin + 5, y + 5);
    doc.text('QTY', margin + 105, y + 5);
    doc.text('Price', margin + 130, y + 5);
    doc.text('Total', pageWidth - margin - 5, y + 5, { align: 'right' });

    y += 8;

    // ===== TABLE ROW =====
    const amount = payment.amount || 0;
    const qty = 1;
    const price = amount;

    doc.setFillColor(245, 245, 247);
    doc.rect(margin, y, pageWidth - margin * 2, 8, 'F');

    doc.setTextColor(74, 76, 78);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(payment.purpose || 'Monthly Partnership', margin + 5, y + 5);
    doc.text(qty.toString(), margin + 105, y + 5);
    doc.text(`₦${price.toLocaleString()}`, margin + 130, y + 5);
    doc.text(`₦${amount.toLocaleString()}`, pageWidth - margin - 5, y + 5, { align: 'right' });

    y += 8;

    // Divider
    doc.setDrawColor(229, 229, 231);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    // ===== TOTALS =====
    doc.setTextColor(74, 76, 78);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    // Subtotal
    doc.text('Subtotal:', pageWidth - margin - 50, y + 2);
    doc.text(`₦${amount.toLocaleString()}`, pageWidth - margin - 5, y + 2, { align: 'right' });

    y += 6;
    doc.text('VAT (0%):', pageWidth - margin - 50, y + 2);
    doc.text('₦0', pageWidth - margin - 5, y + 2, { align: 'right' });

    y += 8;

    // Total - Highlighted
    doc.setDrawColor(229, 25, 19);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 4;

    doc.setTextColor(229, 25, 19);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('TOTAL:', pageWidth - margin - 50, y + 4);
    doc.text(`₦${amount.toLocaleString()}`, pageWidth - margin - 5, y + 4, { align: 'right' });

    y += 14;

    // ===== STATUS BADGE =====
    doc.setFillColor(209, 250, 229);
    doc.roundedRect(pageWidth - margin - 45, y - 3, 45, 8, 4, 4, 'F');
    doc.setTextColor(5, 150, 105);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text('PAID', pageWidth - margin - 22.5, y + 3, { align: 'center' });

    y += 12;

    // Divider
    doc.setDrawColor(229, 229, 231);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    // ===== FOOTER =====
    doc.setTextColor(74, 76, 78);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('Thank you!', pageWidth / 2, y + 2, { align: 'center' });

    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6);
    doc.setTextColor(138, 140, 142);
    doc.text('This is a computer-generated receipt.', pageWidth / 2, y + 2, { align: 'center' });
    y += 4;
    doc.text('No signature required.', pageWidth / 2, y + 2, { align: 'center' });

    y += 8;

    // ===== FOOTER DIVIDER =====
    doc.setDrawColor(229, 25, 19);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 4;

    doc.setTextColor(138, 140, 142);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5);
    doc.text(`© ${new Date().getFullYear()} Exousia Fellowship Incorporated`, pageWidth / 2, y + 2, { align: 'center' });

    // ===== WATERMARK =====
    doc.setTextColor(229, 25, 19);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(40);
    doc.text('EXOUSIA', pageWidth / 2, pageHeight / 2 + 10, {
      align: 'center',
      angle: -30
    });
    doc.setGState(new doc.GState({ opacity: 0.02 }));

    // Get PDF as buffer
    const pdfOutput = doc.output('arraybuffer');

    return new NextResponse(pdfOutput, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=receipt-${payment.reference}.pdf`,
        'Content-Length': pdfOutput.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('Receipt generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate receipt: ' + error.message },
      { status: 500 }
    );
  }
}