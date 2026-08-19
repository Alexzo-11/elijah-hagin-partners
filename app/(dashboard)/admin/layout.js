'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/providers/AuthProvider';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FileBarChart,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Search,
  Loader2
} from 'lucide-react';

// Remove ThemeToggle import
// import { ThemeToggle } from '@/app/components/ThemeToggle';

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/partners', label: 'Partners', icon: Users },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/reports', label: 'Reports', icon: FileBarChart },
  { href: '/admin/emails', label: 'Emails', icon: Mail },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'admin') {
      router.push('/partner');
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
                <span className="font-bold text-sm text-[#4A4C4E]">Admin Portal</span>
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
                      ? 'bg-gradient-to-r from-[#E51913] to-[#E51913]/80 text-white shadow-lg shadow-[#E51913]/25'
                      : 'text-[#4A4C4E]/60 hover:bg-[#F5F6F7] hover:text-[#E51913]'
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
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#FFE8E7] to-[#E8F7FE] mb-3">
              <div className="w-9 h-9 rounded-full bg-[#E51913]/10 flex items-center justify-center text-[#E51913] font-semibold text-sm">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#4A4C4E] truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-[#4A4C4E]/40 truncate">{user?.email}</p>
                <span className="text-xs font-medium text-[#E51913] bg-[#E51913]/10 px-2 py-0.5 rounded-full inline-block mt-0.5">
                  Admin
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
              <div className="hidden md:block relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8C8E]" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-48 lg:w-64 px-4 py-2 pl-9 rounded-lg bg-white/50 border border-[#E5E6E7] text-sm focus:outline-none focus:ring-2 focus:ring-[#E51913]/10 focus:border-[#E51913] transition-all text-[#4A4C4E] placeholder:text-[#8A8C8E]"
                />
              </div>
              {/* ThemeToggle removed */}
              <div className="w-8 h-8 rounded-full bg-[#E51913]/10 flex items-center justify-center text-[#E51913] font-semibold text-sm">
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