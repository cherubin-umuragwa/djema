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
  addDoc,
  Timestamp,
  where,
  limit as firestoreLimit,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import type { Provider } from '@/types/provider';
import type { Category } from '@/types/category';
import type { ServiceRequest } from '@/types/request';
import type { MatchDocument } from '@/types/match';

// Re-export GeoPoint and Timestamp so pages can construct them without importing firebase/firestore directly.
export { GeoPoint, Timestamp };

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

export async function createRequest(
  data: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt' | 'expiresAt' | 'matchCount' | 'descriptionEmbedding' | 'status' | 'isPublic'>,
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'requests'), {
      ...data,
      matchCount: 0,
      descriptionEmbedding: null,
      status: 'pending' as const,
      isPublic: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      expiresAt: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
    });
    return docRef.id;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error('Failed to create request: ' + message);
  }
}

export async function updateRequest(id: string, data: Partial<ServiceRequest>): Promise<void> {
  try {
    await updateDoc(doc(db, 'requests', id), { ...data });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error('Failed to update request: ' + message);
  }
}

export async function getRequest(id: string, sessionToken: string): Promise<ServiceRequest | null> {
  try {
    const snap = await getDoc(doc(db, 'requests', id));
    if (!snap.exists()) return null;
    const data = snap.data() as ServiceRequest;
    if (data.sessionToken !== sessionToken) return null;
    return { ...data, id: snap.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error('Failed to fetch request: ' + message);
  }
}

export function subscribeToRequest(
  id: string,
  callback: (req: ServiceRequest | null) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  return onSnapshot(
    doc(db, 'requests', id),
    (snap) => {
      callback(snap.exists() ? ({ ...snap.data(), id: snap.id } as ServiceRequest) : null);
    },
    (err) => {
      if (onError) onError(err); else callback(null);
    },
  );
}

export async function createMatch(
  requestId: string,
  data: Omit<MatchDocument, 'createdAt'>,
): Promise<void> {
  try {
    await setDoc(doc(db, 'matches', requestId), {
      ...data,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error('Failed to create match: ' + message);
  }
}

export function subscribeToMatch(
  requestId: string,
  callback: (match: MatchDocument | null) => void,
  onError?: (err: Error) => void,
): Unsubscribe {
  return onSnapshot(
    doc(db, 'matches', requestId),
    (snap) => {
      callback(snap.exists() ? (snap.data() as MatchDocument) : null);
    },
    (err) => {
      if (onError) onError(err); else callback(null);
    },
  );
}

export function subscribeToOpenRequests(
  callback: (requests: ServiceRequest[]) => void,
  serviceType?: string,
  onError?: (err: Error) => void,
): Unsubscribe {
  const constraints: Parameters<typeof query>[1][] = [
    where('isPublic', '==', true),
    where('status', '==', 'open'),
    orderBy('createdAt', 'desc'),
    firestoreLimit(30),
  ];
  if (serviceType) {
    constraints.unshift(where('serviceType', '==', serviceType));
  }
  const q = query(collection(db, 'requests'), ...constraints);
  return onSnapshot(
    q,
    (snap) => {
      callback(snap.docs.map((d) => ({ ...d.data(), id: d.id } as ServiceRequest)));
    },
    (err) => {
      if (onError) onError(err); else callback([]);
    },
  );
}

export async function getAvailableProviders(): Promise<Provider[]> {
  try {
    const q = query(
      collection(db, 'providers'),
      where('available', '==', true),
      where('isActive', '==', true),
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Provider);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error('Failed to fetch available providers: ' + message);
  }
}
