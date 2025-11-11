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

  // 1-based for UI
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

  // fix for UI
  data.page = uiPage;

  const pagerData: PagerItem = {
    totalCount: data.totalCount ?? 0,
    maxCount: data.maxCount ?? 0,
    page: data.page ?? 0,
    pageSize: data.pageSize ?? 0,
    messages: JSON.stringify(data.messages, null, 2) ?? '',
  };

  // ---------- READ selected facets from URL ----------
  // URL looks like: facets[<encoded-uri>][]=value
  const selectedFilters: Record<string, string[]> = {};
  for (const [key, value] of sp.entries()) {
    const m = key.match(/^facets\[(.+)\]\[\]$/); // facets[URI][]
    if (m) {
      const facetUri = decodeURIComponent(m[1]);
      if (!selectedFilters[facetUri]) {
        selectedFilters[facetUri] = [];
      }
      selectedFilters[facetUri].push(value);
    }
  }

  console.log('FACETS RESULT: ');
  console.log(data.facets);

  // helper to build the param name
  const facetParamName = (facetKey: string) =>
    `facets[${encodeURIComponent(facetKey)}][]`;

  // ---------- WRITE changes back to URL ----------
  const updateFilters = (partial: Record<string, string[] | null>) => {
    // start from current query
    const params = new URLSearchParams(sp.toString());

    console.log('PARAMS');
    console.log(params);
    Object.entries(partial).forEach(([facetKey, values]) => {
      const paramName = facetParamName(facetKey);

      // 1) remove ALL occurrences of this facet from the query
      // (URLSearchParams.delete should do that, but let's be explicit)
      // first delete the exact key:
      params.delete(paramName);

      // 2) if we still have values -> re-add them
      if (values && values.length) {
        values.forEach((v) => params.append(paramName, v));
      } else {
        // facet completely removed -> also reset page
        params.delete('page');
      }
    });

    const qs = params.toString();
    const nextUrl = qs ? `${pathname}?${qs}` : pathname;

    router.replace(nextUrl, { scroll: false });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 mb-[100px]">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* LEFT: facets */}
        <aside className="w-full lg:w-[25%] space-y-4">
          <FacetsBlock
            data={data.facets}
            selected={selectedFilters}
            onChangeFilters={updateFilters}
          />
        </aside>

        {/* RIGHT: results */}
        <div className="w-full lg:w-[75%] space-y-4">
          <ResultBlock data={data.results} pagerData={pagerData} />
        </div>
      </div>
    </section>
  );
}
