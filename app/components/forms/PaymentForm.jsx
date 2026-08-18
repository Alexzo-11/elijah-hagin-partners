'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { DollarSign, CreditCard, Send } from 'lucide-react';

const paymentSchema = z.object({
  amount: z.number().min(1, 'Amount must be at least $1'),
  purpose: z.string().min(1, 'Please select a purpose'),
  customPurpose: z.string().optional(),
}).refine((data) => {
  if (data.purpose === 'Other' && !data.customPurpose) {
    return false;
  }
  return true;
}, {
  message: 'Please specify the purpose',
  path: ['customPurpose'],
});

export function PaymentForm({ onSubmit, loading = false }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      purpose: 'Monthly Partnership',
    },
  });

  const purpose = watch('purpose');

  const purposes = [
    'Monthly Partnership',
    'Building Fund',
    'Missions',
    'Benevolence',
    'Other',
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[#0f172a] mb-1.5">Amount (USD)</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-[#1a1a2e]/40">$</span>
          <input
            type="number"
            step="0.01"
            min="1"
            className="input-premium pl-8 text-lg font-semibold"
            placeholder="0.00"
            {...register('amount', { valueAsNumber: true })}
          />
        </div>
        {errors.amount && (
          <p className="text-sm text-red-500 mt-1.5">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1a1a2e] mb-1.5">Purpose</label>
        <select
          className="input-premium"
          {...register('purpose')}
          onChange={(e) => setValue('purpose', e.target.value)}
        >
          {purposes.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        {errors.purpose && (
          <p className="text-sm text-red-500 mt-1.5">{errors.purpose.message}</p>
        )}
      </div>

      {purpose === 'Other' && (
        <Input
          label="Specify Purpose"
          placeholder="Enter purpose"
          error={errors.customPurpose?.message}
          {...register('customPurpose')}
        />
      )}

      <div className="bg-[#f8fafc] rounded-xl p-4">
        <div className="flex items-center gap-3 text-sm text-[#1a1a2e]/60">
          <CreditCard className="w-5 h-5" />
          <span>Secure payment via Paystack. We accept all major cards.</span>
        </div>
      </div>

      <Button
        type="submit"
        loading={loading}
        icon={Send}
        iconPosition="right"
        className="w-full justify-center text-base py-3.5"
      >
        Proceed to Payment
      </Button>
    </form>
  );
}