'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CreditCard,
  History,
  Receipt,
  Bell,
  Settings,
  LogOut,
  Heart,
} from 'lucide-react';

export function PartnerSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/partner',
      icon: LayoutDashboard,
    },
    {
      label: 'Make Payment',
      href: '/partner/payments',
      icon: CreditCard,
    },
    {
      label: 'Payment History',
      href: '/partner/history',
      icon: History,
    },
    {
      label: 'Receipts',
      href: '/partner/receipts',
      icon: Receipt,
    },
    {
      label: 'Notifications',
      href: '/partner/notifications',
      icon: Bell,
    },
    {
      label: 'Settings',
      href: '/partner/settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-[#1a1a2e] text-white overflow-y-auto z-40 hidden lg:block">
      <div className="p-6">
        <Link href="/partner" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E51913] flex items-center justify-center font-bold text-lg">
            EF
          </div>
          <div>
            <span className="font-bold text-lg">Exousia</span>
            <span className="block text-xs text-white/50">Partner Portal</span>
          </div>
        </Link>
      </div>

      <nav className="px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-[#E51913] text-white shadow-lg shadow-[#E51913]/25'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-white/10">
          <Link
            href="/api/auth/logout"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Link>
        </div>
      </nav>
    </aside>
  );
}