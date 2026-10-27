import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastItemProps extends ToastMessage {
  onDismiss: (id: string) => void;
}

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle2 size={16} className="text-green-600 shrink-0" aria-hidden="true" />,
  error:   <AlertCircle  size={16} className="text-red-600 shrink-0"   aria-hidden="true" />,
  warning: <AlertTriangle size={16} className="text-amber-600 shrink-0" aria-hidden="true" />,
  info:    <Info size={16} className="text-blue-600 shrink-0"          aria-hidden="true" />,
};

export function ToastItem({ id, type, message, onDismiss }: ToastItemProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-start gap-3 bg-white rounded-xl shadow-md px-4 py-3 min-w-[280px] max-w-sm border border-slate-100"
    >
      {iconMap[type]}
      <p className="font-sans text-sm text-slate-700 flex-1">{message}</p>
      <button
        onClick={() => onDismiss(id)}
        className="text-slate-400 hover:text-slate-600 transition-colors ml-2 shrink-0 focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
        aria-label="Dismiss notification"
      >
        <X size={14} aria-hidden="true" />
      </button>
    </div>
  );
}
