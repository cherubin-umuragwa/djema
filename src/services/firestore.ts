import {
  GeoPoint,
  serverTimestamp,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  onSnapshot,
  collection,
  getDocs,
  query,
  orderBy,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import type { Provider } from '@/types/provider';
import type { Category } from '@/types/category';

// Re-export GeoPoint so pages can construct one without importing firebase/firestore directly.
export { GeoPoint };

export async function createProvider(
  uid: string,
  data: Omit<Provider, 'uid' | 'createdAt' | 'updatedAt' | 'skillEmbedding'>,
): Promise<void> {
  try {
    await setDoc(doc(db, 'providers', uid), {
      ...data,
      uid,
      skillEmbedding: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error('Failed to create provider profile: ' + message);
  }
}

export async function updateProvider(
  uid: string,
  data: Partial<Provider>,
): Promise<void> {
  try {
    await updateDoc(doc(db, 'providers', uid), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error('Failed to update provider profile: ' + message);
  }
}

export async function getProvider(uid: string): Promise<Provider | null> {
  try {
    const snap = await getDoc(doc(db, 'providers', uid));
    if (!snap.exists()) return null;
    return snap.data() as Provider;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error('Failed to fetch provider profile: ' + message);
  }
}

export function subscribeToProvider(
  uid: string,
  callback: (p: Provider | null) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  return onSnapshot(
    doc(db, 'providers', uid),
    (snap) => {
      callback(snap.exists() ? (snap.data() as Provider) : null);
    },
    (err) => {
      console.error('Provider subscription error:', err.message);
      if (onError) {
        onError(err);
      } else {
        callback(null);
      }
    },
  );
}

export async function getCategories(): Promise<Category[]> {
  try {
    const q = query(collection(db, 'categories'), orderBy('sortOrder', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Category);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error('Failed to fetch categories: ' + message);
  }
}

export function subscribeToCategories(
  callback: (cats: Category[]) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  const q = query(collection(db, 'categories'), orderBy('sortOrder', 'asc'));
  return onSnapshot(
    q,
    (snap) => {
      callback(snap.docs.map((d) => d.data() as Category));
    },
    (err) => {
      console.error('Categories subscription error:', err.message);
      if (onError) {
        onError(err);
      } else {
        callback([]);
      }
    },
  );
}
