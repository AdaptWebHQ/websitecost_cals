'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { user, isLoading, initializeAuth } = useAuthStore();

  // Listen to Firebase client auth change
  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        if (user.role === 'admin' || user.role === 'super_admin') {
          router.replace('/dashboard/admin');
        } else {
          router.replace('/dashboard/public');
        }
      } else {
        router.replace('/login');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-400 font-sans">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm font-medium tracking-wide">Syncing session...</p>
      </div>
    </div>
  );
}
