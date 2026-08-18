'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, FileText, CheckCircle, Users, Shield, CreditCard, Mail, Clock } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#F5F6F7]">
      {/* Header - No auth required */}
      <header className="glass border-b border-[#8A8C8E]/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 md:w-10 md:h-10 flex-shrink-0">
                <Image
                  src="/images/logopng.png"
                  alt="Exousia Fellowship"
                  fill
                  className="object-contain group-hover:scale-105 transition-transform"
                  priority
                />
              </div>
              <span className="font-bold text-lg tracking-tight text-[#4A4C4E]">
                Exousia
                <span className="text-[#E51913] font-normal"> Partners Inc.</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link href="/" className="text-[#4A4C4E]/70 hover:text-[#E51913] transition">Home</Link>
              <Link href="/learn-more" className="text-[#4A4C4E]/70 hover:text-[#E51913] transition">About</Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-[#4A4C4E]/70 hover:text-[#E51913] transition px-3 py-1.5 rounded-full hover:bg-[#F5F6F7]">
                Log in
              </Link>
              <Link href="/register" className="btn-primary text-sm py-2 px-5 shadow-lg shadow-[#E51913]/25">
                Become a Partner
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/" className="btn-outline text-sm py-2 px-4 flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>

          <div className="card-premium p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-xl bg-[#3BBCEB]/10">
                <FileText className="w-8 h-8 text-[#3BBCEB]" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#4A4C4E]">Terms of Service</h1>
                <p className="text-[#4A4C4E]/60 mt-1">Last updated: August 2026</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none text-[#4A4C4E]">
              <p className="text-lg">
                Welcome to Exousia Fellowship Incorporated. By using our website and services, you agree to comply with and be bound by the following terms and conditions.
              </p>

              <h2 className="text-2xl font-bold text-[#4A4C4E] mt-8 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-[#E51913]" />
                Acceptance of Terms
              </h2>
              <p>
                By accessing or using the Exousia Fellowship website, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree with any part of these terms, please do not use our services.
              </p>

              <h2 className="text-2xl font-bold text-[#4A4C4E] mt-8 flex items-center gap-2">
                <Users className="w-6 h-6 text-[#3BBCEB]" />
                Partnership Agreement
              </h2>
              <p>When you register as a partner with Exousia Fellowship, you agree to:</p>
              <ul>
                <li>Provide accurate and complete information during registration</li>
                <li>Maintain the confidentiality of your account credentials</li>
                <li>Use the platform for lawful and ministry-related purposes</li>
                <li>Honor your partnership commitments and contributions</li>
                <li>Respect the privacy and rights of other partners</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#4A4C4E] mt-8 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-[#E51913]" />
                Payments and Donations
              </h2>
              <p>All partnership payments and donations made through our platform are subject to the following:</p>
              <ul>
                <li>All payments are processed securely through Paystack</li>
                <li>Contributions are voluntary and non-refundable unless otherwise required by law</li>
                <li>You will receive an official receipt for every transaction</li>
                <li>We reserve the right to verify and confirm all transactions</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#4A4C4E] mt-8">User Responsibilities</h2>
              <p>As a user of our platform, you are responsible for:</p>
              <ul>
                <li>Maintaining the security of your account and password</li>
                <li>Notifying us immediately of any unauthorized use of your account</li>
                <li>Ensuring that your use of the platform complies with all applicable laws</li>
                <li>Not engaging in any activity that could harm the ministry or other users</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#4A4C4E] mt-8 flex items-center gap-2">
                <Shield className="w-6 h-6 text-[#E51913]" />
                Privacy and Data Protection
              </h2>
              <p>
                We are committed to protecting your privacy. Please review our <Link href="/privacy-policy" className="text-[#E51913] hover:underline">Privacy Policy</Link> to understand how we collect, use, and safeguard your personal information.
              </p>

              <h2 className="text-2xl font-bold text-[#4A4C4E] mt-8">Contact Us</h2>
              <p>If you have any questions about these Terms of Service, please contact us:</p>
              <div className="bg-[#F5F6F7] p-4 rounded-xl mt-2">
                <p><strong>Email:</strong> legal@exousiafellowship.org</p>
                <p><strong>Phone:</strong> +234 (703) 5996-162</p>
                <p><strong>Address:</strong> 39 Commercial Layout, Damboa Road, Maiduguri, Borno State, Nigeria</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2A2C2E] text-white/50 border-t border-[#8A8C8E]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/30">
            <p>&copy; 2026 Exousia Fellowship Incorporated. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy-policy" className="hover:text-[#E51913] transition">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-[#E51913] transition">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-[#E51913] transition">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}