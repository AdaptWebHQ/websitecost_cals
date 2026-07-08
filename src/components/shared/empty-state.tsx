'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import * as Icons from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  iconName?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  description,
  iconName = 'FolderOpen',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  // Resolve Lucide Icon dynamically
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[iconName] || Icons.FolderOpen;

  return (
    <Card className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/30 border-slate-800/80 backdrop-blur-md rounded-2xl min-h-[300px]">
      <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800/40 border border-slate-800 text-slate-500 mb-6">
        <Icon className="w-8 h-8" />
      </div>
      
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-6">
        {description}
      </p>

      {actionLabel && onAction && (
        <Button
          onClick={onAction}
          className="rounded-xl px-5 h-11 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 border-none transition-all active:scale-[0.98] shadow-md shadow-indigo-600/10"
        >
          {actionLabel}
        </Button>
      )}
    </Card>
  );
}
