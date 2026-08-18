'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export function NotificationBell({ notifications = [], onMarkRead, onMarkAllRead }) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'payment':
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'alert': return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'info': return <Info className="w-4 h-4 text-blue-600" />;
      default: return <Bell className="w-4 h-4 text-[#1a1a2e]/40" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'payment':
      case 'success': return 'bg-emerald-50';
      case 'alert': return 'bg-amber-50';
      case 'info': return 'bg-blue-50';
      default: return 'bg-[#f8fafc]';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-white/50 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5 text-[#1a1a2e]/60" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-[#e2e8f0] z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-[#e2e8f0]">
                <h3 className="font-semibold text-[#0f172a]">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllRead}
                    className="text-xs text-[#1a1a2e]/60 hover:text-[#1a1a2e] transition"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-[#1a1a2e]/40">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No notifications</p>
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-3 p-3 hover:bg-[#f8fafc] transition-colors ${
                        !notification.read ? 'bg-[#f8fafc]' : ''
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${getBgColor(notification.type)}`}>
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#0f172a]">{notification.title}</p>
                        <p className="text-xs text-[#1a1a2e]/60 mt-0.5">{notification.message}</p>
                        <p className="text-xs text-[#1a1a2e]/40 mt-1">{notification.date}</p>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => onMarkRead?.(notification.id)}
                          className="p-1 hover:bg-white rounded-lg transition-colors"
                        >
                          <X className="w-3 h-3 text-[#1a1a2e]/30" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>

              <Link
                href="/partner/notifications"
                className="block p-3 text-center text-sm font-medium text-[#1a1a2e] hover:bg-[#f8fafc] border-t border-[#e2e8f0] transition-colors"
                onClick={() => setIsOpen(false)}
              >
                View all notifications
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}