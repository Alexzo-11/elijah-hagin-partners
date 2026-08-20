'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/providers/AuthProvider';
import { Loader2, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';

export default function PartnerPayments() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [amount, setAmount] = useState('');
  const [email, setEmail] = useState(user?.email || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const paymentAmount = parseFloat(amount);
    if (!paymentAmount || paymentAmount < 100) {
      setError('Please enter a valid amount (minimum ₦100)');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: paymentAmount,
          email: email,
          paymentMethod: 'paystack',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Payment initialization failed');
      }

      // Redirect to Paystack
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        throw new Error('No authorization URL received');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#4A4C4E]">Make a Payment</h1>
        <p className="text-sm text-[#4A4C4E]/60 mt-1">Support the ministry through partnership giving</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="card-premium p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">
              Amount (₦)
            </label>
            <input
              type="number"
              className="input-premium"
              placeholder="Enter amount (min ₦100)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="100"
              step="100"
              required
            />
            <p className="text-xs text-[#4A4C4E]/40 mt-1">Minimum amount is ₦100</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              className="input-premium"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center text-base py-3.5"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Pay Now
              </>
            )}
          </button>
        </form>
      </div>

      <div className="card-premium p-4 bg-[#F5F6F7] border-dashed">
        <div className="flex items-center gap-3 text-sm text-[#4A4C4E]/60">
          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <span>Your payment is processed securely via Paystack</span>
        </div>
      </div>
    </div>
  );
}