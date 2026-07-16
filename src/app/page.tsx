import Link from 'next/link';
import PublicHeader from '@/components/shared/public-header';

import AnimatedHero from '@/components/landing/animated-hero';
import ScrollShowcase from '@/components/landing/scroll-showcase';
import InteractiveNicheCalculator from '@/components/calculator/interactive-niche-calculator';
import ProcessTimeline from '@/components/landing/process-timeline';

export const revalidate = 60;

export default async function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased selection:bg-primary/20">
      
      {/* Structural Top Navbar */}
      <PublicHeader />

      {/* Hero Section */}
      <AnimatedHero />

      {/* Process Timeline Section - Replaces Packages */}
      <ProcessTimeline />

      {/* Structural Divider */}
      <div className="w-full border-t border-border" />

      {/* Coffee-Tech Approach Banner (Calculator) */}
      <div className="w-full bg-card">
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Product Positioning Statement */}
            <div className="lg:col-span-4 space-y-4">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold block">
                Live Configuration
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Not a presentation.<br />Try it right now.
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Test the advanced logic underneath our pricing matrix. Build your stack and view the structural alignment of engineering variables instantly.
              </p>
            </div>

            {/* Right Column: Embedded Tool as a high-end product piece */}
            <div className="lg:col-span-8">
              <div className="w-full rounded-sm bg-background border border-border p-4 sm:p-6 transition-all duration-300 hover:border-primary/50">
                <InteractiveNicheCalculator />
              </div>
            </div>

          </div>
        </section>
      </div>

      {/* Structural Divider */}
      <div className="w-full border-t border-border" />

      {/* Scroll UI Showcase */}
      <ScrollShowcase />

      {/* Minimalist Engineering Footer */}
      <footer className="mt-auto border-t border-border bg-background py-12 text-xs text-muted-foreground font-mono uppercase tracking-widest">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <p className="font-sans font-bold text-sm tracking-tight text-foreground normal-case">
              AdaptWeb Engineering Group
            </p>
            <p>© {new Date().getFullYear()} Cost Calculation Framework. All rights reserved.</p>
          </div>
          
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy & Terms</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Documentation</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}