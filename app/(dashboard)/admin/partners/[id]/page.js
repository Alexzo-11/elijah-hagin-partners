'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/app/components/providers/AuthProvider';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  FileText,
  Download,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  UserCheck,
  UserX,
  Building,
  Briefcase,
  Calendar as CalendarIcon,
  Activity,
  Eye,
  Copy,
} from 'lucide-react';

export default function PartnerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [partner, setPartner] = useState(null);
  const [payments, setPayments] = useState([]);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
  });
  const [activating, setActivating] = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  useEffect(() => {
    fetchPartnerData();
  }, [params.id]);

  const fetchPartnerData = async () => {
    try {
      const res = await fetch(`/api/admin/partners/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setPartner(data.partner);
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error('Error fetching partner:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setSendingEmail(true);
    setEmailError('');

    try {
      const res = await fetch('/api/admin/emails/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerId: partner.id,
          subject: emailData.subject,
          message: emailData.message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setEmailSent(true);
      setShowEmailModal(false);
      setEmailData({ subject: '', message: '' });
      
      setTimeout(() => setEmailSent(false), 5000);
    } catch (error) {
      setEmailError(error.message);
    } finally {
      setSendingEmail(false);
    }
  };

  const handleToggleStatus = async () => {
    const isActive = partner.status === 'active';
    
    if (isActive) {
      setDeactivating(true);
    } else {
      setActivating(true);
    }

    try {
      const res = await fetch(`/api/admin/partners/${params.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: isActive ? 'inactive' : 'active',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setPartner(prev => ({
          ...prev,
          status: data.status,
        }));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setActivating(false);
      setDeactivating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'inactive': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'suspended': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'failed': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="skeleton h-10 w-10 rounded-full"></div>
          <div className="skeleton h-8 w-48 rounded"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="skeleton h-48 rounded-xl"></div>
            <div className="skeleton h-64 rounded-xl"></div>
          </div>
          <div className="space-y-6">
            <div className="skeleton h-64 rounded-xl"></div>
            <div className="skeleton h-32 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-[#4A4C4E]/20 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-[#4A4C4E]">Partner Not Found</h2>
        <p className="text-[#4A4C4E]/60 mt-2">The partner you're looking for doesn't exist.</p>
        <Link href="/admin/partners" className="btn-primary mt-6 inline-block">
          Back to Partners
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/admin/partners"
            className="p-2 hover:bg-[#F5F6F7] rounded-lg transition flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-[#4A4C4E]/60" />
          </Link>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#4A4C4E] truncate">
              {partner.firstName} {partner.surname}
            </h1>
            <p className="text-sm text-[#4A4C4E]/60 truncate">{partner.email}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
          <button
            onClick={handleToggleStatus}
            disabled={activating || deactivating}
            className={`text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-medium border transition flex items-center gap-1.5 ${
              partner.status === 'active'
                ? 'border-red-200 text-red-600 hover:bg-red-50'
                : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
            }`}
          >
            {activating || deactivating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : partner.status === 'active' ? (
              <>
                <UserX className="w-3.5 h-3.5" />
                Deactivate
              </>
            ) : (
              <>
                <UserCheck className="w-3.5 h-3.5" />
                Activate
              </>
            )}
          </button>
          <button
            onClick={() => setShowEmailModal(true)}
            className="btn-primary text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-5"
          >
            <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Send Email
          </button>
        </div>
      </div>

      {/* Success Message */}
      {emailSent && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2 animate-fade-up">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          Email sent successfully to {partner.firstName} {partner.surname}!
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="card-premium p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-[#4A4C4E] mb-4 flex items-center gap-2">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#4A4C4E]/40" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs sm:text-sm text-[#4A4C4E]/40">Surname</p>
                <p className="text-sm sm:text-base font-medium text-[#4A4C4E] break-words">{partner.surname}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-[#4A4C4E]/40">First Name</p>
                <p className="text-sm sm:text-base font-medium text-[#4A4C4E] break-words">{partner.firstName}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-[#4A4C4E]/40">Email</p>
                <p className="text-sm sm:text-base font-medium text-[#4A4C4E] break-all">{partner.email}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-[#4A4C4E]/40">Phone</p>
                <p className="text-sm sm:text-base font-medium text-[#4A4C4E] break-words">{partner.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-[#4A4C4E]/40">Gender</p>
                <p className="text-sm sm:text-base font-medium text-[#4A4C4E] break-words">{partner.gender || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-[#4A4C4E]/40">Occupation</p>
                <p className="text-sm sm:text-base font-medium text-[#4A4C4E] break-words">{partner.occupation || 'Not specified'}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs sm:text-sm text-[#4A4C4E]/40">Address</p>
                <p className="text-sm sm:text-base font-medium text-[#4A4C4E] break-words">{partner.address || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-[#4A4C4E]/40">Joined</p>
                <p className="text-sm sm:text-base font-medium text-[#4A4C4E] break-words">
                  {new Date(partner.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-[#4A4C4E]/40">Status</p>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(partner.status)}`}>
                  {partner.status === 'active' ? (
                    <CheckCircle className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  {partner.status.charAt(0).toUpperCase() + partner.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="card-premium p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-[#4A4C4E] mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-[#4A4C4E]/40" />
              Payment History
            </h2>
            {payments.length === 0 ? (
              <p className="text-center text-[#4A4C4E]/40 text-sm py-4">No payments recorded</p>
            ) : (
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full min-w-[400px] sm:min-w-0">
                  <thead>
                    <tr className="text-left text-[10px] sm:text-xs font-medium text-[#4A4C4E]/40 uppercase tracking-wider border-b border-[#E5E6E7]">
                      <th className="pb-2 sm:pb-3 pr-2 sm:pr-4 font-medium">Reference</th>
                      <th className="pb-2 sm:pb-3 px-2 sm:px-4 font-medium">Amount</th>
                      <th className="pb-2 sm:pb-3 px-2 sm:px-4 font-medium hidden sm:table-cell">Method</th>
                      <th className="pb-2 sm:pb-3 px-2 sm:px-4 font-medium hidden md:table-cell">Date</th>
                      <th className="pb-2 sm:pb-3 pl-2 sm:pl-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E6E7]">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-[#F5F6F7] transition-colors">
                        <td className="py-2 sm:py-3 pr-2 sm:pr-4">
                          <p className="text-[10px] sm:text-sm font-mono text-[#4A4C4E]/60 truncate max-w-[80px] sm:max-w-[120px]">
                            {payment.reference}
                          </p>
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-[#4A4C4E] whitespace-nowrap">
                          ₦{payment.amount.toLocaleString()}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-[#4A4C4E]/60 hidden sm:table-cell break-words">
                          {payment.method || 'N/A'}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-[#4A4C4E]/60 hidden md:table-cell whitespace-nowrap">
                          {new Date(payment.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-2 sm:py-3 pl-2 sm:pl-4">
                          <span className={`inline-flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium border ${getPaymentStatusColor(payment.status)} whitespace-nowrap`}>
                            {payment.status === 'success' && <CheckCircle className="w-3 h-3" />}
                            {payment.status === 'pending' && <Clock className="w-3 h-3" />}
                            {payment.status === 'failed' && <XCircle className="w-3 h-3" />}
                            <span className="hidden xs:inline">{payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - 1/3 */}
        <div className="space-y-6">
          {/* Partnership Details */}
          <div className="card-premium p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-[#4A4C4E] mb-4 flex items-center gap-2">
              <Building className="w-4 h-4 sm:w-5 sm:h-5 text-[#4A4C4E]/40" />
              Partnership
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-[#4A4C4E]/60">Partnership Type</span>
                <span className="text-sm font-semibold text-[#4A4C4E] break-words max-w-[140px] sm:max-w-none text-right">
                  {partner.partnershipType || 'Standard'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-[#4A4C4E]/60">Monthly Commitment</span>
                <span className="text-sm font-semibold text-[#4A4C4E] whitespace-nowrap">
                  ₦{partner.monthlyCommitment?.toLocaleString() || '0'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-[#4A4C4E]/60">Total Given</span>
                <span className="text-sm font-semibold text-[#4A4C4E] whitespace-nowrap">
                  ₦{partner.totalGiven?.toLocaleString() || '0'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-[#4A4C4E]/60">Joined</span>
                <span className="text-sm font-medium text-[#4A4C4E] whitespace-nowrap">
                  {new Date(partner.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card-premium p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-[#4A4C4E] mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-[#4A4C4E]/40" />
              Quick Actions
            </h2>
            <div className="space-y-2">
              <button
                onClick={() => setShowEmailModal(true)}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5F6F7] hover:bg-[#E51913]/10 transition text-sm font-medium text-[#4A4C4E] hover:text-[#E51913]"
              >
                <Send className="w-4 h-4" />
                Send Email
              </button>
              <button
                onClick={() => router.push(`/admin/reports/generate?partnerId=${partner.id}`)}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5F6F7] hover:bg-[#E51913]/10 transition text-sm font-medium text-[#4A4C4E] hover:text-[#E51913]"
              >
                <FileText className="w-4 h-4" />
                Generate Report
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(partner.email);
                  // Show a quick feedback
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5F6F7] hover:bg-[#E51913]/10 transition text-sm font-medium text-[#4A4C4E] hover:text-[#E51913]"
              >
                <Copy className="w-4 h-4" />
                Copy Email
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#E5E6E7]">
              <h2 className="text-xl font-bold text-[#4A4C4E] flex items-center gap-2">
                <Send className="w-5 h-5 text-[#E51913]" />
                Send Email to {partner.firstName}
              </h2>
              <p className="text-sm text-[#4A4C4E]/60 mt-1 break-words">{partner.email}</p>
            </div>

            <form onSubmit={handleSendEmail} className="p-6 space-y-4">
              {emailError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="break-words">{emailError}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="input-premium"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  placeholder="Enter email subject"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="input-premium min-h-[150px] resize-y"
                  value={emailData.message}
                  onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                  placeholder="Write your email message..."
                  required
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="submit"
                  disabled={sendingEmail}
                  className="btn-primary flex-1 justify-center"
                >
                  {sendingEmail ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Email
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowEmailModal(false);
                    setEmailError('');
                  }}
                  className="btn-outline flex-1 justify-center"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}