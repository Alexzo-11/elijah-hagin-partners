'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/providers/AuthProvider';
import { PartnerSidebar } from '@/app/components/ui/PartnerSidebar';
import { Loader2 } from 'lucide-react';

export default function PartnerLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (user.role === 'admin') {
        // Admins can also access partner pages
        // router.push('/admin');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[#E51913]" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#F5F6F7]">
      <PartnerSidebar />
      <main className="flex-1 ml-0 lg:ml-[280px] p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}