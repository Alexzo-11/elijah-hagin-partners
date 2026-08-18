'use client';

import { useAuth } from '../providers/AuthProvider';
import { Sidebar } from '../ui/Sidebar';
import { NotificationBell } from '../ui/NotificationBell';
import { ThemeToggle } from '../ui/ThemeToggle';
import { SearchBar } from '../ui/SearchBar';
import Link from 'next/link';

const adminNavItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/partners', label: 'Partners', icon: Users },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/reports', label: 'Reports', icon: FileBarChart },
  { href: '/admin/emails', label: 'Emails', icon: Mail },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
  { href: '/admin/activity-logs', label: 'Activity Logs', icon: Activity },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

// Import icons needed
import { LayoutDashboard, Users, CreditCard, FileBarChart, Mail, Bell, Activity, Settings } from 'lucide-react';

export function AdminLayout({ children }) {
  const { user, logout } = useAuth();

  const suggestions = [
    { label: 'John Doe', subtitle: 'john@example.com', value: 'john' },
    { label: 'Jane Smith', subtitle: 'jane@example.com', value: 'jane' },
    { label: 'PAY-2024-001', subtitle: '$250', value: 'pay-001' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Sidebar type="admin" items={adminNavItems} user={user} onLogout={logout} />
      
      <div className="lg:pl-72">
        <header className="glass border-b border-white/20 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
            <Link href="/admin" className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#1a1a2e] flex items-center justify-center text-white font-extrabold text-xs">
                EH
              </div>
            </Link>

            <div className="flex-1 max-w-xl">
              <SearchBar
                placeholder="Search partners, payments, references..."
                suggestions={suggestions}
                onSelect={(item) => console.log('Selected:', item)}
              />
            </div>

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