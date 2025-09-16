import React, { JSX } from 'react';
import MetadataContentHeader from '../MetadataContentHeader';
import NextPrevItem from '../DefaultBlocks/NextPrevItem';
import NewVersionBlock from '../DefaultBlocks/NewVersionBlock';
import { PUBLIC_CONFIG } from '@/config/public';

const OldResourceBlock = ({
  dataJson = {},
}: {
  dataJson?: Record<string, any[]>;
}) => {
  return (
    <div id="">
      PLACE
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
    </div>
  );
};

export default OldResourceBlock;
