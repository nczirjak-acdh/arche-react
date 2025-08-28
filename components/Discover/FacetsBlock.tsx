import React from 'react';
type FacetItem = Record<string, any>;

const FacetsBlock = ({ data = [] }: { data?: FacetItem }) => {
  console.log(data);
  return (
    <div>
      {Object.entries(data).map(([key, value]) => (
        <div>
          <div className="flex gap-2 card-header font-bold">{value.label}</div>
          <div className="flex gap-2 card-body">
            <div>{JSON.stringify(value.values)}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FacetsBlock;
