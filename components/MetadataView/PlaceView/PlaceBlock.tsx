import React, { JSX } from 'react';
import MetadataContentHeader from '../MetadataContentHeader';
import NextPrevItem from '../DefaultBlocks/NextPrevItem';
import NewVersionBlock from '../DefaultBlocks/NewVersionBlock';
import { PUBLIC_CONFIG } from '@/config/public';
import PlaceAddressBlock from './PlaceAddressBlock';
import PlaceDescriptionBlock from './PlaceDescriptionBlock';
import PlaceMapBlock from './PlaceMapBlock';
import PlaceCoordinatesBlock from './PlaceCoordinatesBlock';

const PlaceBlock = ({
  dataJson = {},
}: {
  dataJson?: Record<string, any[]>;
}) => {
  const resourceMapType = dataJson.mapType;
  let mapData = '';
  if (resourceMapType === 'multipolygon') {
    mapData = dataJson.mapPolygon;
  } else if (resourceMapType === 'polygon') {
    mapData = dataJson.mapPolygon;
  } else if (resourceMapType === 'coordinates') {
    mapData = dataJson.mapCoordinates;
  }

  return (
    <div className="flex flex-col gap-2" id="">
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
      <div className="flex flex-col lg:flex-row w-full">
        {dataJson.placeAddress &&
          Object.keys(dataJson.placeAddress).length > 0 && (
            <PlaceAddressBlock data={dataJson.placeAddress} />
          )}
      </div>
      <div className="flex flex-col lg:flex-row w-full">
        {dataJson.placeDescription &&
          Object.keys(dataJson.placeDescription).length > 0 && (
            <PlaceDescriptionBlock data={dataJson.placeDescription} />
          )}
      </div>
      <div className="flex flex-col lg:flex-row w-full">
        {dataJson.mapCoordinatesBlock &&
          Object.keys(dataJson.mapCoordinatesBlock).length > 0 && (
            <PlaceCoordinatesBlock data={dataJson.mapCoordinatesBlock} />
          )}
      </div>
      <div className="flex flex-col lg:flex-row w-full pt-2">
        {mapData && <PlaceMapBlock data={mapData!} mapType={resourceMapType} />}
      </div>
    </div>
  );
};

export default PlaceBlock;
