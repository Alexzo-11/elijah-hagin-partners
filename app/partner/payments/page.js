'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/providers/AuthProvider';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Send,
  Loader2,
  Shield,
  CheckCircle,
  AlertCircle,
  Award,
  ArrowRight,
  Sparkles,
  Lock,
  Heart,
  Wallet,
  Calendar,
  Clock,
  Zap,
  Gem,
  Crown,
  Users,
  Globe,
  Church
} from 'lucide-react';

export default function MakePayment() {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [partnershipType, setPartnershipType] = useState('');
  const [partnershipAmount, setPartnershipAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await fetch('/api/partner/details');
        if (res.ok) {
          const data = await res.json();
          setPartnershipType(data.partnershipType || 'SILVER');
          setPartnershipAmount(data.partnershipAmount || 0);
          setAmount(data.partnershipAmount?.toString() || '');
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setFetching(false);
      }
    };
    
    if (user) {
      fetchUserDetails();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const paymentAmount = parseFloat(amount);
    
    if (!paymentAmount || paymentAmount < 1) {
      setError('Please enter a valid amount (minimum ₦1)');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: paymentAmount,
          purpose: 'Monthly Partnership',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Payment initialization failed');
      }

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error('No authorization URL received');
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card-premium p-8 text-center">
          <AlertCircle className="w-12 h-12 text-[#E51913] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#4A4C4E]">Please Log In</h2>
          <p className="text-[#4A4C4E]/60 mt-2">You need to be logged in to make a payment.</p>
          <button 
            onClick={() => router.push('/login')}
            className="btn-primary mt-4"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="card-premium p-8 text-center">
          <Loader2 className="w-12 h-12 text-[#3BBCEB] animate-spin mx-auto mb-4" />
          <p className="text-[#4A4C4E]/60">Loading your partnership details...</p>
        </div>
      </div>
    );
  }

  const partnershipColors = {
    SILVER: { 
      bg: 'bg-gradient-to-br from-gray-100 to-gray-200',
      text: 'text-gray-700',
      border: 'border-gray-300',
      icon: '🥈',
      gradient: 'from-gray-400 to-gray-600'
    },
    GOLD: { 
      bg: 'bg-gradient-to-br from-amber-100 to-amber-200',
      text: 'text-amber-700',
      border: 'border-amber-300',
      icon: '🥇',
      gradient: 'from-amber-400 to-amber-600'
    },
    DIAMOND: { 
      bg: 'bg-gradient-to-br from-blue-100 to-blue-200',
      text: 'text-blue-700',
      border: 'border-blue-300',
      icon: '💎',
      gradient: 'from-blue-400 to-blue-600'
    }
  };

  const badge = partnershipColors[partnershipType] || partnershipColors.SILVER;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-[#FFE8E7]">
            <Wallet className="w-6 h-6 text-[#E51913]" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#4A4C4E]">Make a Payment</h1>
        </div>
        <p className="text-[#4A4C4E]/60 ml-12">Support the ministry with your monthly partnership gift</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="card-premium p-6 md:p-8"
      >
        {success ? (
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-[#4A4C4E]">Payment Successful!</h2>
            <p className="text-[#4A4C4E]/60 mt-2">Thank you for your faithful partnership.</p>
            <div className="flex gap-4 justify-center mt-6">
              <button 
                onClick={() => router.push('/partner/history')}
                className="btn-primary"
              >
                View History
              </button>
              <button 
                onClick={() => router.push('/partner')}
                className="btn-outline-secondary"
              >
                Dashboard
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-start gap-2"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            {/* Partnership Type Card */}
            <div className={`bg-gradient-to-r ${badge.gradient} rounded-xl p-6 relative overflow-hidden`}>
              <div className="absolute top-0 right-0 text-6xl opacity-10">⛪</div>
              <div className="absolute bottom-0 left-0 text-4xl opacity-10">❤️</div>
              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{badge.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-lg">{partnershipType}</h3>
                      <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white">
                        Tier
                      </span>
                    </div>
                    <p className="text-white/80 text-sm mt-1">
                      Your monthly partnership commitment
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-white/90">
                  <div className="flex items-center gap-1 text-sm">
                    <Wallet className="w-4 h-4" />
                    <span>Monthly: ₦{partnershipAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>Recurring</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Amount */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-[#4A4C4E]">
                  Payment Amount (₦)
                </label>
                <span className="text-xs text-[#4A4C4E]/40">Fixed monthly contribution</span>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <span className="text-lg font-semibold text-[#4A4C4E]/40">₦</span>
                  <div className="w-px h-6 bg-[#E5E6E7]"></div>
                </div>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  className="input-premium pl-20 text-lg font-semibold bg-[#F5F6F7] cursor-not-allowed"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  readOnly
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Lock className="w-4 h-4 text-[#8A8C8E]" />
                </div>
              </div>
              <p className="text-xs text-[#3BBCEB] mt-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                This amount is based on your {partnershipType} partnership tier
              </p>
            </div>

            {/* Security Badge */}
            <div className="bg-[#E8F7FE] rounded-xl p-4 flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#3BBCEB] flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#4A4C4E]">Secure Payment</p>
                <p className="text-xs text-[#4A4C4E]/60">Your payment is encrypted and secure via Paystack</p>
              </div>
              <div className="ml-auto flex items-center gap-1">
                <div className="w-6 h-4 bg-[#E51913]/10 rounded flex items-center justify-center">
                  <span className="text-[8px] font-bold text-[#E51913]">SSL</span>
                </div>
                <div className="w-6 h-4 bg-[#3BBCEB]/10 rounded flex items-center justify-center">
                  <span className="text-[8px] font-bold text-[#3BBCEB]">256</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading || !amount || parseFloat(amount) === 0}
              className="btn-gradient w-full justify-center text-base py-3.5 shadow-lg shadow-[#E51913]/25"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Pay ₦{parseFloat(amount).toLocaleString()}
                  <Send className="w-4 h-4" />
                </>
              )}
            </motion.button>

            <p className="text-xs text-[#4A4C4E]/40 text-center flex items-center justify-center gap-1">
              <Heart className="w-3 h-3 text-[#E51913]" />
              By proceeding, you agree to our terms and conditions
              <Heart className="w-3 h-3 text-[#3BBCEB]" />
            </p>
          </form>
        )}
      </motion.div>

      {/* Info Cards - Simplified */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="card-premium p-4 bg-gradient-to-br from-[#FFE8E7] to-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-[#E51913]/10">
              <Church className="w-5 h-5 text-[#E51913]" />
            </div>
            <h3 className="font-semibold text-[#4A4C4E]">Why Give?</h3>
          </div>
          <p className="text-sm text-[#4A4C4E]/60 leading-relaxed">
            Your partnership helps us advance the Gospel, support missionaries, and reach communities with the love of Christ.
          </p>
        </div>

        <div className="card-premium p-4 bg-gradient-to-br from-[#E8F7FE] to-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-xl bg-[#3BBCEB]/10">
              <Sparkles className="w-5 h-5 text-[#3BBCEB]" />
            </div>
            <h3 className="font-semibold text-[#4A4C4E]">Quick Info</h3>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-[#4A4C4E]/60">Partnership Type</span>
              <span className="font-medium">{partnershipType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4A4C4E]/60">Monthly Amount</span>
              <span className="font-medium text-[#E51913]">₦{partnershipAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#4A4C4E]/60">Status</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                <CheckCircle className="w-3 h-3" />
                Active
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}