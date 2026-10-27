import React from 'react';
import { useParams } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/PageWrapper';

export function MatchesPage() {
  const { requestId } = useParams<{ requestId: string }>();
  return (
    <PageWrapper>
      <h1 className="font-display font-bold text-3xl text-slate-900">Match results</h1>
      <p className="font-sans text-slate-600 mt-4">Request ID: {requestId} — match results coming in Phase 2.</p>
    </PageWrapper>
  );
}
