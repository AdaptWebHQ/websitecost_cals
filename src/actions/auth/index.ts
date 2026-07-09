'use strict';

'use server';

import { cookies } from 'next/headers';
import { verifyIdToken, getOrCreateUser } from '@/lib/auth';
import type { User } from '@/types';

const COOKIE_TOKEN = 'webcost_session_token';
const COOKIE_ROLE = 'webcost_user_role';

/** Set HTTP-only session cookies with Firebase ID Token and User Role */
export async function setSession(idToken: string, isRegistering = false): Promise<{ success: boolean; error?: string; user?: User }> {
  try {
    const cookieStore = await cookies();
    
    // 1. Verify token server-side
    const decodedToken = await verifyIdToken(idToken);
    if (!decodedToken) {
      return { success: false, error: 'Invalid authentication token' };
    }

    // 2. Fetch or create user record from Firestore to get their actual role
    const user = await getOrCreateUser(
      decodedToken.uid,
      decodedToken.email || '',
      decodedToken.name || 'Anonymous User',
      decodedToken.picture,
      isRegistering
    );

    if (!user) {
      return { success: false, error: 'Account not found. Please register first.' };
    }

    if (!user.isActive) {
      return { success: false, error: 'User account is deactivated' };
    }

    const maxAge = 5 * 24 * 60 * 60; // 5 days
    const secure = process.env.NODE_ENV === 'production';

    // 3. Set the session token cookie
    cookieStore.set(COOKIE_TOKEN, idToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge,
    });

    // 4. Set the role cookie (httpOnly for middleware routing check)
    cookieStore.set(COOKIE_ROLE, user.role, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/',
      maxAge,
    });

    // 5. Send automated emails via Nodemailer for public users
    if (user.role === 'public' && user.email) {
      try {
        const { sendWelcomeEmail, sendSecurityAlertEmail } = await import('@/lib/email');
        if (isRegistering) {
          await sendWelcomeEmail(user);
        } else {
          const loginTime = new Date().toLocaleString();
          await sendSecurityAlertEmail(user, loginTime);
        }
      } catch (mailError) {
        console.error('Failed to send automated auth email:', mailError);
      }
    }

    return { success: true, user };
  } catch (error) {
    console.error('Failed to set session session cookies:', error);
    return { success: false, error: 'Internal server error' };
  }
}

/** Clear all session cookies on sign out */
export async function clearSession(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_TOKEN);
    cookieStore.delete(COOKIE_ROLE);
    return { success: true };
  } catch (error) {
    console.error('Failed to clear session cookies:', error);
    return { success: false };
  }
}

/** Get the currently logged-in user on the server side */
export async function getServerUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_TOKEN)?.value;
    if (!token) return null;

    const decodedToken = await verifyIdToken(token);
    if (!decodedToken) return null;

    const user = await getOrCreateUser(
      decodedToken.uid,
      decodedToken.email || '',
      decodedToken.name || 'Anonymous User',
      decodedToken.picture,
      false // Do not auto-create if not exists
    );

    return user;
  } catch (error) {
    console.error('Error fetching server-side user:', error);
    return null;
  }
}
