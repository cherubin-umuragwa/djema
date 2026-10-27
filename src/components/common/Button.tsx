import React from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'whatsapp' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  href?: string;
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  secondary:
    'border border-green-600 text-green-600 hover:bg-green-50 focus:ring-green-500',
  whatsapp:
    'bg-[#25D366] text-white hover:bg-[#128C7E] focus:ring-green-500',
  ghost:
    'text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-400',
  danger:
    'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-xs min-h-[44px]',
  md: 'px-5 py-2.5 text-sm min-h-[44px]',
  lg: 'px-6 py-3 text-base min-h-[44px]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  href,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold font-sans transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const classes = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const content = (
    <>
      {loading ? (
        <Loader2 size={16} className="animate-spin" aria-hidden="true" />
      ) : (
        leftIcon
      )}
      <span>{loading ? 'Loading...' : children}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {content}
    </button>
  );
}
