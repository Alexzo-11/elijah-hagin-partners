'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/components/providers/AuthProvider';
import {
  Send,
  Users,
  Mail,
  Loader2,
  CheckCircle,
  AlertCircle,
  Trash2,
  Eye,
  Clock,
  Search,
  Filter,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminEmails() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState([]);
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [selectedPartners, setSelectedPartners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [sentEmails, setSentEmails] = useState([]);
  const [activeTab, setActiveTab] = useState('compose'); // 'compose' only, removed 'sent'

  useEffect(() => {
    fetchPartners();
    fetchSentEmails();
  }, []);

  const fetchPartners = async () => {
    try {
      const res = await fetch('/api/admin/partners');
      if (res.ok) {
        const data = await res.json();
        setPartners(data.partners || []);
        setFilteredPartners(data.partners || []);
      }
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSentEmails = async () => {
    try {
      const res = await fetch('/api/admin/emails/sent');
      if (res.ok) {
        const data = await res.json();
        setSentEmails(data.emails || []);
      }
    } catch (error) {
      console.error('Error fetching sent emails:', error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = partners.filter(p => 
      p.firstName?.toLowerCase().includes(term) ||
      p.surname?.toLowerCase().includes(term) ||
      p.email?.toLowerCase().includes(term)
    );
    setFilteredPartners(filtered);
  };

  const togglePartnerSelection = (partnerId) => {
    setSelectedPartners(prev =>
      prev.includes(partnerId)
        ? prev.filter(id => id !== partnerId)
        : [...prev, partnerId]
    );
  };

  const toggleAllPartners = () => {
    if (selectedPartners.length === filteredPartners.length) {
      setSelectedPartners([]);
    } else {
      setSelectedPartners(filteredPartners.map(p => p.id));
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSending(true);

    if (selectedPartners.length === 0) {
      setError('Please select at least one partner');
      setSending(false);
      return;
    }

    try {
      const res = await fetch('/api/admin/emails/send-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerIds: selectedPartners,
          subject: emailData.subject,
          message: emailData.message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send emails');
      }

      setSuccess(true);
      setEmailData({ subject: '', message: '' });
      setSelectedPartners([]);
      fetchSentEmails();

      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      setError(error.message);
    } finally {
      setSending(false);
    }
  };

  const handleDeleteEmail = async (emailId) => {
    if (!confirm('Are you sure you want to delete this email record?')) return;

    try {
      const res = await fetch(`/api/admin/emails/${emailId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setSentEmails(prev => prev.filter(e => e.id !== emailId));
      }
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-12 w-48 rounded"></div>
        <div className="skeleton h-64 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#4A4C4E]">
            Email Management
          </h1>
          <p className="text-sm text-[#4A4C4E]/60">
            Send emails to partners
          </p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2 animate-fade-up">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          Emails sent successfully to {selectedPartners.length} partner{selectedPartners.length > 1 ? 's' : ''}!
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2 animate-fade-up">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="break-words">{error}</span>
        </div>
      )}

      {/* Only Compose Tab - Removed Sent Tab */}
      <div className="card-premium p-4 sm:p-6">
        <form onSubmit={handleSendEmail} className="space-y-6">
          {/* Partner Selection */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <label className="text-sm font-medium text-[#4A4C4E] flex items-center gap-2">
                <Users className="w-4 h-4" />
                Recipients
                <span className="text-xs text-[#4A4C4E]/40 font-normal">
                  ({selectedPartners.length} selected)
                </span>
              </label>
              <button
                type="button"
                onClick={toggleAllPartners}
                className="text-xs text-[#E51913] font-medium hover:underline"
              >
                {selectedPartners.length === filteredPartners.length
                  ? 'Deselect All'
                  : 'Select All'}
              </button>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4C4E]/30" />
              <input
                type="text"
                className="input-premium pl-10"
                placeholder="Search partners..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            {/* Partner List */}
            <div className="border border-[#E5E6E7] rounded-xl overflow-hidden max-h-[200px] overflow-y-auto">
              {filteredPartners.length === 0 ? (
                <p className="text-center text-[#4A4C4E]/40 text-sm py-4">
                  No partners found
                </p>
              ) : (
                <div className="divide-y divide-[#E5E6E7]">
                  {filteredPartners.map((partner) => (
                    <label
                      key={partner.id}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#F5F6F7] transition cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPartners.includes(partner.id)}
                        onChange={() => togglePartnerSelection(partner.id)}
                        className="w-4 h-4 rounded border-[#4A4C4E]/20 text-[#E51913] focus:ring-[#E51913]/20"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-[#4A4C4E] truncate">
                          {partner.firstName} {partner.surname}
                        </p>
                        <p className="text-xs text-[#4A4C4E]/40 truncate">
                          {partner.email}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        partner.status === 'active' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-gray-50 text-gray-500'
                      }`}>
                        {partner.status}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Email Content */}
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
              className="input-premium min-h-[200px] resize-y"
              value={emailData.message}
              onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
              placeholder="Write your email message..."
              required
            />
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={sending || selectedPartners.length === 0}
            className="btn-primary w-full sm:w-auto justify-center"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send to {selectedPartners.length} Partner{selectedPartners.length > 1 ? 's' : ''}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}