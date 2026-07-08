import Link from 'next/link';
import { getPackages } from '@/lib/packages';
import { Button } from '@/components/ui/button';
import { getServerUser } from '@/actions/auth';
import { 
  Calculator, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Cpu, 
  FileCheck, 
  LineChart 
} from 'lucide-react';

export const revalidate = 60; // Cache landing page and revalidate every 60s

export default async function LandingPage() {
  const [packages, user] = await Promise.all([
    getPackages(true), // Fetch only active packages
    getServerUser()
  ]);

  const dashboardUrl = user 
    ? (user.role === 'admin' || user.role === 'super_admin' ? '/dashboard/admin' : '/dashboard/public')
    : '/login';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden">
      {/* Background Gradients & Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* 1. Navbar Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-900/60 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-white">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Calculator className="w-5 h-5 text-white" />
            </div>
            <span>WebCost<span className="text-indigo-400 font-medium">Pro</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing Tiers</a>
            <a href="#faq" className="hover:text-white transition-colors">How it works</a>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <Link href={dashboardUrl}>
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-10 px-5 gap-2 text-sm font-semibold shadow-lg shadow-indigo-600/15">
                  Enter Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-3 py-2">
                  Sign In
                </Link>
                <Link href="/register">
                  <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-10 px-5 text-sm font-semibold shadow-lg shadow-indigo-600/15">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          Serverless Pricing Calculator SaaS
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-[1.1]">
          Instantly Estimate & Validate <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400">
            Your Next Web Project Cost
          </span>
        </h1>

        <p className="mt-6 text-lg text-slate-400 max-w-xl leading-relaxed">
          No more guessing quotation rates. Build exact estimates, customize page complexities, choose technical integrations, and download PDF quotes in minutes.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link href={user ? "/dashboard/public/calculator" : "/login"}>
            <Button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl h-14 px-8 text-base font-bold shadow-xl shadow-indigo-500/20 gap-3">
              <Calculator className="w-5 h-5" />
              Launch Cost Calculator
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <a href="#features">
            <Button variant="outline" className="border-slate-800 bg-slate-900/30 hover:bg-slate-900/50 hover:text-white rounded-2xl h-14 px-8 text-slate-300 font-semibold">
              Explore Master Features
            </Button>
          </a>
        </div>

        {/* Floating Dashboard Screen Mockup */}
        <div className="mt-16 w-full max-w-5xl rounded-3xl border border-slate-800/80 bg-slate-900/10 p-3 backdrop-blur-sm shadow-2xl relative">
          <div className="absolute inset-0 bg-indigo-500/5 rounded-3xl filter blur-xl -z-10 pointer-events-none" />
          <div className="rounded-2xl border border-slate-800/60 overflow-hidden bg-slate-950 aspect-[1.6]">
            {/* Mock Dashboard Layout */}
            <div className="h-full w-full flex flex-col">
              <div className="h-10 border-b border-slate-900 bg-slate-950/80 px-4 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/40" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                <div className="w-3 h-3 rounded-full bg-green-500/40" />
                <div className="ml-4 h-5 w-48 rounded bg-slate-900 flex items-center justify-center text-[10px] text-slate-600">
                  webcostpro.com/calculator
                </div>
              </div>
              <div className="flex-1 flex bg-slate-950 p-6 gap-6 text-left">
                {/* Mock Form */}
                <div className="flex-[3] rounded-2xl border border-slate-800/50 bg-slate-900/20 p-5 space-y-4">
                  <div className="h-5 w-32 rounded bg-indigo-500/10 border border-indigo-500/20" />
                  <div className="h-8 w-full rounded bg-slate-900" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-4 w-12 rounded bg-slate-900" />
                      <div className="h-8 w-full rounded bg-slate-900" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-16 rounded bg-slate-900" />
                      <div className="h-8 w-full rounded bg-slate-900" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-28 rounded bg-slate-900" />
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-10 rounded border border-indigo-500/30 bg-indigo-500/5" />
                      <div className="h-10 rounded border border-slate-800" />
                      <div className="h-10 rounded border border-slate-800" />
                    </div>
                  </div>
                </div>
                {/* Mock Estimation Box */}
                <div className="flex-[2] rounded-2xl border border-indigo-500/20 bg-indigo-950/10 p-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="h-4 w-20 rounded bg-slate-800" />
                    <div className="h-10 w-36 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-400">
                      ₹45,500
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full rounded bg-slate-900" />
                      <div className="h-3 w-4/5 rounded bg-slate-900" />
                    </div>
                  </div>
                  <div className="h-10 w-full rounded bg-indigo-600 flex items-center justify-center text-xs font-semibold text-white">
                    Submit Proposal
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Grid Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-900/60">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white">Master Level SaaS Integrity</h2>
          <p className="text-sm text-slate-400 mt-2">
            Built with strict client-server pricing synchronization logic and responsive modules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 relative hover:border-slate-800 transition-colors">
            <Cpu className="w-10 h-10 text-indigo-400 mb-4" />
            <h3 className="text-lg font-bold text-white">Server-Side Recalculations</h3>
            <p className="text-sm text-slate-400 mt-2">
              Prices are calculated dynamically on safe server contexts using current Firestore values. Never trust client-submitted numbers.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 relative hover:border-slate-800 transition-colors">
            <FileCheck className="w-10 h-10 text-emerald-400 mb-4" />
            <h3 className="text-lg font-bold text-white">Premium PDF Quotations</h3>
            <p className="text-sm text-slate-400 mt-2">
              Export generated calculations on demand to beautifully formatted PDF sheets with dynamic headers, breakdowns, and company tax data.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-slate-900 bg-slate-950/40 relative hover:border-slate-800 transition-colors">
            <LineChart className="w-10 h-10 text-violet-400 mb-4" />
            <h3 className="text-lg font-bold text-white">Real-Time CRM Analytics</h3>
            <p className="text-sm text-slate-400 mt-2">
              Admin dashboard analytics tracking calculations pipeline volumes, conversion rates, and hot feature requests instantly.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Dynamic Pricing / Packages Section */}
      <section id="pricing" className="bg-slate-950/40 border-t border-slate-900/60 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white">Baseline Estimation Packages</h2>
            <p className="text-sm text-slate-400 mt-2">
              Start with a predefined baseline structure and customize integrations inside the cost calculator.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {packages.length === 0 ? (
              // Mock items if empty
              [1, 2, 3].map((idx) => (
                <div key={idx} className="p-8 rounded-3xl border border-slate-900 bg-slate-950/60 flex flex-col justify-between animate-pulse">
                  <div className="h-6 w-24 bg-slate-900 rounded" />
                  <div className="h-10 w-36 bg-slate-900 rounded my-4" />
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-slate-900 rounded" />
                    <div className="h-3 w-4/5 bg-slate-900 rounded" />
                  </div>
                </div>
              ))
            ) : (
              packages.map((pkg) => {
                const isFeatured = pkg.isPopular;
                return (
                  <div 
                    key={pkg.id} 
                    className={`p-8 rounded-3xl flex flex-col justify-between relative transition-all duration-300 ${
                      isFeatured 
                        ? 'border-2 border-indigo-500/80 bg-indigo-950/5 shadow-xl shadow-indigo-500/5' 
                        : 'border border-slate-900 bg-slate-950/60 hover:border-slate-800'
                    }`}
                  >
                    {isFeatured && (
                      <span className="absolute top-0 right-6 -translate-y-1/2 bg-indigo-500 text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                        Popular Choice
                      </span>
                    )}

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-bold text-white">{pkg.name}</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-xs">{pkg.description}</p>
                      </div>

                      <div className="flex items-baseline gap-1 text-white">
                        <span className="text-2xl font-bold">₹</span>
                        <span className="text-4xl font-extrabold tracking-tight">{pkg.basePrice.toLocaleString()}</span>
                        <span className="text-sm text-slate-500 font-medium">/ base</span>
                      </div>

                      <ul className="space-y-3.5 text-sm text-slate-400 pt-6 border-t border-slate-900">
                        <li className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                          <span>Includes up to {pkg.pagesIncluded} pages</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                          <span>{pkg.deliveryDays} Days average delivery</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                          <span>{pkg.revisions} Design revisions</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-8">
                      <Link href={user ? "/dashboard/public/calculator" : "/login"}>
                        <Button 
                          className={`w-full rounded-2xl h-11 text-sm font-bold transition-all ${
                            isFeatured 
                              ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/15' 
                              : 'bg-slate-900 hover:bg-slate-800 text-slate-200'
                          }`}
                        >
                          Select Package
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* 5. Call to Action Banner */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center relative z-10">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-tr from-indigo-950/20 to-purple-950/15 border border-indigo-500/10 backdrop-blur-md relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 bg-indigo-500/[0.02] -z-10 pointer-events-none" />
          <h2 className="text-3xl font-extrabold text-white">Ready to Build Your Estimate?</h2>
          <p className="mt-4 text-slate-400 text-sm max-w-md leading-relaxed">
            Create an account to lock in your quotation prices, save drafts, download custom PDFs, and request quick follow-ups.
          </p>
          <div className="mt-8">
            <Link href={user ? "/dashboard/public/calculator" : "/register"}>
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-12 px-6 gap-2 text-sm font-semibold shadow-lg shadow-indigo-600/20">
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
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
