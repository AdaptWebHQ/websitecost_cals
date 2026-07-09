'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Bell, LogOut, Search, User, Settings, ShieldAlert, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { capitalize } from '@/lib/utils';
import { useTitleStore } from '@/store/title-store';
import { useTheme } from '@/context/theme-context';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { title } = useTitleStore();
  const { theme, toggleTheme } = useTheme();

  // Derive title from URL pathname
  const segments = pathname.split('/').filter(Boolean);
  const rawTitle = segments.length > 2 ? segments[segments.length - 1] : segments[segments.length - 1] || 'Dashboard';
  const pageTitle = capitalize(rawTitle.replace('-', ' '));

  const displayTitle = title || pageTitle;

  const handleSignOut = async () => {
    await logout();
    router.replace('/login');
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900 px-6 flex items-center justify-between z-10">
      
      {/* Title */}
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-bold text-white tracking-wide">{displayTitle}</h2>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        
        {/* Mock Search */}
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-500" />
          <input
            type="text"
            placeholder="Quick search..."
            className="w-full h-9 bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
        </Button>

        {/* Theme Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-gold animate-scale-up" />
          ) : (
            <Moon className="w-5 h-5 text-slate-400 animate-scale-up" />
          )}
        </Button>

        {/* User Account Dropdown */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger className="relative h-10 w-10 rounded-full hover:bg-slate-805 focus:ring-0 p-0 overflow-hidden flex items-center justify-center cursor-pointer border border-slate-800 bg-transparent">
              {user.profilePicture ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </>
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-indigo-600/20 text-indigo-400 font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-56 bg-slate-900 border border-slate-800 text-slate-300" align="end">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal text-xs text-slate-500 p-3">
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-slate-200 text-sm leading-none">{user.name}</p>
                    <p className="text-slate-500 text-xs truncate leading-none mt-1">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator className="bg-slate-800" />
              
              {/* Profile Route Link */}
              <DropdownMenuItem 
                onClick={() => router.push(user.role === 'admin' || user.role === 'super_admin' ? '/admin/profile' : '/public/profile')}
                className="hover:bg-slate-800 hover:text-white cursor-pointer py-2.5"
              >
                <User className="mr-2 h-4 w-4 text-slate-400" />
                <span>My Profile</span>
              </DropdownMenuItem>

              {/* Settings Route Link */}
              <DropdownMenuItem 
                onClick={() => router.push(user.role === 'admin' || user.role === 'super_admin' ? '/admin/settings' : '/public/settings')}
                className="hover:bg-slate-800 hover:text-white cursor-pointer py-2.5"
              >
                <Settings className="mr-2 h-4 w-4 text-slate-400" />
                <span>Account Settings</span>
              </DropdownMenuItem>

              {/* Admin warning marker */}
              {(user.role === 'admin' || user.role === 'super_admin') && (
                <DropdownMenuItem className="hover:bg-slate-800 hover:text-white cursor-default py-2.5 text-indigo-400 font-semibold bg-indigo-500/5">
                  <ShieldAlert className="mr-2 h-4 w-4 text-indigo-400" />
                  <span>Admin Panel Access</span>
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator className="bg-slate-800" />
              
              {/* Log Out */}
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer py-2.5"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

      </div>
    </header>
  );
}
