'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download, Loader2, CheckCircle } from 'lucide-react';

export function ReceiptDownload({ payment, onDownload, children, className = '' }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const generatePDF = () => {
    setLoading(true);
    setSuccess(false);
    
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      let y = 20;

      // ===== HEADER =====
      // Red top bar
      doc.setFillColor(229, 25, 19);
      doc.rect(0, 0, pageWidth, 8, 'F');

      // Logo Box
      doc.setFillColor(229, 25, 19);
      doc.roundedRect(margin, y, 50, 50, 4, 4, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.text('EX', margin + 25, y + 32, { align: 'center' });

      // Ministry Name
      doc.setTextColor(74, 76, 78);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('Exousia Fellowship', margin + 65, y + 18);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(138, 140, 142);
      doc.text('Advancing the Gospel Worldwide', margin + 65, y + 28);
      doc.text('39 Commercial Layout, Damboa Road', margin + 65, y + 37);
      doc.text('Maiduguri, Borno State, Nigeria', margin + 65, y + 46);

      // Receipt Title
      doc.setTextColor(229, 25, 19);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('OFFICIAL RECEIPT', pageWidth - margin - 10, y + 18, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(138, 140, 142);
      doc.text(`#${payment.receiptNumber || 'RCP-' + Date.now()}`, pageWidth - margin - 10, y + 30, { align: 'right' });

      y += 65;

      // Divider
      doc.setDrawColor(229, 25, 19);
      doc.setLineWidth(1.5);
      doc.line(margin, y, pageWidth - margin, y);

      y += 12;

      // ===== STATUS BADGE =====
      const isSuccess = payment.status === 'success';
      const isPending = payment.status === 'pending';
      
      let bgColor, textColor;
      if (isSuccess) {
        bgColor = [209, 250, 229];
        textColor = [5, 150, 105];
      } else if (isPending) {
        bgColor = [254, 243, 199];
        textColor = [217, 119, 6];
      } else {
        bgColor = [254, 226, 226];
        textColor = [220, 38, 38];
      }

      doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
      doc.roundedRect(pageWidth - margin - 50, y - 6, 50, 12, 6, 6, 'F');
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text(payment.status.toUpperCase(), pageWidth - margin - 25, y + 4, { align: 'center' });

      // ===== PARTNER INFORMATION =====
      doc.setTextColor(74, 76, 78);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Partner Information', margin, y + 10);
      
      doc.setDrawColor(229, 25, 19);
      doc.setLineWidth(1);
      doc.line(margin, y + 15, margin + 45, y + 15);

      y += 25;

      const infoFields = [
        ['Name', payment.partnerName || 'N/A'],
        ['Email', payment.partnerEmail || 'N/A'],
        ['Phone', payment.partnerPhone || 'N/A'],
        ['Partnership Type', payment.partnershipType || 'SILVER'],
      ];

      infoFields.forEach(([label, value]) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(138, 140, 142);
        doc.text(label, margin, y);
        doc.setTextColor(74, 76, 78);
        doc.setFont('helvetica', 'bold');
        doc.text(value, margin + 45, y);
        y += 8;
      });

      y += 10;

      // Divider
      doc.setDrawColor(229, 229, 231);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageWidth - margin, y);

      y += 12;

      // ===== TRANSACTION DETAILS =====
      doc.setTextColor(74, 76, 78);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('Transaction Details', margin, y + 4);
      
      doc.setDrawColor(59, 188, 235);
      doc.setLineWidth(1);
      doc.line(margin, y + 9, margin + 45, y + 9);

      y += 20;

      const txFields = [
        ['Reference', payment.reference || 'N/A'],
        ['Date', payment.date || new Date().toLocaleDateString()],
        ['Purpose', payment.purpose || 'Monthly Partnership'],
        ['Payment Method', payment.method || 'Card'],
      ];

      txFields.forEach(([label, value], index) => {
        const alpha = index % 2 === 0 ? 245 : 255;
        doc.setFillColor(alpha, alpha, alpha);
        doc.roundedRect(margin, y - 2, pageWidth - margin * 2, 10, 2, 2, 'F');
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(138, 140, 142);
        doc.text(label, margin + 5, y + 6);
        doc.setTextColor(74, 76, 78);
        doc.setFont('helvetica', 'bold');
        doc.text(value, margin + 70, y + 6);
        y += 14;
      });

      y += 8;

      // ===== AMOUNT =====
      doc.setFillColor(245, 245, 247);
      doc.roundedRect(margin, y, pageWidth - margin * 2, 30, 6, 6, 'F');
      
      doc.setDrawColor(229, 25, 19, 0.2);
      doc.setLineWidth(0.5);
      doc.roundedRect(margin, y, pageWidth - margin * 2, 30, 6, 6, 'S');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(74, 76, 78);
      doc.text('Total Amount', margin + 10, y + 12);

      doc.setTextColor(229, 25, 19);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      const amountStr = `₦${(payment.amount || 0).toLocaleString()}`;
      doc.text(amountStr, pageWidth - margin - 10, y + 20, { align: 'right' });

      doc.setTextColor(138, 140, 142);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('NGN', pageWidth - margin - 10, y + 6, { align: 'right' });

      y += 45;

      // ===== DIVIDER =====
      doc.setDrawColor(229, 25, 19);
      doc.setLineWidth(1.5);
      doc.line(margin, y, pageWidth - margin, y);

      y += 15;

      // ===== FOOTER =====
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(138, 140, 142);
      doc.text(
        'This is an official receipt issued by Exousia Fellowship Incorporated.',
        pageWidth / 2,
        y,
        { align: 'center' }
      );
      y += 6;
      doc.text(
        'Thank you for your faithful partnership in advancing the Gospel.',
        pageWidth / 2,
        y,
        { align: 'center' }
      );

      y += 8;
      doc.setTextColor(229, 25, 19);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      doc.text(
        '"God loves a cheerful giver"',
        pageWidth / 2,
        y,
        { align: 'center' }
      );

      y += 8;
      doc.setTextColor(138, 140, 142);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text(
        `© ${new Date().getFullYear()} Exousia Fellowship Incorporated`,
        pageWidth / 2,
        y,
        { align: 'center' }
      );

      y += 15;

      // ===== OFFICIAL STAMP =====
      doc.setDrawColor(229, 25, 19);
      doc.setLineWidth(0.5);
      doc.roundedRect(pageWidth - margin - 55, y, 55, 28, 4, 4, 'S');
      
      doc.setTextColor(229, 25, 19);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.text('OFFICIAL RECEIPT', pageWidth - margin - 27.5, y + 9, { align: 'center' });
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(138, 140, 142);
      doc.text('Computer-generated', pageWidth - margin - 27.5, y + 17, { align: 'center' });
      doc.text('No signature required', pageWidth - margin - 27.5, y + 23, { align: 'center' });

      // ===== WATERMARK =====
      doc.setTextColor(229, 25, 19);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(50);
      doc.text('EXOUSIA', pageWidth / 2, doc.internal.pageSize.getHeight() / 2 + 10, { 
        align: 'center', 
        angle: -30 
      });
      doc.setGState(new doc.GState({ opacity: 0.03 }));

      // Save the PDF
      doc.save(`receipt-${payment.reference || 'download'}.pdf`);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      if (onDownload) onDownload();
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Failed to generate receipt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={loading}
      className={`inline-flex items-center gap-2 transition-all duration-200 ${
        loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
      } ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Generating...
        </>
      ) : success ? (
        <>
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          Downloaded!
        </>
      ) : (
        children || (
          <>
            <Download className="w-4 h-4" />
            Download Receipt
          </>
        )
      )}
    </button>
  );
}