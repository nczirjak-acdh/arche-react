'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import type { PagerItem } from '@/lib/types/types';

const Pager = ({ data }: { data: PagerItem }) => {
  const totalPages = Math.max(1, Math.ceil(data.totalCount / data.pageSize));
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setPage = (p: number) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set('page', String(Math.min(Math.max(1, p), totalPages)));
    router.push(`${pathname}?${sp.toString()}`);
  };

  const from = (data.page - 1) * data.pageSize + 1;
  const to = Math.min(data.page * data.pageSize, data.totalCount);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPage(1)}
          disabled={data.page <= 1}
          className="rounded-md border px-2 py-1 text-sm disabled:opacity-50"
        >
          « First
        </button>
        <button
          onClick={() => setPage(data.page - 1)}
          disabled={data.page <= 1}
          className="rounded-md border px-2 py-1 text-sm disabled:opacity-50"
        >
          ‹ Prev
        </button>
        <span className="px-2 text-sm text-gray-700">
          Page {data.page} / {totalPages}
        </span>
        <button
          onClick={() => setPage(data.page + 1)}
          disabled={data.page >= totalPages}
          className="rounded-md border px-2 py-1 text-sm disabled:opacity-50"
        >
          Next ›
        </button>
        <button
          onClick={() => setPage(totalPages)}
          disabled={data.page >= totalPages}
          className="rounded-md border px-2 py-1 text-sm disabled:opacity-50"
        >
          Last »
        </button>
      </div>
    </div>
  );
};

export default Pager;
