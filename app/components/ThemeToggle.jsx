'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  // This is now just a visual toggle without dark mode functionality
  // It can be removed or kept for future use
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative">
      <button
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative w-9 h-9 rounded-full bg-[#F5F6F7] hover:bg-[#E5E6E7] transition-colors flex items-center justify-center"
        aria-label="Theme toggle (coming soon)"
      >
        <Sun className="w-5 h-5 text-[#4A4C4E]" />
      </button>
    </div>
  );
}