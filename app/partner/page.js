'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/components/providers/AuthProvider';
import {
  CreditCard,
  TrendingUp,
  Calendar,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Download,
  Eye,
  History,
  Wallet,
  DollarSign,
  Loader2
} from 'lucide-react';

export default function PartnerDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalContributions: 0,
    monthlyCommitment: 0,
    lastPayment: 0,
    payments: 0,
    growth: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    fetchPartnerData();
  }, []);

  const fetchPartnerData = async () => {
    try {
      const res = await fetch('/api/partner/dashboard');
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRecentTransactions(data.recentPayments || []);
      }
    } catch (error) {
      console.error('Error fetching partner data:', error);
    } finally {
      setLoading(false);
    }
  };

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
            <div className="skeleton h-8 w-48 rounded"></div>
            <div className="skeleton h-4 w-32 rounded"></div>
          </div>
          <div className="skeleton h-11 w-32 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-xl"></div>
          ))}
        </div>
        <div className="skeleton h-64 rounded-xl"></div>
      </div>
    );
  }

  const statCards = [
    { 
      title: 'Total Contributions', 
      value: `₦${stats.totalContributions.toLocaleString()}`, 
      icon: Wallet, 
      change: `+${stats.growth}%`,
      changeType: 'positive', 
      color: 'text-[var(--primary)]',
      bg: 'bg-[var(--primary-light)]'
    },
    { 
      title: 'Monthly Commitment', 
      value: `₦${stats.monthlyCommitment.toLocaleString()}`, 
      icon: Calendar, 
      change: 'Monthly',
      changeType: 'neutral', 
      color: 'text-[var(--secondary)]',
      bg: 'bg-[var(--secondary-light)]'
    },
    { 
      title: 'Last Payment', 
      value: stats.lastPayment > 0 ? `₦${stats.lastPayment.toLocaleString()}` : 'No payments', 
      icon: CreditCard, 
      change: stats.lastPaymentDate ? new Date(stats.lastPaymentDate).toLocaleDateString() : 'No payments',
      changeType: 'neutral', 
      color: 'text-[var(--grey)]',
      bg: 'bg-[var(--grey-light)]'
    },
    { 
      title: 'Total Payments', 
      value: stats.payments, 
      icon: DollarSign, 
      change: 'Active',
      changeType: 'positive', 
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#4A4C4E]">
            Welcome back, {user?.firstName || 'Partner'} 👋
          </h1>
          <p className="text-[#4A4C4E]/60 mt-1">Here's what's happening with your partnership</p>
        </div>
        <Link href="/partner/payments" className="btn-primary text-sm py-2.5 px-5 shadow-lg shadow-[#E51913]/25 flex items-center gap-2 whitespace-nowrap">
          <Plus className="w-4 h-4" />
          Make a Payment
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const isPrimary = index % 2 === 0;
          return (
            <div key={index} className={`card-premium p-6 animate-fade-up ${isPrimary ? 'card-primary' : 'card-secondary'}`} style={{ animationDelay: `${index * 100}ms` }}>
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
            <h2 className="text-lg font-semibold text-[#4A4C4E]">Recent Transactions</h2>
            <p className="text-sm text-[#4A4C4E]/60">Your latest partnership payments</p>
          </div>
          <Link href="/partner/history" className="text-sm text-[#4A4C4E] font-medium hover:text-[#E51913] transition flex items-center gap-1">
            View All
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-[#4A4C4E]/40 uppercase tracking-wider">
                <th className="pb-3 font-medium">Reference</th>
                <th className="pb-3 font-medium">Purpose</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E6E7]">
              {recentTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-[#4A4C4E]/40">
                    No transactions yet
                  </td>
                </tr>
              ) : (
                recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#F5F6F7] transition-colors">
                    <td className="py-3 text-sm font-mono text-[#4A4C4E]/80">{tx.reference}</td>
                    <td className="py-3 text-sm text-[#4A4C4E]/80">{tx.purpose}</td>
                    <td className="py-3 text-sm font-semibold text-[#4A4C4E]">₦{tx.amount.toLocaleString()}</td>
                    <td className="py-3 text-sm text-[#4A4C4E]/60">{tx.date}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(tx.status)}`}>
                        {getStatusIcon(tx.status)}
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/partner/payments" className="card-premium p-6 hover:border-[#E51913]/30 transition-all flex items-center gap-4 group card-primary">
          <div className="p-3 rounded-xl bg-[#E51913]/10 group-hover:bg-[#E51913]/20 transition-colors">
            <CreditCard className="w-6 h-6 text-[#E51913]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#4A4C4E]">Make Payment</h3>
            <p className="text-sm text-[#4A4C4E]/60">Support the ministry today</p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-[#E51913]/30 ml-auto group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link href="/partner/history" className="card-premium p-6 hover:border-[#3BBCEB]/30 transition-all flex items-center gap-4 group card-secondary">
          <div className="p-3 rounded-xl bg-[#3BBCEB]/10 group-hover:bg-[#3BBCEB]/20 transition-colors">
            <History className="w-6 h-6 text-[#3BBCEB]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#4A4C4E]">View History</h3>
            <p className="text-sm text-[#4A4C4E]/60">See all your payments</p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-[#3BBCEB]/30 ml-auto group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}