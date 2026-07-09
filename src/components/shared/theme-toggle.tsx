'use client';

import { useTheme } from '@/context/theme-context';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={`text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl cursor-pointer ${className}`}
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-gold animate-scale-up" />
      ) : (
        <Moon className="w-5 h-5 text-slate-400 animate-scale-up" />
      )}
    </Button>
  );
}
