import {
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  DocumentData,
  type WithFieldValue,
  type UpdateData,
  type QueryConstraint,
  type FirestoreDataConverter,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from './client';

/** Generic converter to automatically convert Firestore Timestamps to native JS Date objects on fetch */
export const genericConverter = <T extends DocumentData>(): FirestoreDataConverter<T> => ({
  toFirestore: (data: WithFieldValue<T>): DocumentData => {
    return data as DocumentData;
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): T => {
    const data = snapshot.data();
    
    // Recursive parser for Firestore Timestamp objects
    const parseTimestamps = (obj: unknown): unknown => {
      if (!obj) return obj;
      if (typeof obj === 'object') {
        const record = obj as Record<string, unknown>;
        if (record.seconds !== undefined && record.nanoseconds !== undefined) {
          return new Date((record.seconds as number) * 1000);
        }
        if (Array.isArray(obj)) {
          return obj.map(parseTimestamps);
        }
        const newObj: Record<string, unknown> = {};
        for (const key in record) {
          if (Object.prototype.hasOwnProperty.call(record, key)) {
            newObj[key] = parseTimestamps(record[key]);
          }
        }
        return newObj;
      }
      return obj;
    };

    return {
      id: snapshot.id,
      ...(parseTimestamps(data) as Record<string, unknown>),
    } as unknown as T;
  },
});

/** Retrieve a single document by ID from Firestore */
export async function getDocument<T extends DocumentData>(
  collectionName: string,
  id: string
): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, id).withConverter(genericConverter<T>());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as T;
    }
    return null;
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error);
    throw error;
  }
}

/** Create a new document in Firestore with an auto-generated ID */
export async function addDocument<T extends DocumentData>(
  collectionName: string,
  data: WithFieldValue<T>
): Promise<string> {
  try {
    const colRef = collection(db, collectionName).withConverter(genericConverter<T>());
    const docRef = await addDoc(colRef, data);
    return docRef.id;
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
}

/** Set (upsert) a document with a specified ID in Firestore */
export async function setDocument<T extends DocumentData>(
  collectionName: string,
  id: string,
  data: WithFieldValue<T>
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id).withConverter(genericConverter<T>());
    await setDoc(docRef, data, { merge: true });
  } catch (error) {
    console.error(`Error setting document in ${collectionName}:`, error);
    throw error;
  }
}

/** Update fields of an existing document in Firestore */
export async function updateDocument<T extends DocumentData>(
  collectionName: string,
  id: string,
  data: UpdateData<T>
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id).withConverter(genericConverter<T>());
    await updateDoc(docRef, data);
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error);
    throw error;
  }
}

/** Delete a document by ID from Firestore */
export async function deleteDocument(
  collectionName: string,
  id: string
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error);
    throw error;
  }
}

/** Query documents from Firestore using constraints */
export async function queryDocuments<T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  try {
    const colRef = collection(db, collectionName).withConverter(genericConverter<T>());
    const q = query(colRef, ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((snap) => snap.data());
  } catch (error) {
    console.error(`Error querying documents from ${collectionName}:`, error);
    throw error;
  }
}
