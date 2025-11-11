// components/Discover/FacetsBlock.tsx
'use client';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/16/solid';
import FacetMultiSelect from './FacetMultiSelect';
import Link from 'next/link';

type Facet = {
  type: 'literal' | 'object' | 'continuous' | string;
  label: string;
  tooltip?: Record<string, string>;
  values?: Array<{ value: string; label: string; count?: number }>;
  min?: number | string;
  max?: number | string;
};

type FacetItem = Record<string, Facet>;

type FacetsBlockProps = {
  data?: FacetItem;
  selected?: Record<string, string[]>;
  onChangeFilters?: (next: Record<string, string[] | null | string>) => void;
  // NEW: current q from URL
  searchQuery?: string;
};

const FacetsBlock: React.FC<FacetsBlockProps> = ({
  data = {} as FacetItem,
  selected = {},
  onChangeFilters,
  searchQuery = '',
}) => {
  const lang = Cookies.get('i18nextLng') || 'en';
  const { t } = useTranslation();

  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [topSearch, setTopSearch] = useState(searchQuery);

  // if URL changes (back/forward), update the input too
  useEffect(() => {
    setTopSearch(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    const initial: Record<string, boolean> = {};
    Object.keys(data).forEach((k) => (initial[k] = true));
    setOpen(initial);
  }, [data]);

  const toggle = (k: string) => setOpen((prev) => ({ ...prev, [k]: !prev[k] }));

  const handleLiteralChange = (facetKey: string, values: string[]) => {
    onChangeFilters?.({
      [facetKey]: values.length ? values : null,
    });
  };

  const handleTopSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = topSearch.trim();
    onChangeFilters?.({
      q: trimmed === '' ? null : trimmed,
    });
  };

  return (
    <div className="space-y-4">
      {/* top search bar */}
      <div className="flex items-center gap-[10px]">
        <form className="flex w-full mx-auto" onSubmit={handleTopSearchSubmit}>
          <input
            type="text"
            value={topSearch}
            onChange={(e) => setTopSearch(e.target.value)}
            placeholder="Find resources..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 placeholder-gray-400"
          />
          <button
            type="submit"
            className="bg-[#4A90A0] hover:bg-[#3A7C8B] text-white px-4 flex items-center justify-center rounded-r-full transition"
            aria-label="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </form>
      </div>

      {Object.entries(data).map(([key, fd]) => (
        <div
          key={key}
          className="border border-[#E1E1E1] rounded-[8px] w-full bg-white"
        >
          <div className="flex items-center gap-2 bg-[#FAFAFA] px-4 py-2">
            <span className="font-medium text-sm">{fd.label}</span>
            <button
              onClick={() => toggle(key)}
              className="ml-auto flex px-2 py-1 focus:outline-none"
              aria-expanded={!!open[key]}
            >
              {open[key] ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>

          {open[key] && (
            <div className="p-3 space-y-2">
              {(fd.type === 'literal' || fd.type === 'object') && (
                <FacetMultiSelect
                  facetKey={key}
                  options={fd.values ?? []}
                  selected={selected[key] ?? []}
                  onChange={handleLiteralChange}
                />
              )}

              {fd.type === 'continuous' && (
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                    onChange={(e) =>
                      onChangeFilters?.({
                        [`${key}_from`]: e.target.value
                          ? [e.target.value]
                          : null,
                      })
                    }
                  />
                  <input
                    type="date"
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                    onChange={(e) =>
                      onChangeFilters?.({
                        [`${key}_to`]: e.target.value ? [e.target.value] : null,
                      })
                    }
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Reset */}
      <div className="w-full">
        <button
          onClick={() => onChangeFilters?.({ q: null })}
          className="block btn-arche-blue text-white w-full text-center"
        >
          {t('Reset filters')}
        </button>
      </div>
    </div>
  );
};

export default FacetsBlock;
