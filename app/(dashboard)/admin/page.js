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
  Wallet,
  Calendar,
  BarChart3,
  Mail
} from 'lucide-react';
import { ExcelExport } from '@/app/components/ExcelExport';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPartners: 0,
    activePartners: 0,
    newPartners: 0,
    totalRevenue: 0,
    averageDonation: 0,
  });
  const [recentPayments, setRecentPayments] = useState([]);

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
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const paymentHeaders = [
    { key: 'partner', label: 'Partner' },
    { key: 'reference', label: 'Reference' },
    { key: 'amount', label: 'Amount', isCurrency: true },
    { key: 'method', label: 'Payment Method' },
    { key: 'date', label: 'Date', isDate: true },
    { key: 'status', label: 'Status' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'failed': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="skeleton h-8 w-64 rounded"></div>
            <div className="skeleton h-4 w-40 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-xl"></div>
          ))}
        </div>
        <div className="skeleton h-96 rounded-xl"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Partners',
      value: stats.totalPartners.toLocaleString(),
      icon: Users,
      change: `+${stats.newPartners} this month`,
      changeType: 'positive',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Active Partners',
      value: stats.activePartners.toLocaleString(),
      icon: Users,
      change: `${stats.activePartners > 0 ? ((stats.activePartners / stats.totalPartners) * 100).toFixed(0) : 0}% active`,
      changeType: 'positive',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      title: 'Total Revenue',
      value: `₦${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: `Total amount received`,
      changeType: 'neutral',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      title: 'Average Donation',
      value: `₦${stats.averageDonation.toLocaleString()}`,
      icon: CreditCard,
      change: 'Per transaction',
      changeType: 'neutral',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#4A4C4E]">Admin Dashboard</h1>
          <p className="text-[#4A4C4E]/60 mt-1">Welcome back, {user?.firstName || 'Admin'}!</p>
        </div>
        <div className="flex items-center gap-3">
          <ExcelExport
            data={recentPayments}
            filename={`transactions-${new Date().toISOString().split('T')[0]}`}
            headers={paymentHeaders}
            sheetName="Transactions"
            buttonText="Export Transactions"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card-premium p-6 animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[#4A4C4E]/60">{stat.title}</p>
                  <p className="text-2xl font-bold text-[#4A4C4E] mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-sm">
                {stat.changeType === 'positive' && <ArrowUpRight className="w-4 h-4 text-emerald-600" />}
                {stat.changeType === 'negative' && <ArrowDownRight className="w-4 h-4 text-red-600" />}
                <span className={stat.changeType === 'positive' ? 'text-emerald-600' : stat.changeType === 'negative' ? 'text-red-600' : 'text-[#4A4C4E]/60'}>
                  {stat.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card-premium p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-[#4A4C4E] flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#4A4C4E]/40" />
              Recent Transactions
            </h2>
            <p className="text-sm text-[#4A4C4E]/60">Latest partnership payments</p>
          </div>
          <Link href="/admin/payments" className="text-sm text-[#4A4C4E] font-medium hover:text-[#E51913] transition flex items-center gap-1">
            View All
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-[#4A4C4E]/40 uppercase tracking-wider border-b border-[#E5E6E7]">
                <th className="pb-3 font-medium">Partner</th>
                <th className="pb-3 font-medium">Reference</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E6E7]">
              {recentPayments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-[#4A4C4E]/40">
                    No payments yet
                  </td>
                </tr>
              ) : (
                recentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-[#F5F6F7] transition-colors">
                    <td className="py-3">
                      <div>
                        <p className="text-sm font-medium text-[#4A4C4E]">{payment.partner}</p>
                        <p className="text-xs text-[#4A4C4E]/40">{payment.email}</p>
                      </div>
                    </td>
                    <td className="py-3 text-sm font-mono text-[#4A4C4E]/60">{payment.reference}</td>
                    <td className="py-3 text-sm font-semibold text-[#4A4C4E]">₦{payment.amount.toLocaleString()}</td>
                    <td className="py-3 text-sm text-[#4A4C4E]/60">{payment.date}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}