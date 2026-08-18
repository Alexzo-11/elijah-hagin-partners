'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Save, User, Mail, Phone, MapPin, Lock, Bell } from 'lucide-react';

const settingsSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, 'Password must be at least 6 characters').optional(),
  confirmPassword: z.string().optional(),
  emailNotifications: z.boolean().optional(),
  ministryUpdates: z.boolean().optional(),
  prayerRequests: z.boolean().optional(),
}).refine((data) => {
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: 'Current password is required to change password',
  path: ['currentPassword'],
}).refine((data) => {
  if (data.newPassword && data.newPassword !== data.confirmPassword) {
    return false;
  }
  return true;
}, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export function SettingsForm({ defaultValues, onSubmit, loading = false }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: defaultValues || {
      emailNotifications: true,
      ministryUpdates: true,
      prayerRequests: false,
    },
  });

  const newPassword = watch('newPassword');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Profile Information */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[#0f172a] flex items-center gap-2">
          <User className="w-5 h-5 text-[#1a1a2e]/40" />
          Profile Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            placeholder="John"
            error={errors.firstName?.message}
            {...register('firstName')}
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            icon={Mail}
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1 234 567 890"
            icon={Phone}
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>
      </div>

      {/* Address */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[#0f172a] flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#1a1a2e]/40" />
          Address
        </h2>
        <Input
          label="Street Address"
          placeholder="123 Main St"
          error={errors.address?.message}
          {...register('address')}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="City"
            placeholder="New York"
            error={errors.city?.message}
            {...register('city')}
          />
          <Input
            label="State/Province"
            placeholder="NY"
            error={errors.state?.message}
            {...register('state')}
          />
          <Input
            label="Country"
            placeholder="USA"
            error={errors.country?.message}
            {...register('country')}
          />
        </div>
      </div>

      {/* Change Password */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[#0f172a] flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#1a1a2e]/40" />
          Change Password
        </h2>
        <Input
          label="Current Password"
          type="password"
          placeholder="Enter current password"
          error={errors.currentPassword?.message}
          {...register('currentPassword')}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />
          <Input
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-[#0f172a] flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#1a1a2e]/40" />
          Notification Preferences
        </h2>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-[#1a1a2e]/20"
              {...register('emailNotifications')}
            />
            <span className="text-sm text-[#0f172a]">Email notifications for payments</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-[#1a1a2e]/20"
              {...register('ministryUpdates')}
            />
            <span className="text-sm text-[#0f172a]">Ministry updates and newsletters</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="rounded border-[#1a1a2e]/20"
              {...register('prayerRequests')}
            />
            <span className="text-sm text-[#0f172a]">Prayer requests and urgent needs</span>
          </label>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          type="submit"
          loading={loading}
          icon={Save}
          className="text-base py-3 px-8"
        >
          Save Changes
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="text-[#1a1a2e]/60 hover:text-[#1a1a2e]"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}