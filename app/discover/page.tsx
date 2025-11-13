// app/discover/page.tsx
'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useApi } from '@/lib/useApi';
import Loader from '@/components/Loader';
import FacetsBlock from '@/components/Discover/FacetsBlock';
import ResultBlock from '@/components/Discover/ResultBlock';
import { toNumber } from '@/lib/helpers/metadataHelper';
import type { PagerItem } from '@/lib/types/types';

export default function DiscoverPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // UI vs API page
  const uiPage = toNumber(sp.get('page'), 1);
  const apiPage = Math.max(0, uiPage - 1);

  const apiParams = new URLSearchParams(sp.toString());
  apiParams.set('page', String(apiPage));

  const base = process.env.NEXT_PUBLIC_BASE_BROWSER!;
  const url = `${base}/api/smartsearch/?${apiParams.toString()}`;

  const { data, error, loading } = useApi<any>(url);

  if (loading) {
    return (
      <div className="w-full pt-8 pb-8 mb-8 mt-8 text-center">
        <Loader label="Loading…" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="mx-auto max-w-4xl rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
        Error: {error}
      </div>
    );
  }
  if (!data) return null;

  data.page = uiPage;

  const pagerData: PagerItem = {
    totalCount: Math.max(0, data.totalCount ?? 0),
    maxCount: Math.max(0, data.maxCount ?? 0),
    page: Math.max(0, data.page ?? 0),
    pageSize: Math.max(0, data.pageSize ?? 0),
    messages: JSON.stringify(data.messages, null, 2) ?? '',
  };

  const handleReset = () => {
    const resetParams = new URLSearchParams();
    resetParams.set('q', '');
    resetParams.set('preferredLang', 'en');
    resetParams.set('includeBinaries', '0');
    resetParams.set('linkNamedEntities', '1');
    resetParams.set('page', '1');
    resetParams.set('pageSize', '10');
    resetParams.set('noCache', '0');

    router.replace(`${pathname}?${resetParams.toString()}`, { scroll: false });
  };

  // ---- read selected facets from URL ----
  const selectedFilters: Record<string, string[]> = {};
  for (const [key, value] of sp.entries()) {
    const m = key.match(/^facets\[(.+)\]\[\]$/);
    if (m) {
      // IMPORTANT: we decoded here earlier
      const facetUri = decodeURIComponent(m[1]);
      if (!selectedFilters[facetUri]) selectedFilters[facetUri] = [];
      selectedFilters[facetUri].push(value);
    }
  }

  // ---- read continuous/range facets: facets[<prop>][min|max] ----
  const selectedRanges: Record<string, { min?: string; max?: string }> = {};
  for (const [key, value] of sp.entries()) {
    const m = key.match(/^facets\[(.+)\]\[(min|max)\]$/);
    if (m) {
      const facetKey = decodeURIComponent(m[1]);
      const bound = m[2] as 'min' | 'max';
      selectedRanges[facetKey] ??= {};
      selectedRanges[facetKey][bound] = value;
    }
  }
  // also read current text query
  const currentQ = sp.get('q') ?? '';
  // read boolean flags (default to "0")
  const includeBinaries = sp.get('includeBinaries') ?? '0';
  const linkNamedEntities = sp.get('linkNamedEntities') ?? '0';

  const facetParamName = (facetKey: string) => `facets[${facetKey}][]`;

  // this now supports *both* facets and plain params like q
  const updateFilters = (partial: Record<string, string[] | null | string>) => {
    const params = new URLSearchParams(sp.toString());

    Object.entries(partial).forEach(([key, value]) => {
      const isFacetKey =
        key.startsWith('http://') || key.startsWith('https://');

      if (isFacetKey) {
        // facet
        const paramName = facetParamName(key);
        params.delete(paramName);

        if (Array.isArray(value) && value.length) {
          value.forEach((v) => params.append(paramName, v));
        } else {
          params.delete('page');
        }
      } else {
        // plain param, e.g. q
        params.delete(key);
        if (typeof value === 'string') {
          const v = value.trim();
          if (v !== '') {
            params.set(key, v);
            params.delete('page');
          }
        } else if (Array.isArray(value) && value.length) {
          // in case you ever pass an array for a normal key
          value.forEach((v) => params.append(key, v));
          params.delete('page');
        } else {
          // removed → also reset page
          params.delete('page');
        }
      }
    });

    const qs = params.toString();
    const nextUrl = qs ? `${pathname}?${qs}` : pathname;
    router.replace(nextUrl, { scroll: false });
  };

  if (
    data.facets &&
    data.facets['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'] &&
    Array.isArray(
      data.facets['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'].values
    )
  ) {
    data.facets['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'].values =
      data.facets['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'].values.map(
        (v) => ({
          ...v,
          label: v.label.replace(
            'https://vocabs.acdh.oeaw.ac.at/schema#',
            'acdh:'
          ),
        })
      );
  }

  if (data.facets)
    return (
      <section className="mx-auto max-w-7xl px-4 py-8 mb-[100px]">
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="w-full lg:w-[25%] space-y-4">
            <FacetsBlock
              data={data.facets}
              selected={selectedFilters}
              searchQuery={currentQ}
              onChangeFilters={updateFilters}
              includeBinaries={includeBinaries}
              linkNamedEntities={linkNamedEntities}
              onReset={handleReset}
            />
          </aside>
          <div className="w-full lg:w-[75%] space-y-4">
            <ResultBlock
              data={data.results}
              pagerData={pagerData}
              messages={data.messages}
            />
          </div>
        </div>
      </section>
    );
}
