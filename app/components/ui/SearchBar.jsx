'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function SearchBar({ 
  onSearch, 
  placeholder = 'Search...', 
  suggestions = [],
  className = '',
  onSelect
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
    setIsOpen(value.length > 0);
  };

  const handleClear = () => {
    setQuery('');
    onSearch?.('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleSelect = (item) => {
    onSelect?.(item);
    setIsOpen(false);
    setQuery('');
  };

  const filteredSuggestions = suggestions.filter(item =>
    item.label?.toLowerCase().includes(query.toLowerCase()) ||
    item.value?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1a2e]/30" />
        <input
          ref={inputRef}
          type="text"
          className="w-full input-premium pl-10 pr-10"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          onFocus={() => query.length > 0 && setIsOpen(true)}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-[#f8fafc] rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-[#1a1a2e]/30" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && query && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-[#e2e8f0] overflow-hidden z-50"
          >
            {filteredSuggestions.length === 0 ? (
              <div className="p-6 text-center text-[#1a1a2e]/40">
                <p className="text-sm">No results found</p>
              </div>
            ) : (
              <div className="py-2">
                {filteredSuggestions.slice(0, 8).map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelect(item)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#f8fafc] transition-colors text-left"
                  >
                    {item.icon && <item.icon className="w-4 h-4 text-[#1a1a2e]/30" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0f172a]">{item.label}</p>
                      {item.subtitle && (
                        <p className="text-xs text-[#1a1a2e]/40">{item.subtitle}</p>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#1a1a2e]/20" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}