import React from 'react';
import MetadataContentHeader from '../MetadataContentHeader';

import NextPrevItem from '../DefaultBlocks/NextPrevItem';
import CiteBlock from '../DefaultBlocks/CiteBlock';
import SummaryBlock from '../DefaultBlocks/SummaryBlock';
import SeeAlsoBlock from '../DefaultBlocks/SeeAlsoBlock';
import DisseminationsBlock from '../Disseminations/DisseminationsBlock';
import NewVersionBlock from '../DefaultBlocks/NewVersionBlock';

const Content = ({ dataJson = {} }: { dataJson?: Record<string, any[]> }) => {
  return (
    <div id="">
      <MetadataContentHeader data={dataJson}></MetadataContentHeader>

      <div className="flex flex-col w-full">
        <hr className="my-4 border-[#E1EDF3]" />
      </div>

      <NewVersionBlock identifier={dataJson.id}></NewVersionBlock>

      <NextPrevItem></NextPrevItem>

      <div className="flex flex-col lg:flex-row w-full">
        <h4>{dataJson.title}</h4>
      </div>

      <CiteBlock></CiteBlock>
      {dataJson.summaryData && Object.keys(dataJson.summaryData).length > 0 && (
        <SummaryBlock data={dataJson.summaryData}></SummaryBlock>
      )}

      {/* if topcollection then show hasArrangement */}

      {dataJson.seeAlsoData && Object.keys(dataJson.seeAlsoData).length > 0 && (
        <SeeAlsoBlock data={dataJson.seeAlsoData}></SeeAlsoBlock>
      )}

      <div className="flex flex-col lg:flex-row w-full">TABBED Tables</div>

      <DisseminationsBlock></DisseminationsBlock>
    </div>
  );
};

export default Content;
