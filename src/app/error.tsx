'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('Unhandled runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 text-slate-600 font-sans p-6">
      <div className="flex flex-col items-center gap-5 text-center max-w-md bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm animate-in fade-in-50 duration-500">
        <img
          src="/uploaded_logo.png"
          alt="AdaptWeb Logo"
          className="w-20 h-20 object-contain mb-1"
        />
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Something went wrong</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            An unexpected error occurred while processing your request. Our team has been notified.
          </p>
        </div>
        <div className="w-full flex flex-col sm:flex-row gap-3 mt-2">
          <button
            onClick={() => reset()}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 text-sm font-semibold transition-colors shadow-sm flex items-center justify-center cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="flex-1 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl h-11 text-sm font-semibold transition-colors border border-slate-200 flex items-center justify-center cursor-pointer"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
