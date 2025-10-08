'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

const FooterContactBox = () => {
  const { t } = useTranslation();

  return (
    <div className="arche-footer-cta">
      <div className="w-full justify-center">
        <div className="container cta">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h3 className="text-xl font-semibold text-black mb-2">
                  {t('contact_us')}
                </h3>
                <p className="text-[#5B595B]">{t('footer_contact_text')}</p>
              </div>
              <a
                href="mailto:acdh-helpdesk@oeaw.ac.at"
                className="bg-[#3B89AD] text-white px-6 py-2 rounded-md w-fit"
              >
                {t('contact')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="absolute top-0 left-1/2 -translate-y-1/2 -translate-x-1/2  bg-white rounded-lg max-w-5xl mx-auto px-6 py-8 shadow-md">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h3 className="text-xl font-semibold text-black mb-2">
              {t('contact_us')}
            </h3>
            <p className="text-[#5B595B]">{t('footer_contact_text')}</p>
          </div>
          <a
            href="mailto:acdh-helpdesk@oeaw.ac.at"
            className="bg-[#3B89AD] text-white px-6 py-2 rounded-md w-fit"
          >
            {t('contact')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default FooterContactBox;
