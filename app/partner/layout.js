'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/providers/AuthProvider';
import {
  LayoutDashboard,
  CreditCard,
  History,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Loader2
} from 'lucide-react';

// Remove ThemeToggle import
// import { ThemeToggle } from '@/app/components/ThemeToggle';

const navItems = [
  { href: '/partner', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/partner/payments', label: 'Make Payment', icon: CreditCard },
  { href: '/partner/history', label: 'Payment History', icon: History },
  { href: '/partner/settings', label: 'Settings', icon: Settings },
];

export default function PartnerLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'partner') {
      router.push('/admin');
    } else {
      setLoading(false);
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F6F7]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#E51913] animate-spin mx-auto mb-4" />
          <p className="text-[#4A4C4E]/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F6F7]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-[#E5E6E7] z-50 transform transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-[#E5E6E7]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <div className="relative w-12 h-12">
                    <Image
                      src="/images/logopng.png"
                      alt="Exousia Fellowship"
                      fill
                      sizes="48px"
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
                <span className="font-bold text-sm text-[#4A4C4E]">Partner Portal</span>
              </div>
              <button
                className="lg:hidden p-2 hover:bg-[#F5F6F7] rounded-lg"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-5 h-5 text-[#4A4C4E]/50" />
              </button>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#3BBCEB] to-[#3BBCEB]/80 text-white shadow-lg shadow-[#3BBCEB]/25'
                      : 'text-[#4A4C4E]/60 hover:bg-[#F5F6F7] hover:text-[#3BBCEB]'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-[#E5E6E7]">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#E8F7FE] to-[#FFE8E7] mb-3">
              <div className="w-9 h-9 rounded-full bg-[#3BBCEB]/10 flex items-center justify-center text-[#3BBCEB] font-semibold text-sm">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#4A4C4E] truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-[#4A4C4E]/40 truncate">{user?.email}</p>
                <span className="text-xs font-medium text-[#3BBCEB] bg-[#3BBCEB]/10 px-2 py-0.5 rounded-full inline-block mt-0.5">
                  Partner
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="glass border-b border-[#8A8C8E]/10 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden p-2 hover:bg-[#F5F6F7] rounded-lg"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5 text-[#4A4C4E]" />
              </button>
              <div className="hidden lg:flex items-center gap-2">
                <span className="text-sm font-medium text-[#4A4C4E]">Welcome, {user?.firstName}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* ThemeToggle removed */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3BBCEB] to-[#2A9FD4]/10 flex items-center justify-center text-[#3BBCEB] font-semibold text-sm">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}