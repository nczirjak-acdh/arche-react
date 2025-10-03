'use client';

import { useApi } from '@/lib/useApi';
import Loader from '@/components/Loader';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import * as React from 'react';

type ApiRow = {
  id?: string | number;
  acdhid?: string;
  property?: string;
  title?: string;
  type?: string; // e.g. "https://...#TopCollection"
};

type ApiResponse = {
  aaData: ApiRow[];
  iTotalRecords?: string | number;
  iTotalDisplayRecords?: string | number;
  draw?: number;
  cols?: string[];
  order?: 'asc' | 'desc';
  orderby?: number;
};

const labelFromUri = (uri?: string) =>
  (uri ?? '').split(/[#/]/).filter(Boolean).pop() || '';

export default function AssociatedCollectionsTable({
  resourceID = '',
}: {
  resourceID: string;
}) {
  const [search, setSearch] = React.useState('');

  // normalize 'de-AT' -> 'de', default 'en'
  const [guiLang] = React.useState<string>(() => {
    try {
      const stored =
        typeof window !== 'undefined'
          ? localStorage.getItem('i18nextLng')
          : null;
      return (stored || 'en').split('-')[0];
    } catch {
      return 'en';
    }
  });

  const base = process.env.NEXT_PUBLIC_BASE_BROWSER_API!;
  const url = `${base}/projectAssociatedDT/${resourceID}/${guiLang}`;
  const { data, error, loading } = useApi<ApiResponse>(url);

  const rows = React.useMemo(() => {
    const items = data?.aaData ?? [];
    return items.map((r, idx) => ({
      id: r.id ?? idx, // DataGrid row id
      title: r.title ?? '',
      typeLabel: labelFromUri(r.type),
    }));
  }, [data]);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.typeLabel.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: 'title',
        headerName: 'Title',
        flex: 1,
        minWidth: 320,
        renderCell: (p) => {
          const label = (p.value as string) || '-';
          const metaId = p.row.id; // if your metadata id differs, use that field instead
          return label !== '-' ? (
            <a href={`/browser/metadata/${metaId}`}>{label}</a>
          ) : (
            <span>-</span>
          );
        },
      },
      {
        field: 'typeLabel',
        headerName: 'Type',
        flex: 0.5,
        minWidth: 200,
      },
    ],
    []
  );

  return (
    <div style={{ width: '100%' }} className="basic-inside-content-div">
      <div className="flex flex-col items-start gap-6 p-6 self-stretch rounded-xl bg-[#ffffff]">
        <h5>Associated Collections</h5>
        <input
          type="text"
          placeholder="Search…"
          value={search}
          className="rounded-xl"
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: 5, padding: 10, width: '100%' }}
        />

        {loading ? (
          <Loader label="Loading…" />
        ) : error ? (
          <div className="mx-auto max-w-4xl rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
            Error: {String(error)}
          </div>
        ) : (
          <DataGrid
            rows={filtered}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
            className="flex w-full"
            autoHeight
          />
        )}
      </div>
    </div>
  );
}
