'use client';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/16/solid';
import { titleId } from '@/lib/helpers/metadataHelper';

type Facet = {
  type: 'literal' | 'object' | 'continuous' | string;
  label: string;
  tooltip?: Record<string, string>;
  values?: Array<{ value: string; label: string; count?: number }>;
  min?: number | string;
  max?: number | string;
};

type FacetItem = Record<string, Facet>;

const FacetsBlock = ({ data = {} as FacetItem }) => {
  const lang = Cookies.get('i18nextLng') || 'en';
  const { t } = useTranslation();

  // open state per facet key
  const [open, setOpen] = useState<Record<string, boolean>>({});

  // initialize all cards as open
  useEffect(() => {
    const initial: Record<string, boolean> = {};
    Object.keys(data).forEach((k) => {
      initial[k] = true;
    });
    setOpen(initial);
  }, [data]);

  const toggle = (k: string) => setOpen((prev) => ({ ...prev, [k]: !prev[k] }));

  return (
    <div className="space-y-4">
      {Object.entries(data).map(([key, fd]) => (
        <div key={key} className="border border-[#E1E1E1] rounded-[8px] w-full">
          {/* Header */}
          <div className="flex items-center gap-[10px] bg-[#FAFAFA] px-[24px] py-[10px]">
            <span className="text-[16px] font-semibold text-[#1A1A1A]">
              {fd.label}
            </span>

            {/* Tooltip: group only on the trigger, tooltip as a child */}
            {fd.tooltip && (
              <span className="relative inline-block ml-2">
                <button
                  type="button"
                  className="group cursor-help text-blue-500 font-bold leading-none"
                  aria-label="Help"
                >
                  ?
                  <span
                    className="
                      pointer-events-none
                      absolute left-1/2 -translate-x-1/2 mt-2 w-64
                      rounded bg-gray-800 p-2 text-white text-sm
                      opacity-0 group-hover:opacity-100 transition-opacity
                      z-10
                    "
                    role="tooltip"
                  >
                    {fd.tooltip[lang] ?? fd.tooltip.en ?? ''}
                  </span>
                </button>
              </span>
            )}

            <button
              onClick={() => toggle(key)}
              className="ml-auto flex px-4 py-3 focus:outline-none"
              aria-expanded={!!open[key]}
              aria-controls={`facet-body-${key}`}
            >
              {open[key] ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-600" />
              )}
            </button>
          </div>

          {/* Body */}
          {open[key] && (
            <div
              id={`facet-body-${key}`}
              className="flex p-[12px] gap-[24px] border-t border-[#E1EDF3]"
            >
              {fd.type === 'literal' && (
                <select
                  className="border rounded p-2 w-full"
                  id={`smart-multi-${(fd.label ?? '')
                    .toString()
                    .replace(/[^\w\s]/g, '')
                    .replace(/\s+/g, '_')
                    .toLowerCase()}`}
                >
                  {(fd.values ?? []).map((val, i) => (
                    <option key={i} value={val.value}>
                      {val.label} {val.count != null ? `(${val.count})` : ''}
                    </option>
                  ))}
                </select>
              )}

              {fd.type === 'object' && (
                <input
                  type="text"
                  placeholder={`Search ${fd.label}`}
                  className="border rounded p-2 w-full"
                />
              )}

              {fd.type === 'continuous' && (
                <div className="flex gap-2 w-full">
                  <input
                    type="date"
                    className="border rounded p-2 w-full"
                    placeholder="Start"
                  />
                  <input
                    type="date"
                    className="border rounded p-2 w-full"
                    placeholder="End"
                  />
                </div>
              )}

              {!['literal', 'object', 'continuous'].includes(fd.type) && (
                <div className="text-gray-500">Unsupported facet type</div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Extra card */}
      <div className="border border-[#E1E1E1] rounded-[8px] w-full">
        <div className="flex items-center gap-[10px] bg-[#FAFAFA] px-[24px] py-[10px]">
          <span className="text-[16px] font-semibold text-[#1A1A1A]">
            {t('Extended Search')}
          </span>
        </div>
        <div className="flex p-[12px] gap-[24px] border-t border-[#E1EDF3]">
          Body
        </div>
      </div>
    </div>
  );
};

export default FacetsBlock;
