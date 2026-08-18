'use client';

import { useState } from 'react';
import { useAuth } from '@/app/components/providers/AuthProvider';
import {
  Send,
  Mail,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Loader2,
  ArrowRight,
  Users,
  Clock,
  FileText,
  Heart,
  HelpCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SendMessage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    category: 'general',
    priority: 'medium',
    message: '',
  });

  const categories = [
    { value: 'general', label: 'General Inquiry', icon: HelpCircle },
    { value: 'payment', label: 'Payment Related', icon: FileText },
    { value: 'support', label: 'Technical Support', icon: Users },
    { value: 'prayer', label: 'Prayer Request', icon: Heart },
    { value: 'feedback', label: 'Feedback', icon: MessageSquare },
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-700' },
    { value: 'medium', label: 'Medium', color: 'bg-amber-100 text-amber-700' },
    { value: 'high', label: 'High', color: 'bg-red-100 text-red-700' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          sender: {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSuccess(true);
      setFormData({
        subject: '',
        category: 'general',
        priority: 'medium',
        message: '',
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#E51913]/10 to-[#3BBCEB]/10">
          <MessageSquare className="w-8 h-8 text-[#E51913]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#4A4C4E]">Send Message</h1>
          <p className="text-[#4A4C4E]/60 mt-1">Contact the ministry administration</p>
        </div>
      </div>

      <div className="card-premium p-6 md:p-8">
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Message sent successfully! The admin will respond shortly.
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-center gap-2"
          >
            <AlertCircle className="w-5 h-5" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">
              Subject <span className="text-[#E51913]">*</span>
            </label>
            <input
              type="text"
              required
              className="input-premium"
              placeholder="Enter message subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            />
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">
                Category
              </label>
              <select
                className="input-premium"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">
                Priority
              </label>
              <select
                className="input-premium"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                {priorities.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">
              Message <span className="text-[#E51913]">*</span>
            </label>
            <textarea
              required
              rows="6"
              className="input-premium"
              placeholder="Write your message here..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
            <p className="text-xs text-[#4A4C4E]/40 mt-1.5">
              {formData.message.length} characters
            </p>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="btn-gradient w-full justify-center text-base py-3.5 shadow-lg shadow-[#E51913]/25"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send Message
                <Send className="w-4 h-4" />
              </>
            )}
          </motion.button>

          <p className="text-xs text-[#4A4C4E]/40 text-center flex items-center justify-center gap-1">
            <Clock className="w-3 h-3" />
            Response time: 24-48 hours
          </p>
        </form>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-premium p-4 card-primary">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#E51913]/10">
              <Clock className="w-5 h-5 text-[#E51913]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#4A4C4E]">Response Time</p>
              <p className="text-xs text-[#4A4C4E]/60">24-48 hours</p>
            </div>
          </div>
        </div>
        <div className="card-premium p-4 card-secondary">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#3BBCEB]/10">
              <Mail className="w-5 h-5 text-[#3BBCEB]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#4A4C4E]">Email Copy</p>
              <p className="text-xs text-[#4A4C4E]/60">Sent to your email</p>
            </div>
          </div>
        </div>
        <div className="card-premium p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-50">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#4A4C4E]">Admin Response</p>
              <p className="text-xs text-[#4A4C4E]/60">Personal attention</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}