'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FileText,
  Mail,
  Bell,
  Settings,
  LogOut,
  Activity,
  BarChart3,
} from 'lucide-react';

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      label: 'Partners',
      href: '/admin/partners',
      icon: Users,
    },
    {
      label: 'Payments',
      href: '/admin/payments',
      icon: CreditCard,
    },
    {
      label: 'Reports',
      href: '/admin/reports',
      icon: FileText,
    },
    {
      label: 'Emails',
      href: '/admin/emails',
      icon: Mail,
    },
    {
      label: 'Notifications',
      href: '/admin/notifications',
      icon: Bell,
    },
    {
      label: 'Activity Logs',
      href: '/admin/activity-logs',
      icon: Activity,
    },
    {
      label: 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[280px] bg-[#1a1a2e] text-white overflow-y-auto z-40 hidden lg:block">
      <div className="p-6">
        <Link href="/admin" className="flex items-center gap-3">
          {/* <div className="w-10 h-10 rounded-xl bg-[#E51913] flex items-center justify-center font-bold text-lg">
            EF
          </div>
          <div>
            <span className="font-bold text-lg">Exousia</span>
            <span className="block text-xs text-white/50">Admin Portal</span>
          </div> */}
          <div className="relative w-10 h-10">
                            <Image
                              src="/images/logopng.png"
                              alt="Exousia Fellowship"
                              fill
                              className="object-contain"
                              priority
                            />
                          </div>
                       <span className="block text-xs text-white/50">Admin Portal</span>   
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