'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { TooltipProvider } from '@/components/ui/tooltip';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initializeAuth, isLoading } = useAuthStore();

  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, [initializeAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-400 font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-sm font-medium tracking-wide">Initializing session...</p>
        </div>
      </div>
    );
  }

  return <TooltipProvider>{children}</TooltipProvider>;
}
