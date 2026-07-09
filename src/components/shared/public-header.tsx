'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/shared/theme-toggle';
import { Calculator, ArrowRight } from 'lucide-react';

export default function PublicHeader() {
  const pathname = usePathname();
  const { user, isLoading } = useAuth();

  const dashboardUrl = user 
    ? (user.role === 'admin' || user.role === 'super_admin' ? '/admin' : '/public')
    : '/login';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-900/60 bg-white/85 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Branding Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <span>WebCost<span className="text-indigo-600 dark:text-indigo-400 font-medium">Pro</span></span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-500 dark:text-slate-400">
          <Link 
            href="/about" 
            className={`hover:text-slate-900 dark:hover:text-white transition-colors ${pathname === '/about' ? 'text-indigo-600 dark:text-indigo-400' : ''}`}
          >
            About
          </Link>
          <Link 
            href="/faq" 
            className={`hover:text-slate-900 dark:hover:text-white transition-colors ${pathname === '/faq' ? 'text-indigo-600 dark:text-indigo-400' : ''}`}
          >
            FAQ
          </Link>
          <Link 
            href="/privacy" 
            className={`hover:text-slate-900 dark:hover:text-white transition-colors ${pathname === '/privacy' ? 'text-indigo-600 dark:text-indigo-400' : ''}`}
          >
            Privacy
          </Link>
          <Link 
            href="/terms" 
            className={`hover:text-slate-900 dark:hover:text-white transition-colors ${pathname === '/terms' ? 'text-indigo-600 dark:text-indigo-400' : ''}`}
          >
            Terms
          </Link>
        </nav>

        {/* Theme Toggle & Auth Buttons */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {/* We check isLoading to avoid flashing layout shifts on load */}
          {!isLoading && (
            <>
              {user ? (
                <Link href={dashboardUrl}>
                  <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-10 px-5 gap-2 text-sm font-semibold shadow-lg shadow-indigo-600/15">
                    Enter Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" className="text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white text-xs font-semibold">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" className="hidden sm:inline-block">
                    <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-9 px-4 text-xs font-semibold shadow-lg shadow-indigo-600/15">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Skeleton placeholder while auth state initializes */}
          {isLoading && (
            <div className="w-28 h-9 bg-slate-200 dark:bg-slate-900 animate-pulse rounded-xl" />
          )}
        </div>
      </div>
    </header>
  );
}
