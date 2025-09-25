import React, { JSX } from 'react';
import MetadataContentHeader from '../MetadataContentHeader';
import NextPrevItem from '../DefaultBlocks/NextPrevItem';
import NewVersionBlock from '../DefaultBlocks/NewVersionBlock';
import { PUBLIC_CONFIG } from '@/config/public';
import PersonAddressBlock from './PersonAddressBlock';
import PersonContributedTable from './PersonContributedTable';
import { useTranslation } from 'react-i18next';
import OrganisationMemberBlock from '../OrganisationView/OrganisationMemberBlock';

const PersonBlock = ({
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
      {dataJson.personalTitle && (
        <div className="flex flex-col lg:flex-row w-full">
          <span>
            {t('Personal Title')}: nbsp;{dataJson.personalTitle}
          </span>
        </div>
      )}
      {dataJson.alternativeTitle && (
        <div className="flex flex-col lg:flex-row w-full">
          <span>
            {t('Alternative Title')}:&nbsp;{dataJson.alternativeTitle}
          </span>
        </div>
      )}
      <div className="flex flex-col lg:flex-row w-full">
        {dataJson.organisationMemberBlock &&
          Object.keys(dataJson.organisationMemberBlock).length > 0 && (
            <OrganisationMemberBlock data={dataJson.organisationMemberBlock} />
          )}
      </div>

      <div className="flex flex-col lg:flex-row w-full">
        {dataJson.organisationAddressBlock &&
          Object.keys(dataJson.organisationAddressBlock).length > 0 && (
            <PersonAddressBlock data={dataJson.organisationAddressBlock} />
          )}
      </div>
      <div className="flex flex-col lg:flex-row w-full pt-2">
        <PersonContributedTable resourceID={dataJson.id} />
      </div>
      <br />
    </div>
  );
};

export default PersonBlock;
