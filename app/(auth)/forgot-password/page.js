'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, CheckCircle } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Something went wrong');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f1f5f9] via-white to-[#eef2f6] p-4">
      <div className="w-full max-w-md">
        <div className="card-premium p-8 md:p-10">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#1a1a2e] flex items-center justify-center text-white font-extrabold text-sm">
                EH
              </div>
              <span className="font-bold text-lg text-[#0f172a]">Elijah Hagin</span>
            </Link>
            <h1 className="text-2xl font-bold text-[#0f172a] mt-6">Reset Password</h1>
            <p className="text-[#1a1a2e]/60 text-sm mt-2">
              We'll send you a link to reset your password
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {submitted ? (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-[#0f172a]">Check Your Email</h3>
              <p className="text-[#1a1a2e]/60 text-sm mt-2">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <Link href="/login" className="btn-primary mt-6 inline-flex items-center gap-2">
                Back to Login
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#0f172a] mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1a2e]/30" />
                  <input
                    type="email"
                    required
                    className="input-premium pl-10"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center text-base py-3.5"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-[#1a1a2e]/60 mt-6">
            Remember your password?{' '}
            <Link href="/login" className="text-[#1a1a2e] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}