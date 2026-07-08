'use client';

export function CardLoadingSkeleton() {
  return (
    <div className="w-full bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-3 w-20 bg-slate-800 rounded" />
          <div className="h-7 w-32 bg-slate-800 rounded" />
        </div>
        <div className="w-12 h-12 rounded-xl bg-slate-800" />
      </div>
      <div className="h-3 w-40 bg-slate-800 rounded mt-2" />
    </div>
  );
}

export function TableLoadingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-12 bg-slate-900/80 border-b border-slate-800 flex items-center px-6">
        <div className="h-4 w-1/4 bg-slate-800 rounded" />
      </div>
      <div className="divide-y divide-slate-800/60">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-16 flex items-center px-6 space-x-4">
            <div className="h-4 w-12 bg-slate-800 rounded" />
            <div className="h-4 flex-1 bg-slate-800 rounded" />
            <div className="h-4 w-20 bg-slate-800 rounded" />
            <div className="h-4 w-16 bg-slate-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PageLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-slate-900/80 rounded animate-pulse" />
          <div className="h-4 w-32 bg-slate-900/80 rounded animate-pulse" />
        </div>
        <div className="h-10 w-28 bg-slate-900/80 rounded animate-pulse" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardLoadingSkeleton />
        <CardLoadingSkeleton />
        <CardLoadingSkeleton />
        <CardLoadingSkeleton />
      </div>

      <TableLoadingSkeleton />
    </div>
  );
}
