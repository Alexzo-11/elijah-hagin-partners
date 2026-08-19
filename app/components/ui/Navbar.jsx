'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../providers/AuthProvider';
import { Menu, X, User, LogOut, Settings, Home, Heart, Church } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar({ transparent = false }) {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#home', label: 'Home', icon: Home },
    { href: '#about', label: 'About', icon: Church },
    { href: '#ministries', label: 'Ministry', icon: Heart },
  ];

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${scrolled || !transparent ? 'glass border-b border-[#8A8C8E]/10' : 'bg-transparent'}
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.div 
              whileHover={{ rotate: -10, scale: 1.05 }}
              className="relative w-9 h-9 md:w-10 md:h-10 flex-shrink-0"
            >
              <Image
                src="/images/logopng.png"
                alt="Exousia Fellowship"
                fill
                className="object-contain group-hover:scale-105 transition-transform"
                priority
              />
            </motion.div>
            <span className="font-bold text-lg tracking-tight text-[#4A4C4E] hidden sm:inline">
              Exousia
              <span className="text-[#E51913] font-normal"> Partners Inc.</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[#4A4C4E]/70 hover:text-[#E51913] transition relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#E51913] after:transition-all hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/50 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E51913]/20 to-[#3BBCEB]/20 flex items-center justify-center text-[#E51913] font-semibold text-sm">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <span className="text-sm font-medium text-[#4A4C4E]">
                    {user?.firstName}
                  </span>
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-56 glass rounded-xl shadow-xl border border-[#8A8C8E]/10 overflow-hidden"
                    >
                      <div className="p-3 border-b border-[#E5E6E7]">
                        <p className="font-medium text-[#4A4C4E]">{user?.firstName} {user?.lastName}</p>
                        <p className="text-sm text-[#4A4C4E]/40">{user?.email}</p>
                      </div>
                      <div className="p-2">
                        <Link
                          href={user?.role === 'admin' ? '/admin' : '/partner'}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#F5F6F7] transition text-sm text-[#4A4C4E]"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          href={user?.role === 'admin' ? '/admin/settings' : '/partner/settings'}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#F5F6F7] transition text-sm text-[#4A4C4E]"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
                          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-red-50 transition text-sm text-red-600"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-[#4A4C4E]/70 hover:text-[#E51913] transition px-3 py-1.5 rounded-full hover:bg-white/50"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="btn-primary text-sm py-2 px-5 shadow-lg shadow-[#E51913]/25"
                >
                  Become a Partner
                </Link>
              </>
            )}
          </div>

          {/* Mobile: Only Logo + Toggle Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              className="p-2 hover:bg-white/50 rounded-lg transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6 text-[#4A4C4E]" /> : <Menu className="w-6 h-6 text-[#4A4C4E]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-[#8A8C8E]/10 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-3">
              {!user ? (
                <>
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/50 hover:bg-white transition text-[#4A4C4E] hover:text-[#E51913]"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{link.label}</span>
                      </a>
                    );
                  })}
                  <div className="border-t border-[#E5E6E7] pt-3 mt-2 space-y-2">
                    <Link
                      href="/login"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/50 hover:bg-white transition text-[#4A4C4E] hover:text-[#E51913]"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Log in</span>
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#E51913] to-[#E51913]/80 text-white hover:opacity-90 transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">Become a Partner</span>
                    </Link>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 px-4 py-3 bg-white/50 rounded-xl">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E51913]/20 to-[#3BBCEB]/20 flex items-center justify-center text-[#E51913] font-semibold">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                    <div>
                      <p className="font-medium text-[#4A4C4E]">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-[#4A4C4E]/40">{user?.email}</p>
                    </div>
                  </div>
                  <Link
                    href={user?.role === 'admin' ? '/admin' : '/partner'}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/50 hover:bg-white transition text-[#4A4C4E] hover:text-[#E51913]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                  <Link
                    href={user?.role === 'admin' ? '/admin/settings' : '/partner/settings'}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/50 hover:bg-white transition text-[#4A4C4E] hover:text-[#E51913]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl bg-red-50 hover:bg-red-100 transition text-red-600"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}