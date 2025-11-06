// app/discover/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useApi } from '@/lib/useApi';
import Loader from '@/components/Loader';
import FacetsBlock from '@/components/Discover/FacetsBlock';
import ResultBlock from '@/components/Discover/ResultBlock';
import type { PagerItem } from '@/lib/types/types';
import { toNumber } from '@/lib/helpers/metadataHelper';

export default function DiscoverPage() {
  const sp = useSearchParams();

  // the api uses 0 as first page, so we have to change the url for the api call and for the ui
  const uiPage = toNumber(sp.get('page'), 1);
  const apiPage = Math.max(0, uiPage - 1);

  const apiParams = new URLSearchParams(sp.toString());
  apiParams.set('page', String(apiPage));

  const base = process.env.NEXT_PUBLIC_BASE_BROWSER!;
  const url = `${base}/api/smartsearch/?${apiParams.toString()}`;

  const { data, error, loading } = useApi<any>(url);

  if (loading)
    return (
      <div className="w-full pt-8 pb-8 mb-8 mt-8 text-center">
        <Loader label="Loading…" />
      </div>
    );
  if (error) {
    return (
      <div className="mx-auto max-w-4xl rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
        Error: {error}
      </div>
    );
  }
  if (!data) return null;
  // the api uses 0 as first page, so we have to change the url for the api call and for the ui
  data.page = uiPage;

  const pagerData: PagerItem = {
    totalCount: data.totalCount ?? 0,
    maxCount: data.maxCount ?? 0,
    page: data.page ?? 0,
    pageSize: data.pageSize ?? 0,
    messages: JSON.stringify(data.messages, null, 2) ?? '',
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 mb-[100px]">
      <div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-4  gap-6">
        <div>Card 1 </div>
        <div>Card 2 </div>
        <div>Card 3 </div>
        <div>Card 4 </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* LEFT: facets (30%) */}
        <aside className="w-full lg:w-[30%] space-y-4">
          <FacetsBlock data={data.facets}></FacetsBlock>
          {/* {Object.entries(data.facets).map(([facetKey, facet]) => (
            <FacetsBlock />
         ))
                  }
                  
            */}
        </aside>

        {/* RIGHT: pager + results (70%) */}
        <div className="w-full lg:w-[70%] space-y-4">
          {/* <Pager page={page} pageSize={pageSize} totalCount={totalCount} /> */}
          <ResultBlock data={data.results} pagerData={pagerData}></ResultBlock>
          searchIn {JSON.stringify(data.searchIn, null, 2)}
          <br></br>
          allPins {JSON.stringify(data.allPins, null, 2)}
          <br></br>
        </div>
      </div>
    </section>
  );
}
