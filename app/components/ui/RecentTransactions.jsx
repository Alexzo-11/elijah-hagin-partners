'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  Eye, 
  Download, 
  Search, 
  Filter,
  ArrowUpRight
} from 'lucide-react';

export function RecentTransactions({ 
  transactions, 
  title = 'Recent Transactions',
  description = 'Latest partnership payments',
  viewAllLink = '/history',
  showActions = true
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(tx =>
    tx.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.partner?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.purpose?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div className="card-premium p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-[#0f172a]">{title}</h2>
          <p className="text-sm text-[#1a1a2e]/60">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a1a2e]/30" />
            <input
              type="text"
              className="input-premium pl-9 py-2 text-sm"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 hover:bg-[#f8fafc] rounded-lg">
            <Filter className="w-4 h-4 text-[#1a1a2e]/40" />
          </button>
          {viewAllLink && (
            <Link href={viewAllLink} className="text-sm text-[#1a1a2e] font-medium hover:underline flex items-center gap-1">
              View All
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-medium text-[#1a1a2e]/40 uppercase tracking-wider">
              {transactions.some(tx => tx.partner) && (
                <th className="pb-3 font-medium">Partner</th>
              )}
              <th className="pb-3 font-medium">Reference</th>
              <th className="pb-3 font-medium">Purpose</th>
              <th className="pb-3 font-medium">Amount</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Status</th>
              {showActions && <th className="pb-3 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e2e8f0]">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-[#1a1a2e]/40">
                  No transactions found
                </td>
              </tr>
            ) : (
              filteredTransactions.slice(0, 5).map((tx, index) => (
                <motion.tr
                  key={tx.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-[#f8fafc] transition-colors"
                >
                  {transactions.some(t => t.partner) && (
                    <td className="py-3 text-sm font-medium text-[#0f172a]">{tx.partner}</td>
                  )}
                  <td className="py-3 text-sm font-mono text-[#1a1a2e]/60">{tx.reference}</td>
                  <td className="py-3 text-sm text-[#1a1a2e]/80">{tx.purpose || 'Partnership'}</td>
                  <td className="py-3 text-sm font-semibold text-[#0f172a]">${tx.amount.toLocaleString()}</td>
                  <td className="py-3 text-sm text-[#1a1a2e]/60">{tx.date}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(tx.status)}`}>
                      {getStatusIcon(tx.status)}
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </td>
                  {showActions && (
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 hover:bg-[#f8fafc] rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-[#1a1a2e]/40" />
                        </button>
                        <button className="p-1.5 hover:bg-[#f8fafc] rounded-lg transition-colors">
                          <Download className="w-4 h-4 text-[#1a1a2e]/40" />
                        </button>
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}