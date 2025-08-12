import React from 'react';
import MetadataContentHeader from '../MetadataContentHeader';

import NewVersion from '../DefaultBlocks/NewVersion';
import NextPrevItem from '../DefaultBlocks/NextPrevItem';
import CiteBlock from '../DefaultBlocks/CiteBlock';
import SummaryBlock from '../DefaultBlocks/SummaryBlock';
import SeeAlsoBlock from '../DefaultBlocks/SeeAlsoBlock';
import DisseminationsBlock from '../Disseminations/DisseminationsBlock';

const Content = ({ dataJson = {} }: { dataJson?: Record<string, any[]> }) => {
  return (
    <div id="">
      <MetadataContentHeader data={dataJson}></MetadataContentHeader>

      <div className="flex flex-col w-full">
        <hr className="my-4 border-[#E1EDF3]" />
      </div>

      <NewVersion></NewVersion>

      <NextPrevItem></NextPrevItem>

      <div className="flex flex-col lg:flex-row w-full">
        <h4>{dataJson.title}</h4>
      </div>

      <CiteBlock></CiteBlock>

      <SummaryBlock></SummaryBlock>

      <SeeAlsoBlock></SeeAlsoBlock>
      <div className="flex flex-col lg:flex-row w-full">TABBED Tables</div>

      <DisseminationsBlock></DisseminationsBlock>
    </div>
  );
};

export default Content;
