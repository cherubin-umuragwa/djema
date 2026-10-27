import React from 'react';

type BadgeVariant = 'green' | 'slate' | 'amber' | 'red' | 'blue';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  green: 'bg-green-100 text-green-700',
  slate: 'bg-slate-100 text-slate-600',
  amber: 'bg-amber-100 text-amber-700',
  red:   'bg-red-100 text-red-700',
  blue:  'bg-blue-100 text-blue-700',
};

export function Badge({
  variant = 'slate',
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium font-sans ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
