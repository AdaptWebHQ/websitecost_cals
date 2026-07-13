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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Branding Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-foreground">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-md shadow-primary/10">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <span>WebCost<span className="text-primary font-semibold">Pro</span></span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-muted-foreground">
          <Link 
            href="/about" 
            className={`hover:text-foreground transition-colors ${pathname === '/about' ? 'text-primary' : ''}`}
          >
            About
          </Link>
          <Link 
            href="/faq" 
            className={`hover:text-foreground transition-colors ${pathname === '/faq' ? 'text-primary' : ''}`}
          >
            FAQ
          </Link>
          <Link 
            href="/privacy" 
            className={`hover:text-foreground transition-colors ${pathname === '/privacy' ? 'text-primary' : ''}`}
          >
            Privacy
          </Link>
          <Link 
            href="/terms" 
            className={`hover:text-foreground transition-colors ${pathname === '/terms' ? 'text-primary' : ''}`}
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
                  <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-5 gap-2 text-sm font-semibold shadow-md shadow-primary/10">
                    Enter Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground text-xs font-semibold">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" className="hidden sm:inline-block">
                    <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl h-9 px-4 text-xs font-semibold shadow-md shadow-primary/10">
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Skeleton placeholder while auth state initializes */}
          {isLoading && (
            <div className="w-24 h-9 bg-muted animate-pulse rounded-xl" />
          )}
        </div>
      </div>
    </header>
  );
}
