'use client';

import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 text-slate-600 font-sans p-6">
      <div className="flex flex-col items-center gap-5 text-center max-w-md bg-white border border-slate-200/80 p-8 rounded-3xl shadow-sm animate-in fade-in-50 duration-500">
        <img
          src="/uploaded_logo.png"
          alt="AdaptWeb Logo"
          className="w-20 h-20 object-contain mb-1"
        />
        
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 my-2">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Unauthorized Access</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            You do not have the required permissions to view this page. Please make sure you are logged into the correct account.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-11 text-sm font-semibold transition-colors shadow-sm flex items-center justify-center cursor-pointer"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
