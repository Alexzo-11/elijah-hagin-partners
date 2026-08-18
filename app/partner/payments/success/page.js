'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Home,
  Download,
  ArrowRight,
  XCircle,
  Loader2,
  Printer,
  Eye,
  Sparkles,
  Heart,
  User,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  Calendar,
  Clock
} from 'lucide-react';

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get('reference');
  const demo = searchParams.get('demo') === 'true';
  
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!reference) {
      router.push('/partner');
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Verification failed');
        }

        setPayment(data.payment);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [reference, router]);

  const handleViewReceipt = () => {
    if (payment && payment.id) {
      window.open(`/api/payments/receipt/${payment.id}`, '_blank');
    }
  };

  const handleDownloadReceipt = async () => {
    if (!payment || !payment.id) {
      alert('No receipt available');
      return;
    }

    setDownloading(true);
    try {
      const res = await fetch(`/api/payments/receipt/${payment.id}`);
      if (!res.ok) {
        throw new Error('Failed to download receipt');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${payment.reference}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download receipt. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 rounded-full border-4 border-[#E51913]/20 border-t-[#E51913] animate-spin"></div>
          <p className="mt-4 text-[#4A4C4E]/60">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error || !payment || payment.status !== 'success') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#4A4C4E]">Payment Failed</h2>
          <p className="text-[#4A4C4E]/60 mt-2">{error || 'Something went wrong with your payment'}</p>
          <Link href="/partner/payments" className="btn-primary mt-6 inline-flex items-center gap-2">
            Try Again
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Success Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-8"
      >
        <div className="absolute top-0 right-0 opacity-10">
          <CheckCircle className="w-48 h-48 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Payment Successful!</h1>
              <p className="text-white/80 mt-1">Thank you for your faithful partnership</p>
            </div>
          </div>
          <div className="md:ml-auto flex items-center gap-3">
            <span className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium">
              {payment.reference}
            </span>
            {demo && (
              <span className="px-3 py-1 bg-amber-400/20 backdrop-blur-sm rounded-full text-amber-100 text-xs font-medium">
                Demo Mode
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Payment Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-premium p-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-[#4A4C4E]/40">Amount</p>
            <p className="text-lg font-bold text-[#E51913]">{formatCurrency(payment.amount)}</p>
          </div>
          <div>
            <p className="text-xs text-[#4A4C4E]/40">Status</p>
            <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle className="w-3 h-3" />
              Success
            </span>
          </div>
          <div>
            <p className="text-xs text-[#4A4C4E]/40">Reference</p>
            <p className="text-sm font-mono text-[#4A4C4E]">{payment.reference}</p>
          </div>
          <div>
            <p className="text-xs text-[#4A4C4E]/40">Partner</p>
            <p className="text-sm font-medium text-[#4A4C4E]">{payment.partnerName || 'You'}</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 gap-3"
      >
        <button
          onClick={handleViewReceipt}
          className="card-premium p-4 hover:border-[#E51913]/30 transition-all flex items-center gap-3 group"
        >
          <div className="p-2.5 rounded-xl bg-[#E51913]/10 group-hover:bg-[#E51913]/20 transition-colors">
            <Eye className="w-5 h-5 text-[#E51913]" />
          </div>
          <div>
            <p className="font-medium text-[#4A4C4E]">View Receipt</p>
            <p className="text-xs text-[#4A4C4E]/60">Open in browser</p>
          </div>
        </button>

        <button
          onClick={handleDownloadReceipt}
          disabled={downloading}
          className="card-premium p-4 hover:border-[#3BBCEB]/30 transition-all flex items-center gap-3 group"
        >
          <div className="p-2.5 rounded-xl bg-[#3BBCEB]/10 group-hover:bg-[#3BBCEB]/20 transition-colors">
            {downloading ? (
              <Loader2 className="w-5 h-5 animate-spin text-[#3BBCEB]" />
            ) : (
              <Download className="w-5 h-5 text-[#3BBCEB]" />
            )}
          </div>
          <div>
            <p className="font-medium text-[#4A4C4E]">
              {downloading ? 'Downloading...' : 'Download Receipt'}
            </p>
            <p className="text-xs text-[#4A4C4E]/60">PDF format</p>
          </div>
        </button>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Link
          href="/partner/history"
          className="card-premium p-4 hover:border-[#E51913]/30 transition-all flex items-center gap-3 group"
        >
          <div className="p-2.5 rounded-xl bg-[#E51913]/10 group-hover:bg-[#E51913]/20 transition-colors">
            <Eye className="w-5 h-5 text-[#E51913]" />
          </div>
          <div>
            <p className="font-medium text-[#4A4C4E]">View History</p>
            <p className="text-xs text-[#4A4C4E]/60">See all your payments</p>
          </div>
        </Link>

        <Link
          href="/partner/payments"
          className="card-premium p-4 hover:border-[#3BBCEB]/30 transition-all flex items-center gap-3 group"
        >
          <div className="p-2.5 rounded-xl bg-[#3BBCEB]/10 group-hover:bg-[#3BBCEB]/20 transition-colors">
            <CreditCard className="w-5 h-5 text-[#3BBCEB]" />
          </div>
          <div>
            <p className="font-medium text-[#4A4C4E]">Make Another Payment</p>
            <p className="text-xs text-[#4A4C4E]/60">Continue supporting</p>
          </div>
        </Link>

        <Link
          href="/partner"
          className="card-premium p-4 hover:border-[#E51913]/30 transition-all flex items-center gap-3 group"
        >
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#E51913]/10 to-[#3BBCEB]/10 group-hover:from-[#E51913]/20 group-hover:to-[#3BBCEB]/20 transition-colors">
            <Home className="w-5 h-5 text-[#E51913]" />
          </div>
          <div>
            <p className="font-medium text-[#4A4C4E]">Go to Dashboard</p>
            <p className="text-xs text-[#4A4C4E]/60">View your summary</p>
          </div>
        </Link>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-xs text-[#4A4C4E]/30 space-y-1"
      >
        <p>This is a computer-generated receipt. No signature required.</p>
        <p>For any questions, please contact us at support@exousiafellowship.org</p>
        <p className="text-[#E51913]/20 mt-2">© {new Date().getFullYear()} Exousia Fellowship Incorporated</p>
      </motion.div>
    </div>
  );
}