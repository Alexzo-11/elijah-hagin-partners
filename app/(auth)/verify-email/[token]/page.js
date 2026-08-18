'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function VerifyEmail() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token;
  
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('Invalid verification link');
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/verify-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (res.ok) {
          setSuccess(true);
          setTimeout(() => router.push('/login'), 3000);
        } else {
          setError(data.error || 'Verification failed');
        }
      } catch (error) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f1f5f9] via-white to-[#eef2f6] p-4">
      <div className="w-full max-w-md">
        <div className="card-premium p-8 md:p-10 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 justify-center mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#1a1a2e] flex items-center justify-center text-white font-extrabold text-sm">
              EH
            </div>
            <span className="font-bold text-lg text-[#0f172a]">Elijah Hagin</span>
          </Link>

          {loading ? (
            <div>
              <Loader2 className="w-12 h-12 text-[#1a1a2e] animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-[#0f172a]">Verifying Your Email</h2>
              <p className="text-[#1a1a2e]/60 text-sm mt-2">Please wait...</p>
            </div>
          ) : success ? (
            <div>
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-[#0f172a]">Email Verified!</h2>
              <p className="text-[#1a1a2e]/60 text-sm mt-2">
                Your email has been verified. Redirecting to login...
              </p>
            </div>
          ) : (
            <div>
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-[#0f172a]">Verification Failed</h2>
              <p className="text-[#1a1a2e]/60 text-sm mt-2">{error}</p>
              <Link href="/login" className="btn-primary mt-6 inline-block">
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}