import { useState, useEffect } from 'react';
import type { Provider } from '@/types/provider';
import { getAvailableProviders } from '@/services/firestore';

export function useProviders(): { providers: Provider[]; loading: boolean; error: string | null } {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getAvailableProviders()
      .then((data) => {
        if (!cancelled) {
          setProviders(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load providers');
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []); // intentional empty deps — fetch once on mount

  return { providers, loading, error };
}
