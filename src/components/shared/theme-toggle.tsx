'use client';

import { useTheme } from '@/context/theme-context';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  return null; // Locked to dark mode for premium cinematic aesthetic
}
