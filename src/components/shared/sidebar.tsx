'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useSidebarStore } from '@/store/sidebar-store';
import { 
  LayoutGrid, 
  MessageSquare, 
  Coins, 
  Settings, 
  BarChart3, 
  HelpCircle, 
  LogOut, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Calculator,
  FolderTree,
  User,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isOpen, setIsOpen } = useSidebarStore();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setIsCollapsed(false);
      } else if (window.innerWidth >= 768) {
        setIsCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const role = user?.role || 'public';
  const isAdmin = role === 'admin' || role === 'super_admin';

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          'h-full flex flex-col transition-all duration-300 ease-in-out text-sidebar-foreground bg-sidebar border-r border-sidebar-border',
          // Desktop & Mobile display states
          isOpen ? 'flex' : 'hidden md:flex',
          // Desktop sizing
          'relative z-20 flex-shrink-0',
          isCollapsed ? 'md:w-[72px]' : 'md:w-64',
          // Mobile absolute positioning
          'fixed md:relative inset-y-0 left-0 z-50 transform md:transform-none w-64 md:w-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          className
        )}
      >
        {/* Collapse/Expand Handle (Only shown on Desktop) */}
        <button
          onClick={() => setIsCollapsed((p) => !p)}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden md:flex absolute -right-3 top-[72px] z-30 w-6 h-6 rounded-full bg-sidebar border border-sidebar-border shadow-sm items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer"
        >
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Brand Header */}
        <div className="h-20 flex flex-col justify-center px-6 border-b border-[#E2E8F0] dark:border-border flex-shrink-0">
          {(!isCollapsed || isOpen) ? (
            <div className="space-y-0.5">
              <span className="font-extrabold tracking-tight text-foreground text-sm block">
                AdaptWeb Console
              </span>
              <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest block">
                Executive Suite
              </span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-extrabold text-xs mx-auto">
              AW
            </div>
          )}
        </div>

      {/* Navigation Links */}
      <div 
        onClick={() => setIsOpen(false)} 
        className="flex-1 py-6 px-3 flex flex-col justify-between overflow-y-auto scrollbar-none"
      >
        <div className="space-y-6">
          {/* Main Links */}
          <nav className="space-y-1.5">
            {isAdmin ? (
              <>
                {/* Admin Menu */}
                <Link
                  href="/dashboard"
                  className={cn(
                    'group relative flex items-center gap-3 rounded-xl text-xs font-bold transition-all duration-200 px-3.5 py-3',
                    pathname === '/dashboard'
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <LayoutGrid className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>Overview</span>}
                </Link>

                <Link
                  href="/admin/inquiries"
                  className={cn(
                    'group relative flex items-center gap-3 rounded-xl text-xs font-bold transition-all duration-200 px-3.5 py-3',
                    pathname.startsWith('/admin/inquiries')
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>Inquiries</span>}
                </Link>

                <Link
                  href="/admin/packages"
                  className={cn(
                    'group relative flex items-center gap-3 rounded-xl text-xs font-bold transition-all duration-200 px-3.5 py-3',
                    pathname.startsWith('/admin/packages')
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Coins className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>Pricing Rules</span>}
                </Link>

                <Link
                  href="/admin/features"
                  className={cn(
                    'group relative flex items-center gap-3 rounded-xl text-xs font-bold transition-all duration-200 px-3.5 py-3',
                    pathname.startsWith('/admin/features')
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <FolderTree className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>Features</span>}
                </Link>

                <Link
                  href="/admin/price-config"
                  className={cn(
                    'group relative flex items-center gap-3 rounded-xl text-xs font-bold transition-all duration-200 px-3.5 py-3',
                    pathname.startsWith('/admin/price-config')
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Settings className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>Project Metadata</span>}
                </Link>

                <Link
                  href="/admin/industries"
                  className={cn(
                    'group relative flex items-center gap-3 rounded-xl text-xs font-bold transition-all duration-200 px-3.5 py-3',
                    pathname.startsWith('/admin/industries')
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Building2 className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>Industries</span>}
                </Link>

                <Link
                  href="/admin/calculations"
                  className={cn(
                    'group relative flex items-center gap-3 rounded-xl text-xs font-bold transition-all duration-200 px-3.5 py-3',
                    pathname.startsWith('/admin/calculations')
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Calculator className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>Calculations</span>}
                </Link>

              </>
            ) : (
              <>
                {/* Public Menu */}
                <Link
                  href="/dashboard"
                  className={cn(
                    'group relative flex items-center gap-3 rounded-xl text-xs font-bold transition-all duration-200 px-3.5 py-3',
                    pathname === '/dashboard'
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <LayoutGrid className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>Dashboard</span>}
                </Link>

                <Link
                  href="/public/calculator"
                  className={cn(
                    'group relative flex items-center gap-3 rounded-xl text-xs font-bold transition-all duration-200 px-3.5 py-3',
                    pathname === '/public/calculator'
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>Calculator</span>}
                </Link>

                <Link
                  href="/public/estimates"
                  className={cn(
                    'group relative flex items-center gap-3 rounded-xl text-xs font-bold transition-all duration-200 px-3.5 py-3',
                    pathname.startsWith('/public/estimates')
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <BarChart3 className="w-4 h-4 shrink-0" />
                  {!isCollapsed && <span>My Estimates</span>}
                </Link>
              </>
            )}
          </nav>

          {/* "+ New Inquiry" Action Button (Admin only) */}
          {isAdmin && (
            <div className="pt-2">
              {!isCollapsed ? (
                <Link
                  href="/admin/inquiries?new=true"
                  className="w-full h-11 bg-primary text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-primary/95 transition-all shadow-md shadow-primary/10 text-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  New Inquiry
                </Link>
              ) : (
                <Link
                  href="/admin/inquiries?new=true"
                  title="New Inquiry"
                  className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/95 transition-all shadow-md mx-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Bottom Utility items */}
        <div className="space-y-1.5 pt-6 border-t border-sidebar-border">
          <Link
            href="/faq"
            className="group flex items-center gap-3 rounded-xl text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground px-3.5 py-3 transition-all"
          >
            <HelpCircle className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Help Center</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full group flex items-center gap-3 rounded-xl text-xs font-bold text-muted-foreground hover:bg-destructive/10 hover:text-destructive px-3.5 py-3 transition-all cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
      </aside>
    </>
  );
}
