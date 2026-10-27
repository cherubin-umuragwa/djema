import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper({ children, className = '' }: PageWrapperProps) {
  return (
    <main className={`max-w-5xl mx-auto px-4 pt-24 pb-16 ${className}`}>
      {children}
    </main>
  );
}
