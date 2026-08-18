'use client';

import { useState } from 'react';
import {
  Bell,
  Send,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Filter,
  Search,
  Trash2,
  Eye,
  AlertCircle,
  Info,
  Megaphone
} from 'lucide-react';

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('send');

  const notifications = [
    { id: 1, title: 'Monthly Partnership Update', audience: 'All Partners', sent: '2024-12-20', type: 'info', read: 184 },
    { id: 2, title: 'Urgent Prayer Request', audience: 'Active Partners', sent: '2024-12-18', type: 'alert', read: 156 },
    { id: 3, title: 'New Building Fund Campaign', audience: 'All Partners', sent: '2024-12-15', type: 'success', read: 203 },
    { id: 4, title: 'End of Year Giving Report', audience: 'All Partners', sent: '2024-12-12', type: 'info', read: 167 },
  ];

  const notificationTypes = [
    { value: 'all', label: 'All Partners (2,400)' },
    { value: 'active', label: 'Active Partners (2,100)' },
    { value: 'inactive', label: 'Inactive Partners (300)' },
    { value: 'building', label: 'Building Fund Supporters' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0f172a]">Notifications</h1>
          <p className="text-[#1a1a2e]/60 mt-1">Send and manage partner notifications</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-outline text-sm py-2.5 px-5 flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Manage
          </button>
          <button className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Notification
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-premium p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-[#1a1a2e]/40">Total Sent</p>
              <p className="text-xl font-bold text-[#0f172a]">156</p>
            </div>
          </div>
        </div>
        <div className="card-premium p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-[#1a1a2e]/40">Delivered</p>
              <p className="text-xl font-bold text-[#0f172a]">152</p>
            </div>
          </div>
        </div>
        <div className="card-premium p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-[#1a1a2e]/40">Read Rate</p>
              <p className="text-xl font-bold text-[#0f172a]">78%</p>
            </div>
          </div>
        </div>
        <div className="card-premium p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-[#1a1a2e]/40">Active Subscribers</p>
              <p className="text-xl font-bold text-[#0f172a]">2,100</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#e2e8f0]">
        <nav className="flex gap-6">
          {['send', 'history', 'templates'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? 'border-[#1a1a2e] text-[#1a1a2e]'
                  : 'border-transparent text-[#1a1a2e]/60 hover:text-[#1a1a2e]'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Send Tab */}
      {activeTab === 'send' && (
        <div className="card-premium p-6">
          <h3 className="text-lg font-semibold text-[#0f172a] mb-4">Send Notification</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-1.5">Audience</label>
              <select className="input-premium">
                {notificationTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-1.5">Type</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="type" value="info" defaultChecked className="text-[#1a1a2e]" />
                  <span className="text-sm text-[#0f172a]">Info</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="type" value="alert" className="text-amber-600" />
                  <span className="text-sm text-[#0f172a]">Alert</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="type" value="success" className="text-emerald-600" />
                  <span className="text-sm text-[#0f172a]">Success</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-1.5">Title</label>
              <input type="text" className="input-premium" placeholder="Notification title" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#0f172a] mb-1.5">Message</label>
              <textarea className="input-premium" rows="4" placeholder="Write your notification message..." />
            </div>
            <div className="flex items-center gap-3">
              <button className="btn-primary text-sm py-2.5 px-6 flex items-center gap-2">
                <Send className="w-4 h-4" />
                Send Now
              </button>
              <button className="btn-outline text-sm py-2.5 px-6">
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#0f172a]">Notification History</h3>
              <p className="text-sm text-[#1a1a2e]/60">Previously sent notifications</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a1a2e]/30" />
                <input
                  type="text"
                  className="input-premium pl-9 py-2 text-sm w-48"
                  placeholder="Search..."
                />
              </div>
              <button className="p-2 hover:bg-[#f8fafc] rounded-lg">
                <Filter className="w-4 h-4 text-[#1a1a2e]/40" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon = notification.type === 'alert' ? AlertCircle : 
                           notification.type === 'success' ? CheckCircle : Info;
              const color = notification.type === 'alert' ? 'text-amber-600 bg-amber-50' :
                           notification.type === 'success' ? 'text-emerald-600 bg-emerald-50' :
                           'text-blue-600 bg-blue-50';
              
              return (
                <div key={notification.id} className="flex items-center justify-between p-4 border border-[#e2e8f0] rounded-xl hover:border-[#1a1a2e]/30 transition-all">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-2.5 rounded-xl ${color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-[#0f172a]">{notification.title}</p>
                      <div className="flex items-center gap-3 text-sm text-[#1a1a2e]/60">
                        <span>To: {notification.audience}</span>
                        <span>•</span>
                        <span>{notification.sent}</span>
                        <span>•</span>
                        <span>{notification.read} read</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-[#f8fafc] rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-[#1a1a2e]/40" />
                    </button>
                    <button className="p-2 hover:bg-[#f8fafc] rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-[#1a1a2e]/40" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}