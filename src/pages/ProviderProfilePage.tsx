import React from 'react';
import { useParams } from 'react-router-dom';
import { PageWrapper } from '@/components/layout/PageWrapper';

export function ProviderProfilePage() {
  const { id } = useParams<{ id: string }>();
  return (
    <PageWrapper>
      <h1 className="font-display font-bold text-3xl text-slate-900">Provider profile</h1>
      <p className="font-sans text-slate-600 mt-4">Provider ID: {id} — profile coming in Phase 2.</p>
    </PageWrapper>
  );
}
