import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { Category } from '@/types/category';

interface SkillPickerProps {
  value: string[];
  onChange: (skills: string[]) => void;
  categories: Category[];
  error?: string;
}

export function SkillPicker({ value, onChange, categories, error }: SkillPickerProps) {
  function toggle(id: string) {
    if (value.includes(id)) {
      onChange(value.filter((s) => s !== id));
    } else if (value.length < 10) {
      onChange([...value, id]);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const selected = value.includes(cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => toggle(cat.id)}
              className={`
                rounded-md px-3 py-1.5 font-sans text-sm font-medium
                transition-colors duration-150
                focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1
                ${selected
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}
              `}
              aria-pressed={selected}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
      {error && (
        <p className="font-sans text-red-600 text-sm mt-1.5 flex items-center gap-1.5" role="alert">
          <AlertCircle size={14} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
