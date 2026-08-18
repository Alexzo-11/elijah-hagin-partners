const fs = require('fs');
const path = require('path');

const root = process.cwd();

// Helper function to write files
function writeFile(filePath, content) {
  const fullPath = path.join(root, filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content);
  console.log(`✅ Created: ${filePath}`);
}

// Partner Layout
writeFile('app/partner/layout.js', `'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/providers/AuthProvider';
import {
  LayoutDashboard,
  CreditCard,
  History,
  FileText,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Loader2
} from 'lucide-react';

const navItems = [
  { href: '/partner', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/partner/payments', label: 'Make Payment', icon: CreditCard },
  { href: '/partner/history', label: 'Payment History', icon: History },
  { href: '/partner/receipts', label: 'Receipts', icon: FileText },
  { href: '/partner/notifications', label: 'Notifications', icon: Bell },
  { href: '/partner/settings', label: 'Settings', icon: Settings },
];

export default function PartnerLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      setLoading(false);
    }
  }, [user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF8F0]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#C9A84C] animate-spin mx-auto mb-4" />
          <p className="text-[#1B2A4A]/60">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF8F0]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside className={\`fixed top-0 left-0 h-full w-72 bg-white border-r border-[#E8D5A3] z-50 transform transition-transform duration-300 \${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}\`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-[#E8D5A3]">
            <div className="flex items-center justify-between">
              <Link href="/partner" className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#C9A84C] flex items-center justify-center text-[#1A1A1A] font-extrabold text-sm">EX</div>
                <span className="font-bold text-sm text-[#1B2A4A]">Partner Portal</span>
              </Link>
              <button className="lg:hidden p-2 hover:bg-[#FDF8F0] rounded-lg" onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5 text-[#1B2A4A]/50" />
              </button>
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={\`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 \${isActive ? 'bg-[#C9A84C] text-[#1A1A1A] shadow-lg shadow-[#C9A84C]/25' : 'text-[#1B2A4A]/60 hover:bg-[#FDF8F0] hover:text-[#C9A84C]'}\`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-[#E8D5A3]">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#FDF8F0] mb-3">
              <div className="w-9 h-9 rounded-full bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C] font-semibold text-sm">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#1B2A4A] truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-[#1B2A4A]/40 truncate">{user?.email}</p>
              </div>
            </div>
            <button onClick={logout} className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition-colors duration-200">
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>
      <div className="lg:pl-72">
        <header className="glass border-b border-[#C9A84C]/10 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button className="lg:hidden p-2 hover:bg-[#FDF8F0] rounded-lg" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-5 h-5 text-[#1B2A4A]" />
              </button>
              <Link href="/" className="lg:hidden flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#C9A84C] flex items-center justify-center text-[#1A1A1A] font-extrabold text-xs">EX</div>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/partner/notifications" className="relative p-2 hover:bg-[#FDF8F0] rounded-lg">
                <Bell className="w-5 h-5 text-[#1B2A4A]/60" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
              </Link>
              <div className="w-8 h-8 rounded-full bg-[#C9A84C]/10 flex items-center justify-center text-[#C9A84C] font-semibold text-sm">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}`);

// Partner Dashboard Page
writeFile('app/partner/page.js', `'use client';

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
  FileText
} from 'lucide-react';

export default function PartnerDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalContributions: 12450,
    monthlyCommitment: 1200,
    lastPayment: 250,
    payments: 24,
    growth: 12.5
  });
  const [recentTransactions, setRecentTransactions] = useState([
    { id: 1, reference: 'PAY-2024-001', amount: 250, status: 'success', date: '2024-12-20', purpose: 'Monthly Partnership' },
    { id: 2, reference: 'PAY-2024-002', amount: 500, status: 'success', date: '2024-12-15', purpose: 'Building Fund' },
    { id: 3, reference: 'PAY-2024-003', amount: 150, status: 'pending', date: '2024-12-10', purpose: 'Missions' },
    { id: 4, reference: 'PAY-2024-004', amount: 300, status: 'failed', date: '2024-12-05', purpose: 'Monthly Partnership' },
  ]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

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
    { title: 'Total Contributions', value: \`\$\${stats.totalContributions.toLocaleString()}\`, icon: TrendingUp, change: \`+\${stats.growth}%\`, changeType: 'positive', color: 'text-emerald-600' },
    { title: 'Monthly Commitment', value: \`\$\${stats.monthlyCommitment.toLocaleString()}\`, icon: Calendar, change: 'Monthly', changeType: 'neutral', color: 'text-blue-600' },
    { title: 'Last Payment', value: \`\$\${stats.lastPayment.toLocaleString()}\`, icon: CreditCard, change: '2 days ago', changeType: 'neutral', color: 'text-purple-600' },
    { title: 'Total Payments', value: stats.payments, icon: Users, change: 'Active', changeType: 'positive', color: 'text-indigo-600' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#1B2A4A]">Welcome back, {user?.firstName || 'Partner'} 👋</h1>
          <p className="text-[#1B2A4A]/60 mt-1">Here's what's happening with your partnership</p>
        </div>
        <Link href="/partner/payments" className="btn-primary text-sm py-2.5 px-5 shadow-lg shadow-[#C9A84C]/25 flex items-center gap-2 whitespace-nowrap">
          <Plus className="w-4 h-4" />
          Make a Payment
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card-premium p-6 animate-fade-up" style={{ animationDelay: \`\${index * 100}ms\` }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-[#1B2A4A]/60">{stat.title}</p>
                  <p className="text-2xl font-bold text-[#1B2A4A] mt-2">{stat.value}</p>
                </div>
                <div className={\`p-3 rounded-xl bg-[#FDF8F0] \${stat.color}\`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-sm">
                {stat.changeType === 'positive' && <ArrowUpRight className="w-4 h-4 text-emerald-600" />}
                {stat.changeType === 'negative' && <ArrowDownRight className="w-4 h-4 text-red-600" />}
                <span className={stat.changeType === 'positive' ? 'text-emerald-600' : stat.changeType === 'negative' ? 'text-red-600' : 'text-[#1B2A4A]/60'}>
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
            <h2 className="text-lg font-semibold text-[#1B2A4A]">Recent Transactions</h2>
            <p className="text-sm text-[#1B2A4A]/60">Your latest partnership payments</p>
          </div>
          <Link href="/partner/history" className="text-sm text-[#1B2A4A] font-medium hover:text-[#C9A84C] transition flex items-center gap-1">
            View All
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs font-medium text-[#1B2A4A]/40 uppercase tracking-wider">
                <th className="pb-3 font-medium">Reference</th>
                <th className="pb-3 font-medium">Purpose</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8D5A3]">
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#FDF8F0] transition-colors">
                  <td className="py-3 text-sm font-mono text-[#1B2A4A]/80">{tx.reference}</td>
                  <td className="py-3 text-sm text-[#1B2A4A]/80">{tx.purpose}</td>
                  <td className="py-3 text-sm font-semibold text-[#1B2A4A]">\${tx.amount.toLocaleString()}</td>
                  <td className="py-3 text-sm text-[#1B2A4A]/60">{tx.date}</td>
                  <td className="py-3">
                    <span className={\`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border \${getStatusColor(tx.status)}\`}>
                      {getStatusIcon(tx.status)}
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 hover:bg-[#FDF8F0] rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-[#1B2A4A]/40" />
                      </button>
                      <button className="p-1.5 hover:bg-[#FDF8F0] rounded-lg transition-colors">
                        <Download className="w-4 h-4 text-[#1B2A4A]/40" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/partner/payments" className="card-premium p-6 hover:border-[#C9A84C]/30 transition-all flex items-center gap-4 group">
          <div className="p-3 rounded-xl bg-[#C9A84C]/10 group-hover:bg-[#C9A84C]/20 transition-colors">
            <CreditCard className="w-6 h-6 text-[#C9A84C]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#1B2A4A]">Make Payment</h3>
            <p className="text-sm text-[#1B2A4A]/60">Support the ministry today</p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-[#C9A84C]/30 ml-auto group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link href="/partner/history" className="card-premium p-6 hover:border-[#C9A84C]/30 transition-all flex items-center gap-4 group">
          <div className="p-3 rounded-xl bg-[#C9A84C]/10 group-hover:bg-[#C9A84C]/20 transition-colors">
            <History className="w-6 h-6 text-[#C9A84C]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#1B2A4A]">View History</h3>
            <p className="text-sm text-[#1B2A4A]/60">See all your payments</p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-[#C9A84C]/30 ml-auto group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link href="/partner/receipts" className="card-premium p-6 hover:border-[#C9A84C]/30 transition-all flex items-center gap-4 group">
          <div className="p-3 rounded-xl bg-[#C9A84C]/10 group-hover:bg-[#C9A84C]/20 transition-colors">
            <FileText className="w-6 h-6 text-[#C9A84C]" />
          </div>
          <div>
            <h3 className="font-semibold text-[#1B2A4A]">Download Receipts</h3>
            <p className="text-sm text-[#1B2A4A]/60">Get your tax receipts</p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-[#C9A84C]/30 ml-auto group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}`);

// Payments Page
writeFile('app/partner/payments/page.js', `'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Send, Loader2 } from 'lucide-react';

export default function MakePayment() {
  const [formData, setFormData] = useState({
    amount: '',
    purpose: 'Monthly Partnership',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: parseFloat(formData.amount),
          purpose: formData.purpose,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Payment initialization failed');
      }

      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      }
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#1B2A4A]">Make a Payment</h1>
        <p className="text-[#1B2A4A]/60 mt-1">Support the ministry with your partnership gift</p>
      </div>

      <div className="card-premium p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-[#1B2A4A] mb-1.5">Amount (USD)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-[#1B2A4A]/40">$</span>
              <input
                type="number"
                required
                min="1"
                step="0.01"
                className="input-premium pl-8 text-lg font-semibold"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
            </div>
            <p className="text-xs text-[#1B2A4A]/40 mt-1.5">Minimum amount: $1.00</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1B2A4A] mb-1.5">Purpose</label>
            <select
              className="input-premium"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
            >
              <option value="Monthly Partnership">Monthly Partnership</option>
              <option value="Building Fund">Building Fund</option>
              <option value="Missions">Missions</option>
              <option value="Benevolence">Benevolence</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {formData.purpose === 'Other' && (
            <div>
              <label className="block text-sm font-medium text-[#1B2A4A] mb-1.5">Specify Purpose</label>
              <input
                type="text"
                className="input-premium"
                placeholder="Enter purpose"
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              />
            </div>
          )}

          <div className="bg-[#FDF8F0] rounded-xl p-4">
            <div className="flex items-center gap-3 text-sm text-[#1B2A4A]/60">
              <CreditCard className="w-5 h-5" />
              <span>Secure payment via Paystack. We accept all major cards.</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full justify-center text-base py-3.5"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Proceed to Payment
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}`);

// History Page
writeFile('app/partner/history/page.js', `'use client';

import { useState } from 'react';
import { Search, Filter, Download, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PaymentHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const payments = [
    { id: 1, reference: 'PAY-2024-001', amount: 250, status: 'success', date: '2024-12-20', purpose: 'Monthly Partnership', method: 'Card' },
    { id: 2, reference: 'PAY-2024-002', amount: 500, status: 'success', date: '2024-12-15', purpose: 'Building Fund', method: 'Bank Transfer' },
    { id: 3, reference: 'PAY-2024-003', amount: 150, status: 'pending', date: '2024-12-10', purpose: 'Missions', method: 'Mobile Money' },
    { id: 4, reference: 'PAY-2024-004', amount: 300, status: 'failed', date: '2024-12-05', purpose: 'Monthly Partnership', method: 'Card' },
    { id: 5, reference: 'PAY-2024-005', amount: 1000, status: 'success', date: '2024-11-28', purpose: 'Annual Gift', method: 'Bank Transfer' },
    { id: 6, reference: 'PAY-2024-006', amount: 200, status: 'success', date: '2024-11-20', purpose: 'Monthly Partnership', method: 'Card' },
    { id: 7, reference: 'PAY-2024-007', amount: 75, status: 'success', date: '2024-11-15', purpose: 'Missions', method: 'Mobile Money' },
    { id: 8, reference: 'PAY-2024-008', amount: 450, status: 'pending', date: '2024-11-10', purpose: 'Building Fund', method: 'Card' },
  ];

  const filteredPayments = payments.filter(p =>
    p.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-emerald-50 text-emerald-700';
      case 'pending': return 'bg-amber-50 text-amber-700';
      case 'failed': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#1B2A4A]">Payment History</h1>
        <p className="text-[#1B2A4A]/60 mt-1">View all your partnership payments</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1B2A4A]/30" />
          <input
            type="text"
            className="input-premium pl-10"
            placeholder="Search by reference or purpose..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn-outline text-sm py-2.5 px-5 flex items-center gap-2 whitespace-nowrap">
          <Filter className="w-4 h-4" />
          Filter
        </button>
        <button className="btn-outline text-sm py-2.5 px-5 flex items-center gap-2 whitespace-nowrap">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FDF8F0]">
              <tr className="text-left text-xs font-medium text-[#1B2A4A]/40 uppercase tracking-wider">
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Purpose</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8D5A3]">
              {currentPayments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-[#1B2A4A]/40">
                    No payments found
                  </td>
                </tr>
              ) : (
                currentPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-[#FDF8F0] transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-[#1B2A4A]/80">{payment.reference}</td>
                    <td className="px-6 py-4 text-sm text-[#1B2A4A]/80">{payment.purpose}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#1B2A4A]">\${payment.amount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-[#1B2A4A]/60">{payment.date}</td>
                    <td className="px-6 py-4 text-sm text-[#1B2A4A]/60">{payment.method}</td>
                    <td className="px-6 py-4">
                      <span className={\`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium \${getStatusColor(payment.status)}\`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 hover:bg-[#FDF8F0] rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-[#1B2A4A]/40" />
                        </button>
                        <button className="p-1.5 hover:bg-[#FDF8F0] rounded-lg transition-colors">
                          <Download className="w-4 h-4 text-[#1B2A4A]/40" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-[#E8D5A3] flex items-center justify-between">
            <p className="text-sm text-[#1B2A4A]/60">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredPayments.length)} of {filteredPayments.length} results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-[#FDF8F0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-[#1B2A4A]/60" />
              </button>
              <span className="text-sm font-medium text-[#1B2A4A]">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-[#FDF8F0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-[#1B2A4A]/60" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}`);

// Receipts Page
writeFile('app/partner/receipts/page.js', `'use client';

import { useState } from 'react';
import { Search, Download, FileText, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Receipts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const receipts = [
    { id: 1, receiptNumber: 'RCP-2024-001', reference: 'PAY-2024-001', amount: 250, date: '2024-12-20', purpose: 'Monthly Partnership' },
    { id: 2, receiptNumber: 'RCP-2024-002', reference: 'PAY-2024-002', amount: 500, date: '2024-12-15', purpose: 'Building Fund' },
    { id: 3, receiptNumber: 'RCP-2024-003', reference: 'PAY-2024-005', amount: 1000, date: '2024-11-28', purpose: 'Annual Gift' },
    { id: 4, receiptNumber: 'RCP-2024-004', reference: 'PAY-2024-006', amount: 200, date: '2024-11-20', purpose: 'Monthly Partnership' },
    { id: 5, receiptNumber: 'RCP-2024-005', reference: 'PAY-2024-007', amount: 75, date: '2024-11-15', purpose: 'Missions' },
  ];

  const filteredReceipts = receipts.filter(r =>
    r.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredReceipts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReceipts = filteredReceipts.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#1B2A4A]">Receipts</h1>
        <p className="text-[#1B2A4A]/60 mt-1">Download your partnership receipts</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1B2A4A]/30" />
        <input
          type="text"
          className="input-premium pl-10"
          placeholder="Search receipts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {currentReceipts.length === 0 ? (
          <div className="card-premium p-12 text-center">
            <FileText className="w-12 h-12 text-[#1B2A4A]/20 mx-auto mb-4" />
            <p className="text-[#1B2A4A]/60">No receipts found</p>
          </div>
        ) : (
          currentReceipts.map((receipt) => (
            <div key={receipt.id} className="card-premium p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#C9A84C]/30 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-[#C9A84C]/10">
                  <FileText className="w-6 h-6 text-[#C9A84C]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1B2A4A]">{receipt.receiptNumber}</h3>
                  <p className="text-sm text-[#1B2A4A]/60">{receipt.purpose} · {receipt.date}</p>
                  <p className="text-sm font-mono text-[#1B2A4A]/40">Ref: {receipt.reference}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold text-[#1B2A4A]">\${receipt.amount.toLocaleString()}</span>
                <div className="flex gap-2">
                  <button className="p-2.5 rounded-lg hover:bg-[#FDF8F0] transition-colors">
                    <Eye className="w-5 h-5 text-[#1B2A4A]/40" />
                  </button>
                  <button className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#1B2A4A]/60">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredReceipts.length)} of {filteredReceipts.length} receipts
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-[#FDF8F0] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 text-[#1B2A4A]/60" />
            </button>
            <span className="text-sm font-medium text-[#1B2A4A]">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-[#FDF8F0] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5 text-[#1B2A4A]/60" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}`);

// Notifications Page
writeFile('app/partner/notifications/page.js', `'use client';

import { useState } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, CheckCheck, Trash2 } from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'payment', title: 'Payment Received', message: 'Your partnership payment of $250 has been received.', date: '2024-12-20 14:30', read: false },
    { id: 2, type: 'info', title: 'Ministry Update', message: 'New prayer request posted for the upcoming mission trip.', date: '2024-12-19 10:15', read: false },
    { id: 3, type: 'success', title: 'Receipt Generated', message: 'Your receipt for payment #PAY-2024-002 is ready.', date: '2024-12-18 09:00', read: true },
    { id: 4, type: 'alert', title: 'Upcoming Payment', message: 'Your monthly partnership payment is due in 3 days.', date: '2024-12-17 08:00', read: true },
    { id: 5, type: 'info', title: 'New Blog Post', message: 'Read the latest ministry update from Elijah Hagin.', date: '2024-12-16 16:45', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch (type) {
      case 'payment': return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      case 'alert': return <AlertCircle className="w-5 h-5 text-amber-600" />;
      case 'info': return <Info className="w-5 h-5 text-blue-600" />;
      default: return <Bell className="w-5 h-5 text-[#1B2A4A]/40" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'payment': return 'bg-emerald-50';
      case 'success': return 'bg-emerald-50';
      case 'alert': return 'bg-amber-50';
      case 'info': return 'bg-blue-50';
      default: return 'bg-[#FDF8F0]';
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
          <h1 className="text-3xl font-bold tracking-tight text-[#1B2A4A]">Notifications</h1>
          <p className="text-[#1B2A4A]/60 mt-1">Stay updated with your partnership</p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <span className="badge-premium bg-[#C9A84C] text-[#1A1A1A]">
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
          <Bell className="w-12 h-12 text-[#1B2A4A]/20 mx-auto mb-4" />
          <p className="text-[#1B2A4A]/60">No notifications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={\`card-premium p-5 transition-all hover:border-[#C9A84C]/30 \${!notification.read ? 'border-l-4 border-l-[#C9A84C]' : 'opacity-70'}\`}
            >
              <div className="flex items-start gap-4">
                <div className={\`p-2 rounded-xl \${getBgColor(notification.type)}\`}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h3 className="font-semibold text-[#1B2A4A]">{notification.title}</h3>
                    <span className="text-xs text-[#1B2A4A]/40 whitespace-nowrap">{notification.date}</span>
                  </div>
                  <p className="text-sm text-[#1B2A4A]/60 mt-1">{notification.message}</p>
                </div>
                <div className="flex items-center gap-1">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-1.5 hover:bg-[#FDF8F0] rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <CheckCircle className="w-4 h-4 text-[#1B2A4A]/30" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-1.5 hover:bg-[#FDF8F0] rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-[#1B2A4A]/30 hover:text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}`);

// Settings Page
writeFile('app/partner/settings/page.js', `'use client';

import { useState } from 'react';
import { useAuth } from '@/app/components/providers/AuthProvider';
import { User, Mail, Phone, MapPin, Lock, Bell, Save } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    country: user?.country || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    await new Promise(resolve => setTimeout(resolve, 1500));
    setSuccess(true);
    setLoading(false);

    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#1B2A4A]">Settings</h1>
        <p className="text-[#1B2A4A]/60 mt-1">Manage your account preferences</p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
          <Save className="w-4 h-4" />
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="card-premium p-6">
          <h2 className="text-lg font-semibold text-[#1B2A4A] mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-[#1B2A4A]/40" />
            Profile Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1B2A4A] mb-1.5">First Name</label>
              <input
                type="text"
                className="input-premium"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1B2A4A] mb-1.5">Last Name</label>
              <input
                type="text"
                className="input-premium"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-[#1B2A4A] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1B2A4A]/30" />
                <input
                  type="email"
                  className="input-premium pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1B2A4A] mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1B2A4A]/30" />
                <input
                  type="tel"
                  className="input-premium pl-10"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card-premium p-6">
          <h2 className="text-lg font-semibold text-[#1B2A4A] mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#1B2A4A]/40" />
            Address
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1B2A4A] mb-1.5">Street Address</label>
              <input
                type="text"
                className="input-premium"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1B2A4A] mb-1.5">City</label>
                <input
                  type="text"
                  className="input-premium"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1B2A4A] mb-1.5">State/Province</label>
                <input
                  type="text"
                  className="input-premium"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1B2A4A] mb-1.5">Country</label>
                <input
                  type="text"
                  className="input-premium"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card-premium p-6">
          <h2 className="text-lg font-semibold text-[#1B2A4A] mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#1B2A4A]/40" />
            Change Password
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1B2A4A] mb-1.5">Current Password</label>
              <input
                type="password"
                className="input-premium"
                placeholder="Enter current password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#1B2A4A] mb-1.5">New Password</label>
                <input
                  type="password"
                  className="input-premium"
                  placeholder="Enter new password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1B2A4A] mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  className="input-premium"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card-premium p-6">
          <h2 className="text-lg font-semibold text-[#1B2A4A] mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#1B2A4A]/40" />
            Notification Preferences
          </h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="rounded border-[#C9A84C]/30" defaultChecked />
              <span className="text-sm text-[#1B2A4A]">Email notifications for payments</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="rounded border-[#C9A84C]/30" defaultChecked />
              <span className="text-sm text-[#1B2A4A]">Ministry updates and newsletters</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="rounded border-[#C9A84C]/30" />
              <span className="text-sm text-[#1B2A4A]">Prayer requests and urgent needs</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary text-base py-3 px-8"
          >
            {loading ? 'Saving...' : 'Save Changes'}
            {!loading && <Save className="w-4 h-4" />}
          </button>
          <button
            type="button"
            className="text-[#1B2A4A]/60 hover:text-[#1B2A4A] text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}`);

// Payment Success Page
writeFile('app/partner/payments/success/page.js', `'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Home, Download, ArrowRight, XCircle } from 'lucide-react';

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get('reference');
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!reference) {
      router.push('/partner');
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Verification failed');
        }

        setPayment(data.payment);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [reference, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 rounded-full border-4 border-[#C9A84C]/20 border-t-[#C9A84C] animate-spin"></div>
          <p className="mt-4 text-[#1B2A4A]/60">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error || !payment || payment.status !== 'success') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#1B2A4A]">Payment Failed</h2>
          <p className="text-[#1B2A4A]/60 mt-2">{error || 'Something went wrong with your payment'}</p>
          <Link href="/partner/payments" className="btn-primary mt-6 inline-flex items-center gap-2">
            Try Again
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-3xl font-bold text-[#1B2A4A]">Payment Successful!</h2>
        <p className="text-[#1B2A4A]/60 mt-2">
          Thank you for your partnership. Your payment has been received.
        </p>

        <div className="card-premium p-6 mt-6 text-left">
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#1B2A4A]/60">Receipt Number</span>
              <span className="font-mono font-medium text-[#1B2A4A]">{payment.receiptNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#1B2A4A]/60">Reference</span>
              <span className="font-mono text-[#1B2A4A]">{payment.reference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#1B2A4A]/60">Amount</span>
              <span className="font-bold text-[#1B2A4A]">\${payment.amount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#1B2A4A]/60">Status</span>
              <span className="badge-premium bg-emerald-50 text-emerald-700">Success</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link href="/partner" className="btn-outline justify-center flex-1 py-3">
            <Home className="w-4 h-4" />
            Dashboard
          </Link>
          <button className="btn-primary justify-center flex-1 py-3">
            <Download className="w-4 h-4" />
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
}`);

console.log('\n✅ All partner files created successfully!');
console.log('\n📁 Files created:');
console.log('  - app/partner/layout.js');
console.log('  - app/partner/page.js');
console.log('  - app/partner/payments/page.js');
console.log('  - app/partner/payments/success/page.js');
console.log('  - app/partner/history/page.js');
console.log('  - app/partner/receipts/page.js');
console.log('  - app/partner/notifications/page.js');
console.log('  - app/partner/settings/page.js');
console.log('\n🚀 Next steps:');
console.log('1. Run: npm run dev');
console.log('2. Visit: http://localhost:3000/partner');