'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Phone, Send, Clock, CheckCircle } from 'lucide-react';

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Admin WhatsApp number (replace with actual number)
  const phoneNumber = '2348106509069'; // Nigeria number without +
  const message = 'Hello, I would like to inquire about my partnership with Exousia Fellowship.';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const handleQuickReply = (e, replyMessage) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(replyMessage)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const quickReplies = [
    { label: '💳 Payment Inquiry', message: 'I have a question about my payment.' },
    { label: '📊 Partnership Status', message: 'I want to check my partnership status.' },
    { label: '📄 Receipt Request', message: 'I need a copy of my receipt.' },
    { label: '🙏 General Support', message: 'I need general support.' },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 w-72 bg-white rounded-2xl shadow-2xl border border-[#E5E6E7] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#25D366] p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Chat with Admin</h4>
                  <p className="text-xs text-white/80">Usually replies within minutes</p>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="ml-auto text-white/80 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Replies */}
            <div className="p-4 space-y-2">
              <p className="text-xs text-[#4A4C4E]/60 mb-2">Quick messages:</p>
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={(e) => handleQuickReply(e, reply.message)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#F5F6F7] transition text-sm text-[#4A4C4E] border border-[#E5E6E7] flex items-center gap-2"
                >
                  <span className="text-base">{reply.label.split(' ')[0]}</span>
                  <span>{reply.label.split(' ').slice(1).join(' ')}</span>
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-[#F5F6F7] border-t border-[#E5E6E7] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#4A4C4E]/60">
                <Clock className="w-3 h-3" />
                <span>Available 24/7</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#4A4C4E]/60">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                <span>Secure</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <button
        onClick={handleToggle}
        className={`relative w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen ? 'bg-[#4A4C4E] hover:bg-[#3A3A3A]' : 'bg-[#25D366] hover:scale-110 hover:shadow-xl'
        }`}
        aria-label="WhatsApp Chat"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageCircle className="w-7 h-7 text-white" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
          </>
        )}
      </button>

      {/* Pulse animation */}
      {!isOpen && isVisible && (
        <>
          <div className="absolute inset-0 rounded-full bg-[#25D366]/30 animate-ping" style={{ animationDuration: '2s' }}></div>
          <div className="absolute inset-0 rounded-full bg-[#25D366]/20 animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
        </>
      )}
    </div>
  );
}