'use client';

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card } from '../ui/Card';
import { motion } from 'framer-motion';

const COLORS = ['#1a1a2e', '#2d2d4a', '#4a4a6a', '#6a6a8a', '#8a8aaa'];

export function PaymentCategories({ data, title = 'Payment Categories' }) {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-xl p-4 shadow-xl border border-white/30">
          <p className="text-sm font-medium text-[#0f172a]">{payload[0].name}</p>
          <p className="text-lg font-bold text-[#1a1a2e]">
            {payload[0].value}%
          </p>
          <p className="text-xs text-[#1a1a2e]/40">of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card padding="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#0f172a]">{title}</h3>
          <p className="text-sm text-[#1a1a2e]/60">Distribution by category</p>
        </div>
        <div style={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={{ stroke: '#94a3b8' }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
}