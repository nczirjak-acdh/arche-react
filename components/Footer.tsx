'use client';

import React from 'react';
import FooterContactBox from './Footer/FooterContactBox';
import { useTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="flex flex-col bg-[#069] text-white text-sm items-center arche-footer">
      {/* CTA Section */}
      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-4 col-start-2">
          <div className="w-full">
            <FooterContactBox></FooterContactBox>
          </div>
        </div>
      </div>
      {/* Footer Main Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-[100px_repeat(4,_1fr)] gap-4">
          {/* Logo & Address */}
          <div className="">
            <a href="https://www.oeaw.ac.at/acdh/">
              <img
                src="/browser/images/logos/acdh-white-transparent-logo.svg"
                alt="ACDH Logo"
                className="mb-4 w-full max-w-[64px]"
              />
            </a>
          </div>

          <div className="">
            <p>
              <Trans i18nKey="acdh_name" />{' '}
            </p>
            <p className="mt-4">
              Bäckerstraße 13
              <br />
              1010 Wien
            </p>
            <p className="mt-4">T: +43 1 51581-2200</p>
            <a href="https://www.oeaw.ac.at/" className="inline-block mt-4">
              <img
                src="/browser/images/logos/OEAW_Logo_white.svg"
                alt="ÖAW Logo"
                className="max-w-[120px]"
              />
            </a>
          </div>

          {/* Orientierung */}
          <div>
            <h4 className="font-bold mb-2 text-white">{t('guidance')}</h4>
            <ul className="space-y-1">
              <li>
                <a href="#">{t('deposition_resources')}</a>
              </li>
              <li>
                <a href="#">{t('deposition_agreement')}</a>
              </li>
              <li>
                <a href="#">{t('filenames_formats_metadata')}</a>
              </li>
              <li>
                <a href="#">{t('faq')}</a>
              </li>
              <li>
                <a href="#">{t('further_guidance')}</a>
              </li>
              <li>
                <a href="#">{t('technical_setup')}</a>
              </li>
              <li>
                <a href="#">{t('api_access')}</a>
              </li>
            </ul>
          </div>

          {/* Richtlinien */}
          <div>
            <h4 className="font-bold mb-2">{t('policies')}</h4>
            <ul className="space-y-1">
              <li>
                <a href="#">{t('collection_policy')}</a>
              </li>
              <li>
                <a href="#">{t('preservation_policy')}</a>
              </li>
              <li>
                <a href="#">{t('privacy_policy')}</a>
              </li>
              <li>
                <a href="#">{t('terms_of_use')}</a>
              </li>
            </ul>
          </div>

          {/* Helpdesk */}
          <div className="">
            <h4 className="font-bold mb-2">{t('helpdesk')}</h4>
            <p className="mb-4">
              Das ACDH bietet über das{' '}
              <a href="mailto:acdh-helpdesk@oeaw.ac.at" className="underline">
                Helpdesk-Service
              </a>
              Beratung bei Fragen zu Digital Humanities-bezogenen Themen an.
            </p>

            <p className="font-bold mb-2">Website durchsuchen</p>
            <form action="/browser/search/node" method="get" className="flex">
              <input
                type="search"
                name="keys"
                className="p-2 rounded-l-md w-full text-black bg-white"
                placeholder="Suche..."
              />
              <button type="submit" className="bg-[#3B89AD] p-2 rounded-r-md">
                <img
                  src="/browser/images/common/search_icon.svg"
                  alt="Search"
                  className="w-4 h-4"
                />
              </button>
            </form>

            <ul className="mt-4 space-y-1">
              <li>
                <a href="/browser/user/login">Anmelden</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 text-center text-sm">
          <p>
            © Copyright OEAW |{' '}
            <a href="/browser/imprint" className="underline">
              Impressum
            </a>
            <a href="#" id="footer-versions-btn" className="underline">
              Software-Versionen
            </a>
          </p>
        </div>

        {/* Optional hidden version info section */}
        <div className="hidden mt-4 text-center text-xs space-x-2">
          arche lib versions
        </div>
      </div>
    </footer>
  );
};

export default Footer;
