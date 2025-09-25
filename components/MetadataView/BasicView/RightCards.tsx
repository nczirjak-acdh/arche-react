import React from 'react';
import IdentifierCard from '../Cards/IdentifierCard';
import TitleImageCard from '../Cards/TitleImageCard';
import MapCard from '../Cards/MapCard';
import LicenseDataCard from '../Cards/LicenseDataCard';
import CreditsDataCard from '../Cards/CreditsDataCard';
import FundingDataCard from '../Cards/FundingDataCard';
import TechnicalCard from '../Cards/TechnicalCard';
import DownloadCard from '../Cards/DownloadCard';
import ViewShareCard from '../Cards/ViewShareCard';
import VersionsCard from '../Cards/VersionsCard';

const RightCards = ({ dataJson = {} }: { dataJson?: Record<string, []> }) => {
  const [hasImage, setHasImage] = React.useState(false);

  let mapData = '';
  const resourceMapType = dataJson.mapType;
  const acdhType = dataJson.acdhType;
  console.log(acdhType);
  if (resourceMapType === 'multipolygon') {
    mapData = dataJson.mapPolygon;
  } else if (resourceMapType === 'polygon') {
    mapData = dataJson.mapPolygon;
  } else if (resourceMapType === 'coordinates') {
    mapData = dataJson.mapCoordinates;
  }

  console.log('TECHNOCAL DAZA');
  console.log(dataJson.technicalData);

  return (
    <div className="flex flex-col w-full lg:w-[25%] gap-8">
      <div className={hasImage ? 'block' : 'hidden'}>
        <TitleImageCard
          id={`${process.env.NEXT_PUBLIC_API_BASE}/api/${dataJson.id}`}
          onFound={setHasImage}
        />
      </div>

      {mapData && !acdhType.includes('#Place') && (
        <MapCard data={mapData!} mapType={resourceMapType} />
      )}

      <IdentifierCard data={dataJson.pidOrAcdhIdentifier}></IdentifierCard>
      {dataJson.licenseData && Object.keys(dataJson.licenseData).length > 0 && (
        <LicenseDataCard data={dataJson.licenseData} />
      )}
      {dataJson.creditsData && Object.keys(dataJson.creditsData).length > 0 && (
        <CreditsDataCard data={dataJson.creditsData} />
      )}
      {dataJson.fundingData && Object.keys(dataJson.fundingData).length > 0 && (
        <FundingDataCard
          data={dataJson.fundingData}
          logos={dataJson.fundingLogos}
        />
      )}

      {dataJson.technicalData &&
        Object.keys(dataJson.technicalData).length > 0 && (
          <TechnicalCard data={dataJson.technicalData} />
        )}
      <DownloadCard data={dataJson} />
      <ViewShareCard data={dataJson.id}></ViewShareCard>
      <VersionsCard data={dataJson.id}></VersionsCard>
    </div>
  );
};

export default RightCards;
