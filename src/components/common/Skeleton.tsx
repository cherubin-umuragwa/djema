import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: string;
}

// NOTE: width/height inline styles are used here because they accept dynamic values
// that cannot be expressed as static Tailwind classes. This is the only exception to
// the no-inline-styles rule per AGENTS.md.
export function Skeleton({
  className = '',
  width,
  height,
  rounded = 'rounded-md',
}: SkeletonProps) {
  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={`animate-pulse bg-slate-200 ${rounded} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}
