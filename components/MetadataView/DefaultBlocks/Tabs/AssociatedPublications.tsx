import React from 'react';

export default function AssociatedPublications({
  identifier,
  onDataStatus,
}: {
  identifier: string | number; // accept both
  onDataStatus: (hasData: boolean) => void;
}) {
  return (
    <div>
      AssociatedPublications
      <div>ddddd</div>
    </div>
  );
}
