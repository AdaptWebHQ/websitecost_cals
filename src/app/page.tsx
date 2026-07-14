import Link from 'next/link';
import { getPackages } from '@/lib/packages';
import { getFeatures } from '@/lib/features';
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

import InteractiveNicheCalculator from '@/components/calculator/interactive-niche-calculator';
import PackagesPricingSection from '@/components/landing/packages-pricing-section';

export const revalidate = 60; // Cache landing page and revalidate every 60s

export default async function LandingPage() {
  const packages = await getPackages(true); // Fetch only active packages
  const features = await getFeatures(undefined, true); // Fetch only active features

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
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent dark:to-primary-hover">
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
        <div className="mt-20 w-full max-w-5xl rounded-[32px] border border-border bg-card p-4 sm:p-6 shadow-2xl relative transition-all duration-500 hover:scale-[1.005]">
          <div className="absolute inset-0 bg-primary/5 rounded-[32px] filter blur-2xl -z-10 pointer-events-none" />
          <InteractiveNicheCalculator />
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

          <PackagesPricingSection packages={packages} allFeatures={features} />
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
