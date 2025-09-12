import React from 'react';

export default function AssociatedCollectionsAndResources({
  identifier,
  onDataStatus,
}: {
  identifier: string | number; // accept both
  onDataStatus: (hasData: boolean) => void;
}) {
  return (
    <div>
      AssociatedCollectionsAndResources
      <div>eeeee</div>
    </div>
  );
}
