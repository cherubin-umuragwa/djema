import { useCallback, useEffect, useState } from 'react';
import { subscribeToOpenRequests } from '@/services/firestore';
import type { ServiceRequest } from '@/types/request';

const PAGE_SIZE = 9;

export function useOpenRequests(serviceTypeFilter?: string): {
  requests: ServiceRequest[];
  loading: boolean;
  error: string | null;
  loadMore: () => void;
  hasMore: boolean;
  retry: () => void;
} {
  const [allRequests, setAllRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const [retryNonce, setRetryNonce] = useState<number>(0);

  // Real-time subscription. Depends on retryNonce only — NOT serviceTypeFilter:
  // Firestore returns all 30 open requests ordered by createdAt desc, and we
  // filter client-side, so changing the filter never tears down the listener.
  useEffect(() => {
    setLoading(true);
    setError(null);
    const unsubscribe = subscribeToOpenRequests(
      (requests) => {
        setAllRequests(requests);
        setLoading(false);
      },
      undefined, // no serviceType → fetch all open requests
      (err: Error) => {
        setError(err.message);
        setLoading(false);
      },
    );
    return unsubscribe;
  }, [retryNonce]);

  // Reset pagination whenever the active filter changes.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [serviceTypeFilter]);

  const loadMore = useCallback(() => {
    setVisibleCount((count) => count + PAGE_SIZE);
  }, []);

  const retry = useCallback(() => {
    setRetryNonce((nonce) => nonce + 1);
  }, []);

  const filtered = serviceTypeFilter
    ? allRequests.filter((r) => r.serviceType === serviceTypeFilter)
    : allRequests;

  return {
    requests: filtered.slice(0, visibleCount),
    loading,
    error,
    loadMore,
    hasMore: visibleCount < filtered.length,
    retry,
  };
}
