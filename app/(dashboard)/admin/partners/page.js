'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Eye, ChevronLeft, ChevronRight, Users, Download, UserCheck, UserX, DollarSign, Loader2, Camera } from 'lucide-react';
import { ExcelExport } from '@/app/components/ExcelExport';

export default function PartnersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState([]);
  const itemsPerPage = 10;

  // Headers for Excel export
  const partnerHeaders = [
    { key: 'surname', label: 'Surname' },
    { key: 'firstName', label: 'First Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'partnershipType', label: 'Partnership Type' },
    { key: 'partnershipAmount', label: 'Monthly Amount', isCurrency: true },
    { key: 'totalContributed', label: 'Total Given', isCurrency: true },
    { key: 'isActive', label: 'Status', isBoolean: true },
    { key: 'createdAt', label: 'Joined Date', isDate: true },
  ];

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await fetch('/api/partners');
      if (res.ok) {
        const data = await res.json();
        setPartners(data.partners || []);
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPartners = partners.filter(p =>
    p.surname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPartners.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPartners = filteredPartners.slice(startIndex, endIndex);

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
          <h1 className="text-3xl font-bold tracking-tight text-[#4A4C4E]">Partners</h1>
          <p className="text-[#4A4C4E]/60 mt-1">Manage all registered partners</p>
        </div>
        <ExcelExport
          data={filteredPartners}
          filename={`partners-${new Date().toISOString().split('T')[0]}`}
          headers={partnerHeaders}
          sheetName="Partners"
          buttonText="Export Partners"
        />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A4C4E]/30" />
        <input
          type="text"
          className="input-premium pl-10"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F5F6F7]">
              <tr className="text-left text-xs font-medium text-[#4A4C4E]/40 uppercase tracking-wider">
                <th className="px-4 py-3">Passport</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E6E7]">
              {currentPartners.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-12 text-center text-[#4A4C4E]/40">
                    No partners found
                  </td>
                </tr>
              ) : (
                currentPartners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-[#F5F6F7] transition-colors">
                    <td className="px-4 py-3">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#E51913]/20">
                        {partner.passport ? (
                          <img
                            src={partner.passport}
                            alt={`${partner.firstName} ${partner.surname}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#F5F6F7] flex items-center justify-center">
                            <Camera className="w-5 h-5 text-[#8A8C8E]" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-[#4A4C4E]">
                          {partner.surname} {partner.firstName}
                        </p>
                        <p className="text-xs text-[#4A4C4E]/40">{partner.occupation || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#4A4C4E]">{partner.email}</td>
                    <td className="px-4 py-3 text-sm text-[#4A4C4E]/60">{partner.phone || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span className="badge-premium bg-amber-100 text-amber-700">
                        {partner.partnershipType || 'SILVER'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge-premium ${partner.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {partner.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link 
                        href={`/admin/partners/${partner.id}`}
                        className="p-1.5 hover:bg-[#F5F6F7] rounded-lg transition-colors inline-block"
                      >
                        <Eye className="w-4 h-4 text-[#4A4C4E]/40 hover:text-[#E51913]" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-[#E5E6E7] flex items-center justify-between">
            <p className="text-sm text-[#4A4C4E]/60">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredPartners.length)} of {filteredPartners.length} partners
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-[#F5F6F7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-[#4A4C4E]/60" />
              </button>
              <span className="text-sm font-medium text-[#4A4C4E]">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-[#F5F6F7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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