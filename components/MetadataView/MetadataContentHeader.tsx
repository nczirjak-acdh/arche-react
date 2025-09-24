'use client';
import { t } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';

const MetadataContentHeader = ({
  data = {},
  availableDate = true,
}: {
  data?: Record<string, any[]>;
  availableDate: boolean;
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col lg:flex-row w-full">
      <div className="w-full lg:w-[70%]  ">
        {availableDate && (
          <p>
            {t('available_since')} {data.availableDate}{' '}
          </p>
        )}
      </div>
      <div className="w-full lg:w-[30%] flex justify-end">
        <span className="w-max flex p-[4px_8px] items-start gap-[8px] rounded-[12px] bg-[#5B595B] text-white text-xs">
          {data.acdhTypeNiceFormat}
        </span>
      </div>
    </div>
  );
};

export default MetadataContentHeader;
