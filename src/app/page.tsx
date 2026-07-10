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
      <section className="relative max-w-7xl mx-auto px-6 pt-28 pb-24 text-center flex flex-col items-center z-10 animate-in fade-in duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold mb-8 tracking-wider uppercase font-mono">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          AdaptWeb Configurator Platform
        </div>

        <h1 className="text-5xl sm:text-7xl font-black tracking-tight max-w-4xl leading-[1.1] text-foreground">
          Instantly Estimate & Validate <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
            Your Next Web Project Cost
          </span>
        </h1>

        <p className="mt-8 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
          Configure page count, select custom modules, adjust timeline speeds, and download dynamically signed PDF quotes in minutes.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center gap-4">
          <Link href="/public/calculator">
            <Button className="bg-primary hover:bg-primary/95 text-white rounded-2xl h-14 px-8 text-base font-extrabold shadow-xl shadow-primary/20 gap-3 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
              <Calculator className="w-5 h-5" />
              Launch Cost Calculator
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <a href="#features">
            <Button variant="outline" className="border-border bg-card hover:bg-muted text-foreground rounded-2xl h-14 px-8 font-bold transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer">
              Explore Capabilities
            </Button>
          </a>
        </div>

        {/* Floating Mockup Bento Container */}
        <div className="mt-20 w-full max-w-5xl rounded-[32px] border border-border bg-card p-3.5 shadow-2xl relative transition-all duration-500 hover:scale-[1.005]">
          <div className="absolute inset-0 bg-primary/5 rounded-[32px] filter blur-2xl -z-10 pointer-events-none" />
          <div className="rounded-[24px] border border-border overflow-hidden bg-background aspect-[1.7] md:aspect-[1.9]">
            {/* Mock Dashboard Layout */}
            <div className="h-full w-full flex flex-col font-sans">
              <div className="h-11 border-b border-border bg-muted/60 px-4 flex items-center gap-2 flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-destructive/30" />
                <div className="w-3 h-3 rounded-full bg-amber-500/30" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/30" />
                <div className="ml-4 h-6 w-52 rounded-lg bg-card border border-border flex items-center justify-center text-[10px] text-muted-foreground font-mono">
                  adaptweb.co/calculator
                </div>
              </div>
              <div className="flex-1 flex p-6 gap-6 text-left bg-card min-h-0">
                {/* Mock Form */}
                <div className="flex-[3] rounded-2xl border border-border bg-muted/40 p-5 space-y-4">
                  <div className="h-5 w-32 rounded-lg bg-primary/10 border border-primary/20" />
                  <div className="h-10 w-full rounded-xl bg-card border border-border" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="h-3 w-12 rounded bg-muted" />
                      <div className="h-10 w-full rounded-xl bg-card border border-border" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-16 rounded bg-muted" />
                      <div className="h-10 w-full rounded-xl bg-card border border-border" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-28 rounded bg-muted" />
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-11 rounded-xl border border-primary/30 bg-primary/5" />
                      <div className="h-11 rounded-xl border border-border bg-card" />
                      <div className="h-11 rounded-xl border border-border bg-card" />
                    </div>
                  </div>
                </div>
                {/* Mock Estimation Box */}
                <div className="flex-[2] rounded-2xl border border-primary/25 bg-primary/5 p-5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="h-4.5 w-20 rounded bg-card/60" />
                    <div className="h-11 w-40 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-extrabold text-primary text-lg">
                      ₹45,500
                    </div>
                    <div className="space-y-2.5">
                      <div className="h-3 w-full rounded bg-card/60" />
                      <div className="h-3 w-4/5 rounded bg-card/60" />
                    </div>
                  </div>
                  <div className="h-11 w-full rounded-xl bg-primary flex items-center justify-center text-xs font-bold text-white shadow-md shadow-primary/25">
                    Submit Proposal
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-28 border-t border-border z-10">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">Neo-Minimalist Capabilities</h2>
          <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
            Built with strict client-server pricing synchronization logic and responsive modules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-[24px] border border-border bg-card hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-lg group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20 group-hover:scale-110 transition-transform">
              <Cpu className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Server-Side Recalculations</h3>
            <p className="text-sm text-muted-foreground mt-2.5 leading-relaxed">
              Prices are calculated dynamically on safe server contexts using current Firestore values. Never trust client-submitted numbers.
            </p>
          </div>

          <div className="p-6 rounded-[24px] border border-border bg-card hover:border-secondary/40 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-lg group">
            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 border border-secondary/20 group-hover:scale-110 transition-transform">
              <FileCheck className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Premium PDF Quotations</h3>
            <p className="text-sm text-muted-foreground mt-2.5 leading-relaxed">
              Export generated calculations on demand to beautifully formatted PDF sheets with dynamic headers, breakdowns, and company tax data.
            </p>
          </div>

          <div className="p-6 rounded-[24px] border border-border bg-card hover:border-accent/40 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-lg group">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6 border border-accent/20 group-hover:scale-110 transition-transform">
              <LineChart className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Real-Time CRM Analytics</h3>
            <p className="text-sm text-muted-foreground mt-2.5 leading-relaxed">
              Admin dashboard analytics tracking calculations pipeline volumes, conversion rates, and hot feature requests instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Pricing / Packages Section */}
      <section id="pricing" className="bg-muted/40 border-t border-border py-28 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-20">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">Baseline Estimation Packages</h2>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Start with a predefined baseline structure and customize integrations inside the cost calculator.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {packages.length === 0 ? (
              [1, 2, 3].map((idx) => (
                <div key={idx} className="p-8 rounded-[24px] border border-border bg-card flex flex-col justify-between animate-pulse">
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
                    className={`p-8 rounded-[24px] flex flex-col justify-between relative transition-all duration-500 hover:-translate-y-1 select-none ${
                      isFeatured 
                        ? 'border-2 border-primary bg-primary/5 shadow-xl shadow-primary/5' 
                        : 'border border-border bg-card hover:border-primary/25'
                    }`}
                  >
                    {isFeatured && (
                      <span className="absolute top-0 right-6 -translate-y-1/2 bg-gradient-to-r from-primary to-secondary text-white font-bold text-[9px] uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg">
                        Popular Choice
                      </span>
                    )}

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{pkg.name}</h3>
                        <p className="text-xs text-muted-foreground mt-2 max-w-xs leading-relaxed">{pkg.description}</p>
                      </div>

                      <div className="flex items-baseline gap-1 text-foreground">
                        <span className="text-2xl font-bold">₹</span>
                        <span className="text-4xl font-extrabold tracking-tight">{pkg.basePrice.toLocaleString()}</span>
                        <span className="text-xs text-muted-foreground font-semibold">/ base</span>
                      </div>

                      <ul className="space-y-3 text-sm pt-6 border-t border-border">
                        <li className="flex items-center gap-2.5 text-foreground/80">
                          <Check className="w-4 h-4 text-primary shrink-0" />
                          <span>Includes up to {pkg.pagesIncluded} pages</span>
                        </li>
                        <li className="flex items-center gap-2.5 text-foreground/80">
                          <Check className="w-4 h-4 text-primary shrink-0" />
                          <span>{pkg.deliveryDays} Days delivery</span>
                        </li>
                        <li className="flex items-center gap-2.5 text-foreground/80">
                          <Check className="w-4 h-4 text-primary shrink-0" />
                          <span>{pkg.revisions} Design revisions</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-8">
                      <Link href="/public/calculator">
                        <Button 
                          className={`w-full rounded-xl h-12 text-xs font-bold transition-all cursor-pointer ${
                            isFeatured 
                              ? 'bg-primary hover:bg-primary/95 text-white shadow-md shadow-primary/20' 
                              : 'bg-muted text-muted-foreground border border-border hover:bg-card hover:text-foreground'
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
        <div className="p-8 sm:p-12 rounded-[24px] bg-card border border-border relative overflow-hidden flex flex-col items-center shadow-lg">
          <div className="absolute inset-0 bg-primary/5 -z-10 pointer-events-none" />
          <h2 className="text-3xl font-extrabold text-foreground">Ready to Build Your Estimate?</h2>
          <p className="mt-4 text-muted-foreground text-sm max-w-md leading-relaxed">
            Create an account to lock in your quotation prices, save drafts, download custom PDFs, and request quick follow-ups.
          </p>
          <div className="mt-8">
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/95 text-white rounded-xl h-12 px-6 gap-2 text-sm font-semibold shadow-md shadow-primary/20 cursor-pointer">
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
