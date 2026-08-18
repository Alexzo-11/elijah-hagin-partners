'use client';

import { useState, useEffect } from 'react';
import {
  Activity,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  CreditCard,
  Mail,
  Settings,
  Users,
  FileText,
  LogIn,
  LogOut,
  Eye,
  Download,
  Calendar,
  Clock,
  Loader2,
  Shield,
  MessageSquare
} from 'lucide-react';

export default function ActivityLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/activity-logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      auth: <LogIn className="w-4 h-4" />,
      partner: <Users className="w-4 h-4" />,
      payment: <CreditCard className="w-4 h-4" />,
      email: <Mail className="w-4 h-4" />,
      message: <MessageSquare className="w-4 h-4" />,
      settings: <Settings className="w-4 h-4" />,
      report: <FileText className="w-4 h-4" />,
      login: <LogIn className="w-4 h-4" />,
      logout: <LogOut className="w-4 h-4" />,
    };
    return icons[type] || <Activity className="w-4 h-4" />;
  };

  const getActivityColor = (type) => {
    const colors = {
      auth: 'bg-blue-50 text-blue-600',
      partner: 'bg-emerald-50 text-emerald-600',
      payment: 'bg-purple-50 text-purple-600',
      email: 'bg-amber-50 text-amber-600',
      message: 'bg-indigo-50 text-indigo-600',
      settings: 'bg-gray-50 text-gray-600',
      report: 'bg-rose-50 text-rose-600',
      login: 'bg-emerald-50 text-emerald-600',
      logout: 'bg-red-50 text-red-600',
    };
    return colors[type] || 'bg-[#F5F6F7] text-[#4A4C4E]/40';
  };

  const filteredLogs = logs.filter(log =>
    log.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLogs = filteredLogs.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-64 rounded"></div>
        <div className="skeleton h-12 w-full rounded"></div>
        <div className="skeleton h-96 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#4A4C4E]">Activity Logs</h1>
          <p className="text-[#4A4C4E]/60 mt-1">Track all admin activities</p>
        </div>
        <button className="btn-outline text-sm py-2.5 px-5 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A4C4E]/30" />
        <input
          type="text"
          className="input-premium pl-10"
          placeholder="Search activities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F6F7]">
              <tr className="text-left text-xs font-medium text-[#4A4C4E]/40 uppercase tracking-wider">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E6E7]">
              {currentLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[#4A4C4E]/40">
                    No activities found
                  </td>
                </tr>
              ) : (
                currentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F5F6F7] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E51913]/10 to-[#3BBCEB]/10 flex items-center justify-center text-[#E51913] font-semibold text-xs">
                          {log.user?.split(' ').map(n => n[0]).join('') || 'S'}
                        </div>
                        <span className="text-sm font-medium text-[#4A4C4E]">{log.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#4A4C4E]/80">{log.action}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getActivityColor(log.type)}`}>
                        {getActivityIcon(log.type)}
                        {log.type?.charAt(0).toUpperCase() + log.type?.slice(1) || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-[#4A4C4E]/60">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-1.5 hover:bg-[#F5F6F7] rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-[#4A4C4E]/40 hover:text-[#E51913]" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-[#E5E6E7] flex items-center justify-between">
            <p className="text-sm text-[#4A4C4E]/60">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredLogs.length)} of {filteredLogs.length} activities
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-[#F5F6F7] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5 text-[#4A4C4E]/60" />
              </button>
              <span className="text-sm font-medium text-[#4A4C4E]">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-[#F5F6F7] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5 text-[#4A4C4E]/60" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}