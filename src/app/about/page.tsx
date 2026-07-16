import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PublicHeader from '@/components/shared/public-header';
import { Calculator, Compass, Users, Target } from 'lucide-react';
import ThemeToggle from '@/components/shared/theme-toggle';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AdaptWeb Cost Calculator | About',
  description: 'Professional Website Estimation & Lead Management Platform.',
};

export const revalidate = 3600; // Cache for 1 hour

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative overflow-hidden transition-colors duration-300">
      {/* Background Gradients & Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 dark:opacity-40 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar Header */}
      <PublicHeader />

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 space-y-16 relative z-10">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            About AdaptWeb Cost Calculator
          </h1>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            AdaptWeb Cost Calculator is a professional website estimation and lead management platform developed by AdaptWeb IT Solutions.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-foreground text-base">Our Mission</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Help agencies, freelancers, startups, and businesses generate transparent website estimates, qualify leads, and simplify project discussions.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-foreground text-base">The Team</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Built by AdaptWeb IT Solutions with experience in web development, UI/UX, pricing strategy, and client acquisition.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-foreground text-base">Platform</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Combines smart pricing, proposal generation, lead management, and project estimation into one workflow.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-card py-8 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} AdaptWeb Cost Calculator. An AdaptWeb Product.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors font-medium">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors font-medium">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
