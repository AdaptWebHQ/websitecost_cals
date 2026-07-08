import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from './client';

/** Upload a file or Blob to Firebase Storage at a specified path and return its download URL */
export async function uploadFile(
  file: File | Blob,
  path: string
): Promise<string> {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  } catch (error) {
    console.error(`Error uploading file to ${path}:`, error);
    throw error;
  }
}

/** Delete a file by path from Firebase Storage */
export async function deleteFile(path: string): Promise<void> {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error(`Error deleting file from ${path}:`, error);
    throw error;
  }
}
