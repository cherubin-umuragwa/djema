import { useEffect } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/services/firebase';
import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const { user, loading, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // Subscribe once — onAuthStateChanged keeps auth state in sync
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, [setUser, setLoading]);

  async function signOut() {
    await firebaseSignOut(auth);
  }

  return {
    user,
    loading,
    isAuthenticated: user !== null,
    signOut,
  };
}
