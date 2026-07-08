import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './client';

const googleProvider = new GoogleAuthProvider();

// Force account selection when logging in
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

/** Sign in with Google (Popup first, fallback to Redirect if blocked) */
export async function signInWithGoogle(): Promise<FirebaseUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.warn('Google Popup Sign-In blocked/failed. Redirecting...', error?.message || error);
    try {
      await signInWithRedirect(auth, googleProvider);
      return new Promise(() => {}); // Page redirects, return unresolved promise
    } catch (redirectError) {
      console.error('Redirect sign-in failed:', redirectError);
      throw error;
    }
  }
}

/** Sign out the current user */
export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Sign-Out Error:', error);
    throw error;
  }
}

/** Get the current authenticated user's ID token */
export async function getUserIdToken(user: FirebaseUser): Promise<string> {
  return user.getIdToken();
}

/** Subscribe to authentication state changes without needing to pass the client Auth instance */
export function onAuthStateChanged(
  callback: (user: FirebaseUser | null) => void
) {
  return firebaseOnAuthStateChanged(auth, callback);
}

export { type FirebaseUser };
