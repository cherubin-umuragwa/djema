// Initials-based avatar — used in place of profile photos since
// Firebase Storage requires a billing account (not available on Spark plan).

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Deterministic color from name — same name always gets the same color
const COLORS = [
  'bg-green-600',
  'bg-blue-600',
  'bg-amber-600',
  'bg-rose-600',
  'bg-violet-600',
  'bg-teal-600',
  'bg-orange-600',
  'bg-cyan-600',
];

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

const SIZE_CLASSES = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
};

export function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  const initials = getInitials(name);
  const color = getColor(name);

  return (
    <div
      className={`
        ${SIZE_CLASSES[size]}
        ${color}
        rounded-full flex items-center justify-center
        font-sans font-semibold text-white
        flex-shrink-0
        ${className}
      `}
      aria-label={`Avatar for ${name}`}
      role="img"
    >
      {initials}
    </div>
  );
}
