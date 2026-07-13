import { adminAuth, adminDb } from '@/firebase/admin';
import type { User, UserRole } from '@/types';
import { COLLECTIONS } from '@/constants';

/** Verify Firebase ID Token */
export async function verifyIdToken(token: string) {
  try {
    return await adminAuth.verifyIdToken(token);
  } catch (error) {
    console.warn(
      'Firebase ID token verification failed:',
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

/** Get user data from Firestore. If user does not exist and autoCreate is true, create a new public user. */
export async function getOrCreateUser(
  uid: string,
  email: string,
  name: string,
  photoURL?: string,
  autoCreate = true
): Promise<User | null> {
  try {
    const userRef = adminDb.collection(COLLECTIONS.USERS).doc(uid);
    const docSnap = await userRef.get();

    if (docSnap.exists) {
      const data = docSnap.data();
      const now = new Date();

      // Update last login
      await userRef.update({
        lastLogin: now,
        updatedAt: now,
      });

      return {
        id: uid,
        name: data?.name || name,
        email: data?.email || email,
        role: (data?.role || 'public') as UserRole,
        profilePicture: data?.profilePicture || photoURL || '',
        isActive: data?.isActive ?? true,
        lastLogin: data?.lastLogin?.toDate() ?? now,
        createdAt: data?.createdAt?.toDate() ?? now,
        updatedAt: now,
      };
    }

    if (!autoCreate) return null;

    const now = new Date();

    const newUser = {
      name,
      email,
      role: 'public' as UserRole,
      profilePicture: photoURL || '',
      isActive: true,
      lastLogin: now,
      createdAt: now,
      updatedAt: now,
    };

    await userRef.set(newUser);

    return {
      id: uid,
      ...newUser,
    };
  } catch (error) {
    console.warn(
      'Error in getOrCreateUser:',
      error instanceof Error ? error.message : error
    );
    throw error;
  }
}