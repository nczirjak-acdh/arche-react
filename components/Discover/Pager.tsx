'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

const Pager = ({
  page,
  pageSize,
  totalCount,
}: {
  page: number;
  pageSize: number;
  totalCount: number;
}) => {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setPage = (p: number) => {
    const sp = new URLSearchParams(searchParams.toString());
    sp.set('page', String(Math.min(Math.max(1, p), totalPages)));
    router.push(`${pathname}?${sp.toString()}`);
  };

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalCount);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-gray-200 bg-white p-3">
      <div className="text-sm text-gray-600">
        {totalCount > 0 ? `${from}–${to} / ${totalCount}` : 'No results'}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPage(1)}
          disabled={page <= 1}
          className="rounded-md border px-2 py-1 text-sm disabled:opacity-50"
        >
          « First
        </button>
        <button
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
          className="rounded-md border px-2 py-1 text-sm disabled:opacity-50"
        >
          ‹ Prev
        </button>
        <span className="px-2 text-sm text-gray-700">
          Page {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page >= totalPages}
          className="rounded-md border px-2 py-1 text-sm disabled:opacity-50"
        >
          Next ›
        </button>
        <button
          onClick={() => setPage(totalPages)}
          disabled={page >= totalPages}
          className="rounded-md border px-2 py-1 text-sm disabled:opacity-50"
        >
          Last »
        </button>
      </div>
    </div>
  );
};

export default Pager;
