import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface LocationValue {
  locationName: string;
  lat: number;
  lng: number;
}

interface LocationInputProps {
  value: string;
  onLocationSelect: (value: LocationValue) => void;
  error?: string;
  label: string;
  required?: boolean;
}

// Extend Window to allow Google Maps types without full @types/google.maps dep
declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: object
          ) => {
            addListener: (event: string, handler: () => void) => void;
            getPlace: () => {
              name?: string;
              geometry?: { location?: { lat: () => number; lng: () => number } };
              formatted_address?: string;
            };
          };
        };
      };
    };
  }
}

export function LocationInput({
  value,
  onLocationSelect,
  error,
  label,
  required,
}: LocationInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localValue, setLocalValue] = useState(value);
  const [mapsAvailable, setMapsAvailable] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      // No API key — degrade gracefully to plain text input
      return;
    }

    if (window.google?.maps?.places) {
      initAutocomplete();
      return;
    }

    const scriptId = 'google-maps-script';
    if (document.getElementById(scriptId)) {
      // Script already loading — wait for it
      const interval = setInterval(() => {
        if (window.google?.maps?.places) {
          clearInterval(interval);
          initAutocomplete();
        }
      }, 200);
      return () => clearInterval(interval);
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = initAutocomplete;
    document.head.appendChild(script);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function initAutocomplete() {
    if (!inputRef.current || !window.google?.maps?.places) return;
    setMapsAvailable(true);
    const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: ['ug', 'ke', 'tz', 'rw'] },
      fields: ['name', 'geometry', 'formatted_address'],
    });
    ac.addListener('place_changed', () => {
      const place = ac.getPlace();
      const lat = place.geometry?.location?.lat() ?? 0;
      const lng = place.geometry?.location?.lng() ?? 0;
      const locationName = place.formatted_address || place.name || '';
      setLocalValue(locationName);
      onLocationSelect({ locationName, lat, lng });
    });
  }

  const inputId = label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
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
          ref={inputRef}
          id={inputId}
          type="text"
          value={localValue}
          onChange={(e) => {
            setLocalValue(e.target.value);
            if (!mapsAvailable) {
              // Fallback plain text: propagate manually with zero coords
              onLocationSelect({ locationName: e.target.value, lat: 0, lng: 0 });
            }
          }}
          placeholder={mapsAvailable ? 'Start typing a location...' : 'Enter your location'}
          className={`
            w-full border rounded-lg pl-9 pr-4 py-3 font-sans text-base text-slate-900
            bg-white placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent
            transition-colors duration-150
            ${error ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
      </div>
      {!mapsAvailable && !import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
        <p className="font-sans text-slate-400 text-xs mt-1">
          Location autocomplete unavailable. Enter your location manually.
        </p>
      )}
      {error && (
        <p
          id={`${inputId}-error`}
          className="font-sans text-red-600 text-sm mt-1.5 flex items-center gap-1.5"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
