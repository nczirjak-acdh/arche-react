'use client';
import React from 'react';
import Cookies from 'js-cookie';

type FacetItem = Record<string, any>;

const FacetsBlock = ({ data = {} }: { data?: FacetItem }) => {
  const lang = Cookies.get('i18nextLng') || 'en';

  return (
    <div className="space-y-4">
      {Object.entries(data).map(([key, fd]) => (
        <div key={key} className="border rounded-lg p-4 bg-white shadow">
          {/* Card header */}
          <div className="flex items-center justify-between font-bold text-gray-700 mb-2">
            {fd.label}
            {fd.tooltip && (
              <div className="relative group ml-2">
                <span className="cursor-pointer text-blue-500 font-bold">
                  ?
                </span>
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 p-2 rounded bg-gray-800 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  {fd.tooltip[lang]}
                </div>
              </div>
            )}
          </div>

          {/* Card body */}
          <div className="card-body">
            {/* Conditional rendering based on type */}
            {fd.type === 'literal' && (
              <select className="border rounded p-2 w-full">
                {fd.values.map((val: any, i: number) => (
                  <option key={i} value={val.value}>
                    {val.label} ({val.count})
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
              <div className="flex gap-2">
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

            {/* Fallback if type is unknown */}
            {!['literal', 'object', 'continuous'].includes(fd.type) && (
              <div className="text-gray-500">Unsupported facet type</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FacetsBlock;
