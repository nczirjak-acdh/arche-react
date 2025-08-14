import React from 'react';
import { useTranslation } from 'react-i18next';

const SeeAlsoBlock = ({ data = {} }: { data?: Record<string, unknown[]> }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col lg:flex-row w-full">
      <div className="w-full">
        <h5>{t('See Also')}</h5>
      </div>

      <div>ssss</div>
    </div>
  );
};

export default SeeAlsoBlock;
