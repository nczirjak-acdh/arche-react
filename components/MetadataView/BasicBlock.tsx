'use client';

import React from 'react';

import IdentifierCard from './Cards/IdentifierCard';
import { useTranslation } from 'react-i18next';
import TitleImageCard from './Cards/TitleImageCard';
import MapCard from './Cards/MapCard';
import LicenseDataCard from './Cards/LicenseDataCard';
import CreditsDataCard from './Cards/CreditsDataCard';
import FundingDataCard from './Cards/FundingDataCard';
import CollectionTechnicalCard from './Cards/CollectionTechnicalCard';
import ResourceMetaTechnicalCard from './Cards/ResourceMetaTechnicalCard';
import DownloadCard from './Cards/DownloadCard';
import ViewShareCard from './Cards/ViewShareCard';
import VersionsCard from './Cards/VersionsCard';

export default function BasicBlock({ data }: { data: any }) {
  console.log('BasicBlock');
  console.log(data);

  const { t } = useTranslation();

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 gap-[20px]">
      <div className="flex flex-col gap-[20px] ">
        {/* First row */}
        <div className="flex flex-col lg:flex-row w-full">
          <div className="w-full lg:w-[70%] ">BREADCRUMB</div>
          <div className="w-full lg:w-[30%] flex justify-end">
            <button className="text-white px-[16px] py-[10px] gap-[8px] rounded-[6px] bg-[#3B89AD] w-fit">
              {t('expert_view')}
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row w-full gap-8">
          <div className="w-full lg:w-[70%]  bg-white rounded-[12px] border border-[#E1E1E1] p-[24px]">
            <div className="flex flex-col lg:flex-row w-full">
              <div className="w-full lg:w-[70%]  ">
                <p>
                  {t('available_since')} {data.availableDate}{' '}
                </p>
              </div>
              <div className="w-full lg:w-[30%] flex justify-end">
                <span className="w-max flex p-[4px_8px] items-start gap-[8px] rounded-[12px] bg-[#5B595B] text-white text-xs">
                  {data.acdhTypeNiceFormat}
                </span>
              </div>
            </div>

            <div className="flex flex-col w-full">
              <hr className="my-4 border-[#E1EDF3]" />
            </div>

            <div className="flex flex-col lg:flex-row w-full">
              Has a new version
            </div>

            <div className="flex flex-col lg:flex-row w-full">
              NExt/previous item
            </div>

            <div className="flex flex-col lg:flex-row w-full">
              <h4>{data.title}</h4>
            </div>
            <div className="flex flex-col lg:flex-row w-full">CITE block</div>

            <div className="flex flex-col lg:flex-row w-full">SUMMARY</div>

            <div className="flex flex-col lg:flex-row w-full">SEE ALSO</div>

            <div className="flex flex-col lg:flex-row w-full">
              TABBED Tables
            </div>

            <div className="flex flex-col lg:flex-row w-full">
              disseminations : pdf,
            </div>

            <div className="flex flex-col lg:flex-row w-full">
              disseminations : audio
            </div>
            <div className="flex flex-col lg:flex-row w-full">
              disseminations : iiif
            </div>
            <div className="flex flex-col lg:flex-row w-full">
              disseminations : glb
            </div>
            <div className="flex flex-col lg:flex-row w-full">
              disseminations : ply
            </div>
            <div className="flex flex-col lg:flex-row w-full">
              disseminations : tei
            </div>
          </div>

          <div className="grid w-full lg:w-[30%] gap-8">
            titleimage map
            <TitleImageCard data={data.id}></TitleImageCard>
            <MapCard data={data.id}></MapCard>
            <IdentifierCard data={data.pidOrAcdhIdentifier}></IdentifierCard>
            <LicenseDataCard></LicenseDataCard>
            <CreditsDataCard></CreditsDataCard>
            <FundingDataCard></FundingDataCard>
            <CollectionTechnicalCard></CollectionTechnicalCard>
            <ResourceMetaTechnicalCard></ResourceMetaTechnicalCard>
            <DownloadCard></DownloadCard>
            <ViewShareCard></ViewShareCard>
            <VersionsCard></VersionsCard>
          </div>
        </div>

        {/* Second row */}
      </div>
    </section>
  );
}
