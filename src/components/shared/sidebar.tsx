'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { ADMIN_NAV_ITEMS, PUBLIC_NAV_ITEMS } from '@/constants';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const role = user?.role || 'public';
  const navItems = role === 'admin' || role === 'super_admin' ? ADMIN_NAV_ITEMS : PUBLIC_NAV_ITEMS;

  return (
    <aside
      className={cn(
        'relative h-full flex flex-col transition-all duration-300 ease-in-out z-20 flex-shrink-0',
        'bg-slate-900/95 border-r border-slate-800/80 backdrop-blur-xl',
        isCollapsed ? 'w-[72px]' : 'w-64',
        className
      )}
    >
      {/* Collapse/Expand Handle — anchored to right edge of sidebar */}
      <button
        onClick={() => setIsCollapsed((p) => !p)}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3 top-[72px] z-30 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 shadow-md flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all duration-200"
      >
        {isCollapsed ? (
          <Icons.ChevronRight className="w-3 h-3" />
        ) : (
          <Icons.ChevronLeft className="w-3 h-3" />
        )}
      </button>

      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-slate-800/80 flex-shrink-0">
        <Link href="/dashboard" className={cn('flex items-center gap-3 overflow-hidden min-w-0', isCollapsed && 'justify-center w-full')}>
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20 flex-shrink-0">
            <Icons.Shield className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <span className="font-bold tracking-tight text-white text-base truncate">
              WebCost <span className="text-indigo-400">Pro</span>
            </span>
          )}
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-none">
        {navItems.map((item) => {
          const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[item.icon] || Icons.HelpCircle;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                'group relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200',
                isCollapsed ? 'px-0 py-0 justify-center h-11 w-full' : 'px-3.5 py-2.5',
                isActive
                  ? 'bg-indigo-600/15 text-indigo-300'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              )}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-indigo-500 rounded-r-full" />
              )}
              <Icon
                className={cn(
                  'flex-shrink-0 transition-all duration-200',
                  isCollapsed ? 'w-5 h-5' : 'w-4.5 h-4.5',
                  isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                )}
              />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Divider */}
      <div className="border-t border-slate-800/60" />

      {/* Footer User Card */}
      {user && (
        <div className={cn('p-3 flex-shrink-0', isCollapsed ? 'flex justify-center' : '')}>
          {isCollapsed ? (
            <div className="w-9 h-9 rounded-full bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
          ) : (
            <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-800/40 transition-colors cursor-default">
              {user.profilePicture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-9 h-9 rounded-full border border-slate-700 object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm flex-shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-200 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate capitalize">
                  {user.role.replace('_', ' ')}
                </p>
              </div>
              <Icons.MoreVertical className="w-4 h-4 text-slate-600 flex-shrink-0" />
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
