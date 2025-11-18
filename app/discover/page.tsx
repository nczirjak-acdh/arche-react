// app/discover/page.tsx
'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { useApi } from '@/lib/useApi';
import Loader from '@/components/Loader';
import FacetsBlock from '@/components/Discover/FacetsBlock';
import ResultBlock from '@/components/Discover/ResultBlock';
import { toNumber } from '@/lib/helpers/metadataHelper';
import type { PagerItem } from '@/lib/types/types';
import { MapView } from '@/components/Discover/MapView';

type PendingFilters = {
  facets: Record<string, string[]>;
  ranges: Record<string, { min?: string; max?: string }>;
  q: string;
  includeBinaries: string;
  linkNamedEntities: string;
  mapPolygon?: string | null;
};

export default function DiscoverPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // --- PENDING STATE (local, no URL updates until Search is pressed) ---
  const [pending, setPending] = useState<PendingFilters | null>(null);

  // UI vs API page
  const uiPage = toNumber(sp.get('page'), 1);
  const apiPage = Math.max(0, uiPage - 1);

  const apiParams = new URLSearchParams(sp.toString());
  apiParams.set('page', String(apiPage));

  const base = process.env.NEXT_PUBLIC_BASE_BROWSER!;
  const url = `${base}/api/smartsearch/?${apiParams.toString()}`;

  const { data, error, loading } = useApi<any>(url);

  // --- map visibility state ---
  const [showMap, setShowMap] = useState(false);

  // ---- read selected facets (multi) from URL: facets[<prop>][] ----
  const selectedFiltersFromUrl: Record<string, string[]> = {};
  for (const [key, value] of sp.entries()) {
    const m = key.match(/^facets\[(.+)\]\[\]$/);
    if (m) {
      const facetUri = decodeURIComponent(m[1]);
      if (!selectedFiltersFromUrl[facetUri])
        selectedFiltersFromUrl[facetUri] = [];
      selectedFiltersFromUrl[facetUri].push(value);
    }
  }

  // ---- read continuous/range facets: facets[<prop>][min|max] ----
  const selectedRangesFromUrl: Record<string, { min?: string; max?: string }> =
    {};
  for (const [key, value] of sp.entries()) {
    const m = key.match(/^facets\[(.+)\]\[(min|max)\]$/);
    if (m) {
      const facetKey = decodeURIComponent(m[1]);
      const bound = m[2] as 'min' | 'max';
      selectedRangesFromUrl[facetKey] ??= {};
      selectedRangesFromUrl[facetKey][bound] = value;
    }
  }

  // text query + flags from URL
  const currentQFromUrl = sp.get('q') ?? '';
  const includeBinariesFromUrl = sp.get('includeBinaries') ?? '0';
  const linkNamedEntitiesFromUrl = sp.get('linkNamedEntities') ?? '0';
  const mapPolygonFromUrl = sp.get('facets[map]') ?? null;

  // ---- keep local pending state in sync with URL ----
  useEffect(() => {
    setPending({
      facets: selectedFiltersFromUrl,
      ranges: selectedRangesFromUrl,
      q: currentQFromUrl,
      includeBinaries: includeBinariesFromUrl,
      linkNamedEntities: linkNamedEntitiesFromUrl,
      mapPolygon: mapPolygonFromUrl,
    });
  }, [
    currentQFromUrl,
    includeBinariesFromUrl,
    linkNamedEntitiesFromUrl,
    JSON.stringify(selectedFiltersFromUrl),
    JSON.stringify(selectedRangesFromUrl),
  ]);

  // ---- RESET: reset URL to base state (pending will follow via effect) ----
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

  const facetParamName = (facetKey: string) => `facets[${facetKey}][]`;

  // ---- UPDATE PENDING ONLY (used by FacetsBlock on change, NO URL UPDATE) ----
  const updateFilters = (
    partial: Record<
      string,
      string[] | null | string | { min?: string | null; max?: string | null }
    >
  ) => {
    setPending((prev) => {
      const basePending: PendingFilters = prev ?? {
        facets: selectedFiltersFromUrl,
        ranges: selectedRangesFromUrl,
        q: currentQFromUrl,
        includeBinaries: includeBinariesFromUrl,
        linkNamedEntities: linkNamedEntitiesFromUrl,
        mapPolygon: mapPolygonFromUrl,
      };

      const next: PendingFilters = {
        facets: { ...basePending.facets },
        ranges: { ...basePending.ranges },
        q: basePending.q,
        includeBinaries: basePending.includeBinaries,
        linkNamedEntities: basePending.linkNamedEntities,
        mapPolygon: basePending.mapPolygon,
      };

      Object.entries(partial).forEach(([key, value]) => {
        // range object from continuous facet
        const isRangeObj =
          typeof value === 'object' &&
          value !== null &&
          ('min' in value || 'max' in value);

        if (isRangeObj) {
          const { min, max } = value as {
            min?: string | null;
            max?: string | null;
          };
          next.ranges[key] = {
            ...(next.ranges[key] ?? {}),
            ...(min !== undefined ? { min: min ?? '' } : {}),
            ...(max !== undefined ? { max: max ?? '' } : {}),
          };
          return;
        }

        if (key === 'map') {
          next.mapPolygon =
            typeof value === 'string'
              ? value
              : Array.isArray(value)
                ? (value[0] ?? null)
                : null;
          return;
        }

        // facet keys (URIs or dateContent)
        const isFacetKey =
          key.startsWith('http://') ||
          key.startsWith('https://') ||
          key === 'dateContent';

        if (isFacetKey) {
          if (Array.isArray(value) && value.length) {
            next.facets[key] = value;
          } else {
            delete next.facets[key];
          }
          return;
        }

        // normal params
        if (key === 'q') {
          next.q =
            typeof value === 'string'
              ? value
              : Array.isArray(value)
                ? (value[0] ?? '')
                : '';
          return;
        }

        if (key === 'includeBinaries') {
          next.includeBinaries =
            typeof value === 'string'
              ? value
              : Array.isArray(value)
                ? (value[0] ?? '0')
                : '0';
          return;
        }

        if (key === 'linkNamedEntities') {
          next.linkNamedEntities =
            typeof value === 'string'
              ? value
              : Array.isArray(value)
                ? (value[0] ?? '0')
                : '0';
          return;
        }
      });

      return next;
    });
  };

  // ---- APPLY PENDING TO URL (called only when Search button is pressed) ----
  const handleApplySearch = () => {
    if (!pending) return;

    const params = new URLSearchParams(sp.toString());

    // remove existing facets/ranges
    [...params.keys()].forEach((k) => {
      if (k.startsWith('facets[')) params.delete(k);
    });

    // plain params
    params.set('q', pending.q ?? '');
    params.set('includeBinaries', pending.includeBinaries ?? '0');
    params.set('linkNamedEntities', pending.linkNamedEntities ?? '0');
    params.set('page', '1');

    // ranges: facets[dateContent][min/max]
    Object.entries(pending.ranges).forEach(([facetKey, { min, max }]) => {
      const minKey = `facets[${facetKey}][min]`;
      const maxKey = `facets[${facetKey}][max]`;

      if (min && min.trim() !== '') params.set(minKey, min.trim());
      if (max && max.trim() !== '') params.set(maxKey, max.trim());
    });

    // multi facets: facets[<prop>][]
    Object.entries(pending.facets).forEach(([facetKey, values]) => {
      if (!values || values.length === 0) return;
      const paramName = facetParamName(facetKey);
      values.forEach((v) => params.append(paramName, v));
    });

    // MAP facet: facets[map]=POLYGON(...)
    if (pending.mapPolygon && pending.mapPolygon.trim() !== '') {
      params.set('facets[map]', pending.mapPolygon.trim());
    }

    const qs = params.toString();
    const nextUrl = qs ? `${pathname}?${qs}` : pathname;
    router.replace(nextUrl, { scroll: false });
  };

  // ---- replace rdf:type labels in data.facets ----
  if (
    data?.facets &&
    data.facets['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'] &&
    Array.isArray(
      data.facets['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'].values
    )
  ) {
    data.facets['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'].values =
      data.facets['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'].values.map(
        (v: any) => ({
          ...v,
          label:
            typeof v.label === 'string'
              ? v.label.replace(
                  'https://vocabs.acdh.oeaw.ac.at/schema#',
                  'acdh:'
                )
              : v.label,
        })
      );
  }

  // --- parse GeoJSON for the map once per `data` change ---
  const mapGeoJson = useMemo(() => {
    const facet = data?.facets?.map;
    if (!facet) return null;

    if (typeof facet.values === 'string') {
      try {
        return JSON.parse(facet.values); // GeoJSON object
      } catch {
        return null;
      }
    }
    return null;
  }, [data]);

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

  // what to pass to FacetsBlock: pending if available, otherwise URL-derived
  const selectedForUi = pending?.facets ?? selectedFiltersFromUrl;
  const rangesForUi = pending?.ranges ?? selectedRangesFromUrl;
  const qForUi = pending?.q ?? currentQFromUrl;
  const includeBinariesForUi =
    pending?.includeBinaries ?? includeBinariesFromUrl;
  const linkNamedEntitiesForUi =
    pending?.linkNamedEntities ?? linkNamedEntitiesFromUrl;
  const mapPolygonForUi = pending?.mapPolygon ?? mapPolygonFromUrl;

  if (data.facets) {
    /* let mapGeoJson = '';
    if (data.facets.map) {
      console.log('MAP::::');
      console.log(data.facets.map.values);

      mapGeoJson = JSON.parse(data.facets.map.values); // GeoJSON object
    }
*/
    return (
      <section className="mx-auto max-w-7xl px-4 py-8 mb-[100px]">
        <div className="flex flex-col gap-6 lg:flex-row">
          <aside className="w-full lg:w-[25%] space-y-4">
            <FacetsBlock
              data={data.facets}
              selected={selectedForUi}
              selectedRanges={rangesForUi}
              searchQuery={qForUi}
              onChangeFilters={updateFilters}
              includeBinaries={includeBinariesForUi}
              linkNamedEntities={linkNamedEntitiesForUi}
              onReset={handleReset}
              onApplySearch={handleApplySearch}
              mapPolygon={mapPolygonForUi}
              onToggleMap={() => setShowMap((prev) => !prev)}
            />
          </aside>
          <div className="w-full lg:w-[75%] space-y-4">
            <ResultBlock
              data={data.results}
              pagerData={pagerData}
              messages={data.messages}
              showMap={showMap}
              mapGeoJson={mapGeoJson}
              mapPolygon={mapPolygonForUi}
              onPolygonChange={(poly) => updateFilters({ map: poly ?? '' })}
            />
          </div>
        </div>
      </section>
    );
  }

  return null;
}
