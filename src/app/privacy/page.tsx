import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PublicHeader from '@/components/shared/public-header';
import { Calculator } from 'lucide-react';
import ThemeToggle from '@/components/shared/theme-toggle';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AdaptWeb Cost Calculator | Privacy Policy',
  description: 'Professional Website Estimation & Lead Management Platform.',
};

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
            <h3 className="text-base font-bold text-primary uppercase tracking-wider">1. Information We Collect</h3>
            <p className="text-muted-foreground">
              We collect information you provide directly to us when creating an account, generating website estimates, or requesting a consultation. This includes your name, email address, business details, and specific project requirements. We also collect authentication metadata when you sign in via Google.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-primary uppercase tracking-wider">2. How We Use Your Information</h3>
            <p className="text-muted-foreground">
              We use the collected data to generate accurate project estimates, save your quotation history, process your consultation requests, and communicate with you regarding your projects. Your data allows us to provide a seamless estimation workflow and personalized service.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-primary uppercase tracking-wider">3. Data Security</h3>
            <p className="text-muted-foreground">
              We implement industry-standard security measures to protect your personal information and project data from unauthorized access. Your data is securely stored in our encrypted database infrastructure.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-primary uppercase tracking-wider">4. Cookies</h3>
            <p className="text-muted-foreground">
              We use essential cookies to maintain your authenticated session and secure your account. We may also use analytical cookies to understand how users interact with our platform to improve the user experience.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-primary uppercase tracking-wider">5. Third-Party Services</h3>
            <p className="text-muted-foreground">
              We do not sell, rent, or trade your personal information. We may share necessary data with trusted third-party service providers (like email sending services or secure hosting providers) solely for the purpose of operating the AdaptWeb Cost Calculator platform.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-primary uppercase tracking-wider">6. User Rights</h3>
            <p className="text-muted-foreground">
              You have the right to access, update, or delete your personal information and saved estimates at any time through your dashboard. You may also contact us to request a complete removal of your data from our systems.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="text-base font-bold text-primary uppercase tracking-wider">7. Contact Information</h3>
            <p className="text-muted-foreground">
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact the AdaptWeb IT Solutions privacy team through our main website or via your dashboard.
            </p>
          </section>
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
