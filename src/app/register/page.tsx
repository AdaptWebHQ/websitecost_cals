'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { UserPlus, Sparkles } from 'lucide-react';

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loginWithGoogle, isLoading, error, setError } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  // Clear errors on load
  useEffect(() => {
    setError(null);
  }, [setError]);

  // Handle redirect if user is already authenticated
  useEffect(() => {
    if (user) {
      const redirect = searchParams.get('redirect') || '/dashboard';
      router.push(redirect);
    }
  }, [user, router, searchParams]);

  const handleGoogleSignUp = async () => {
    setAuthError(null);
    const res = await loginWithGoogle(true);
    if (!res.success) {
      setAuthError(res.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-950 overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-violet-500/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[120px]" />
      <div className="absolute top-[30%] right-[40%] w-[30%] h-[30%] rounded-full bg-cyan-500/5 blur-[100px]" />

      {/* Glassmorphic Container */}
      <div className="relative z-10 w-full max-w-md mx-4 p-8 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-slate-700/50">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20 mb-4 group overflow-hidden">
            <UserPlus className="w-7 h-7 text-white relative z-10 transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2 flex items-center gap-2">
            Create Public Account
            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
          </h1>
          <p className="text-sm text-slate-400">
            Sign up to save estimates & request quotes
          </p>
        </div>

        {/* Error Alerts */}
        {authError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            <span className="font-semibold">Error:</span> {authError}
          </div>
        )}

        {error && !authError && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}

        {/* Interactive Features */}
        <div className="space-y-6">
          <Button
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="w-full h-12 flex items-center justify-center gap-3 rounded-xl text-white font-medium bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 border-none transition-all duration-300 active:scale-[0.98] shadow-md shadow-violet-600/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.113-5.136 4.113-3.41 0-6.19-2.775-6.19-6.19 0-3.41 2.78-6.19 6.19-6.19 1.637 0 3.125.64 4.238 1.685l3.074-3.075C19.395 2.213 16.035 1 12.24 1 5.922 1 12.016 1 18.11 5.922 23 12.24 23c6.07 0 11.285-4.364 11.285-11 0-.697-.089-1.36-.2-1.714H12.24z" />
                </svg>
                <span>Sign Up with Google</span>
              </>
            )}
          </Button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          <div className="text-center">
            <p className="text-xs text-slate-400">
              Already have an account?{' '}
              <a
                href="/login"
                className="text-violet-400 hover:text-violet-300 font-medium underline underline-offset-4 transition-colors"
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>

        {/* Footer / Info terms */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 text-center text-[10px] text-slate-500 leading-relaxed">
          By signing up, you agree to our{' '}
          <a href="/terms" className="underline hover:text-slate-400">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="underline hover:text-slate-400">
            Privacy Policy
          </a>.
        </div>

      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-400 font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-sm font-medium tracking-wide">Loading registration...</p>
        </div>
      </div>
    }>
      <RegisterFormContent />
    </Suspense>
  );
}
