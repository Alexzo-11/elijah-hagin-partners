'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  CreditCard, 
  Users, 
  DollarSign, 
  Loader2,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
  ArrowUpRight,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { ExcelExport } from '@/app/components/ExcelExport';

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);
  const [viewingReceipt, setViewingReceipt] = useState(null);
  const [payments, setPayments] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    successful: 0,
    pending: 0,
    failed: 0,
    revenue: 0
  });
  const itemsPerPage = 10;

  const paymentHeaders = [
    { key: 'reference', label: 'Reference' },
    { key: 'partner', label: 'Partner' },
    { key: 'amount', label: 'Amount', isCurrency: true },
    { key: 'method', label: 'Method' },
    { key: 'date', label: 'Date', isDate: true },
    { key: 'status', label: 'Status' },
  ];

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/admin/payments');
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
        
        const total = data.payments.length;
        const successful = data.payments.filter(p => p.status === 'success').length;
        const pending = data.payments.filter(p => p.status === 'pending').length;
        const failed = data.payments.filter(p => p.status === 'failed').length;
        const revenue = data.payments
          .filter(p => p.status === 'success')
          .reduce((sum, p) => sum + p.amount, 0);
        
        setStats({ total, successful, pending, failed, revenue });
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
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
    p.partner?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-xl"></div>
          ))}
        </div>
        <div className="skeleton h-12 w-full rounded"></div>
        <div className="skeleton h-96 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#4A4C4E]">Payments</h1>
          <p className="text-[#4A4C4E]/60 mt-1">Manage all partnership payments</p>
        </div>
        <div className="flex items-center gap-3">
          <ExcelExport
            data={filteredPayments}
            filename={`payments-${new Date().toISOString().split('T')[0]}`}
            headers={paymentHeaders}
            sheetName="Payments"
            buttonText="Export Excel"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-premium p-4 card-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#4A4C4E]/40">Total Revenue</p>
              <p className="text-xl font-bold text-[#4A4C4E]">₦{stats.revenue.toLocaleString()}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#E51913]/10 text-[#E51913]">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="card-premium p-4 card-secondary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#4A4C4E]/40">Total Transactions</p>
              <p className="text-xl font-bold text-[#4A4C4E]">{stats.total}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-[#3BBCEB]/10 text-[#3BBCEB]">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="card-premium p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#4A4C4E]/40">Successful</p>
              <p className="text-xl font-bold text-emerald-600">{stats.successful}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>
        <div className="card-premium p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#4A4C4E]/40">Failed / Pending</p>
              <p className="text-xl font-bold text-amber-600">{stats.pending + stats.failed}</p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A4C4E]/30" />
        <input
          type="text"
          className="input-premium pl-10"
          placeholder="Search by reference or partner..."
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
                <th className="px-6 py-4">Partner</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E6E7]">
              {currentPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <CreditCard className="w-12 h-12 text-[#4A4C4E]/20 mx-auto mb-3" />
                    <p className="text-[#4A4C4E]/60">No payments found</p>
                  </td>
                </tr>
              ) : (
                currentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-[#F5F6F7] transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-[#4A4C4E]/80">{payment.reference}</td>
                    <td className="px-6 py-4 text-sm text-[#4A4C4E]">{payment.partner}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#4A4C4E]">₦{payment.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-[#4A4C4E]/60">{payment.method || 'Card'}</td>
                    <td className="px-6 py-4 text-sm text-[#4A4C4E]/60">{payment.date}</td>
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
                className="p-2 rounded-lg hover:bg-[#F5F6F7] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5 text-[#4A4C4E]/60" />
              </button>
              <span className="text-sm font-medium text-[#4A4C4E]">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-[#F5F6F7] disabled:opacity-50 disabled:cursor-not-allowed"
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