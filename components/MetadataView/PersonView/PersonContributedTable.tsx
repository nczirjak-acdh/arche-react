'use client';

import { useApi } from '@/lib/useApi';
import Loader from '@/components/Loader';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import * as React from 'react';

type ApiRow = {
  id?: string | number;
  acdhid?: string;
  property?: string; // role uri
  title?: string;
  type?: string; // e.g. …#TopCollection
};

type ApiResponse = {
  aaData: ApiRow[];
};

const labelFromUri = (uri?: string) =>
  (uri ?? '').split(/[#/]/).filter(Boolean).pop() || '';

export const labelFromRole = (s?: string): string =>
  (s ?? '').replace(/^.*#/, '');

export default function InvolvedInTable({
  resourceID = '',
}: {
  resourceID: string;
}) {
  const [search, setSearch] = React.useState('');

  // normalize 'de-AT' -> 'de'
  const [guiLang] = React.useState(() => {
    try {
      const v =
        typeof window !== 'undefined'
          ? localStorage.getItem('i18nextLng')
          : null;
      return (v || 'en').split('-')[0];
    } catch {
      return 'en';
    }
  });

  const base = process.env.NEXT_PUBLIC_BASE_BROWSER_API!;
  const url = `${base}/contributedDT/${resourceID}/${guiLang}`;
  const { data, error, loading } = useApi<ApiResponse>(url);

  type Row = {
    metaId: string | number | undefined; // for your link
    title: string;
    typeLabel: string;
    role: string;
    __rid: string; // unique row key for DataGrid
  };

  const rows = React.useMemo<Row[]>(() => {
    const items = data?.aaData ?? [];
    return items.map((r, idx) => {
      const role = labelFromRole(r.property);
      const rawId = r.id ?? idx;
      return {
        metaId: r.acdhid ?? rawId,
        title: r.title ?? '',
        typeLabel: labelFromUri(r.type),
        role,
        // ✅ unique + stable even if API id repeats with a different role
        __rid: `inv-${rawId}-${role || 'norole'}`,
      };
    });
  }, [data]);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.typeLabel.toLowerCase().includes(q) ||
        r.role.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const columns = React.useMemo<GridColDef<Row>[]>(
    () => [
      { field: 'role', headerName: 'Role', flex: 0.5, minWidth: 200 },
      {
        field: 'title',
        headerName: 'Entity',
        flex: 1,
        minWidth: 320,
        sortable: false,
        renderCell: (p) => {
          const label = p.value || '-';
          const metaId = p.row.metaId;
          return label !== '-' ? (
            <a
              href={`/browser/metadata/${metaId}`}
              className="underline hover:no-underline"
            >
              {label}
            </a>
          ) : (
            <span>-</span>
          );
        },
      },
      { field: 'typeLabel', headerName: 'Type', flex: 0.5, minWidth: 200 },
    ],
    []
  );

  // Show loader until we actually have the array, not a blank grid
  const ready = !!data && Array.isArray(data.aaData);

  if (error) {
    console.log('Person contributed  table error: ' + error);
    return null;
  }

  if (!!data && Array.isArray(data.aaData) && rows.length === 0) {
    return null; // nothing rendered at all
  }

  return (
    <div className="w-full basic-inside-content-div">
      <div className="flex flex-col items-start gap-6 p-6 self-stretch rounded-xl bg-white w-full">
        <h5>Contributed to</h5>

        <input
          type="text"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border px-3 py-2"
        />

        {error ? (
          <div className="mx-auto max-w-4xl rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
            Error: {String(error)}
          </div>
        ) : !ready ? (
          <Loader />
        ) : (
          <DataGrid
            rows={filtered}
            columns={columns}
            // ✅ use our unique key
            getRowId={(row) => row.__rid}
            // ✅ built-in loading overlay (also nice on refetch)
            loading={loading || !ready}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
            autoHeight
            className="w-full"
          />
        )}
      </div>
    </div>
  );
}
