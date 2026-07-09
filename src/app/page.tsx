import Link from 'next/link';
import { getPackages } from '@/lib/packages';
import { Button } from '@/components/ui/button';
import PublicHeader from '@/components/shared/public-header';
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
  const packages = await getPackages(true); // Fetch only active packages

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative overflow-hidden transition-colors duration-300">
      {/* Background Gradients & Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar Header */}
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-24 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          Serverless Pricing Calculator SaaS
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-3xl leading-[1.1]">
          Instantly Estimate & Validate <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 dark:from-purple-400 dark:via-violet-400 dark:to-indigo-400">
            Your Next Web Project Cost
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
          No more guessing quotation rates. Build exact estimates, customize page complexities, choose technical integrations, and download PDF quotes in minutes.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link href="/public/calculator">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl h-14 px-8 text-base font-bold shadow-xl shadow-primary/20 gap-3 border border-primary/10 transition-all duration-300 hover:-translate-y-0.5">
              <Calculator className="w-5 h-5" />
              Launch Cost Calculator
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <a href="#features">
            <Button variant="outline" className="border-border bg-card hover:bg-secondary text-foreground rounded-2xl h-14 px-8 font-semibold transition-all duration-300 hover:-translate-y-0.5">
              Explore Master Features
            </Button>
          </a>
        </div>

        {/* Floating Mockup in a Bento Container */}
        <div className="mt-16 w-full max-w-5xl rounded-3xl border border-border bg-card p-3 shadow-2xl relative transition-all duration-500 hover:scale-[1.01]">
          <div className="absolute inset-0 bg-primary/5 rounded-3xl filter blur-xl -z-10 pointer-events-none" />
          <div className="rounded-2xl border border-border overflow-hidden bg-background aspect-[1.7] md:aspect-[1.9]">
            {/* Mock Dashboard Layout */}
            <div className="h-full w-full flex flex-col">
              <div className="h-10 border-b border-border bg-muted px-4 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/40" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/40" />
                <div className="w-3 h-3 rounded-full bg-green-500/40" />
                <div className="ml-4 h-5 w-48 rounded bg-card flex items-center justify-center text-[10px] text-muted-foreground">
                  webcostpro.com/calculator
                </div>
              </div>
              <div className="flex-1 flex p-6 gap-6 text-left bg-card">
                {/* Mock Form */}
                <div className="flex-[3] rounded-2xl border border-border bg-muted p-5 space-y-4">
                  <div className="h-5 w-32 rounded bg-primary/10 border border-primary/20" />
                  <div className="h-8 w-full rounded bg-card border border-border" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-4 w-12 rounded bg-card" />
                      <div className="h-8 w-full rounded bg-card border border-border" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-16 rounded bg-card" />
                      <div className="h-8 w-full rounded bg-card border border-border" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-28 rounded bg-card" />
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-10 rounded border border-primary/30 bg-primary/5" />
                      <div className="h-10 rounded border border-border bg-card" />
                      <div className="h-10 rounded border border-border bg-card" />
                    </div>
                  </div>
                </div>
                {/* Mock Estimation Box */}
                <div className="flex-[2] rounded-2xl border border-primary/20 bg-primary/5 p-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="h-4 w-20 rounded bg-card" />
                    <div className="h-10 w-36 rounded bg-primary/15 border border-primary/20 flex items-center justify-center font-bold text-primary">
                      ₹45,500
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full rounded bg-card" />
                      <div className="h-3 w-4/5 rounded bg-card" />
                    </div>
                  </div>
                  <div className="h-10 w-full rounded-xl bg-primary flex items-center justify-center text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/20">
                    Submit Proposal
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 border-t border-border">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-bold">Neo-Minimalist Bento Capabilities</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Built with strict client-server pricing synchronization logic and responsive modules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-3xl border border-border bg-card hover:border-primary/45 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-lg font-bold">Server-Side Recalculations</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Prices are calculated dynamically on safe server contexts using current Firestore values. Never trust client-submitted numbers.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-border bg-card hover:border-emerald/45 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <FileCheck className="w-6 h-6 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold">Premium PDF Quotations</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Export generated calculations on demand to beautifully formatted PDF sheets with dynamic headers, breakdowns, and company tax data.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-border bg-card hover:border-indigo/45 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:scale-110 transition-transform">
              <LineChart className="w-6 h-6 text-indigo-500" />
            </div>
            <h3 className="text-lg font-bold">Real-Time CRM Analytics</h3>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Admin dashboard analytics tracking calculations pipeline volumes, conversion rates, and hot feature requests instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Pricing / Packages Section */}
      <section id="pricing" className="bg-muted border-t border-border py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="text-3xl font-bold">Baseline Estimation Packages</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Start with a predefined baseline structure and customize integrations inside the cost calculator.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {packages.length === 0 ? (
              [1, 2, 3].map((idx) => (
                <div key={idx} className="p-8 rounded-3xl border border-border bg-card flex flex-col justify-between animate-pulse">
                  <div className="h-6 w-24 bg-muted rounded" />
                  <div className="h-10 w-36 bg-muted rounded my-4" />
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-muted rounded" />
                    <div className="h-3 w-4/5 bg-muted rounded" />
                  </div>
                </div>
              ))
            ) : (
              packages.map((pkg) => {
                const isFeatured = pkg.isPopular;
                return (
                  <div 
                    key={pkg.id} 
                    className={`p-8 rounded-3xl flex flex-col justify-between relative transition-all duration-300 hover:-translate-y-1 ${
                      isFeatured 
                        ? 'border-2 border-primary bg-primary/5 shadow-xl shadow-primary/5' 
                        : 'border border-border bg-card hover:border-primary/25'
                    }`}
                  >
                    {isFeatured && (
                      <span className="absolute top-0 right-6 -translate-y-1/2 bg-primary text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                        Popular Choice
                      </span>
                    )}

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-bold">{pkg.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1 max-w-xs">{pkg.description}</p>
                      </div>

                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold">₹</span>
                        <span className="text-4xl font-extrabold tracking-tight">{pkg.basePrice.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground font-medium">/ base</span>
                      </div>

                      <ul className="space-y-3.5 text-sm pt-6 border-t border-border">
                        <li className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 text-primary shrink-0" />
                          <span>Includes up to {pkg.pagesIncluded} pages</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 text-primary shrink-0" />
                          <span>{pkg.deliveryDays} Days average delivery</span>
                        </li>
                        <li className="flex items-center gap-2.5">
                          <Check className="w-4 h-4 text-primary shrink-0" />
                          <span>{pkg.revisions} Design revisions</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-8">
                      <Link href="/public/calculator">
                        <Button 
                          className={`w-full rounded-2xl h-11 text-sm font-bold transition-all ${
                            isFeatured 
                              ? 'bg-primary hover:bg-primary/95 text-white shadow-lg shadow-primary/15' 
                              : 'bg-secondary hover:bg-muted text-foreground'
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

      {/* Call to Action Banner */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center relative z-10">
        <div className="p-8 sm:p-12 rounded-3xl bg-card border border-border relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 bg-primary/5 -z-10 pointer-events-none" />
          <h2 className="text-3xl font-extrabold">Ready to Build Your Estimate?</h2>
          <p className="mt-4 text-muted-foreground text-sm max-w-md leading-relaxed">
            Create an account to lock in your quotation prices, save drafts, download custom PDFs, and request quick follow-ups.
          </p>
          <div className="mt-8">
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/95 text-white rounded-xl h-12 px-6 gap-2 text-sm font-semibold shadow-lg shadow-primary/20">
                Create Free Account
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-card py-8 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} WebCost Pro Calculator SaaS. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
