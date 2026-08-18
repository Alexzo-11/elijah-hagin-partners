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
        <div className="skeleton h-8 w-48 rounded"></div>
        <div className="skeleton h-12 w-full rounded"></div>
        <div className="skeleton h-96 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#4A4C4E]">Partners</h1>
          <p className="text-sm text-[#4A4C4E]/60">Manage all registered partners</p>
        </div>
        <div className="flex items-center gap-2">
          <ExcelExport
            data={filteredPartners}
            filename={`partners-${new Date().toISOString().split('T')[0]}`}
            headers={partnerHeaders}
            sheetName="Partners"
            buttonText="Export"
            className="text-xs sm:text-sm py-1.5 sm:py-2.5 px-3 sm:px-5"
          />
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#4A4C4E]/30" />
        <input
          type="text"
          className="input-premium pl-9 sm:pl-10 text-sm"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Partners Table - Responsive */}
      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[500px] sm:min-w-0">
            <thead className="bg-[#F5F6F7]">
              <tr className="text-left text-xs font-medium text-[#4A4C4E]/40 uppercase tracking-wider">
                <th className="px-3 sm:px-4 py-2 sm:py-3">Partner</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 hidden sm:table-cell">Email</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 hidden md:table-cell">Phone</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3">Type</th>
                <th className="px-2 sm:px-4 py-2 sm:py-3 hidden lg:table-cell">Status</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E6E7]">
              {currentPartners.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-8 sm:py-12 text-center text-[#4A4C4E]/40">
                    No partners found
                  </td>
                </tr>
              ) : (
                currentPartners.map((partner) => (
                  <tr key={partner.id} className="hover:bg-[#F5F6F7] transition-colors">
                    <td className="px-3 sm:px-4 py-2 sm:py-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-[#E51913]/20 flex-shrink-0">
                          {partner.passport ? (
                            <img
                              src={partner.passport}
                              alt={`${partner.firstName} ${partner.surname}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#F5F6F7] flex items-center justify-center">
                              <Camera className="w-3 h-3 sm:w-4 sm:h-4 text-[#8A8C8E]" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-medium text-[#4A4C4E] truncate max-w-[80px] sm:max-w-[120px] lg:max-w-none">
                            {partner.surname} {partner.firstName}
                          </p>
                          <p className="text-[10px] sm:text-xs text-[#4A4C4E]/40 truncate max-w-[80px] sm:max-w-[120px] lg:max-w-none">
                            {partner.occupation || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#4A4C4E] hidden sm:table-cell truncate max-w-[120px] lg:max-w-none">
                      {partner.email}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#4A4C4E]/60 hidden md:table-cell">
                      {partner.phone || 'N/A'}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <span className="badge-premium bg-amber-100 text-amber-700 text-[10px] sm:text-xs">
                        {partner.partnershipType || 'SILVER'}
                      </span>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 hidden lg:table-cell">
                      <span className={`badge-premium text-[10px] sm:text-xs ${partner.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {partner.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-2 sm:py-3 text-right">
                      <Link 
                        href={`/admin/partners/${partner.id}`}
                        className="p-1 hover:bg-[#F5F6F7] rounded-lg transition-colors inline-block"
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

        {/* Pagination - Responsive */}
        {totalPages > 1 && (
          <div className="px-3 sm:px-4 py-3 border-t border-[#E5E6E7] flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs sm:text-sm text-[#4A4C4E]/60 order-2 sm:order-1">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredPartners.length)} of {filteredPartners.length} partners
            </p>
            <div className="flex items-center gap-1 order-1 sm:order-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-[#F5F6F7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[#4A4C4E]/60" />
              </button>
              <span className="text-xs sm:text-sm font-medium text-[#4A4C4E]">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 sm:p-2 rounded-lg hover:bg-[#F5F6F7] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#4A4C4E]/60" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}