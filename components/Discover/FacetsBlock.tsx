// components/Discover/FacetsBlock.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/16/solid';
import FacetMultiSelect from './FacetMultiSelect';
import { MapView } from './MapView';

type Facet = {
  type: 'literal' | 'object' | 'continuous' | 'map' | string;
  label: string;
  property: string;
  tooltip?: Record<string, string>;
  values?: Array<{ value: string; label: string; count?: number }>;
  min?: number | string;
  max?: number | string;
};

type FacetItem = Record<string, Facet>;

type FacetsBlockProps = {
  data?: FacetItem;
  selected?: Record<string, string[]>;
  selectedRanges?: Record<string, { min?: string; max?: string }>;
  searchQuery?: string;
  onChangeFilters?: (
    next: Record<
      string,
      string[] | null | string | { min?: string | null; max?: string | null }
    >
  ) => void;
  includeBinaries?: string;
  linkNamedEntities?: string;
  onReset?: () => void;
  onApplySearch?: () => void; // Search button
  mapPolygon?: string | null;
  onToggleMap?: () => void;
};

function formatPolygonLabel(polygon?: string | null): string {
  if (!polygon) return '';
  const m = polygon.match(/POLYGON\(\((.+)\)\)/i);
  if (!m) return polygon;

  const parts = m[1].split(',');
  if (parts.length < 3) return polygon;

  const [p1, p3] = [parts[0], parts[2]];
  const [lon1, lat1] = p1.trim().split(/\s+/).map(Number);
  const [lon2, lat2] = p3.trim().split(/\s+/).map(Number);

  const f = (n: number) => n.toFixed(1);

  return `${f(lon1)}, ${f(lat1)} - ${f(lon2)}, ${f(lat2)}`;
}

const FacetsBlock: React.FC<FacetsBlockProps> = ({
  data = {} as FacetItem,
  selected = {},
  selectedRanges = {},
  searchQuery = '',
  onChangeFilters,
  includeBinaries = '0',
  linkNamedEntities = '0',
  onReset,
  onApplySearch,
  mapPolygon,
  onToggleMap,
}) => {
  console.log('FACETSBLOCK INSIDE:');
  console.log(data);
  const { t } = useTranslation();
  const lang = Cookies.get('i18nextLng') || 'en';

  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [topSearch, setTopSearch] = useState(searchQuery);

  // Keep input synced with searchQuery from parent
  useEffect(() => setTopSearch(searchQuery), [searchQuery]);

  // Initialize facets open state (indexed by property URI)
  useEffect(() => {
    const initial: Record<string, boolean> = {};
    Object.entries(data).forEach(([key, f]) => {
      const prop = f?.property || key;
      initial[prop] = true;
    });
    setOpen(initial);
  }, [data]);

  const toggle = (facetProp: string) =>
    setOpen((prev) => ({ ...prev, [facetProp]: !prev[facetProp] }));

  // MULTI facet change
  const handleFacetValuesChange = (facetProp: string, values: string[]) => {
    onChangeFilters?.({
      [facetProp]: values.length ? values : null,
    });
  };

  // TEXT QUERY (top bar) — only updates pending, no search yet
  const handleTopSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopSearch(e.target.value);
    onChangeFilters?.({ q: e.target.value });
  };

  // FIXED CHECKBOXES
  const handleIncludeBinaries = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeFilters?.({ includeBinaries: e.target.checked ? '1' : '0' });
  };

  const handleLinkNamedEntities = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeFilters?.({ linkNamedEntities: e.target.checked ? '1' : '0' });
  };

  // RANGE FACET HELPERS
  const setRangeMin = (facetKey: string, value: string) => {
    onChangeFilters?.({
      [facetKey]: {
        min: value || null,
        max: selectedRanges[facetKey]?.max ?? null,
      },
    });
  };

  const setRangeMax = (facetKey: string, value: string) => {
    onChangeFilters?.({
      [facetKey]: {
        min: selectedRanges[facetKey]?.min ?? null,
        max: value || null,
      },
    });
  };

  return (
    <div className="space-y-4">
      {/* SEARCH BAR */}
      <div className="flex items-center gap-[10px]">
        <input
          type="text"
          value={topSearch}
          onChange={handleTopSearchChange}
          placeholder="Find resources..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* FACETS */}
      {Object.entries(data).map(([key, fd]) => {
        const facetProp = fd?.property || key;
        const safeId = facetProp.replace(/[^a-z0-9_-]/gi, '_');
        // HIDE facets with empty values

        if (
          (Array.isArray(fd.values) && fd.values.length === 0) || // empty array
          (!Array.isArray(fd.values) && String(fd.values).trim() === '') // empty string/null/undefined
        ) {
          console.log('EMPTY _----> ');
          console.log(fd.label);
          console.log(fd);
          return null;
        }

        return (
          <div
            key={facetProp}
            className="border border-[#E1E1E1] rounded-[8px] w-full bg-white"
          >
            <div className="flex items-center gap-2 bg-[#FAFAFA] px-4 py-2 rounded-tr-[8px] rounded-tl-[8px]">
              <span className="font-medium text-sm">{fd.label}</span>
              <button
                onClick={() => toggle(facetProp)}
                className="ml-auto flex px-2 py-1 focus:outline-none"
                aria-expanded={!!open[facetProp]}
                aria-controls={`facet-body-${safeId}`}
              >
                {open[facetProp] ? (
                  <ChevronUpIcon className="h-5 w-5 text-gray-600" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>

            {open[facetProp] && (
              <div id={`facet-body-${safeId}`} className="p-3 space-y-2">
                {fd.type === 'map' && (
                  <div className="">
                    {mapPolygon && (
                      <div className="inline-flex items-center gap-2 rounded bg-gray-200 px-3 py-1 text-sm">
                        <span>{formatPolygonLabel(mapPolygon)}</span>
                        <button
                          type="button"
                          onClick={() => onChangeFilters?.({ map: '' })}
                          className="text-gray-600"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={onToggleMap}
                      className="block btn-arche-blue text-white w-full text-center py-2 rounded-md"
                    >
                      {t('Open Map')}
                    </button>
                  </div>
                )}

                {/* CONTINUOUS (DATE RANGE) */}
                {fd.type === 'continuous' && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={String(fd.min ?? '')}
                      className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                      value={selectedRanges[facetProp]?.min ?? ''}
                      onChange={(e) => setRangeMin(facetProp, e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder={String(fd.max ?? '')}
                      className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm"
                      value={selectedRanges[facetProp]?.max ?? ''}
                      onChange={(e) => setRangeMax(facetProp, e.target.value)}
                    />
                  </div>
                )}

                {/* MULTI SELECT */}
                {(fd.type === 'literal' || fd.type === 'object') && (
                  <FacetMultiSelect
                    facetKey={facetProp}
                    options={fd.values ?? []}
                    selected={selected[facetProp] ?? []}
                    onChange={handleFacetValuesChange}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* FIXED EXTENDED SEARCH CARD */}
      <div className="border border-[#E1E1E1] rounded-[8px] w-full bg-white">
        <div className="flex items-center gap-2 bg-[#FAFAFA] px-4 py-2 rounded-tr-[8px] rounded-tl-[8px]">
          <span className="font-medium text-sm">Extended search</span>
        </div>
        <div className="p-3 space-y-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={includeBinaries === '1'}
              onChange={handleIncludeBinaries}
            />
            <span>{t('Search in file content')}</span>
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={linkNamedEntities === '1'}
              onChange={handleLinkNamedEntities}
            />
            <span>{t('Follow named entities')}</span>
          </label>
        </div>
      </div>

      {/* SEARCH BUTTON */}
      <button
        onClick={onApplySearch}
        className="block btn-arche-blue text-white w-full text-center py-2 rounded-md"
      >
        {t('Search')}
      </button>

      {/* RESET */}
      <button
        onClick={onReset}
        className="block btn-arche-blue text-white w-full text-center mt-2"
      >
        {t('Reset filters')}
      </button>
    </div>
  );
};

export default FacetsBlock;
