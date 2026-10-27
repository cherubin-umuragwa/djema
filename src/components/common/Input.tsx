import React from 'react';
import { AlertCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helpText?: string;
  required?: boolean;
}

export function Input({
  label,
  error,
  helpText,
  required,
  id,
  className = '',
  ...props
}: InputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="block font-sans font-medium text-sm text-slate-700 mb-1.5"
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        id={inputId}
        className={`
          w-full border rounded-lg px-4 py-3 font-sans text-base text-slate-900
          bg-white placeholder:text-slate-400
          focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
          transition-colors duration-150
          ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'}
          ${className}
        `}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined}
        {...props}
      />
      {helpText && !error && (
        <p id={`${inputId}-help`} className="font-sans text-slate-500 text-sm mt-1.5">
          {helpText}
        </p>
      )}
      {error && (
        <p
          id={`${inputId}-error`}
          className="font-sans text-red-600 text-sm mt-1.5 flex items-center gap-1.5"
          role="alert"
        >
          <AlertCircle size={14} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
