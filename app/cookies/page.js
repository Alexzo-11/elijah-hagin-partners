'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Cookie, CheckCircle, Shield, Eye, Settings, Globe } from 'lucide-react';

export default function CookiesPage() {
  // No auth checks - freely accessible
  return (
    <div className="min-h-screen bg-[#F5F6F7]">
      {/* Same header */}
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
              <Link href="/register" className="text-[#4A4C4E]/70 hover:text-[#E51913] transition">Become a Partner</Link>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/login" className="hidden sm:inline-flex text-sm font-medium text-[#4A4C4E]/70 hover:text-[#E51913] transition px-3 py-1.5 rounded-full hover:bg-[#F5F6F7]">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </header>

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
              <div className="p-3 rounded-xl bg-amber-50">
                <Cookie className="w-8 h-8 text-amber-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#4A4C4E]">Cookies Policy</h1>
                <p className="text-[#4A4C4E]/60 mt-1">Last updated: August 2026</p>
              </div>
            </div>

            <div className="prose prose-lg max-w-none text-[#4A4C4E]">
              {/* Full cookies policy content here */}
              <p className="text-lg">
                This Cookies Policy explains how Exousia Fellowship Incorporated uses cookies and similar technologies...
              </p>

              <h2 className="text-2xl font-bold text-[#4A4C4E] mt-8 flex items-center gap-2">
                <Cookie className="w-6 h-6 text-amber-600" />
                What Are Cookies?
              </h2>
              <p>
                Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently, enhance user experience, and provide information to the website owners.
              </p>

              <h2 className="text-2xl font-bold text-[#4A4C4E] mt-8 flex items-center gap-2">
                <Settings className="w-6 h-6 text-[#3BBCEB]" />
                Types of Cookies We Use
              </h2>
              <p>We use the following types of cookies:</p>

              <div className="space-y-4 mt-4">
                <div className="border border-[#E5E6E7] rounded-xl p-4">
                  <h4 className="font-bold text-[#4A4C4E]">Essential Cookies</h4>
                  <p className="text-sm text-[#4A4C4E]/60">These cookies are necessary for the website to function properly. They enable core functionality such as security, authentication, and network management.</p>
                </div>

                <div className="border border-[#E5E6E7] rounded-xl p-4">
                  <h4 className="font-bold text-[#4A4C4E]">Performance Cookies</h4>
                  <p className="text-sm text-[#4A4C4E]/60">These cookies help us understand how visitors interact with our website by collecting information anonymously. We use this data to improve our site's performance and user experience.</p>
                </div>

                <div className="border border-[#E5E6E7] rounded-xl p-4">
                  <h4 className="font-bold text-[#4A4C4E]">Functionality Cookies</h4>
                  <p className="text-sm text-[#4A4C4E]/60">These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.</p>
                </div>

                <div className="border border-[#E5E6E7] rounded-xl p-4">
                  <h4 className="font-bold text-[#4A4C4E]">Targeting Cookies</h4>
                  <p className="text-sm text-[#4A4C4E]/60">These cookies may be set through our site by our advertising partners. They are used to build a profile of your interests and show you relevant content on other sites.</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[#4A4C4E] mt-8 flex items-center gap-2">
                <Globe className="w-6 h-6 text-[#E51913]" />
                How We Use Cookies
              </h2>
              <p>We use cookies for the following purposes:</p>
              <ul>
                <li>To authenticate and maintain your session</li>
                <li>To remember your preferences and settings</li>
                <li>To analyze website traffic and usage patterns</li>
                <li>To improve our services and user experience</li>
                <li>To provide secure transactions and payments</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#4A4C4E] mt-8 flex items-center gap-2">
                <Eye className="w-6 h-6 text-[#3BBCEB]" />
                Third-Party Cookies
              </h2>
              <p>
                We may use third-party services that set cookies on our behalf. These include:
              </p>
              <ul>
                <li><strong>Paystack:</strong> For secure payment processing</li>
                <li><strong>Google Analytics:</strong> For website analytics</li>
                <li><strong>Resend:</strong> For email communications</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#4A4C4E] mt-8">Managing Cookies</h2>
              <p>
                You can control and manage cookies in your browser settings. Most browsers allow you to:
              </p>
              <ul>
                <li>View the cookies stored on your device</li>
                <li>Delete existing cookies</li>
                <li>Block cookies from specific websites</li>
                <li>Configure your preferences for different types of cookies</li>
              </ul>

              <div className="bg-[#F5F6F7] p-4 rounded-xl mt-4">
                <p className="font-semibold">Note:</p>
                <p className="text-sm text-[#4A4C4E]/60">Please note that disabling certain cookies may affect the functionality and performance of our website, and may impact your user experience.</p>
              </div>

              <h2 className="text-2xl font-bold text-[#4A4C4E] mt-8">Contact Us</h2>
              <p>If you have any questions about our use of cookies, please contact us:</p>
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