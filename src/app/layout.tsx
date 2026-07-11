import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider, AuthWrapper } from '@/context/auth-context';
import { ThemeProvider } from '@/context/theme-context';
import { APP_NAME, APP_DESCRIPTION } from '@/constants';

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
        <ThemeProvider>
          <AuthProvider>
            <AuthWrapper>
              {children}
            </AuthWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
