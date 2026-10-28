import React, { useEffect, useState } from 'react';
import { SearchX, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/common/Button';
import { Skeleton } from '@/components/common/Skeleton';
import { BoardFilters } from '@/components/request/BoardFilters';
import { RequestCard } from '@/components/request/RequestCard';
import { useCategories } from '@/hooks/useCategories';
import { useOpenRequests } from '@/hooks/useRequests';
import { useAuth } from '@/hooks/useAuth';
import { getProvider } from '@/services/firestore';
import type { Provider } from '@/types/provider';

export function BoardPage() {
  const [filter, setFilter] = useState('');
  const { categories } = useCategories();
  const { requests, loading, error, loadMore, hasMore, retry } = useOpenRequests(filter);
  const { user, isAuthenticated } = useAuth();
  const [provider, setProvider] = useState<Provider | null>(null);

  // Load provider profile for the sidebar identity block
  useEffect(() => {
    if (user) {
      getProvider(user.uid)
        .then((data) => setProvider(data))
        .catch(() => { /* non-fatal — sidebar still renders with fallback */ });
    }
  }, [user]);

  const labelFor = (id: string): string =>
    categories.find((c) => c.id === id)?.label ?? id;

  const content = (
    <>
      {/* Header */}
      <div className="mb-8">
        <h2 className="font-display font-bold text-2xl text-slate-900">Open Requests</h2>
        <p className="font-sans text-sm text-slate-500 mt-1">
          Browse requests that didn't find an immediate match and reach out directly.
        </p>
      </div>

      {/* Filter bar */}
      <BoardFilters value={filter} onChange={setFilter} categories={categories} />

      {/* Content */}
      <div className="mt-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-6">
                <Skeleton className="w-24 h-6 rounded-md" />
                <Skeleton className="w-full h-4 mt-3 rounded-md" />
                <Skeleton className="w-2/3 h-4 mt-2 rounded-md" />
                <Skeleton className="w-full h-10 mt-4 rounded-lg" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <AlertCircle size={48} className="text-red-400" aria-hidden="true" />
            <p className="font-display text-xl text-slate-700 mt-4">Failed to load requests.</p>
            <div className="mt-6">
              <Button variant="ghost" onClick={retry}>Retry</Button>
            </div>
          </div>
        ) : requests.length === 0 && filter === '' ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <SearchX size={48} className="text-slate-300" aria-hidden="true" />
            <h3 className="font-display text-xl text-slate-700 mt-4">No open requests right now.</h3>
            <p className="font-sans text-sm text-slate-500 mt-2">Check back soon, or post your own request.</p>
            <div className="mt-6">
              <Button variant="primary" href="/post-request">Post a Request</Button>
            </div>
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <SearchX size={48} className="text-slate-300" aria-hidden="true" />
            <h3 className="font-display text-xl text-slate-700 mt-4">No requests for this service type.</h3>
            <div className="mt-6">
              <Button variant="ghost" onClick={() => setFilter('')}>Clear filter</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {requests.map((req) => (
                <RequestCard
                  key={req.id}
                  request={req}
                  categoryLabel={labelFor(req.serviceType)}
                />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-8">
                <Button variant="ghost" onClick={loadMore}>Load more requests</Button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );

  // Authenticated users get the dashboard shell; guests get the regular layout
  if (isAuthenticated) {
    return (
      <DashboardLayout provider={provider} pageTitle="Browse Requests">
        {content}
      </DashboardLayout>
    );
  }

  return (
    <PageWrapper>
      <h1 className="font-display text-3xl text-slate-900">Open Requests</h1>
      <p className="font-sans text-slate-600 mt-2">
        These requests didn't find an immediate match. Browse and reach out directly.
      </p>
      <div className="mt-8">{content}</div>
    </PageWrapper>
  );
}
