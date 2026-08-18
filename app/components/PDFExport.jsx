'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download, Loader2, FileText } from 'lucide-react';

export function PDFExport({ 
  data, 
  filename, 
  headers, 
  title = 'Report',
  subtitle = '',
  buttonText = 'Export PDF',
  className = '',
  icon = true,
  variant = 'outline'
}) {
  const [loading, setLoading] = useState(false);

  const exportToPDF = () => {
    setLoading(true);
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 20;

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(229, 25, 19);
      doc.text(title, pageWidth / 2, y, { align: 'center' });

      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(74, 76, 78);
      doc.text(subtitle || `Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, y, { align: 'center' });

      y += 10;

      // Table data
      const tableData = data.map(row => {
        return headers.map(header => {
          let value = row[header.key];
          if (header.isDate && value) {
            value = new Date(value).toLocaleDateString();
          }
          if (header.isCurrency && value) {
            value = `₦${value.toLocaleString()}`;
          }
          return value !== undefined && value !== null ? value : '';
        });
      });

      // Generate table
      doc.autoTable({
        startY: y,
        head: [headers.map(h => h.label)],
        body: tableData,
        theme: 'striped',
        headStyles: {
          fillColor: [229, 25, 19],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          halign: 'center',
        },
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        columnStyles: {
          0: { cellWidth: 'auto' },
        },
        didParseCell: function(data) {
          // Color code status cells
          if (data.section === 'body' && headers[data.column.dataKey]?.key === 'status') {
            const value = data.cell.raw;
            if (value === 'success') {
              data.cell.styles.fillColor = [209, 250, 229];
              data.cell.styles.textColor = [5, 150, 105];
            } else if (value === 'pending') {
              data.cell.styles.fillColor = [254, 243, 199];
              data.cell.styles.textColor = [217, 119, 6];
            } else if (value === 'failed') {
              data.cell.styles.fillColor = [254, 226, 226];
              data.cell.styles.textColor = [220, 38, 38];
            }
          }
        },
      });

      // Footer
      const finalY = doc.internal.pageSize.getHeight() - 20;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(138, 140, 142);
      doc.text(
        `© ${new Date().getFullYear()} Exousia Fellowship Incorporated`,
        pageWidth / 2,
        finalY,
        { align: 'center' }
      );

      // Save PDF
      doc.save(`${filename}.pdf`);

      if (window.onPDFExportSuccess) {
        window.onPDFExportSuccess();
      }
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getButtonStyles = () => {
    if (variant === 'primary') {
      return 'btn-primary text-sm py-2.5 px-5 flex items-center gap-2';
    }
    return 'btn-outline text-sm py-2.5 px-5 flex items-center gap-2';
  };

  return (
    <button
      onClick={exportToPDF}
      disabled={loading || data.length === 0}
      className={`${getButtonStyles()} ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : icon ? (
        <FileText className="w-4 h-4" />
      ) : null}
      {loading ? 'Generating...' : buttonText}
      {!loading && data.length === 0 && ' (No data)'}
    </button>
  );
}