import React from 'react';
import { AlertCircle } from 'lucide-react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  maxLength?: number;
}

// forwardRef is required so React Hook Form's register() can attach its ref
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { label, error, helpText, required, maxLength, id, className = '', value, ...props },
    ref,
  ) {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');
    const charCount = typeof value === 'string' ? value.length : 0;

    return (
      <div className="w-full">
        <label
          htmlFor={inputId}
          className="block font-sans font-medium text-sm text-slate-700 mb-1.5"
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        <textarea
          id={inputId}
          ref={ref}
          maxLength={maxLength}
          value={value}
          className={`
            w-full border rounded-lg px-4 py-3 font-sans text-base text-slate-900
            bg-white placeholder:text-slate-400 resize-y min-h-[100px]
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
            transition-colors duration-150
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'}
            ${className}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error
              ? `${inputId}-error`
              : helpText
              ? `${inputId}-help`
              : undefined
          }
          {...props}
        />
        {maxLength && (
          <p className="font-sans text-slate-400 text-xs text-right mt-1">
            {charCount}/{maxLength}
          </p>
        )}
        {helpText && !error && (
          <p
            id={`${inputId}-help`}
            className="font-sans text-slate-500 text-sm mt-1.5"
          >
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
  },
);
