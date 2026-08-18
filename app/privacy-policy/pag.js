'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Shield, CheckCircle, Lock, Eye, Database, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
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
              <div className="p-3 rounded-xl bg-[#E51913]/10">
                <Shield className="w-8 h-8 text-[#E51913]" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#4A4C4E]">Privacy Policy</h1>
                <p className="text-[#4A4C4E]/60 mt-1">Last updated: August 2026</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none text-[#4A4C4E]">
              <p className="text-lg">
                At Exousia Fellowship Incorporated, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you interact with our ministry.
              </p>

              <h2 className="text-2xl font-bold text-[#4A4C4E] mt-8 flex items-center gap-2">
                <Database className="w-6 h-6 text-[#E51913]" />
                Information We Collect
              </h2>
              <p>We collect information that you voluntarily provide to us when you:</p>
              <ul>
                <li>Register as a partner</li>
                <li>Make a donation or partnership payment</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact us for support or prayer requests</li>
                <li>Participate in our events or programs</li>
              </ul>
              <p>The types of information we may collect include:</p>
              <ul>
                <li><strong>Personal Identification:</strong> Name, email address, phone number, postal address</li>
                <li><strong>Payment Information:</strong> Transaction details, payment history (we do not store full payment card details)</li>
                <li><strong>Partnership Details:</strong> Partnership type, donation amounts, communication preferences</li>
                <li><strong>Demographic Information:</strong> Gender, date of birth, occupation, nationality</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#4A4C4E] mt-8 flex items-center gap-2">
                <Lock className="w-6 h-6 text-[#3BBCEB]" />
                How We Use Your Information
              </h2>
              <p>We use your information to:</p>
              <ul>
                <li>Process and manage your partnership contributions</li>
                <li>Send you receipts and statements</li>
                <li>Communicate ministry updates and prayer requests</li>
                <li>Respond to your inquiries and provide support</li>
                <li>Improve our services and ministry impact</li>
                <li>Comply with legal and regulatory requirements</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#4A4C4E] mt-8 flex items-center gap-2">
                <Eye className="w-6 h-6 text-[#E51913]" />
                Data Security
              </h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul>
                <li>256-bit SSL encryption for all data transmission</li>
                <li>Secure database storage with access controls</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Limited staff access to personal data</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#4A4C4E] mt-8">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy or how we handle your data, please contact us:
              </p>
              <div className="bg-[#F5F6F7] p-4 rounded-xl mt-2">
                <p><strong>Email:</strong> privacy@exousiafellowship.org</p>
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