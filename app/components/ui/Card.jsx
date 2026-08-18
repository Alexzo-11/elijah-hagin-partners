'use client';

import { motion } from 'framer-motion';

export function Card({
  children,
  className = '',
  hover = false,
  padding = 'p-6',
  variant = 'default',
  ...props
}) {
  const variants = {
    default: 'card-premium',
    primary: 'card-premium card-primary',
    secondary: 'card-premium card-secondary',
    glass: 'glass',
  };

  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      className={`
        ${variants[variant]}
        ${padding}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-semibold text-[#4A4C4E] ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-[#4A4C4E]/60 ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`flex items-center pt-4 ${className}`}>
      {children}
    </div>
  );
}