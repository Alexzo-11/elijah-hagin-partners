'use client';

import { useState } from 'react';
import { useAuth } from '@/app/components/providers/AuthProvider';
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  Loader2,
} from 'lucide-react';

export default function AdminSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSuccess(true);
    setLoading(false);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#4A4C4E]">Settings</h1>
        <p className="text-[#4A4C4E]/60 mt-1">Manage your admin preferences</p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
          <Save className="w-4 h-4" />
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Information */}
        <div className="card-premium p-6">
          <h2 className="text-lg font-semibold text-[#4A4C4E] mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-[#E51913]" />
            Profile Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">First Name</label>
              <input
                type="text"
                className="input-premium"
                defaultValue={user?.firstName || ''}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">Last Name</label>
              <input
                type="text"
                className="input-premium"
                defaultValue={user?.lastName || ''}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A4C4E]/30" />
                <input
                  type="email"
                  className="input-premium pl-10"
                  defaultValue={user?.email || ''}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#4A4C4E]/30" />
                <input
                  type="tel"
                  className="input-premium pl-10"
                  defaultValue="+1 234 567 890"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="card-premium p-6">
          <h2 className="text-lg font-semibold text-[#4A4C4E] mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#8A8C8E]" />
            Change Password
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">Current Password</label>
              <input
                type="password"
                className="input-premium"
                placeholder="Enter current password"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">New Password</label>
                <input
                  type="password"
                  className="input-premium"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#4A4C4E] mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  className="input-premium"
                  placeholder="Confirm password"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary text-base py-3 px-8"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Save Changes
                <Save className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}