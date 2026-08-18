'use client';

import { useState, useEffect } from 'react';
import {
  FileBarChart,
  Download,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  PieChart,
  BarChart3,
  FileText,
  Printer,
  Mail,
  ChevronDown,
  Eye,
  Loader2,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { ExcelExport } from '@/app/components/ExcelExport';

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    totalTransactions: 0,
    newPartners: 0,
    successfulPayments: 0,
    failedPayments: 0,
    totalIncome: 0,
  });
  const [dateRange, setDateRange] = useState('last30');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reports?range=${dateRange}`);
      if (res.ok) {
        const data = await res.json();
        setReportData(data);
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const reportHeaders = [
    { key: 'metric', label: 'Metric' },
    { key: 'value', label: 'Value' },
  ];

  const reportMetrics = [
    { metric: 'Total Transactions', value: reportData.totalTransactions },
    { metric: 'New Partners', value: reportData.newPartners },
    { metric: 'Successful Payments', value: reportData.successfulPayments },
    { metric: 'Failed Payments', value: reportData.failedPayments },
    { metric: 'Total Income', value: `₦${reportData.totalIncome.toLocaleString()}` },
  ];

  const handleGenerateReport = async () => {
    setGenerating(true);
    setGenerated(false);
    try {
      const headers = ['Metric', 'Value'];
      const rows = [
        ['Total Transactions', reportData.totalTransactions],
        ['New Partners', reportData.newPartners],
        ['Successful Payments', reportData.successfulPayments],
        ['Failed Payments', reportData.failedPayments],
        ['Total Income', `₦${reportData.totalIncome.toLocaleString()}`],
      ];
      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      setGenerated(true);
      setTimeout(() => setGenerated(false), 5000);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-xl"></div>
          ))}
        </div>
        <div className="skeleton h-96 rounded-xl"></div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Transactions', value: reportData.totalTransactions, icon: BarChart3, color: 'text-[#E51913]', bg: 'bg-[#FFE8E7]' },
    { label: 'New Partners', value: reportData.newPartners, icon: Users, color: 'text-[#3BBCEB]', bg: 'bg-[#E8F7FE]' },
    { label: 'Successful Payments', value: reportData.successfulPayments, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Failed Payments', value: reportData.failedPayments, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Total Income', value: `₦${reportData.totalIncome.toLocaleString()}`, icon: DollarSign, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#4A4C4E]">Reports</h1>
          <p className="text-[#4A4C4E]/60 mt-1">Monthly summary and analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <ExcelExport
            data={reportMetrics}
            filename={`report-${new Date().toISOString().split('T')[0]}`}
            headers={reportHeaders}
            sheetName="Report"
            buttonText="Export Report"
          />
          <button 
            onClick={handleGenerateReport}
            disabled={generating}
            className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {generating ? 'Generating...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {generated && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Report exported successfully!
        </div>
      )}

      <div className="card-premium p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#4A4C4E]">Monthly Summary</h3>
          <select 
            className="input-premium py-2 px-4 w-40"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="last30">Last 30 Days</option>
            <option value="last90">Last 90 Days</option>
            <option value="last365">Last Year</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`card-premium p-4 ${stat.bg}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${stat.bg}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-[#4A4C4E]/40">{stat.label}</p>
                    <p className="text-lg font-bold text-[#4A4C4E]">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-[#4A4C4E] mb-4">Transaction Overview</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-[#F5F6F7] rounded-xl">
            <span className="text-[#4A4C4E]/60">Total Transactions</span>
            <span className="font-bold text-[#4A4C4E]">{reportData.totalTransactions}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-[#F5F6F7] rounded-xl">
            <span className="text-[#4A4C4E]/60">Successful Payments</span>
            <span className="font-bold text-emerald-600">{reportData.successfulPayments}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-[#F5F6F7] rounded-xl">
            <span className="text-[#4A4C4E]/60">Failed Payments</span>
            <span className="font-bold text-red-600">{reportData.failedPayments}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#FFE8E7] to-[#E8F7FE] rounded-xl">
            <span className="text-[#4A4C4E]/60 font-medium">Total Income</span>
            <span className="font-bold text-[#E51913] text-lg">₦{reportData.totalIncome.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="card-premium p-6">
        <h3 className="text-lg font-semibold text-[#4A4C4E] mb-4">Growth Metrics</h3>
        <div className="p-4 bg-[#F5F6F7] rounded-xl">
          <p className="text-sm text-[#4A4C4E]/60">New Partners</p>
          <p className="text-2xl font-bold text-[#4A4C4E]">{reportData.newPartners}</p>
          <p className="text-xs text-[#4A4C4E]/40 mt-1">Added in this period</p>
        </div>
      </div>
    </div>
  );
}