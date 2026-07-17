import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PublicHeader from '@/components/shared/public-header';
import { Calculator } from 'lucide-react';
import ThemeToggle from '@/components/shared/theme-toggle';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | Web Cost Calculator',
  description: 'Frequently Asked Questions about our web application estimation wizard, package details, PDF proposals, and custom consulting.',
};

export const revalidate = 3600; // Cache for 1 hour

export default function FaqPage() {
  const faqs = [
    {
      question: 'How accurate are the website estimates?',
      answer: 'The estimates generated are highly accurate approximations based on our current base rates, add-on features, and project scope. However, they serve as a starting point for discussion.',
    },
    {
      question: 'Can I customize my quotation?',
      answer: 'Yes, you can customize your quotation by selecting different packages, adding features, adjusting the page count, and changing the delivery timeline.',
    },
    {
      question: 'Can I download a PDF proposal?',
      answer: 'Absolutely. Once your estimate is generated, you can download a beautifully formatted, branded PDF proposal instantly.',
    },
    {
      question: 'Will my estimate become the final project price?',
      answer: 'The generated estimate is a strong baseline. The final price may be adjusted slightly during our consultation call to account for specific bespoke requirements.',
    },
    {
      question: 'Can AdaptWeb build my website?',
      answer: 'Yes! AdaptWeb Cost Calculator is built by AdaptWeb IT Solutions, a full-service agency. You can request a consultation directly from your estimate to have us build your project.',
    },
    {
      question: 'How long are quotations valid?',
      answer: 'Unless otherwise stated during consultation, quotations generated on the platform are typically valid for 30 days.',
    },
    {
      question: 'Can I save multiple estimates?',
      answer: 'Yes. By creating a free account, you can generate, save, and manage as many project estimates as you need in your dashboard.',
    },
    {
      question: 'Do I need an account?',
      answer: 'You can use the calculator without an account, but you will need to create a free account to save your estimates, download PDFs, and manage your projects.',
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans relative overflow-hidden transition-colors duration-300">
      {/* Schema.org FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* Background Gradients & Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 dark:opacity-40 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar Header */}
      <PublicHeader />

      {/* Main Content */}
      <main className="flex-1 max-w-3xl mx-auto px-6 py-16 space-y-10 relative z-10">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-muted-foreground">
            Get clear, quick answers to common pricing, scoping, and consulting queries.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-border bg-card/40 backdrop-blur-sm space-y-2"
            >
              <h3 className="font-bold text-foreground text-base">{faq.question}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                {faq.answer}
              </p>
            </div>
          ))}
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
