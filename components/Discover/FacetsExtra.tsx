'use client';
import Link from 'next/link';
import React from 'react';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

const FacetsExtra = () => {
  const lang = Cookies.get('i18nextLng') || 'en';
  const { t } = useTranslation();
  return (
    <div>
      {/* Extra card */}
      <div className="border border-[#E1E1E1] rounded-[8px] w-full">
        <div className="flex items-center gap-[10px] bg-[#FAFAFA] px-[24px] py-[10px]">
          <span className="facet-title">{t('Extended Search')}</span>
        </div>
        <div className="flex p-[12px] gap-[24px] border-t border-[#E1EDF3]">
          Body
        </div>
      </div>

      {/* Reset / Search buttons */}
      <div className="w-full">
        <button
          onClick={() => onChangeFilters?.({})}
          className="block btn-arche-blue text-white w-full text-center"
        >
          {t('Reset filters')}
        </button>
      </div>

      <div className="w-full">
        <button
          onClick={handleTopSearchSubmit}
          className="block btn-arche-blue text-white w-full text-center"
        >
          {t('Search')}
        </button>
      </div>

      <div className="w-full">
        <Link
          href="#"
          target="_blank"
          className="block btn-arche-blue text-white w-full text-center"
        >
          Add to CLARIN Virtual Collection
        </Link>
      </div>
    </div>
  );
};

export default FacetsExtra;
