import React from 'react';
import MetadataContentHeader from '../MetadataContentHeader';

import NextPrevItem from '../DefaultBlocks/NextPrevItem';
import CiteBlock from '../DefaultBlocks/CiteBlock';
import SummaryBlock from '../DefaultBlocks/SummaryBlock';
import SeeAlsoBlock from '../DefaultBlocks/SeeAlsoBlock';
import DisseminationsBlock from '../Disseminations/DisseminationsBlock';
import NewVersionBlock from '../DefaultBlocks/NewVersionBlock';
import CollectionContent from '../DefaultBlocks/CollectionContent';

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

      <CiteBlock
        src="https://arche-biblatex.acdh.oeaw.ac.at/?id=https://arche-dev.acdh-dev.oeaw.ac.at/api/262625&lang=en&format=application%2Fvnd.citationstyles.csl%2Bjson"
        lang="en-US"
      />
      {dataJson.summaryData && Object.keys(dataJson.summaryData).length > 0 && (
        <SummaryBlock data={dataJson.summaryData}></SummaryBlock>
      )}

      {/* if topcollection then show hasArrangement */}

      {dataJson.seeAlsoData && Object.keys(dataJson.seeAlsoData).length > 0 && (
        <SeeAlsoBlock data={dataJson.seeAlsoData}></SeeAlsoBlock>
      )}

      <div className="flex flex-col lg:flex-row w-full">TABBED Tables</div>
      <CollectionContent identifier={dataJson.id}></CollectionContent>
      <DisseminationsBlock></DisseminationsBlock>
    </div>
  );
};

export default Content;
