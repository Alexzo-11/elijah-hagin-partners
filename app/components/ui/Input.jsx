'use client';

import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  className = '',
  type = 'text',
  required = false,
  helper,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-sm font-medium text-[#0f172a]">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1a2e]/30" />
        )}
        <input
          ref={ref}
          type={isPassword && showPassword ? 'text' : type}
          className={`
            w-full px-4 py-2.5 rounded-xl border-2 transition-all duration-200
            bg-white text-[#0f172a] placeholder:text-[#1a1a2e]/30
            focus:outline-none focus:ring-4 focus:ring-[#1a1a2e]/10
            ${Icon ? 'pl-10' : ''}
            ${isPassword ? 'pr-10' : ''}
            ${error ? 'border-red-500 focus:border-red-500' : 'border-[#e2e8f0] focus:border-[#1a1a2e]'}
            ${className}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1a1a2e]/30 hover:text-[#1a1a2e]/60 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-sm text-red-500"
          >
            {error}
          </motion.p>
        )}
        {helper && !error && (
          <p className="text-sm text-[#1a1a2e]/40">{helper}</p>
        )}
      </AnimatePresence>
    </div>
  );
});

Input.displayName = 'Input';