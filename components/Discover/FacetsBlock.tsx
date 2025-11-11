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
  // comes from URL
  selected?: Record<string, string[]>;
  // sends changes up → parent updates URL
  onChangeFilters?: (next: Record<string, string[] | null>) => void;
};

const FacetsBlock: React.FC<FacetsBlockProps> = ({
  data = {} as FacetItem,
  selected = {},
  onChangeFilters,
}) => {
  const lang = Cookies.get('i18nextLng') || 'en';
  const { t } = useTranslation();

  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [topSearch, setTopSearch] = useState('');

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
    onChangeFilters?.({
      q: topSearch.trim() === '' ? null : topSearch.trim(),
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
            >
              {open[key] ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>
          {fd.type}
          {open[key] && (
            <div className="p-3 border-t border-[#E1EDF3] space-y-2">
              {fd.type === 'literal' && (
                <FacetMultiSelect
                  facetKey={key}
                  options={fd.values ?? []}
                  selected={selected[key] ?? []}
                  onChange={handleLiteralChange}
                />
              )}

              {fd.type === 'object' && (
                <FacetMultiSelect
                  facetKey={key}
                  options={fd.values ?? []}
                  selected={selected[key] ?? []}
                  onChange={handleLiteralChange}
                />
              )}
              {/*
              {fd.type === 'object' && (
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                  placeholder={`Search ${fd.label}`}
                  // IMPORTANT: only update when user presses Enter
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const value = (e.target as HTMLInputElement).value.trim();
                      onChangeFilters?.({
                        [key]: value ? [value] : null,
                      });
                    }
                  }}
                />
              )}
              */}

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

      {/* Extra card */}
      <div className="border border-[#E1E1E1] rounded-[8px] w-full">
        <div className="flex items-center gap-[10px] bg-[#FAFAFA] px-[24px] py-[10px]">
          <span className="facet-title">{t('Extended Search')}</span>
        </div>
        <div className="flex p-[12px] gap-[24px] border-t border-[#E1EDF3]">
          Body
        </div>
      </div>

      {/* Reset / Search buttons */}
      <div className="w-full">
        <button
          onClick={() => onChangeFilters?.({})}
          className="block btn-arche-blue text-white w-full text-center"
        >
          {t('Reset filters')}
        </button>
      </div>

      <div className="w-full">
        <button className="block btn-arche-blue text-white w-full text-center">
          {t('Search')}
        </button>
      </div>

      <div className="w-full">
        <Link
          href="#"
          target="_blank"
          className="block btn-arche-blue text-white w-full text-center"
        >
          Add to CLARIN Virtual Collection
        </Link>
      </div>
    </div>
  );
};

export default FacetsBlock;
