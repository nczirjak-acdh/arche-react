'use client';
import { DataGrid } from '@mui/x-data-grid';

const ExpertView = ({
  dataJson = {},
}: {
  dataJson?: Record<string, any[]>;
}) => {
  const rows = [
    { id: 1, col1: 'Hello', col2: 'World' },
    { id: 2, col1: 'Data', col2: 'Grid' },
  ];
  const columns = [
    { field: 'col1', headerName: 'Column 1', width: 150 },
    { field: 'col2', headerName: 'Column 2', width: 150 },
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns} pageSizeOptions={[5]} />
    </div>
  );
};

export default ExpertView;
