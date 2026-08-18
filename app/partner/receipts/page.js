'use client';

import { useState } from 'react';
import { Search, Download, FileText, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Receipts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const receipts = [
    { id: 1, receiptNumber: 'RCP-2024-001', reference: 'PAY-2024-001', amount: 250, date: '2024-12-20', purpose: 'Monthly Partnership' },
    { id: 2, receiptNumber: 'RCP-2024-002', reference: 'PAY-2024-002', amount: 500, date: '2024-12-15', purpose: 'Building Fund' },
    { id: 3, receiptNumber: 'RCP-2024-003', reference: 'PAY-2024-005', amount: 1000, date: '2024-11-28', purpose: 'Annual Gift' },
    { id: 4, receiptNumber: 'RCP-2024-004', reference: 'PAY-2024-006', amount: 200, date: '2024-11-20', purpose: 'Monthly Partnership' },
    { id: 5, receiptNumber: 'RCP-2024-005', reference: 'PAY-2024-007', amount: 75, date: '2024-11-15', purpose: 'Missions' },
  ];

  const filteredReceipts = receipts.filter(r =>
    r.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReceipts = filteredReceipts.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#1B2A4A]">Receipts</h1>
        <p className="text-[#1B2A4A]/60 mt-1">Download your partnership receipts</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1B2A4A]/30" />
        <input
          type="text"
          className="input-premium pl-10"
          placeholder="Search receipts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {currentReceipts.length === 0 ? (
          <div className="card-premium p-12 text-center">
            <FileText className="w-12 h-12 text-[#1B2A4A]/20 mx-auto mb-4" />
            <p className="text-[#1B2A4A]/60">No receipts found</p>
          </div>
        ) : (
          currentReceipts.map((receipt) => (
            <div key={receipt.id} className="card-premium p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#C9A84C]/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#C9A84C]/10">
                  <FileText className="w-6 h-6 text-[#C9A84C]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1B2A4A]">{receipt.receiptNumber}</h3>
                  <p className="text-sm text-[#1B2A4A]/60">{receipt.purpose} · {receipt.date}</p>
                  <p className="text-sm font-mono text-[#1B2A4A]/40">Ref: {receipt.reference}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-[#1B2A4A]">${receipt.amount.toLocaleString()}</span>
                <div className="flex gap-2">
                  <button className="p-2.5 rounded-lg hover:bg-[#FDF8F0] transition-colors">
                    <Eye className="w-5 h-5 text-[#1B2A4A]/40" />
                  </button>
                  <button className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#1B2A4A]/60">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredReceipts.length)} of {filteredReceipts.length} receipts
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-[#FDF8F0] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 text-[#1B2A4A]/60" />
            </button>
            <span className="text-sm font-medium text-[#1B2A4A]">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-[#FDF8F0] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5 text-[#1B2A4A]/60" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}