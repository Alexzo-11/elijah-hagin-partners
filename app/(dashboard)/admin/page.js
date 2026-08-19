'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/components/providers/AuthProvider';
import {
  Users,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  Search,
  Filter,
  Calendar,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  Building,
  Activity,
  PieChart,
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPartners: 0,
    activePartners: 0,
    newPartners: 0,
    totalRevenue: 0,
    averageDonation: 0,
    monthlyGrowth: 0,
    pendingPayments: 0,
  });
  const [recentPayments, setRecentPayments] = useState([]);
  const [recentPartners, setRecentPartners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/admin/dashboard');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRecentPayments(data.recentPayments || []);
        setRecentPartners(data.recentPartners || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'active':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'failed':
      case 'inactive':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'suspended':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'success':
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
      case 'inactive':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status) => {
    if (!status) return 'N/A';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Filter payments
  const filteredPayments = recentPayments.filter(payment => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = 
      payment.partner?.toLowerCase().includes(search) ||
      payment.email?.toLowerCase().includes(search) ||
      payment.reference?.toLowerCase().includes(search);
    
    const matchesStatus = filterStatus === 'all' || payment.status?.toLowerCase() === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="skeleton h-8 w-48 rounded"></div>
            <div className="skeleton h-4 w-32 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-24 sm:h-32 rounded-xl"></div>
          ))}
        </div>
        <div className="skeleton h-64 sm:h-96 rounded-xl"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Partners',
      value: stats.totalPartners?.toLocaleString() || '0',
      icon: Users,
      change: `+${stats.newPartners || 0} this month`,
      changeType: 'positive',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Active Partners',
      value: stats.activePartners?.toLocaleString() || '0',
      icon: Users,
      change: `${stats.totalPartners > 0 ? ((stats.activePartners / stats.totalPartners) * 100).toFixed(0) : 0}% active`,
      changeType: 'positive',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      title: 'Total Revenue',
      value: `₦${stats.totalRevenue?.toLocaleString() || '0'}`,
      icon: DollarSign,
      change: `${stats.monthlyGrowth || 0}% growth`,
      changeType: stats.monthlyGrowth >= 0 ? 'positive' : 'negative',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      title: 'Avg Donation',
      value: `₦${stats.averageDonation?.toLocaleString() || '0'}`,
      icon: CreditCard,
      change: `${stats.pendingPayments || 0} pending`,
      changeType: 'neutral',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#4A4C4E]">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-[#4A4C4E]/60">
            Welcome back, {user?.firstName || user?.name || 'Admin'}!
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={fetchDashboardData}
            className="text-xs sm:text-sm py-1.5 sm:py-2.5 px-3 sm:px-5 rounded-xl bg-[#F5F6F7] hover:bg-[#E5E6E7] transition flex items-center gap-2 text-[#4A4C4E]"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
          <Link
            href="/admin/reports"
            className="btn-primary text-xs sm:text-sm py-1.5 sm:py-2.5 px-3 sm:px-5"
          >
            <Download className="w-4 h-4" />
            Export Report
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card-premium p-3 sm:p-6 animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-sm font-medium text-[#4A4C4E]/60 truncate">{stat.title}</p>
                  <p className="text-base sm:text-2xl font-bold text-[#4A4C4E] mt-0.5 sm:mt-2 truncate">{stat.value}</p>
                </div>
                <div className={`p-1.5 sm:p-3 rounded-xl ${stat.bg} ${stat.color} flex-shrink-0 ml-2`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>
              <div className="mt-1 sm:mt-4 flex items-center gap-1 text-[10px] sm:text-sm">
                {stat.changeType === 'positive' && <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />}
                {stat.changeType === 'negative' && <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />}
                <span className={stat.changeType === 'positive' ? 'text-emerald-600' : stat.changeType === 'negative' ? 'text-red-600' : 'text-[#4A4C4E]/60'}>
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Transactions - Enhanced Table */}
      <div className="card-premium p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-[#4A4C4E] flex items-center gap-2">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-[#4A4C4E]/40" />
              Recent Transactions
            </h2>
            <p className="text-xs sm:text-sm text-[#4A4C4E]/60">Latest partnership payments</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4C4E]/30" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-xl border border-[#E5E6E7] bg-white focus:outline-none focus:ring-2 focus:ring-[#E51913]/20 focus:border-[#E51913] transition w-full sm:w-40"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Filter */}
            <select
              className="px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-xl border border-[#E5E6E7] bg-white focus:outline-none focus:ring-2 focus:ring-[#E51913]/20 focus:border-[#E51913] transition"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            <Link
              href="/admin/payments"
              className="text-xs sm:text-sm text-[#E51913] font-medium hover:underline transition whitespace-nowrap flex items-center gap-1"
            >
              View All
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[600px] sm:min-w-0">
            <thead>
              <tr className="text-left text-[10px] sm:text-xs font-medium text-[#4A4C4E]/40 uppercase tracking-wider border-b border-[#E5E6E7]">
                <th className="pb-2 sm:pb-3 pr-2 sm:pr-4 font-medium">Partner</th>
                <th className="pb-2 sm:pb-3 px-2 sm:px-4 font-medium hidden sm:table-cell">Reference</th>
                <th className="pb-2 sm:pb-3 px-2 sm:px-4 font-medium">Amount</th>
                <th className="pb-2 sm:pb-3 px-2 sm:px-4 font-medium hidden md:table-cell">Method</th>
                <th className="pb-2 sm:pb-3 px-2 sm:px-4 font-medium hidden lg:table-cell">Date</th>
                <th className="pb-2 sm:pb-3 pl-2 sm:pl-4 font-medium">Status</th>
                <th className="pb-2 sm:pb-3 pl-2 sm:pl-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E6E7]">
              {paginatedPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-4 sm:py-8 text-center text-[#4A4C4E]/40 text-sm">
                    No transactions found
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-[#F5F6F7] transition-colors">
                    <td className="py-2 sm:py-3 pr-2 sm:pr-4">
                      <div className="min-w-0 max-w-[120px] sm:max-w-[200px]">
                        <p className="text-xs sm:text-sm font-medium text-[#4A4C4E] truncate">
                          {payment.partner || 'Unknown Partner'}
                        </p>
                        <p className="text-[10px] sm:text-xs text-[#4A4C4E]/40 truncate">
                          {payment.email || 'No email'}
                        </p>
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-[10px] sm:text-sm font-mono text-[#4A4C4E]/60 hidden sm:table-cell truncate max-w-[100px] md:max-w-none">
                      {payment.reference || 'N/A'}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-[#4A4C4E] whitespace-nowrap">
                      ₦{payment.amount?.toLocaleString() || '0'}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-[#4A4C4E]/60 hidden md:table-cell">
                      {payment.method || 'N/A'}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-[#4A4C4E]/60 hidden lg:table-cell whitespace-nowrap">
                      {payment.date ? new Date(payment.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      }) : 'N/A'}
                    </td>
                    <td className="py-2 sm:py-3 pl-2 sm:pl-4">
                      <span className={`inline-flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border ${getStatusColor(payment.status)} whitespace-nowrap`}>
                        {getStatusIcon(payment.status)}
                        {getStatusLabel(payment.status)}
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 pl-2 sm:pl-4 text-right">
                      <Link
                        href={`/admin/payments/${payment.id}`}
                        className="text-[#4A4C4E]/40 hover:text-[#E51913] transition p-1 inline-block"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredPayments.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-[#E5E6E7]">
            <p className="text-xs text-[#4A4C4E]/60">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of {filteredPayments.length} transactions
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg hover:bg-[#F5F6F7] transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 text-[#4A4C4E]/60" />
              </button>
              {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition ${
                      currentPage === pageNum
                        ? 'bg-[#E51913] text-white'
                        : 'text-[#4A4C4E]/60 hover:bg-[#F5F6F7]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && <span className="text-[#4A4C4E]/40 text-xs">...</span>}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg hover:bg-[#F5F6F7] transition disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4 text-[#4A4C4E]/60" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recent Partners Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Partners */}
        <div className="card-premium p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-[#4A4C4E] flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#4A4C4E]/40" />
                Recent Partners
              </h2>
              <p className="text-xs sm:text-sm text-[#4A4C4E]/60">Newest registered partners</p>
            </div>
            <Link href="/admin/partners" className="text-xs sm:text-sm text-[#E51913] font-medium hover:underline transition">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentPartners.length === 0 ? (
              <p className="text-center text-[#4A4C4E]/40 text-sm py-4">No partners registered yet</p>
            ) : (
              recentPartners.slice(0, 5).map((partner) => (
                <Link
                  key={partner.id}
                  href={`/admin/partners/${partner.id}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F5F6F7] transition group"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E51913]/10 to-[#3BBCEB]/10 flex items-center justify-center text-[#4A4C4E] font-bold text-sm flex-shrink-0">
                    {partner.firstName?.[0]}{partner.surname?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#4A4C4E] truncate">
                      {partner.firstName} {partner.surname}
                    </p>
                    <p className="text-xs text-[#4A4C4E]/40 truncate">{partner.email}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(partner.status)}`}>
                      {getStatusLabel(partner.status)}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-[#4A4C4E]/30 group-hover:text-[#E51913] transition" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Quick Stats / Activity */}
        <div className="card-premium p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-[#4A4C4E] flex items-center gap-2">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-[#4A4C4E]/40" />
                Quick Stats
              </h2>
              <p className="text-xs sm:text-sm text-[#4A4C4E]/60">At a glance overview</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F5F6F7] rounded-xl p-4 text-center">
              <Building className="w-6 h-6 text-[#E51913] mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#4A4C4E]">{stats.totalPartners || 0}</p>
              <p className="text-xs text-[#4A4C4E]/60">Total Partners</p>
            </div>
            <div className="bg-[#F5F6F7] rounded-xl p-4 text-center">
              <DollarSign className="w-6 h-6 text-[#3BBCEB] mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#4A4C4E]">₦{stats.totalRevenue?.toLocaleString() || '0'}</p>
              <p className="text-xs text-[#4A4C4E]/60">Total Revenue</p>
            </div>
            <div className="bg-[#F5F6F7] rounded-xl p-4 text-center">
              <CreditCard className="w-6 h-6 text-[#E51913] mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#4A4C4E]">{stats.pendingPayments || 0}</p>
              <p className="text-xs text-[#4A4C4E]/60">Pending</p>
            </div>
            <div className="bg-[#F5F6F7] rounded-xl p-4 text-center">
              <TrendingUp className="w-6 h-6 text-[#3BBCEB] mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#4A4C4E]">{stats.monthlyGrowth || 0}%</p>
              <p className="text-xs text-[#4A4C4E]/60">Growth</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}