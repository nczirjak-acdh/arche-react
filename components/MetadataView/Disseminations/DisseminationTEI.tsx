import React, { useEffect, useState } from 'react';

const DisseminationTEI = ({ url }: { url: string }) => {
  return (
    <div className={`w-full`}>
      {/* Viewer */}
      <div className="overflow-hidden rounded-lg border shadow">
        <iframe
          src={url}
          className="h-[700px] w-full"
          loading="lazy"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  );
};

export default DisseminationTEI;
