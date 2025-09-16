'use client';
import { t } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import BreadcrumbBlock from './DefaultBlocks/BreadcrumbBlock';

const MetadataContentTop = ({
  data = {},
  expertView,
  setExpertView,
}: {
  data?: Record<string, any[]>;
  expertView: boolean;
  setExpertView: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col lg:flex-row w-full">
      <div className="w-full lg:w-[70%] ">
        <BreadcrumbBlock identifier={data.id}></BreadcrumbBlock>
      </div>
      <div className="w-full lg:w-[30%] flex justify-end">
        <a
          className="btn-arche-blue text-white px-[16px] py-[10px] gap-[8px] w-fit"
          id="expertViewBtn"
          onClick={() => setExpertView((prev) => !prev)}
        >
          {expertView ? t('Basic view') : t('Expert view')}
        </a>
      </div>
    </div>
  );
};

export default MetadataContentTop;
