'use client';

import { useState, useEffect } from 'react';
import { Search, Eye, ChevronLeft, ChevronRight, CheckCircle, Clock, XCircle, Download, FileText, Loader2 } from 'lucide-react';

export default function PaymentHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);
  const [viewingReceipt, setViewingReceipt] = useState(null);
  const [payments, setPayments] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const res = await fetch('/api/partner/payments');
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  // View receipt in browser (opens in new tab)
  const handleViewReceipt = (paymentId) => {
    setViewingReceipt(paymentId);
    const url = `/api/payments/receipt/${paymentId}`;
    window.open(url, '_blank');
    setTimeout(() => setViewingReceipt(null), 1000);
  };

  // Download receipt
  const handleDownloadReceipt = async (paymentId) => {
    try {
      setDownloading(paymentId);
      
      if (!paymentId) {
        throw new Error('Invalid payment ID');
      }

      const res = await fetch(`/api/payments/receipt/${paymentId}`);
      
      if (!res.ok) {
        let errorMessage = 'Failed to download receipt';
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = `Error ${res.status}: ${res.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${paymentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download receipt: ' + error.message);
    } finally {
      setDownloading(null);
    }
  };

  const filteredPayments = payments.filter(p =>
    p.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.purpose?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-emerald-50 text-emerald-700';
      case 'pending': return 'bg-amber-50 text-amber-700';
      case 'failed': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-3 h-3" />;
      case 'pending': return <Clock className="w-3 h-3" />;
      case 'failed': return <XCircle className="w-3 h-3" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48 rounded"></div>
        <div className="skeleton h-12 w-full rounded"></div>
        <div className="skeleton h-96 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#4A4C4E]">Payment History</h1>
        <p className="text-[#4A4C4E]/60 mt-1">View all your monthly partnership payments</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A4C4E]/30" />
        <input
          type="text"
          className="input-premium pl-10"
          placeholder="Search by reference or purpose..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F6F7]">
              <tr className="text-left text-xs font-medium text-[#4A4C4E]/40 uppercase tracking-wider">
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Purpose</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E6E7]">
              {currentPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <FileText className="w-12 h-12 text-[#8A8C8E]/30 mb-3" />
                      <p className="text-[#4A4C4E]/60">No payments found</p>
                      <p className="text-xs text-[#4A4C4E]/40 mt-1">Your transaction history will appear here</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-[#F5F6F7] transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-[#4A4C4E]/80">{payment.reference}</td>
                    <td className="px-6 py-4 text-sm text-[#4A4C4E]/80">{payment.purpose || 'Monthly Partnership'}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#4A4C4E]">₦{payment.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-[#4A4C4E]/60">{payment.date}</td>
                    <td className="px-6 py-4 text-sm text-[#4A4C4E]/60">{payment.method || 'Card'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {payment.status === 'success' && (
                          <>
                            <button 
                              onClick={() => handleViewReceipt(payment.id)}
                              disabled={viewingReceipt === payment.id}
                              className="p-1.5 hover:bg-[#F5F6F7] rounded-lg transition-colors group"
                              title="View receipt in browser"
                            >
                              {viewingReceipt === payment.id ? (
                                <Loader2 className="w-4 h-4 animate-spin text-[#E51913]" />
                              ) : (
                                <Eye className="w-4 h-4 text-[#4A4C4E]/40 group-hover:text-[#E51913]" />
                              )}
                            </button>
                            <button 
                              onClick={() => handleDownloadReceipt(payment.id)}
                              disabled={downloading === payment.id}
                              className="p-1.5 hover:bg-[#F5F6F7] rounded-lg transition-colors group"
                              title="Download receipt"
                            >
                              {downloading === payment.id ? (
                                <Loader2 className="w-4 h-4 animate-spin text-[#3BBCEB]" />
                              ) : (
                                <Download className="w-4 h-4 text-[#4A4C4E]/40 group-hover:text-[#3BBCEB]" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-[#E5E6E7] flex items-center justify-between">
            <p className="text-sm text-[#4A4C4E]/60">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredPayments.length)} of {filteredPayments.length} results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-[#F5F6F7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-[#4A4C4E]/60" />
              </button>
              <span className="text-sm font-medium text-[#4A4C4E]">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-[#F5F6F7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-[#4A4C4E]/60" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}