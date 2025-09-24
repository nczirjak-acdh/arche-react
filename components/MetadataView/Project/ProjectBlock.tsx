import React, { JSX } from 'react';
import MetadataContentHeader from '../MetadataContentHeader';
import NextPrevItem from '../DefaultBlocks/NextPrevItem';
import NewVersionBlock from '../DefaultBlocks/NewVersionBlock';
import { PUBLIC_CONFIG } from '@/config/public';
import { useTranslation } from 'react-i18next';
import SummaryBlock from '../DefaultBlocks/SummaryBlock';
import SeeAlsoBlock from '../DefaultBlocks/SeeAlsoBlock';
import AssociatedCollectionsTable from './AssociatedCollectionsTable';

const ProjectBlock = ({
  dataJson = {},
}: {
  dataJson?: Record<string, any[]>;
}) => {
  const { t } = useTranslation();

  return (
    <div id="">
      <MetadataContentHeader
        data={dataJson}
        availableDate={false}
      ></MetadataContentHeader>
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
      {dataJson.alternativeTitle && (
        <div className="flex flex-col lg:flex-row w-full">
          <span>
            {t('Alternative Title')}:&nbsp;{dataJson.alternativeTitle}
          </span>
        </div>
      )}
      {dataJson.projectSummary &&
        Object.keys(dataJson.projectSummary).length > 0 && (
          <SummaryBlock data={dataJson.projectSummary}></SummaryBlock>
        )}
      {dataJson.seeAlsoData && Object.keys(dataJson.seeAlsoData).length > 0 && (
        <SeeAlsoBlock data={dataJson.seeAlsoData}></SeeAlsoBlock>
      )}
      <div className="flex flex-col lg:flex-row w-full pt-2">
        <AssociatedCollectionsTable resourceID={dataJson.id} />
      </div>
    </div>
  );
};

export default ProjectBlock;
