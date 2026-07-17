import type { Metadata } from 'next';
import LoginClient from './login-client';
import { APP_NAME } from '@/constants';

export const metadata: Metadata = {
  title: 'Sign In',
  description: `Log in to your ${APP_NAME} account to view your project calculations, manage saved estimates, and download customized quotation PDFs.`,
  openGraph: {
    title: `Sign In | ${APP_NAME}`,
    description: `Log in to your ${APP_NAME} account to view your project calculations, manage saved estimates, and download customized quotation PDFs.`,
    url: 'https://calculator.yourdomain.com/login',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Sign In | ${APP_NAME}`,
    description: `Log in to your ${APP_NAME} account to view your project calculations, manage saved estimates, and download customized quotation PDFs.`,
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
