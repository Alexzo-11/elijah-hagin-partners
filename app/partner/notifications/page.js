'use client';

import { useState } from 'react';
import { Bell, CheckCircle, X, AlertCircle, Info, CheckCheck, Trash2 } from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'payment', title: 'Payment Received', message: 'Your monthly partnership payment of $250 has been received. Thank you for your faithfulness!', date: '2024-12-20 14:30', read: false },
    { id: 2, type: 'info', title: 'Ministry Update', message: 'New prayer request posted for the upcoming mission trip to Nigeria. Please join us in prayer.', date: '2024-12-19 10:15', read: false },
    { id: 3, type: 'success', title: 'Receipt Generated', message: 'Your receipt for payment #PAY-2024-002 is ready. You can download it from your history.', date: '2024-12-18 09:00', read: true },
    { id: 4, type: 'alert', title: 'Upcoming Payment Reminder', message: 'Your monthly partnership payment is due in 3 days. Please make your payment on time.', date: '2024-12-17 08:00', read: true },
    { id: 5, type: 'info', title: 'New Ministry Update', message: 'Read the latest ministry update from Pastor Elijah Hagin about the building project.', date: '2024-12-16 16:45', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'payment': return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'alert': return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'info': return <Info className="w-5 h-5 text-blue-600" />;
      default: return <Bell className="w-5 h-5 text-[#4A4C4E]/40" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'payment': return 'bg-emerald-50';
      case 'success': return 'bg-emerald-50';
      case 'alert': return 'bg-amber-50';
      case 'info': return 'bg-blue-50';
      default: return 'bg-[#F5F6F7]';
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#4A4C4E]">Notifications</h1>
          <p className="text-[#4A4C4E]/60 mt-1">Stay updated with your partnership</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <span className="badge-premium bg-[#E51913] text-white">
              {unreadCount} unread
            </span>
          )}
          <button
            onClick={markAllAsRead}
            className="btn-outline text-sm py-2 px-4 flex items-center gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All Read
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="card-premium p-12 text-center">
          <Bell className="w-12 h-12 text-[#4A4C4E]/20 mx-auto mb-4" />
          <p className="text-[#4A4C4E]/60">No notifications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`card-premium p-5 transition-all hover:border-[#E51913]/30 ${
                !notification.read ? 'border-l-4 border-l-[#E51913]' : 'opacity-70'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-xl ${getBgColor(notification.type)}`}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="font-semibold text-[#4A4C4E]">{notification.title}</h3>
                    <span className="text-xs text-[#4A4C4E]/40 whitespace-nowrap">{notification.date}</span>
                  </div>
                  <p className="text-sm text-[#4A4C4E]/60 mt-1">{notification.message}</p>
                </div>
                <div className="flex items-center gap-1">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-1.5 hover:bg-[#F5F6F7] rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <CheckCircle className="w-4 h-4 text-[#4A4C4E]/30" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-1.5 hover:bg-[#F5F6F7] rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-[#4A4C4E]/30 hover:text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}