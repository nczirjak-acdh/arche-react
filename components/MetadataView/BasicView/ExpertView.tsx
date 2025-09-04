'use client';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React from 'react';
import { useState } from 'react';

type Item = {
  value?: string;
  identifiers?: string[];
  [key: string]: any;
};

type ResultSet = Record<string, Item[]>;

function pickLink(item: Item): string | null {
  // 1) prefer identifiers[0]
  if (Array.isArray(item.identifiers) && item.identifiers.length > 0) {
    return String(item.identifiers[0]);
  }
  // 2) if value itself looks like a URL, use it
  if (typeof item.value === 'string' && /^https?:\/\//i.test(item.value)) {
    return item.value;
  }
  return null;
}

function toRows(data: ResultSet) {
  return Object.entries(data).map(([prop, items], idx) => ({
    id: idx,
    prop,
    items: Array.isArray(items) ? items : [],
  }));
}

const ExpertView = ({ dataJson = {} }: { dataJson?: ResultSet }) => {
  const [search, setSearch] = useState('');

  const allRows = Object.entries(dataJson).map(([prop, items], idx) => ({
    id: idx,
    prop,
    items: items || [],
  }));

  const filteredRows = allRows.filter(
    (row) =>
      row.prop.toLowerCase().includes(search.toLowerCase()) ||
      row.items.some((it) =>
        (it.value || '').toLowerCase().includes(search.toLowerCase())
      )
  );

  const rows = React.useMemo(() => toRows(dataJson), [dataJson]);

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: 'prop',
        headerName: 'Property',
        flex: 0.5,
        minWidth: 220,
      },
      {
        field: 'items',
        headerName: 'Value(s)',
        flex: 1,
        minWidth: 400,
        sortable: false,
        filterable: false,
        renderCell: (params) => {
          const items: Item[] = params.value || [];
          // Build comma-separated anchors (or plain text if no link)
          const parts = items
            .filter(
              (it) =>
                it && typeof it.value === 'string' && it.value.trim() !== ''
            )
            .map((it, i) => {
              const href = pickLink(it);
              const label = it.value!;
              return (
                <React.Fragment key={i}>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'underline' }}
                    >
                      {label}
                    </a>
                  ) : (
                    <span>{label}</span>
                  )}
                  {i < items.length - 1 ? <span>,&nbsp;</span> : null}
                </React.Fragment>
              );
            });

          return (
            <div style={{ whiteSpace: 'normal', lineHeight: 1.4 }}>
              {parts.length > 0 ? parts : <span>-</span>}
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <div style={{ width: '100%', height: 600 }}>
      <input
        type="text"
        placeholder="Search…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: 8, padding: 4, width: '100%' }}
      />
      <DataGrid
        rows={filteredRows}
        columns={columns}
        disableRowSelectionOnClick
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: { paginationModel: { pageSize: 25 } },
        }}
        // Make rows with no values less noisy (optional)
        getRowClassName={(p) =>
          (p.row.items?.length ?? 0) === 0 ? 'opacity-60' : ''
        }
      />
    </div>
  );
};

export default ExpertView;
