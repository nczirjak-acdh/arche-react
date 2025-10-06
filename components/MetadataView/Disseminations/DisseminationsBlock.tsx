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
  switch (acdhCategory) {
    case 'pdf':
      return (
        <DisseminationPdf
          url={`${PUBLIC_CONFIG.browserApiBase}${identifier}`}
        />
      );

    case 'audio':
      return (
        <DisseminationAudio
          src={`${PUBLIC_CONFIG.browserApiBase}${identifier}`}
        />
      );

    case 'glb':
      return (
        <DisseminationGlb
          src={`${PUBLIC_CONFIG.browserApiBase}${identifier}`}
          autoRotate
          cameraControls
          className="rounded-xl shadow"
        />
      );

    case 'image':
      return (
        <DisseminationIIIF
          endpoint={`https://arche-iiifmanifest.acdh.oeaw.ac.at/?id=${PUBLIC_CONFIG.apiBase}${identifier}&mode=images`}
          height={600}
        />
      );

    case 'ply':
      return (
        <DisseminationPLY
          src="https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/ply/binary/Lucy100k.ply"
          height={520}
          background="#f8fafc"
          className="rounded-xl"
        />
      );

    case 'tei':
      return (
        <DisseminationTEI
          url={`${PUBLIC_CONFIG.apiBase}${identifier}?skipContentDisposition=true`}
        />
      );

    default:
      return null; // or some fallback UI
  }
};

export default DisseminationsBlock;
