// app/discover/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useApi } from '@/lib/useApi';
import Loader from '@/components/Loader';
import FacetsBlock from '@/components/Discover/FacetsBlock';
import Pager from '@/components/Discover/Pager';
import ResultBlock from '@/components/Discover/ResultBlock';

export default function DiscoverPage() {
  const sp = useSearchParams();
  const qs = sp.toString();
  const url = qs
    ? `${process.env.NEXT_PUBLIC_API_BASE}/browser/api/smartsearch/?${sp}`
    : undefined;

  const { data, error, loading } = useApi<any>(url);

  if (loading) return <Loader label="Keresés folyamatban…" />;
  if (error) {
    return (
      <div className="mx-auto max-w-4xl rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
        Error: {error}
      </div>
    );
  }
  if (!data) return null;

  console.log(data);
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
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
          <ResultBlock data={data.results}></ResultBlock>
          <br></br>
          Paging block: <br></br>
          Totalcount: {JSON.stringify(data.totalCound, null, 2)}
          <br></br>
          maxCount: {JSON.stringify(data.maxCount, null, 2)} <br></br>
          page: {JSON.stringify(data.page, null, 2)}
          <br></br>
          messages_ {JSON.stringify(data.messages, null, 2)} <br></br>
          pageSize_: {JSON.stringify(data.pageSize, null, 2)} <br></br>
          searchIn {JSON.stringify(data.searchIn, null, 2)}
          <br></br>
          allPins {JSON.stringify(data.allPins, null, 2)}
          <br></br>
        </div>
      </div>
    </section>
  );
}
