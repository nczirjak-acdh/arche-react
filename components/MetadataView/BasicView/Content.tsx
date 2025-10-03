import React, { JSX } from 'react';
import MetadataContentHeader from '../MetadataContentHeader';
import NextPrevItem from '../DefaultBlocks/NextPrevItem';
import CiteBlock from '../DefaultBlocks/CiteBlock';
import SummaryBlock from '../DefaultBlocks/SummaryBlock';
import SeeAlsoBlock from '../DefaultBlocks/SeeAlsoBlock';
import DisseminationsBlock from '../Disseminations/DisseminationsBlock';
import NewVersionBlock from '../DefaultBlocks/NewVersionBlock';
import { PUBLIC_CONFIG } from '@/config/public';
import AssociatedPublications from '../DefaultBlocks/Tabs/AssociatedPublications';
import AssociatedCollectionsAndResources from '../DefaultBlocks/Tabs/AssociatedCollectionsAndResources';
import CustomTab, { TabItem } from './CustomTab';
import CollectionContentTab from '../DefaultBlocks/Tabs/CollectionContentTab';
import ArrangementBlock from '../DefaultBlocks/ArrangementBlock';

type Status = 'pending' | 'has' | 'empty';

const Content = ({ dataJson = {} }: { dataJson?: Record<string, any[]> }) => {
  const [t1, setT1] = React.useState<Status>('pending');
  const [t2, setT2] = React.useState<Status>('pending');
  const [t3, setT3] = React.useState<Status>('pending');

  // stable mappers
  const onT1 = React.useCallback(
    (has: boolean) => setT1(has ? 'has' : 'empty'),
    []
  );
  const onT2 = React.useCallback(
    (has: boolean) => setT2(has ? 'has' : 'empty'),
    []
  );
  const onT3 = React.useCallback(
    (has: boolean) => setT3(has ? 'has' : 'empty'),
    []
  );

  // Build visible tabs:
  // - show while 'pending' (so user sees loader)
  // - keep if 'has'
  // - drop only when 'empty'
  const items: TabItem[] = [];

  if (t1 !== 'empty') {
    items.push({
      key: 'coll-cont',
      label: 'Collection Content',
      content: (
        <CollectionContentTab endpoint={dataJson.id} onDataStatus={onT1} />
      ),
    });
  }
  if (t2 !== 'empty') {
    items.push({
      key: 'assoc-publ',
      label: 'Associated Publications',
      content: (
        <AssociatedPublications
          endpoint={`${PUBLIC_CONFIG.apiBase}/publicationsDT/${encodeURIComponent(
            dataJson.id
          )}/${encodeURIComponent('en')}`}
          onDataStatus={onT2}
        />
      ),
    });
  }
  if (t3 !== 'empty') {
    items.push({
      key: 'assoc-coll-res',
      label: 'Associated Collections and Resources',
      content: (
        <AssociatedCollectionsAndResources
          endpoint={`${PUBLIC_CONFIG.apiBase}/rprDT/${encodeURIComponent(
            dataJson.id
          )}/${encodeURIComponent('en')}`}
          onDataStatus={onT3}
        ></AssociatedCollectionsAndResources>
      ),
    });
  }

  // Force Tabs remount when set of labels changes (many Tab libs cache items on mount)
  const tabsKey = items.map((i) => i.key).join('|');

  // Optional total loader while both tabs are still probing and nothing visible yet
  const anyPending = [t1, t2].some((s) => s === 'pending');
  const anyHas = items.length > 0;
  const allEmpty = !anyHas && !anyPending;

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
      <CiteBlock resourceID={dataJson.id} lang="en-US" />
      {dataJson.summaryData && Object.keys(dataJson.summaryData).length > 0 && (
        <SummaryBlock data={dataJson.summaryData}></SummaryBlock>
      )}
      {dataJson.arrangement && Object.keys(dataJson.arrangement).length > 0 && (
        <ArrangementBlock data={dataJson.arrangement}></ArrangementBlock>
      )}
      {/* if topcollection then show hasArrangement */}
      {dataJson.seeAlsoData && Object.keys(dataJson.seeAlsoData).length > 0 && (
        <SeeAlsoBlock data={dataJson.seeAlsoData}></SeeAlsoBlock>
      )}
      <div className="w-full flex flex-col lg:flex-row">
        {anyHas ? (
          <CustomTab key={tabsKey} items={items} />
        ) : anyPending ? (
          <div className="w-full flex flex-col rounded border p-6 text-sm text-gray-600">
            Loading…
          </div>
        ) : allEmpty ? (
          <div className="hidden"></div>
        ) : null}
      </div>
      <div className="w-full flex flex-col lg:flex-row"></div>

      <DisseminationsBlock
        identifier={dataJson.id}
        acdhCategory={dataJson.disseminationCategories}
      ></DisseminationsBlock>
    </div>
  );
};

export default Content;
