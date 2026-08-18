'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function DashboardStats({ stats }) {
  const getColor = (change) => {
    if (change > 0) return 'text-emerald-600';
    if (change < 0) return 'text-red-600';
    return 'text-[#4A4C4E]/60';
  };

  const getIcon = (change) => {
    if (change > 0) return <ArrowUpRight className="w-4 h-4" />;
    if (change < 0) return <ArrowDownRight className="w-4 h-4" />;
    return null;
  };

  // Alternate colors between primary and secondary
  const getCardVariant = (index) => {
    return index % 2 === 0 ? 'primary' : 'secondary';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const variant = getCardVariant(index);
        const iconColor = index % 2 === 0 ? 'text-[#E51913]' : 'text-[#3BBCEB]';
        const bgColor = index % 2 === 0 ? 'bg-[#FFE8E7]' : 'bg-[#E8F7FE]';
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`card-premium p-6 ${variant === 'primary' ? 'card-primary' : 'card-secondary'}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-[#4A4C4E]/60">{stat.label}</p>
                <p className="text-2xl font-bold text-[#4A4C4E] mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${bgColor} ${iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            {stat.change !== undefined && (
              <div className="mt-4 flex items-center gap-1.5 text-sm">
                {getIcon(stat.change)}
                <span className={getColor(stat.change)}>
                  {stat.change > 0 ? '+' : ''}{stat.change}%
                </span>
                <span className="text-[#4A4C4E]/40">vs last month</span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}