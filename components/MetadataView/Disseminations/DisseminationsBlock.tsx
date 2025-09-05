import React from 'react';

import DisseminationAudio from './DisseminationAudio';
import DisseminationGlb from './DisseminationGlb';
import { DisseminationPdf } from './DisseminationPdf';
import DisseminationIIIF from './DisseminationIIIF';
import DisseminationPLY from './DisseminationPLY';
import DisseminationTEI from './DisseminationTEI';
import { PUBLIC_CONFIG } from '@/config/public';

const DisseminationsBlock = ({
  identifier,
  acdhCategory,
}: {
  identifier: string;
  acdhCategory: string;
}) => {
  const directAudioUrl = 'https://arche-dev.acdh-dev.oeaw.ac.at/api/262652';
  const audioURL = `/browser/api/audio?url=${encodeURIComponent(directAudioUrl)}`;
  console.log(acdhCategory);
  switch (acdhCategory) {
    case 'pdf':
      return (
        <DisseminationPdf url={`${PUBLIC_CONFIG.apiBase}/api/${identifier}`} />
      );

    case 'audio':
      return (
        <DisseminationAudio
          src={`${PUBLIC_CONFIG.apiBase}/api/${identifier}`}
        />
      );

    case 'glb':
      return <DisseminationGlb identifier={identifier} />;

    case 'iiif':
      return <DisseminationIIIF identifier={identifier} />;

    case 'ply':
      return <DisseminationPLY identifier={identifier} />;

    case 'tei':
      return <DisseminationTEI identifier={identifier} />;

    default:
      return null; // or some fallback UI
  }
};

export default DisseminationsBlock;
