import type { Metadata } from 'next';
import RegisterClient from './register-client';
import { APP_NAME } from '@/constants';

export const metadata: Metadata = {
  title: 'Create Account',
  description: `Register a new account on ${APP_NAME} using Google Single Sign-On to instantly save your website cost estimations, manage inquiries, and track development proposals.`,
  openGraph: {
    title: `Create Account | ${APP_NAME}`,
    description: `Register a new account on ${APP_NAME} using Google Single Sign-On to instantly save your website cost estimations, manage inquiries, and track development proposals.`,
    url: 'https://calculator.yourdomain.com/register',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `Create Account | ${APP_NAME}`,
    description: `Register a new account on ${APP_NAME} using Google Single Sign-On to instantly save your website cost estimations, manage inquiries, and track development proposals.`,
  },
};

export default function RegisterPage() {
  return <RegisterClient />;
}
