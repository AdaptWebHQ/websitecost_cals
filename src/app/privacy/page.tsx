import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getServerUser } from '@/actions/auth';
import { Calculator } from 'lucide-react';
import ThemeToggle from '@/components/shared/theme-toggle';

export const revalidate = 3600; // Cache for 1 hour

export default async function PrivacyPage() {
  const user = await getServerUser();

  const dashboardUrl = user 
    ? (user.role === 'admin' || user.role === 'super_admin' ? '/admin' : '/public')
    : '/login';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden">
      {/* Background Gradients & Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-900/60 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <span>WebCost<span className="text-indigo-400 font-medium">Pro</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link href="/privacy" className="text-white hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href={dashboardUrl}>
              <Button variant="ghost" className="text-slate-300 hover:text-white text-xs font-semibold">
                {user ? 'Enter Dashboard' : 'Sign In'}
              </Button>
            </Link>
            {!user && (
              <Link href="/register">
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-9 px-4 text-xs font-semibold shadow-lg shadow-indigo-600/15">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto px-6 py-16 space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-400">
            How we protect, log, and secure your personal and project scoping details.
          </p>
        </div>

        <div className="p-8 rounded-3xl border border-slate-900 bg-slate-900/10 backdrop-blur-sm prose prose-invert max-w-none text-slate-300 text-sm space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h3 className="text-base font-bold text-white uppercase tracking-wider text-indigo-400">1. Information Collection</h3>
            <p>
              We gather user profile credentials (such as Google profile metadata on Auth triggers) and contact parameters inputted during multi-step cost evaluations (business name, email, phone).
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-white uppercase tracking-wider text-indigo-400">2. Usage of Scoping Data</h3>
            <p>
              Calculations are registered in database logs and associated with authenticated client records solely to enable historical listings, PDF downloads, and consulting inquiries callback.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-white uppercase tracking-wider text-indigo-400">3. Data Sharing Policies</h3>
            <p>
              We never trade, distribute, or rent your estimation metrics or contact parameters to external brokers. Scoping parameters are only visible to system administrators for CRM pipeline actions.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-8 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} WebCost Pro Calculator SaaS. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
