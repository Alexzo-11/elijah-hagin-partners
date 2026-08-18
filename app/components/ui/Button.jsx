'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-[#E51913] text-white hover:bg-[#C41712] shadow-lg shadow-[#E51913]/25 focus:ring-[#E51913]/50',
    secondary: 'bg-[#3BBCEB] text-white hover:bg-[#2A9FD4] shadow-lg shadow-[#3BBCEB]/25 focus:ring-[#3BBCEB]/50',
    outline: 'bg-transparent text-[#E51913] border-2 border-[#E51913] hover:bg-[#E51913] hover:text-white focus:ring-[#E51913]/30',
    outlineSecondary: 'bg-transparent text-[#3BBCEB] border-2 border-[#3BBCEB] hover:bg-[#3BBCEB] hover:text-white focus:ring-[#3BBCEB]/30',
    gradient: 'bg-gradient-to-r from-[#E51913] to-[#3BBCEB] text-white hover:opacity-90 focus:ring-[#E51913]/50 shadow-lg shadow-[#E51913]/25',
    ghost: 'bg-transparent text-[#4A4C4E]/60 hover:text-[#E51913] hover:bg-[#FFE8E7] focus:ring-[#E51913]/30',
    ghostSecondary: 'bg-transparent text-[#4A4C4E]/60 hover:text-[#3BBCEB] hover:bg-[#E8F7FE] focus:ring-[#3BBCEB]/30',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/20 focus:ring-red-600/50',
    success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 focus:ring-emerald-600/50',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
    xl: 'px-10 py-3.5 text-lg',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed hover:transform-none';

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${(disabled || loading) ? disabledStyles : ''}
        ${className}
      `}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {Icon && iconPosition === 'left' && !loading && <Icon className="w-4 h-4" />}
      {children}
      {Icon && iconPosition === 'right' && !loading && <Icon className="w-4 h-4" />}
    </motion.button>
  );
}