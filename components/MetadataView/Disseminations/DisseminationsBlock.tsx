import React from 'react';

import DisseminationAudio from './DisseminationAudio';
import DisseminationGlb from './DisseminationGlb';
import { DisseminationPdf } from './DisseminationPdf';
import DisseminationIIIF from './DisseminationIIIF';
import DisseminationPLY from './DisseminationPLY';
import DisseminationTEI from './DisseminationTEI';

const DisseminationsBlock = () => {
  return (
    <div>
      <DisseminationPdf></DisseminationPdf>
      <DisseminationAudio></DisseminationAudio>
      <DisseminationGlb></DisseminationGlb>
      <DisseminationIIIF></DisseminationIIIF>
      <DisseminationPLY></DisseminationPLY>
      <DisseminationTEI></DisseminationTEI>
    </div>
  );
};

export default DisseminationsBlock;
