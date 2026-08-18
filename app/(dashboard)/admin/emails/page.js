'use client';

import { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  Users,
  Clock,
  CheckCircle,
  Eye,
  Trash2,
  Plus,
  Filter,
  Search,
  Loader2,
  AlertCircle,
  UserPlus
} from 'lucide-react';

export default function EmailsPage() {
  const [activeTab, setActiveTab] = useState('compose');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [partnerCount, setPartnerCount] = useState(0);
  const [formData, setFormData] = useState({
    to: 'all',
    subject: '',
    message: '',
  });
  const [sentEmails, setSentEmails] = useState([]);
  const [loadingSent, setLoadingSent] = useState(true);

  useEffect(() => {
    fetchSentEmails();
    fetchPartnerCount();
  }, []);

  const fetchPartnerCount = async () => {
    try {
      const res = await fetch('/api/partners');
      if (res.ok) {
        const data = await res.json();
        setPartnerCount(data.partners?.length || 0);
      }
    } catch (error) {
      console.error('Error fetching partner count:', error);
    }
  };

  const fetchSentEmails = async () => {
    try {
      const res = await fetch('/api/admin/emails');
      if (res.ok) {
        const data = await res.json();
        setSentEmails(data.emails || []);
      }
    } catch (error) {
      console.error('Error fetching sent emails:', error);
    } finally {
      setLoadingSent(false);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    setSending(true);
    setSuccess(false);
    setError('');

    try {
      const res = await fetch('/api/admin/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: formData.to,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setSuccess(true);
      setFormData({ to: 'all', subject: '', message: '' });
      await fetchSentEmails(); // Refresh sent list
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      setError(error.message);
    } finally {
      setSending(false);
    }
  };

  const getRecipientLabel = (to) => {
    const labels = {
      all: `All Partners (${partnerCount})`,
      active: 'Active Partners',
      inactive: 'Inactive Partners',
      silver: 'Silver Partners',
      gold: 'Gold Partners',
      diamond: 'Diamond Partners',
    };
    return labels[to] || to;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#4A4C4E]">Email Management</h1>
          <p className="text-[#4A4C4E]/60 mt-1">Send emails to all partners</p>
        </div>
      </div>

      <div className="border-b border-[#E5E6E7]">
        <nav className="flex gap-6">
          {['compose', 'sent'].map((tab) => (
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

      {activeTab === 'compose' && (
        <div className="card-premium p-6">
          <h3 className="text-lg font-semibold text-[#4A4C4E] mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#E51913]" />
            Compose Email
          </h3>
          
          {success && (
            <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Email sent successfully to all partners!
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSendEmail} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">Recipients</label>
              <select 
                className="input-premium"
                value={formData.to}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
              >
                <option value="all">All Partners ({partnerCount})</option>
                <option value="active">Active Partners</option>
                <option value="inactive">Inactive Partners</option>
                <option value="silver">Silver Partners</option>
                <option value="gold">Gold Partners</option>
                <option value="diamond">Diamond Partners</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">Subject</label>
              <input 
                type="text" 
                className="input-premium" 
                placeholder="Enter email subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">Message</label>
              <textarea 
                className="input-premium" 
                rows="8" 
                placeholder="Write your email message..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={sending}
              className="btn-primary text-sm py-2.5 px-6 flex items-center gap-2"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send to {getRecipientLabel(formData.to)}
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'sent' && (
        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#4A4C4E]">Sent Emails</h3>
              <p className="text-sm text-[#4A4C4E]/60">History of sent emails</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#4A4C4E]/30" />
                <input type="text" className="input-premium pl-9 py-2 text-sm w-48" placeholder="Search..." />
              </div>
              <button className="p-2 hover:bg-[#F5F6F7] rounded-lg">
                <Filter className="w-4 h-4 text-[#4A4C4E]/40" />
              </button>
            </div>
          </div>

          {loadingSent ? (
            <div className="text-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-[#E51913] mx-auto" />
            </div>
          ) : (
            <div className="space-y-3">
              {sentEmails.length === 0 ? (
                <div className="text-center py-8 text-[#4A4C4E]/40">
                  No emails sent yet
                </div>
              ) : (
                sentEmails.map((email) => (
                  <div key={email.id} className="flex items-center justify-between p-4 border border-[#E5E6E7] rounded-xl hover:border-[#E51913]/30 transition-all">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-[#4A4C4E]">{email.subject}</p>
                        <div className="flex items-center gap-3 text-sm text-[#4A4C4E]/60">
                          <span>To: {email.recipient}</span>
                          <span>•</span>
                          <span>{new Date(email.sentAt).toLocaleString()}</span>
                          <span>•</span>
                          <span>{email.opens || 0} opens</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-[#F5F6F7] rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-[#4A4C4E]/40 hover:text-[#E51913]" />
                      </button>
                      <button className="p-2 hover:bg-[#F5F6F7] rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-[#4A4C4E]/40 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}