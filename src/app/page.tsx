import type { Metadata } from 'next';
import Link from 'next/link';
import PublicHeader from '@/components/shared/public-header';
import { APP_NAME, APP_DESCRIPTION } from '@/constants';

export const metadata: Metadata = {
  title: 'Home | Web Cost Calculator & Estimate System',
  description: APP_DESCRIPTION,
  openGraph: {
    title: `Home | ${APP_NAME}`,
    description: APP_DESCRIPTION,
    url: 'https://calculator.yourdomain.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Home | ${APP_NAME}`,
    description: APP_DESCRIPTION,
  },
};

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

      {/* Process Timeline Section */}
      <ProcessTimeline />

      {/* Structural Divider */}
      <div className="w-full border-t border-border" />

      {/* Interactive Pricing Banner (Calculator) */}
      <div className="w-full bg-card">
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Product Positioning Statement */}
            <div className="lg:col-span-4 space-y-4">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold block">
                Interactive Pricing
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                Build your ideal website.<br />See the cost instantly.
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every business is unique. Use our transparent calculator to explore different pages, features, and custom integrations. Shape your project exactly how you want it, and know the price before you make a commitment.
              </p>
            </div>

            {/* Right Column: Embedded Tool */}
            <div className="lg:col-span-8">
              <div className="w-full rounded-sm bg-background border border-border p-4 sm:p-6 transition-all duration-300 hover:border-primary/50 shadow-sm">
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

      {/* Premium Minimal Footer */}
      <footer className="mt-auto border-t border-border bg-background py-12 text-xs text-muted-foreground font-mono uppercase tracking-widest">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <p className="font-sans font-bold text-sm tracking-tight text-foreground normal-case">
              AdaptWeb IT Solutions
            </p>
            <p>© {new Date().getFullYear()} AdaptWeb IT Solutions. All rights reserved.</p>
          </div>
          
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}