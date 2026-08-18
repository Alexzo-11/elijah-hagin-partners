'use client';

import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card } from '../ui/Card';
import { motion } from 'framer-motion';

export function RevenueChart({ data, title = 'Revenue Overview', height = 300 }) {
  const [hovered, setHovered] = useState(null);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-xl p-4 shadow-xl border border-white/30">
          <p className="text-sm font-medium text-[#0f172a]">{label}</p>
          <p className="text-lg font-bold text-[#1a1a2e]">
            ${payload[0].value.toLocaleString()}
          </p>
          <p className="text-xs text-[#1a1a2e]/40">Revenue</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card padding="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[#0f172a]">{title}</h3>
            <p className="text-sm text-[#1a1a2e]/60">Monthly revenue trend</p>
          </div>
          <select className="text-sm border border-[#e2e8f0] rounded-lg px-3 py-1.5 bg-white">
            <option>Last 12 Months</option>
            <option>Last 6 Months</option>
            <option>Last 3 Months</option>
          </select>
        </div>

        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              onMouseLeave={() => setHovered(null)}
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a1a2e" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#1a1a2e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#1a1a2e"
                strokeWidth={2}
                fill="url(#revenueGradient)"
                onMouseEnter={() => setHovered('revenue')}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
}