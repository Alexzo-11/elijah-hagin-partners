'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/components/providers/AuthProvider';
import {
  Inbox,
  Mail,
  MailOpen,
  CheckCheck,
  Reply,
  Trash2,
  Clock,
  AlertCircle,
  Loader2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageSquare,
  Heart,
  Users,
  FileText,
  HelpCircle,
  User,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminMessages() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
        if (data.messages?.length > 0) {
          setSelectedMessage(data.messages[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      const res = await fetch(`/api/messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' }),
      });
      if (res.ok) {
        setMessages(messages.map(m => 
          m.id === messageId ? { ...m, status: 'read' } : m
        ));
        if (selectedMessage?.id === messageId) {
          setSelectedMessage({ ...selectedMessage, status: 'read' });
        }
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleReply = async (messageId) => {
    if (!replyText.trim()) return;
    setReplying(true);
    setReplySuccess(false);
    try {
      const res = await fetch(`/api/messages/${messageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'replied',
          reply: { message: replyText, sentAt: new Date().toISOString() }
        }),
      });
      if (res.ok) {
        setMessages(messages.map(m => 
          m.id === messageId ? { ...m, status: 'replied', reply: { message: replyText, sentAt: new Date().toISOString() } } : m
        ));
        setSelectedMessage({ 
          ...selectedMessage, 
          status: 'replied', 
          reply: { message: replyText, sentAt: new Date().toISOString() } 
        });
        setReplyText('');
        setReplySuccess(true);
        setTimeout(() => setReplySuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error replying:', error);
      alert('Failed to send reply. Please try again.');
    } finally {
      setReplying(false);
    }
  };

  const filteredMessages = messages.filter(m =>
    m.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.sender?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.sender?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMessages = filteredMessages.slice(startIndex, endIndex);

  const getCategoryIcon = (category) => {
    const icons = {
      general: HelpCircle,
      payment: FileText,
      support: Users,
      prayer: Heart,
      feedback: MessageSquare,
    };
    return icons[category] || HelpCircle;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-700',
      medium: 'bg-amber-100 text-amber-700',
      high: 'bg-red-100 text-red-700',
    };
    return colors[priority] || 'bg-gray-100 text-gray-700';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'unread': return <Mail className="w-4 h-4 text-[#E51913]" />;
      case 'read': return <MailOpen className="w-4 h-4 text-[#3BBCEB]" />;
      case 'replied': return <CheckCheck className="w-4 h-4 text-emerald-500" />;
      default: return <Mail className="w-4 h-4 text-[#4A4C4E]/40" />;
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-8 w-48 rounded"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 skeleton h-96 rounded-xl"></div>
          <div className="lg:col-span-2 skeleton h-96 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const unreadCount = messages.filter(m => m.status === 'unread').length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-[#E51913]/10 to-[#3BBCEB]/10">
            <Inbox className="w-8 h-8 text-[#E51913]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#4A4C4E]">Messages</h1>
            <p className="text-[#4A4C4E]/60 mt-1">Manage partner messages</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <span className="badge-premium bg-[#E51913] text-white">
              {unreadCount} unread
            </span>
          )}
          <button 
            onClick={() => {
              // Mark all as read
              messages.filter(m => m.status === 'unread').forEach(m => {
                handleMarkAsRead(m.id);
              });
            }}
            className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All Read
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A4C4E]/30" />
        <input
          type="text"
          className="input-premium pl-10"
          placeholder="Search messages..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Messages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-2">
          {currentMessages.length === 0 ? (
            <div className="card-premium p-8 text-center">
              <Inbox className="w-12 h-12 text-[#4A4C4E]/20 mx-auto mb-3" />
              <p className="text-[#4A4C4E]/60">No messages</p>
            </div>
          ) : (
            currentMessages.map((message) => {
              const CategoryIcon = getCategoryIcon(message.category);
              const isSelected = selectedMessage?.id === message.id;
              return (
                <motion.button
                  key={message.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => {
                    setSelectedMessage(message);
                    if (message.status === 'unread') {
                      handleMarkAsRead(message.id);
                    }
                  }}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#E51913]/10 to-[#3BBCEB]/10 border-2 border-[#E51913]/30'
                      : 'card-premium hover:border-[#E51913]/30'
                  } ${message.status === 'unread' ? 'border-l-4 border-l-[#E51913]' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#4A4C4E] truncate flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#E51913]/10 flex items-center justify-center text-[#E51913] text-xs font-bold">
                          {message.sender?.name?.[0] || 'P'}
                        </span>
                        {message.sender?.name || 'Unknown'}
                      </p>
                      <p className="text-sm text-[#4A4C4E]/60 truncate">{message.subject}</p>
                    </div>
                    {getStatusIcon(message.status)}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`badge-premium ${getPriorityColor(message.priority)}`}>
                      {message.priority}
                    </span>
                    <span className="text-xs text-[#4A4C4E]/40">
                      {new Date(message.createdAt).toLocaleDateString()}
                    </span>
                    <CategoryIcon className="w-3 h-3 text-[#4A4C4E]/30 ml-auto" />
                  </div>
                </motion.button>
              );
            })
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-[#F5F6F7] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5 text-[#4A4C4E]/60" />
              </button>
              <span className="text-sm text-[#4A4C4E]/60">{currentPage} / {totalPages}</span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-[#F5F6F7] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5 text-[#4A4C4E]/60" />
              </button>
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="card-premium p-6 space-y-6">
              {/* Message Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#E51913]/10 flex items-center justify-center text-[#E51913] font-bold">
                      {selectedMessage.sender?.name?.[0] || 'P'}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#4A4C4E]">{selectedMessage.subject}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-[#4A4C4E]/60">
                          From: {selectedMessage.sender?.name} ({selectedMessage.sender?.email})
                        </span>
                        <span className="text-xs text-[#4A4C4E]/40">
                          {new Date(selectedMessage.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge-premium ${getPriorityColor(selectedMessage.priority)}`}>
                    {selectedMessage.priority}
                  </span>
                  <span className={`badge-premium ${selectedMessage.status === 'unread' ? 'bg-[#E51913] text-white' : 'bg-gray-100 text-gray-700'}`}>
                    {getStatusText(selectedMessage.status)}
                  </span>
                </div>
              </div>

              {/* Message Body */}
              <div className="bg-[#F5F6F7] rounded-xl p-4">
                <p className="text-[#4A4C4E]/80 whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>

              {/* Category */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#4A4C4E]/60">Category:</span>
                <span className="badge-premium bg-blue-50 text-blue-700">
                  {selectedMessage.category}
                </span>
              </div>

              {/* Reply Section */}
              <div className="border-t border-[#E5E6E7] pt-4">
                {replySuccess && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Reply sent successfully!
                  </div>
                )}
                {selectedMessage.reply ? (
                  <div className="bg-emerald-50 rounded-xl p-4">
                    <p className="text-sm font-medium text-emerald-700 flex items-center gap-2">
                      <CheckCheck className="w-4 h-4" />
                      Reply Sent
                    </p>
                    <p className="text-sm text-[#4A4C4E]/80 mt-2">{selectedMessage.reply.message}</p>
                    <p className="text-xs text-[#4A4C4E]/40 mt-1">
                      {new Date(selectedMessage.reply.sentAt).toLocaleString()}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-[#4A4C4E]">
                      Reply to {selectedMessage.sender?.name}
                    </label>
                    <textarea
                      rows="3"
                      className="input-premium"
                      placeholder="Write your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <button
                      onClick={() => handleReply(selectedMessage.id)}
                      disabled={replying || !replyText.trim()}
                      className="btn-primary text-sm py-2 px-6 flex items-center gap-2"
                    >
                      {replying ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Reply className="w-4 h-4" />
                      )}
                      Send Reply
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card-premium p-12 text-center">
              <Inbox className="w-16 h-16 text-[#4A4C4E]/20 mx-auto mb-4" />
              <p className="text-[#4A4C4E]/60">Select a message to view</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}