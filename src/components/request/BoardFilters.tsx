import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/common/Button';
import type { Category } from '@/types/category';

interface BoardFiltersProps {
  value: string;
  onChange: (val: string) => void;
  categories: Category[];
}

export function BoardFilters({ value, onChange, categories }: BoardFiltersProps) {
  const activeCategories = categories.filter((c) => c.isActive);

  return (
    <div className="flex flex-row gap-3 flex-wrap">
      <select
        aria-label="Filter by service type"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-slate-300 rounded-lg px-4 py-2.5 font-sans text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors duration-150"
      >
        <option value="">All services</option>
        {activeCategories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.label}
          </option>
        ))}
      </select>

      {value !== '' && (
        <Button
          variant="ghost"
          leftIcon={<X size={16} aria-hidden="true" />}
          onClick={() => onChange('')}
        >
          Clear
        </Button>
      )}
    </div>
  );
}
