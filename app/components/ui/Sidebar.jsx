'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  CreditCard, 
  History, 
  FileText, 
  Bell, 
  Settings, 
  LogOut,
  Users,
  FileBarChart,
  Mail,
  Activity,
  Menu,
  X,
  ChevronRight,
  Home
} from 'lucide-react';

export function Sidebar({ items, user, onLogout, type = 'partner' }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isAdmin = type === 'admin';

  const defaultItems = type === 'partner' ? [
    { href: '/partner', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/partner/payments', label: 'Make Payment', icon: CreditCard },
    { href: '/partner/history', label: 'Payment History', icon: History },
    { href: '/partner/notifications', label: 'Notifications', icon: Bell },
    { href: '/partner/settings', label: 'Settings', icon: Settings },
  ] : [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/partners', label: 'Partners', icon: Users },
    { href: '/admin/payments', label: 'Payments', icon: CreditCard },
    { href: '/admin/reports', label: 'Reports', icon: FileBarChart },
    { href: '/admin/emails', label: 'Emails', icon: Mail },
    { href: '/admin/notifications', label: 'Notifications', icon: Bell },
    { href: '/admin/activity-logs', label: 'Activity Logs', icon: Activity },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const navItems = items || defaultItems;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -288 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed top-0 left-0 h-full w-72 bg-white border-r border-[#E5E6E7] z-50 lg:translate-x-0"
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-[#E5E6E7]">
            <div className="flex items-center justify-between">
              <Link href={type === 'partner' ? '/partner' : '/admin'} className="flex-shrink-0">
                <div className="relative w-10 h-10">
                  <Image
                    src="/images/logopng.png"
                    alt="Exousia Fellowship"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>
              <button
                className="lg:hidden p-2 hover:bg-[#F5F6F7] rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-5 h-5 text-[#4A4C4E]/50" />
              </button>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              const Icon = item.icon;
              const isAdminActive = isAdmin && isActive;
              const isPartnerActive = !isAdmin && isActive;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${isActive 
                      ? isAdmin 
                        ? 'bg-[#E51913] text-white shadow-lg shadow-[#E51913]/25' 
                        : 'bg-[#3BBCEB] text-white shadow-lg shadow-[#3BBCEB]/25'
                      : 'text-[#4A4C4E]/60 hover:bg-[#F5F6F7] hover:text-[#E51913]'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-[#E5E6E7]">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl ${isAdmin ? 'bg-[#FFE8E7]' : 'bg-[#E8F7FE]'} mb-3`}>
              <div className={`w-9 h-9 rounded-full ${isAdmin ? 'bg-[#E51913]/10' : 'bg-[#3BBCEB]/10'} flex items-center justify-center ${isAdmin ? 'text-[#E51913]' : 'text-[#3BBCEB]'} font-semibold text-sm`}>
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#4A4C4E] truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-[#4A4C4E]/40 truncate">{user?.email}</p>
                {isAdmin && (
                  <span className={`text-xs font-medium ${isAdmin ? 'text-[#E51913] bg-[#E51913]/10' : 'text-[#3BBCEB] bg-[#3BBCEB]/10'} px-2 py-0.5 rounded-full inline-block mt-0.5`}>
                    Admin
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </div>
      </motion.aside>

      <button
        className={`lg:hidden fixed bottom-6 right-6 z-30 p-3 rounded-full ${isAdmin ? 'bg-[#E51913]' : 'bg-[#3BBCEB]'} text-white shadow-xl ${isAdmin ? 'shadow-[#E51913]/30' : 'shadow-[#3BBCEB]/30'}`}
        onClick={() => setIsOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </button>
    </>
  );
}