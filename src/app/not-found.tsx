'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 text-slate-600 font-sans p-6">
      <div className="flex flex-col items-center gap-5 text-center max-w-md bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm animate-in fade-in-50 duration-500">
        <img
          src="/uploaded_logo.png"
          alt="AdaptWeb Logo"
          className="w-20 h-20 object-contain mb-1"
        />
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Page Not Found</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Sorry, the page you are looking for does not exist or has been moved.
          </p>
        </div>
        <Link
          href="/"
          className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 text-sm font-semibold transition-colors shadow-sm flex items-center justify-center cursor-pointer"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
