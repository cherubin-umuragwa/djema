import { useEffect, useState } from 'react';
import { subscribeToCategories } from '@/services/firestore';
import type { Category } from '@/types/category';

export function useCategories(): { categories: Category[]; loading: boolean } {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = subscribeToCategories((cats) => {
      setCategories(cats);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { categories, loading };
}
