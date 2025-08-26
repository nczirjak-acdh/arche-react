import React, { JSX } from 'react';
import MetadataContentHeader from '../MetadataContentHeader';
import { useState } from 'react';

import NextPrevItem from '../DefaultBlocks/NextPrevItem';
import CiteBlock from '../DefaultBlocks/CiteBlock';
import SummaryBlock from '../DefaultBlocks/SummaryBlock';
import SeeAlsoBlock from '../DefaultBlocks/SeeAlsoBlock';
import DisseminationsBlock from '../Disseminations/DisseminationsBlock';
import NewVersionBlock from '../DefaultBlocks/NewVersionBlock';
import CollectionContent from '../DefaultBlocks/CollectionContent';
import Tabs from '@/components/Tabs';
import { PUBLIC_CONFIG } from '@/config/public';

const Content = ({ dataJson = {} }: { dataJson?: Record<string, any[]> }) => {
  const [availableTabs, setAvailableTabs] = useState<
    { label: string; content: JSX.Element }[]
  >([]);

  const addTabIfData = (label: string, Component: JSX.Element) => {
    setAvailableTabs((prev) => [...prev, { label, content: Component }]);
  };

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
        src={`https://arche-biblatex.acdh.oeaw.ac.at/?id=${PUBLIC_CONFIG.apiBase}/api/${dataJson.id}&lang=en&format=application%2Fvnd.citationstyles.csl%2Bjson`}
        lang="en-US"
      />
      {dataJson.summaryData && Object.keys(dataJson.summaryData).length > 0 && (
        <SummaryBlock data={dataJson.summaryData}></SummaryBlock>
      )}
      {/* if topcollection then show hasArrangement */}
      {dataJson.seeAlsoData && Object.keys(dataJson.seeAlsoData).length > 0 && (
        <SeeAlsoBlock data={dataJson.seeAlsoData}></SeeAlsoBlock>
      )}
      <div className="w-full flex flex-col lg:flex-row">
        <Tabs
          items={[
            {
              label: 'Collection Content',
              content: (
                <div className="w-full">
                  <CollectionContent
                    identifier={dataJson.id}
                  ></CollectionContent>
                </div>
              ),
            },
            {
              label: 'Tab 2',
              content: (
                <div className="rounded-md border p-4">
                  <h3 className="text-lg font-semibold mb-2">Second content</h3>
                  <p>Another block with its own layout.</p>
                </div>
              ),
            },
            {
              label: 'Tab 3',
              content: (
                <div className="rounded-md border p-4">
                  <h3 className="text-lg font-semibold mb-2">Third content</h3>
                  <p>Put grids, forms, anything.</p>
                </div>
              ),
            },
          ]}
        />
      </div>
      <DisseminationsBlock></DisseminationsBlock>
    </div>
  );
};

export default Content;
