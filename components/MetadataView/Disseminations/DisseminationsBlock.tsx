import React from 'react';

import DisseminationAudio from './DisseminationAudio';
import DisseminationGlb from './DisseminationGlb';
import { DisseminationPdf } from './DisseminationPdf';
import DisseminationIIIF from './DisseminationIIIF';
import DisseminationPLY from './DisseminationPLY';
import DisseminationTEI from './DisseminationTEI';
import { PUBLIC_CONFIG } from '@/config/public';

const DisseminationsBlock = ({ identifier }: { identifier: string }) => {
  const directAudioUrl = 'https://arche-dev.acdh-dev.oeaw.ac.at/api/262652';
  const audioURL = `/browser/api/audio?url=${encodeURIComponent(directAudioUrl)}`;
  return (
    <div>
      <DisseminationPdf></DisseminationPdf>

      <DisseminationAudio
        src={`${PUBLIC_CONFIG.apiBase}/api/${identifier}`}
      ></DisseminationAudio>
      <DisseminationGlb></DisseminationGlb>
      <DisseminationIIIF></DisseminationIIIF>
      <DisseminationPLY></DisseminationPLY>
      <DisseminationTEI></DisseminationTEI>
    </div>
  );
};

export default DisseminationsBlock;
