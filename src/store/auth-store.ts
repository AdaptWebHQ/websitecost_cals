import { create } from 'zustand';
import { 
  signInWithGoogle as firebaseSignInWithGoogle, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  getUserIdToken,
  type FirebaseUser
} from '@/firebase/auth';
import { setSession, clearSession } from '@/actions/auth';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  initializeAuth: () => () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isInitialized: false,
  error: null,

  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  loginWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      // 1. Google sign in on Firebase client
      const firebaseUser = await firebaseSignInWithGoogle();
      
      // 2. Retrieve ID token
      const idToken = await getUserIdToken(firebaseUser);
      
      // 3. Set cookie session and obtain full Firestore User Profile
      const result = await setSession(idToken);
      
      if (result.success && result.user) {
        set({ user: result.user, isLoading: false, isInitialized: true });
        return true;
      } else {
        await firebaseSignOut();
        set({ error: result.error || 'Failed to authenticate on the server', isLoading: false });
        return false;
      }
    } catch (err: unknown) {
      console.error('Login action error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in with Google';
      set({ error: errorMessage, isLoading: false });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      // 1. Sign out on Firebase client
      await firebaseSignOut();
      
      // 2. Clear server session cookies
      await clearSession();
      
      set({ user: null, isLoading: false, isInitialized: false });
    } catch (err: unknown) {
      console.error('Logout action error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out';
      set({ error: errorMessage, isLoading: false });
    }
  },

  initializeAuth: () => {
    // Prevent re-initialization if already listening
    if (get().isInitialized) {
      return () => {};
    }

    set({ isLoading: true });
    
    // Subscribe to Firebase client auth state change listener
    const unsubscribe = onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          const idToken = await getUserIdToken(firebaseUser);
          const result = await setSession(idToken);
          
          if (result.success && result.user) {
            set({ user: result.user, isLoading: false, isInitialized: true });
          } else {
            // If server-side session sync fails or profile deactivated
            await firebaseSignOut();
            await clearSession();
            set({ user: null, isLoading: false, isInitialized: true });
          }
        } else {
          await clearSession();
          set({ user: null, isLoading: false, isInitialized: true });
        }
      } catch (err) {
        console.error('Authentication sync error:', err);
        set({ user: null, isLoading: false, isInitialized: true });
      }
    });

    return unsubscribe;
  },
}));
