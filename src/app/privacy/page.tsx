import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PublicHeader from '@/components/shared/public-header';
import { Calculator } from 'lucide-react';
import ThemeToggle from '@/components/shared/theme-toggle';

export const revalidate = 3600; // Cache for 1 hour

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative overflow-hidden transition-colors duration-300">
      {/* Background Gradients & Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 dark:opacity-40 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar Header */}
      <PublicHeader />

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto px-6 py-16 space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            How we protect, log, and secure your personal and project scoping details.
          </p>
        </div>

        <div className="p-8 rounded-3xl border border-border bg-card/40 backdrop-blur-sm max-w-none text-foreground text-sm space-y-6 leading-relaxed shadow-sm">
          <section className="space-y-2">
            <h3 className="text-base font-bold text-primary uppercase tracking-wider">1. Information Collection</h3>
            <p className="text-muted-foreground">
              We gather user profile credentials (such as Google profile metadata on Auth triggers) and contact parameters inputted during multi-step cost evaluations (business name, email, phone).
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-primary uppercase tracking-wider">2. Usage of Scoping Data</h3>
            <p className="text-muted-foreground">
              Calculations are registered in database logs and associated with authenticated client records solely to enable historical listings, PDF downloads, and consulting inquiries callback.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-primary uppercase tracking-wider">3. Data Sharing Policies</h3>
            <p className="text-muted-foreground">
              We never trade, distribute, or rent your estimation metrics or contact parameters to external brokers. Scoping parameters are only visible to system administrators for CRM pipeline actions.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-border bg-card py-8 text-center text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} WebCost Pro Calculator SaaS. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors font-medium">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors font-medium">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
