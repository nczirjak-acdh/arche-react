'use client';
import React, { useState, useRef, useEffect } from 'react';

type Option = {
  value: string;
  label: string;
  count?: number;
};

type FacetMultiSelectProps = {
  facetKey: string;
  options: Option[];
  selected: string[];
  onChange: (facetKey: string, nextValues: string[]) => void;
};

const FacetMultiSelect: React.FC<FacetMultiSelectProps> = ({
  facetKey,
  options,
  selected,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // available = options not yet selected

  const available = options.filter(
    (o) =>
      !selected.includes(o.value) &&
      o.label.toLowerCase().includes(filter.toLowerCase())
  );

  const addValue = (val: string) => {
    const next = [...selected, val];
    onChange(facetKey, next);
    setFilter('');
  };

  const removeValue = (val: string) => {
    const next = selected.filter((v) => v !== val);
    onChange(facetKey, next);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div
        className="flex min-h-10 w-full flex-wrap items-center gap-2 rounded-md border border-gray-300 bg-white px-2 py-1 cursor-text"
        onClick={() => setOpen(true)}
      >
        {selected.map((val) => {
          const opt = options.find((o) => o.value === val);
          return (
            <span
              key={val}
              className="flex items-center gap-1 rounded bg-gray-200 px-2 py-0.5 text-sm"
            >
              {opt ? opt.label : val}
              <button
                type="button"
                className="text-gray-600"
                onClick={(e) => {
                  e.stopPropagation();
                  removeValue(val);
                }}
              >
                ×
              </button>
            </span>
          );
        })}

        <input
          className="flex-1 min-w-[80px]  focus:ring-0 text-sm !border-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={selected.length === 0 ? 'Select…' : ''}
        />
      </div>
      {open && (
        <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-md  bg-white shadow">
          {available.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-400">
              No more options
            </div>
          ) : (
            available.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => addValue(opt.value)}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-100"
              >
                <span>{opt.label}</span>
                {typeof opt.count === 'number' && (
                  <span className="text-xs text-gray-400">({opt.count})</span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FacetMultiSelect;
