import React from 'react';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

interface AvailabilityToggleProps {
  available: boolean;
  onChange: (value: boolean) => void;
  loading?: boolean;
}

export function AvailabilityToggle({ available, onChange, loading = false }: AvailabilityToggleProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(!available);
    }
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={available}
      onClick={() => onChange(!available)}
      onKeyDown={handleKeyDown}
      disabled={loading}
      className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 rounded-lg p-1 disabled:opacity-70"
    >
      {/* Track */}
      <div
        className={`
          w-11 h-6 rounded-full transition-colors duration-150 flex-shrink-0
          ${available ? 'bg-green-600' : 'bg-slate-300'}
        `}
        aria-hidden="true"
      >
        {/* Thumb */}
        <div
          className={`
            w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-150 mt-0.5
            ${available ? 'translate-x-5' : 'translate-x-0.5'}
          `}
        />
      </div>

      {/* Label */}
      <span className="flex items-center gap-2">
        {loading ? (
          <Loader2 size={16} className="animate-spin text-slate-400" aria-hidden="true" />
        ) : available ? (
          <CheckCircle2 size={16} className="text-green-600" aria-hidden="true" />
        ) : (
          <XCircle size={16} className="text-slate-400" aria-hidden="true" />
        )}
        {available ? (
          <span className="font-sans text-sm font-medium text-slate-700">Available for work</span>
        ) : (
          <span className="font-sans text-sm text-slate-500">Not available</span>
        )}
      </span>
    </button>
  );
}
