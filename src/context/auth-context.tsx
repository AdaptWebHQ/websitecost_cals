'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithGoogle as firebaseSignInWithGoogle, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  getUserIdToken,
  type FirebaseUser
} from '@/firebase/auth';
import { setSession, clearSession, getServerUser } from '@/actions/auth';
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
          // Check if valid server user session exists before clearing
          const serverUser = await getServerUser();
          if (serverUser) {
            setUser(serverUser);
          } else {
            await clearSession();
            setUser(null);
          }
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

const CATCHY_PHRASES = [
  "Crafting high-performance digital experiences...",
  "Transforming your bold ideas into clean, interactive code...",
  "Designing pixel-perfect interfaces that inspire and engage...",
  "Building ultra-fast, modern, and SEO-friendly websites...",
  "Bringing your business online with premium responsive layouts...",
  "Optimizing performance, speed, and overall user experience...",
  "Developing cutting-edge, secure, and scalable web solutions...",
  "Empowering your brand through state-of-the-art web design..."
];

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();
  const [catchyPhrase, setCatchyPhrase] = useState('');

  useEffect(() => {
    if (isLoading) {
      const randomIndex = Math.floor(Math.random() * CATCHY_PHRASES.length);
      setCatchyPhrase(CATCHY_PHRASES[randomIndex]);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 text-slate-600 font-sans">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm px-4 animate-in fade-in-50 duration-500">
          <img
            src="/uploaded_logo.png"
            alt="AdaptWeb Logo"
            className="w-20 h-20 object-contain animate-pulse mb-1"
          />
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-wider">AdaptWeb</h2>
          <div className="w-12 h-1 bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full animate-pulse my-1" />
          <p className="text-sm font-medium tracking-wide text-slate-500 italic animate-in fade-in duration-700">
            {catchyPhrase || "Initializing session..."}
          </p>
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
