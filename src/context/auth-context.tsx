'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithGoogle as firebaseSignInWithGoogle, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  getUserIdToken,
  type FirebaseUser
} from '@/firebase/auth';
import { setSession, clearSession } from '@/actions/auth';
import { TooltipProvider } from '@/components/ui/tooltip';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  loginWithGoogle: (isRegistering?: boolean) => Promise<{ success: boolean; error?: string }>;
  loginMock: (role: 'admin' | 'public') => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to Firebase client auth state change listener on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          const idToken = await getUserIdToken(firebaseUser);
          const result = await setSession(idToken);
          
          if (result.success && result.user) {
            setUser(result.user);
          } else {
            await firebaseSignOut();
            await clearSession();
            setUser(null);
          }
        } else {
          // Keep active mock sessions in dev instead of wiping them
          const cookieToken = document.cookie.split('; ').find(row => row.startsWith('webcost_session_token='));
          if (cookieToken && cookieToken.split('=')[1].startsWith('mock_')) {
            // Already logged in with mock
            return;
          }
          await clearSession();
          setUser(null);
        }
      } catch (err) {
        console.error('Authentication sync error:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (isRegistering = false): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);
    try {
      const firebaseUser = await firebaseSignInWithGoogle();
      const idToken = await getUserIdToken(firebaseUser);
      const result = await setSession(idToken, isRegistering);
      
      if (result.success && result.user) {
        setUser(result.user);
        setIsLoading(false);
        return { success: true };
      } else {
        await firebaseSignOut();
        const errMessage = result.error || 'Failed to authenticate on the server';
        setError(errMessage);
        setIsLoading(false);
        return { success: false, error: errMessage };
      }
    } catch (err: unknown) {
      console.error('Login action error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in with Google';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const loginMock = async (role: 'admin' | 'public'): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    setError(null);
    try {
      const idToken = role === 'admin' 
        ? 'mock_admin:admin_uid:admin@example.com:Admin User'
        : 'mock_public:public_uid:public@example.com:Public User';
      const result = await setSession(idToken, false);
      
      if (result.success && result.user) {
        setUser(result.user);
        setIsLoading(false);
        return { success: true };
      } else {
        const errMessage = result.error || 'Failed to authenticate mock user on the server';
        setError(errMessage);
        setIsLoading(false);
        return { success: false, error: errMessage };
      }
    } catch (err: unknown) {
      console.error('Mock login action error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in with Mock';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await firebaseSignOut();
      await clearSession();
      setUser(null);
    } catch (err: unknown) {
      console.error('Logout action error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        setError,
        loginWithGoogle,
        loginMock,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-400 font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
          <p className="text-sm font-medium tracking-wide">Initializing session...</p>
        </div>
      </div>
    );
  }

  return <TooltipProvider>{children}</TooltipProvider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
