import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, MapPin } from 'lucide-react';
import { geocodeLocation } from '@/utils/geocoding';
import type { NominatimResult } from '@/utils/geocoding';

interface LocationValue {
  locationName: string;
  lat: number;
  lng: number;
}

interface LocationInputProps {
  value: string;
  onLocationSelect: (loc: LocationValue) => void;
  error?: string;
  label?: string;
  required?: boolean;
}

export function LocationInput({
  value,
  onLocationSelect,
  error,
  label = 'Location',
  required,
}: LocationInputProps) {
  const [inputText, setInputText] = useState(value);
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync external value changes (e.g. form reset)
  useEffect(() => {
    setInputText(value);
  }, [value]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const text = e.target.value;
    setInputText(text);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (text.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const results = await geocodeLocation(text);
        setSuggestions(results);
        setIsOpen(results.length > 0);
      } catch {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 500);
  }

  function handleSuggestionClick(item: NominatimResult) {
    onLocationSelect({
      locationName: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    });
    setInputText(item.display_name);
    setSuggestions([]);
    setIsOpen(false);
  }

  const inputId = label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full" ref={containerRef}>
      <label
        htmlFor={inputId}
        className="block font-sans font-medium text-sm text-slate-700 mb-1.5"
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <MapPin
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          aria-hidden="true"
        />
        <input
          id={inputId}
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Start typing a location..."
          className={`
            w-full border rounded-lg pl-9 pr-4 py-3 font-sans text-base text-slate-900
            bg-white placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
            transition-colors duration-150
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          autoComplete="off"
        />
        {isOpen && suggestions.length > 0 && (
          <ul
            role="listbox"
            className="absolute z-10 w-full mt-1 bg-white rounded-xl shadow-md border border-slate-100"
          >
            {suggestions.map((item) => (
              <li
                key={`${item.lat}-${item.lon}`}
                role="option"
                aria-selected="false"
                onMouseDown={() => handleSuggestionClick(item)}
                className="px-4 py-2.5 font-sans text-sm text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {item.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>
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
