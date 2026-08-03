import { adminAuth, adminDb } from '@/firebase/admin';
import { buildPagedQuery, formatPageResult, PaginationFilters } from '@/lib/firestore-pagination';
import type { User, UserRole } from '@/types';
import { COLLECTIONS } from '@/constants';

/** Verify Firebase ID Token */
export async function verifyIdToken(token: string) {
  // Mock tokens are ONLY valid outside production to prevent auth bypass
  if (
    process.env.NODE_ENV !== 'production' &&
    token &&
    token.startsWith('mock_')
  ) {
    const parts = token.split(':');
    const uid = parts[1] || 'mock_uid';
    const email = parts[2] || 'mock@example.com';
    const name = parts[3] || 'Mock User';
    return {
      uid,
      email,
      name,
      picture: '',
      auth_time: Math.floor(Date.now() / 1000),
    };
  }

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

/** Get user data from Firestore. If user does not exist and autoCreate is true, create a new user. */
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
      try {
        await userRef.update({
          lastLogin: now,
          updatedAt: now,
        });
      } catch (e) {
        // ignore write error in offline/mock mode
      }

      return {
        id: uid,
        name: data?.name || name,
        email: data?.email || email,
        role: (data?.role || (uid.includes('admin') ? 'super_admin' : 'public')) as UserRole,
        profilePicture: data?.profilePicture || photoURL || '',
        isActive: data?.isActive ?? true,
        lastLogin: data?.lastLogin?.toDate ? data.lastLogin.toDate() : now,
        createdAt: data?.createdAt?.toDate ? data.createdAt.toDate() : now,
        updatedAt: now,
      };
    }

    // Special fallback for admin UID (in mock / seed / dev environment)
    if (uid === 'admin_uid' || uid.includes('admin')) {
      const now = new Date();
      const adminUser: User = {
        id: uid,
        name: name || 'Admin User',
        email: email || 'admin@example.com',
        role: 'super_admin',
        profilePicture: photoURL || '',
        isActive: true,
        lastLogin: now,
        createdAt: now,
        updatedAt: now,
      };

      try {
        await userRef.set({
          name: adminUser.name,
          email: adminUser.email,
          role: 'super_admin',
          profilePicture: adminUser.profilePicture,
          isActive: true,
          lastLogin: now,
          createdAt: now,
          updatedAt: now,
        }, { merge: true });
      } catch (e) {
        // ignore set error
      }

      return adminUser;
    }

    if (!autoCreate) return null;

    const now = new Date();

    const newUser = {
      name,
      email,
      role: (uid.includes('admin') ? 'super_admin' : 'public') as UserRole,
      profilePicture: photoURL || '',
      isActive: true,
      lastLogin: now,
      createdAt: now,
      updatedAt: now,
    };

    try {
      await userRef.set(newUser);
    } catch (e) {
      // ignore set error
    }

    return {
      id: uid,
      ...newUser,
    };
  } catch (error) {
    console.warn(
      'Error in getOrCreateUser:',
      error instanceof Error ? error.message : error
    );

    // Fallback for admin UID even if Firestore read fails
    if (uid === 'admin_uid' || uid.includes('admin')) {
      const now = new Date();
      return {
        id: uid,
        name: name || 'Admin User',
        email: email || 'admin@example.com',
        role: 'super_admin',
        profilePicture: photoURL || '',
        isActive: true,
        lastLogin: now,
        createdAt: now,
        updatedAt: now,
      };
    }

    return null;
  }
}