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

  console.log('MAP');
  console.log(dataJson.mapType);
  return (
    <div className="grid w-full lg:w-[25%] gap-8">
      <div className={hasImage ? 'block' : 'hidden'}>
        <TitleImageCard
          id={`${process.env.NEXT_PUBLIC_API_BASE}/api/${dataJson.id}`}
          onFound={setHasImage}
        />
      </div>

      <MapCard data={dataJson.id} mapType={dataJson.mapType}></MapCard>
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
      <DownloadCard data={dataJson.id} />
      <ViewShareCard data={dataJson.id}></ViewShareCard>
      <VersionsCard data={dataJson.id}></VersionsCard>
    </div>
  );
};

export default RightCards;
