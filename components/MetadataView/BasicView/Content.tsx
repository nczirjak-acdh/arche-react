import React, { JSX } from 'react';
import MetadataContentHeader from '../MetadataContentHeader';
import { useState, useMemo } from 'react';

import NextPrevItem from '../DefaultBlocks/NextPrevItem';
import CiteBlock from '../DefaultBlocks/CiteBlock';
import SummaryBlock from '../DefaultBlocks/SummaryBlock';
import SeeAlsoBlock from '../DefaultBlocks/SeeAlsoBlock';
import DisseminationsBlock from '../Disseminations/DisseminationsBlock';
import NewVersionBlock from '../DefaultBlocks/NewVersionBlock';
import CollectionContent from '../DefaultBlocks/Tabs/CollectionContent';
import Tabs from '@/components/Tabs';
import { PUBLIC_CONFIG } from '@/config/public';
import AssociatedPublications from '../DefaultBlocks/Tabs/AssociatedPublications';
import AssociatedCollectionsAndResources from '../DefaultBlocks/Tabs/AssociatedCollectionsAndResources';

type DisseminationsProps = {
  identifier: string;
  acdhCategory: string[];
};

const Content = ({ dataJson = {} }: { dataJson?: Record<string, any[]> }) => {
  const [hasCollectionContentTab, setHasCollectionContentTab] =
    React.useState(false);
  const [hasAssociatedPublicationsTab, setHasAssociatedPublicationsTab] =
    React.useState(false);
  const [hasAssociatedCollResTab, setHasAssociatedCollResTab] =
    React.useState(false);

  return (
    <div id="">
      <MetadataContentHeader data={dataJson}></MetadataContentHeader>
      <div className="flex flex-col w-full">
        <hr className="my-4 border-[#E1EDF3]" />
      </div>
      <NewVersionBlock identifier={dataJson.id}></NewVersionBlock>
      {dataJson.parentId &&
        typeof dataJson.parentId === 'string' &&
        dataJson.parentId.trim() !== '' && (
          <NextPrevItem identifier={dataJson.id} parentId={dataJson.parentId} />
        )}
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
                  Response:
                  {hasCollectionContentTab.toString()}
                  <CollectionContent
                    identifier={dataJson.id}
                    onDataStatus={setHasCollectionContentTab}
                  ></CollectionContent>
                </div>
              ),
            },
            {
              label: 'Associated Publications',
              content: (
                <div className="w-full">
                  Response:
                  {hasAssociatedPublicationsTab.toString()}
                  <AssociatedPublications
                    identifier={dataJson.id}
                    onDataStatus={setHasAssociatedPublicationsTab}
                  ></AssociatedPublications>
                </div>
              ),
            },
            {
              label: 'Associated Collections and Resources',
              content: (
                <div className="w-full">
                  Response:
                  {hasAssociatedCollResTab.toString()}
                  <AssociatedCollectionsAndResources
                    identifier={dataJson.id}
                    onDataStatus={setHasAssociatedCollResTab}
                  ></AssociatedCollectionsAndResources>
                </div>
              ),
            },
          ]}
        />
      </div>
      Size:
      {dataJson.binarySize}
      Public:
      {JSON.stringify(dataJson.disseminationCategories)}
      <DisseminationsBlock
        identifier={dataJson.id}
        acdhCategory={dataJson.disseminationCategories}
      ></DisseminationsBlock>
    </div>
  );
};

export default Content;
