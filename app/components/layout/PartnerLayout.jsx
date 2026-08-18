'use client';

import { useAuth } from '../providers/AuthProvider';
import { Sidebar } from '../ui/Sidebar';
import { NotificationBell } from '../ui/NotificationBell';
import { ThemeToggle } from '../ui/ThemeToggle';
import Link from 'next/link';

export function PartnerLayout({ children }) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar type="partner" user={user} onLogout={logout} />
      
      <div className="lg:pl-72">
        <header className="glass border-b border-white/20 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/partner" className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1a1a2e] flex items-center justify-center text-white font-extrabold text-xs">
                EH
              </div>
            </Link>

            <div className="flex items-center gap-3 ml-auto">
              <NotificationBell notifications={[]} />
              <ThemeToggle />
              <div className="w-8 h-8 rounded-full bg-[#1a1a2e]/10 flex items-center justify-center text-[#1a1a2e] font-semibold text-sm">
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