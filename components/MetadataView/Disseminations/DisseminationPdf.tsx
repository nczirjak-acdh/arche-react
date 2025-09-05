import React from 'react';
import PdfViewer from './Helper/PdfViewer';

export const DisseminationPdf = ({ url }: { url: string }) => {
  return (
    <div className="flex flex-col lg:flex-row w-full">
      <PdfViewer url={url}></PdfViewer>
    </div>
  );
};
