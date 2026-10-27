import React from 'react';
import { SearchX } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/common/Button';

export function NotFoundPage() {
  return (
    <PageWrapper className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <SearchX size={48} className="text-slate-300 mb-6" aria-hidden="true" />
      <h1 className="font-display font-bold text-xl text-slate-900 mb-4">Page not found.</h1>
      <Button variant="primary" href="/">Go to homepage</Button>
    </PageWrapper>
  );
}
