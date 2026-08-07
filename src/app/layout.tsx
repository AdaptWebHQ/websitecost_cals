import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider, AuthWrapper } from '@/context/auth-context';
import { ThemeProvider } from '@/context/theme-context';
import { APP_NAME, APP_DESCRIPTION } from '@/constants';
import { Toaster } from '@/components/ui/sonner';

/**
 * Font Optimization:
 * Preloads Inter variable font with font-display: swap to reduce Render-Blocking resources and eliminate Cumulative Layout Shift (CLS).
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: 'https://calculator.yourdomain.com',
    siteName: APP_NAME,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_NAME,
    description: APP_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${inter.variable}`}
    >
      <body className={`min-h-full flex flex-col antialiased ${inter.className} selection:bg-indigo-500/30 selection:text-indigo-200`}>
        <ThemeProvider>
          <AuthProvider>
            <AuthWrapper>
              {children}
            </AuthWrapper>
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
