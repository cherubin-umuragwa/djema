import React from 'react';
import { AlertCircle } from 'lucide-react';
import type { Category } from '@/types/category';
import { getIcon } from '@/utils/icons';

interface CategoryPickerProps {
  value: string;
  onChange: (categoryId: string) => void;
  categories: Category[];
  error?: string;
}

export function CategoryPicker({ value, onChange, categories, error }: CategoryPickerProps) {
  const activeCategories = categories.filter(c => c.isActive);
  return (
    <div>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
        {activeCategories.map(cat => {
          const Icon = getIcon(cat.icon ?? '');
          const isSelected = value === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange(isSelected ? '' : cat.id)}
              className={`rounded-lg p-4 flex flex-col items-center gap-2 cursor-pointer transition-colors ${
                isSelected
                  ? 'border-2 border-green-600 bg-green-50 text-green-700'
                  : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Icon size={24} aria-hidden="true" />
              <span className="font-sans text-xs text-center leading-tight">{cat.label}</span>
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
