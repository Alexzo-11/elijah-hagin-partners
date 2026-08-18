'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/providers/AuthProvider';
import { 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Lock, 
  Mail, 
  Shield,
  Heart,
  Loader2,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      setLoading(false);
    } else {
      setError(result.error || 'Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F5F6F7] via-white to-[#F5F6F7] p-4 relative overflow-hidden">
      {/* Background Glassmorphism Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#E51913]/5 to-[#3BBCEB]/5 blur-3xl"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#3BBCEB]/5 to-[#E51913]/5 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[#E51913]/3 blur-3xl"></div>
      </div>
      
      {/* Logo Watermarks in Background */}
      <div className="absolute top-10 left-10 opacity-[0.03] transform -rotate-12">
        <div className="relative w-48 h-48">
          <Image
            src="/images/logopng.png"
            alt="Exousia Fellowship"
            fill
            className="object-contain"
          />
        </div>
      </div>
      <div className="absolute bottom-10 right-10 opacity-[0.03] transform rotate-12">
        <div className="relative w-48 h-48">
          <Image
            src="/images/logopng.png"
            alt="Exousia Fellowship"
            fill
            className="object-contain"
          />
        </div>
      </div>
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 opacity-[0.02] transform -rotate-6">
        <div className="relative w-64 h-64">
          <Image
            src="/images/logopng.png"
            alt="Exousia Fellowship"
            fill
            className="object-contain"
          />
        </div>
      </div>
      <div className="absolute bottom-1/3 right-1/4 opacity-[0.02] transform rotate-6">
        <div className="relative w-64 h-64">
          <Image
            src="/images/logopng.png"
            alt="Exousia Fellowship"
            fill
            className="object-contain"
          />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10"
      >
        <div className="relative">
          {/* Glassmorphism Card */}
          <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl shadow-[#E51913]/5 border border-white/20 p-8 md:p-10">
            {/* Glass shine effect */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
            
            {/* Top gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E51913] via-[#3BBCEB] to-[#E51913] rounded-t-2xl"></div>

            {/* Logo */}
            <div className="text-center mb-8">
              <Link href="/" className="inline-flex flex-col items-center gap-3 group">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="relative w-24 h-24"
                >
                  <Image
                    src="/images/logopng.png"
                    alt="Exousia Fellowship"
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>
                <div className="text-center">
                  <span className="block text-xs text-[#4A4C4E]/40 font-medium tracking-[0.2em] uppercase">
                    Partnership Portal
                  </span>
                </div>
              </Link>
              
              <h1 className="text-2xl font-bold text-[#4A4C4E] mt-6">Welcome Back</h1>
              <p className="text-[#4A4C4E]/60 text-sm mt-2">
                Sign in to your partnership account
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-start gap-2"
              >
                <span className="text-red-500 mt-0.5">⚠️</span>
                <span>{error}</span>
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#4A4C4E]/30 group-focus-within:text-[#E51913] transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 border border-[#E5E6E7] focus:border-[#E51913] focus:ring-4 focus:ring-[#E51913]/10 transition-all outline-none text-[#4A4C4E] placeholder:text-[#4A4C4E]/30"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-[#4A4C4E]">
                    Password
                  </label>
                  <Link 
                    href="/forgot-password" 
                    className="text-xs text-[#3BBCEB] hover:text-[#2A9FD4] transition font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-[#4A4C4E]/30 group-focus-within:text-[#E51913] transition-colors" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/50 border border-[#E5E6E7] focus:border-[#E51913] focus:ring-4 focus:ring-[#E51913]/10 transition-all outline-none text-[#4A4C4E] placeholder:text-[#4A4C4E]/30"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#4A4C4E]/30 hover:text-[#4A4C4E]/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <input 
                  type="checkbox" 
                  className="rounded border-[#E51913]/30 text-[#E51913] focus:ring-[#E51913]/20 w-4 h-4" 
                />
                <label className="text-[#4A4C4E]/60">Remember me</label>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#E51913] to-[#E51913]/80 text-white font-semibold text-base shadow-lg shadow-[#E51913]/25 hover:shadow-xl hover:shadow-[#E51913]/30 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#E5E6E7]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 text-[#4A4C4E]/40">or</span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-[#4A4C4E]/60">
                Don't have an account?{' '}
                <Link 
                  href="/register" 
                  className="text-[#E51913] font-semibold hover:text-[#C41712] transition hover:underline"
                >
                  Create one now
                </Link>
              </p>
            </div>

            {/* Security Badge */}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#4A4C4E]/40">
              <Shield className="w-3 h-3 text-[#E51913]" />
              <span>Secure login with 256-bit encryption</span>
              <Sparkles className="w-3 h-3 text-[#3BBCEB]" />
            </div>

            {/* Glass effect bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-[#4A4C4E]/30 mt-6">
          © 2026 Exousia Fellowship Incorporated. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}