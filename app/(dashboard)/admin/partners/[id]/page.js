'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Award,
  Users,
  Download,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Edit,
  Mail as MailIcon,
  Flag,
  Briefcase,
  Heart,
  Loader2,
  CreditCard,
  Eye,
  BarChart3,
  Printer,
  Camera
} from 'lucide-react';

export default function PartnerDetails() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [partner, setPartner] = useState(null);
  const [payments, setPayments] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [showPassportModal, setShowPassportModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const partnerRes = await fetch(`/api/partners/${params.id}`);
        if (partnerRes.ok) {
          const data = await partnerRes.json();
          setPartner(data.partner);
        }

        const paymentsRes = await fetch(`/api/partners/${params.id}/payments`);
        if (paymentsRes.ok) {
          const data = await paymentsRes.json();
          setPayments(data.payments || []);
        }
      } catch (error) {
        console.error('Error loading partner data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [params.id]);

  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-emerald-50 text-emerald-700'
      : 'bg-red-50 text-red-700';
  };

  const getPartnershipBadge = (type) => {
    const colors = {
      SILVER: 'bg-gray-100 text-gray-700',
      GOLD: 'bg-amber-100 text-amber-700',
      DIAMOND: 'bg-blue-100 text-blue-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-emerald-50 text-emerald-700';
      case 'pending': return 'bg-amber-50 text-amber-700';
      case 'failed': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const handleGenerateReport = async () => {
    setGenerating(true);
    try {
      const res = await fetch(`/api/partners/${params.id}/report`, {
        method: 'POST',
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `partner-report-${params.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleViewPayment = (paymentId) => {
    router.push(`/admin/payments/${paymentId}`);
  };

  const handleViewReceipt = (paymentId) => {
    window.open(`/api/payments/receipt/${paymentId}`, '_blank');
  };

  const handleDownloadReceipt = async (paymentId) => {
    try {
      const res = await fetch(`/api/payments/receipt/${paymentId}`);
      if (!res.ok) {
        throw new Error('Failed to download receipt');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt-${paymentId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download receipt');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-12 w-64 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-24 rounded-xl"></div>
          ))}
        </div>
        <div className="skeleton h-96 rounded-xl"></div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="text-center py-12">
        <p className="text-[#4A4C4E]/60">Partner not found</p>
        <Link href="/admin/partners" className="btn-primary mt-4 inline-block">
          Back to Partners
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Passport Modal */}
      {showPassportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPassportModal(false)}>
          <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowPassportModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-[#E51913] transition"
            >
              <XCircle className="w-8 h-8" />
            </button>
            <div className="bg-white rounded-2xl p-4 overflow-hidden shadow-2xl">
              {partner.passport ? (
                <img
                  src={partner.passport}
                  alt={`${partner.firstName} ${partner.surname}`}
                  className="w-full h-auto max-h-[70vh] object-contain rounded-xl"
                />
              ) : (
                <div className="w-full h-96 bg-[#F5F6F7] flex items-center justify-center rounded-xl">
                  <Camera className="w-16 h-16 text-[#8A8C8E]" />
                </div>
              )}
              <div className="mt-4 text-center">
                <p className="font-medium text-[#4A4C4E]">
                  {partner.surname} {partner.firstName}
                </p>
                <p className="text-sm text-[#4A4C4E]/60">{partner.email}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-[#F5F6F7] rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#4A4C4E]/60" />
          </button>
          <div className="flex items-center gap-3">
            <div 
              className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#E51913]/20 cursor-pointer group"
              onClick={() => setShowPassportModal(true)}
            >
              {partner.passport ? (
                <img
                  src={partner.passport}
                  alt={`${partner.firstName} ${partner.surname}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-full h-full bg-[#F5F6F7] flex items-center justify-center">
                  <Camera className="w-6 h-6 text-[#8A8C8E]" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#4A4C4E]">
                {partner.surname} {partner.firstName}
              </h1>
              <p className="text-sm text-[#4A4C4E]/60">{partner.email}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <span className={`badge-premium ${getPartnershipBadge(partner.partnershipType)}`}>
            {partner.partnershipType}
          </span>
          <span className={`badge-premium ${getStatusColor(partner.isActive)}`}>
            {partner.isActive ? 'Active' : 'Inactive'}
          </span>
          <button 
            onClick={handleGenerateReport}
            disabled={generating}
            className="btn-outline text-sm py-2 px-4 flex items-center gap-2"
          >
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
            Generate Report
          </button>
          <button className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card-premium p-4 card-primary">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#E51913]/10 text-[#E51913]">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-[#4A4C4E]/40">Partnership Type</p>
              <p className="text-lg font-bold text-[#4A4C4E]">{partner.partnershipType}</p>
            </div>
          </div>
        </div>
        <div className="card-premium p-4 card-secondary">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#3BBCEB]/10 text-[#3BBCEB]">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-[#4A4C4E]/40">Monthly Commitment</p>
              <p className="text-lg font-bold text-[#4A4C4E]">₦{partner.partnershipAmount?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>
        <div className="card-premium p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-[#4A4C4E]/40">Total Given</p>
              <p className="text-lg font-bold text-[#4A4C4E]">₦{partner.totalContributed?.toLocaleString() || 0}</p>
            </div>
          </div>
        </div>
        <div className="card-premium p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-[#4A4C4E]/40">Joined</p>
              <p className="text-lg font-bold text-[#4A4C4E]">
                {partner.createdAt ? new Date(partner.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs - Only Overview and Payments */}
      <div className="border-b border-[#E5E6E7]">
        <nav className="flex gap-6 overflow-x-auto">
          {['overview', 'payments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-1 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab
                  ? 'border-[#E51913] text-[#E51913]'
                  : 'border-transparent text-[#4A4C4E]/60 hover:text-[#4A4C4E]'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="card-premium p-6">
                <h3 className="text-lg font-semibold text-[#4A4C4E] mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#4A4C4E]/40">Surname</p>
                    <p className="font-medium text-[#4A4C4E]">{partner.surname}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#4A4C4E]/40">First Name</p>
                    <p className="font-medium text-[#4A4C4E]">{partner.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#4A4C4E]/40">Gender</p>
                    <p className="font-medium text-[#4A4C4E]">{partner.gender || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#4A4C4E]/40">Occupation</p>
                    <p className="font-medium text-[#4A4C4E]">{partner.occupation || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#4A4C4E]/40">Marital Status</p>
                    <p className="font-medium text-[#4A4C4E]">{partner.maritalStatus || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#4A4C4E]/40">Nationality</p>
                    <p className="font-medium text-[#4A4C4E]">{partner.nationality || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#4A4C4E]/40">State of Origin</p>
                    <p className="font-medium text-[#4A4C4E]">{partner.stateOfOrigin || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#4A4C4E]/40">State of Residence</p>
                    <p className="font-medium text-[#4A4C4E]">{partner.stateOfResidence || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="card-premium p-6">
                <h3 className="text-lg font-semibold text-[#4A4C4E] mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#4A4C4E]/40" />
                    <span className="text-[#4A4C4E]">{partner.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#4A4C4E]/40" />
                    <span className="text-[#4A4C4E]">{partner.phone || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#4A4C4E]/40" />
                    <span className="text-[#4A4C4E]">{partner.residentialAddress || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="card-premium p-6">
                <h3 className="text-lg font-semibold text-[#4A4C4E] mb-4">Passport Photo</h3>
                <div className="flex flex-col items-center">
                  <div 
                    className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-[#E51913]/20 cursor-pointer group"
                    onClick={() => setShowPassportModal(true)}
                  >
                    {partner.passport ? (
                      <img
                        src={partner.passport}
                        alt={`${partner.firstName} ${partner.surname}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#F5F6F7] flex items-center justify-center">
                        <Camera className="w-10 h-10 text-[#8A8C8E]" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                      <Eye className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPassportModal(true)}
                    className="mt-3 text-sm text-[#3BBCEB] hover:text-[#2A9FD4] transition"
                  >
                    Click to view full size
                  </button>
                </div>
              </div>

              <div className="card-premium p-6 mt-4">
                <h3 className="text-lg font-semibold text-[#4A4C4E] mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full btn-primary text-sm py-2.5 flex items-center justify-center gap-2">
                    <MailIcon className="w-4 h-4" />
                    Send Email
                  </button>
                  <button 
                    onClick={handleGenerateReport}
                    disabled={generating}
                    className="w-full btn-outline text-sm py-2.5 flex items-center justify-center gap-2"
                  >
                    {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
                    Generate Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="card-premium p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-[#4A4C4E]">Payment History</h3>
                <p className="text-sm text-[#4A4C4E]/60">All transactions by {partner.firstName}</p>
              </div>
              <button className="btn-outline text-sm py-2 px-4 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-[#4A4C4E]/40 uppercase tracking-wider border-b border-[#E5E6E7]">
                    <th className="pb-3">Reference</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Method</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E6E7]">
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-8 text-center text-[#4A4C4E]/40">
                        No payments found
                      </td>
                    </tr>
                  ) : (
                    payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-[#F5F6F7] transition-colors">
                        <td className="py-3 text-sm font-mono text-[#4A4C4E]/60">{payment.reference}</td>
                        <td className="py-3 text-sm font-semibold text-[#4A4C4E]">₦{payment.amount.toLocaleString()}</td>
                        <td className="py-3 text-sm text-[#4A4C4E]/60">{payment.method || 'Card'}</td>
                        <td className="py-3 text-sm text-[#4A4C4E]/60">{payment.date}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(payment.status)}`}>
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleViewReceipt(payment.id)}
                              className="p-1.5 hover:bg-[#F5F6F7] rounded-lg transition-colors"
                              title="View receipt"
                            >
                              <Eye className="w-4 h-4 text-[#4A4C4E]/40 hover:text-[#E51913]" />
                            </button>
                            {payment.status === 'success' && (
                              <button 
                                onClick={() => handleDownloadReceipt(payment.id)}
                                className="p-1.5 hover:bg-[#F5F6F7] rounded-lg transition-colors"
                                title="Download receipt"
                              >
                                <Download className="w-4 h-4 text-[#4A4C4E]/40 hover:text-[#3BBCEB]" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}