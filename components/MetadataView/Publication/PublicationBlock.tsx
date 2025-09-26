import React, { JSX } from 'react';
import MetadataContentHeader from '../MetadataContentHeader';
import NextPrevItem from '../DefaultBlocks/NextPrevItem';
import NewVersionBlock from '../DefaultBlocks/NewVersionBlock';
import { useTranslation } from 'react-i18next';
import CiteBlock from '../DefaultBlocks/CiteBlock';
import { PUBLIC_CONFIG } from '@/config/public';
import PublicationSummaryBlock from './PublicationSummaryBlock';
import PublicationPartOfTable from './PublicationPartOfTable';
import PublicationInverseTable from './PublicationInverseTable';

const PublicationBlock = ({
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
      <CiteBlock
        src={`${process.env.NEXT_PUBLIC_BIBLATEX_URL}/?id=${PUBLIC_CONFIG.apiBase}/api/${dataJson.id}&lang=en&format=application%2Fvnd.citationstyles.csl%2Bjson`}
        lang="en-US"
      />
      <PublicationSummaryBlock data={dataJson.publicationSummary} />
      <PublicationPartOfTable resourceID={dataJson.id} />

      <PublicationInverseTable resourceID={dataJson.id} />

      <br />
    </div>
  );
};

export default PublicationBlock;
