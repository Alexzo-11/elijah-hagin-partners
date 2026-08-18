'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Download, Loader2, FileSpreadsheet } from 'lucide-react';

export function ExcelExport({ 
  data, 
  filename, 
  headers, 
  sheetName = 'Sheet1',
  buttonText = 'Export Excel',
  className = '',
  icon = true,
  variant = 'outline'
}) {
  const [loading, setLoading] = useState(false);

  const exportToExcel = () => {
    setLoading(true);
    try {
      // Check if data exists
      if (!data || data.length === 0) {
        alert('No data available to export');
        setLoading(false);
        return;
      }

      // Format data with proper headers
      const formattedData = data.map(row => {
        const obj = {};
        headers.forEach(header => {
          let value = row[header.key];
          
          // Handle different data types
          if (value === undefined || value === null) {
            value = '';
          }
          
          // Format date if needed
          if (header.isDate && value) {
            value = new Date(value).toLocaleDateString('en-NG', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });
          }
          
          // Format currency if needed
          if (header.isCurrency && typeof value === 'number') {
            value = `₦${value.toLocaleString()}`;
          }
          
          // Format boolean
          if (header.isBoolean && typeof value === 'boolean') {
            value = value ? 'Active' : 'Inactive';
          }
          
          obj[header.label] = value;
        });
        return obj;
      });

      // Create workbook
      const ws = XLSX.utils.json_to_sheet(formattedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName);

      // Set column widths
      const colWidths = headers.map(() => ({ wch: 25 }));
      ws['!cols'] = colWidths;

      // Add auto-filter
      if (formattedData.length > 0) {
        const range = XLSX.utils.decode_range(ws['!ref']);
        ws['!autofilter'] = { ref: XLSX.utils.encode_range(range) };
      }

      // Add styling for headers
      const headerRow = XLSX.utils.sheet_to_json(ws, { header: 1 })[0];
      if (headerRow) {
        ws['!rows'] = [{ hpt: 30 }];
        // Make header bold
        headerRow.forEach((_, index) => {
          const cellAddress = XLSX.utils.encode_cell({ r: 0, c: index });
          if (!ws[cellAddress]) ws[cellAddress] = {};
          ws[cellAddress].s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "E51913" } },
            alignment: { horizontal: 'center' }
          };
        });
      }

      // Save file
      XLSX.writeFile(wb, `${filename}.xlsx`);

      // Show success message
      setLoading(false);
      alert(`✅ ${formattedData.length} records exported successfully!`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export. Please try again.');
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
      onClick={exportToExcel}
      disabled={loading}
      className={`${getButtonStyles()} ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : icon ? (
        <FileSpreadsheet className="w-4 h-4" />
      ) : null}
      {loading ? 'Exporting...' : buttonText}
    </button>
  );
}