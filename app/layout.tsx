'use client';
import '../i18n';
import I18nProvider from '@/components/I18nProvider';
import './globals.css';
import Footer from '@/components/Footer';
import { usePathname } from 'next/navigation';
import HomePage from '@/components/FrontPage/HomePage';

import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

import HeaderMain from '@/components/Header/HeaderMain';
import HeaderFront from '@/components/FrontPage/HeaderFront';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { t } = useTranslation();

  const pathname = usePathname();

  useEffect(() => {
    const langParam = new URLSearchParams(window.location.search).get('lang');
    if (langParam) i18n.changeLanguage(langParam);
  }, []);

  if (pathname === '/') {
    return (
      <html lang="{langParam}">
        <body>
          <I18nProvider>
            <HeaderFront
              mainNavigation={
                <>
                  <a href="#" className="text-[#2c3e50] hover:underline">
                    {t('menu_discover')}
                  </a>
                  <a href="#" className="text-[#2c3e50] hover:underline">
                    {t('menu_deposit')}
                  </a>
                  <a href="#" className="text-[#2c3e50] hover:underline">
                    Policies
                  </a>
                  <a href="#" className="text-[#2c3e50] hover:underline">
                    About Arche
                  </a>
                </>
              }
              mobileNavigation={
                <>
                  <a
                    href="#"
                    className="block py-2 text-[#2c3e50] hover:underline"
                  >
                    {t('menu_discover')}
                  </a>
                  <a
                    href="#"
                    className="block py-2 text-[#2c3e50] hover:underline"
                  >
                    {t('menu_deposit')}
                  </a>
                  <a
                    href="#"
                    className="block py-2 text-[#2c3e50] hover:underline"
                  >
                    Policies
                  </a>
                  <a
                    href="#"
                    className="block py-2 text-[#2c3e50] hover:underline"
                  >
                    About Arche
                  </a>
                </>
              }
            />
            <HomePage />
            <Footer></Footer>
          </I18nProvider>
        </body>
      </html>
    );
  }

  return (
    <html lang="{langParam}">
      <body>
        <I18nProvider>
          <HeaderMain
            mainNavigation={
              <>
                <a href="#" className="text-[#2c3e50] hover:underline">
                  {t('menu_discover')}
                </a>
                <a href="#" className="text-[#2c3e50] hover:underline">
                  {t('menu_deposit')}
                </a>
                <a href="#" className="text-[#2c3e50] hover:underline">
                  Policies
                </a>
                <a href="#" className="text-[#2c3e50] hover:underline">
                  About Arche
                </a>
              </>
            }
            mobileNavigation={
              <>
                <a
                  href="#"
                  className="block py-2 text-[#2c3e50] hover:underline"
                >
                  {t('menu_discover')}
                </a>
                <a
                  href="#"
                  className="block py-2 text-[#2c3e50] hover:underline"
                >
                  {t('menu_deposit')}
                </a>
                <a
                  href="#"
                  className="block py-2 text-[#2c3e50] hover:underline"
                >
                  Policies
                </a>
                <a
                  href="#"
                  className="block py-2 text-[#2c3e50] hover:underline"
                >
                  About Arche
                </a>
              </>
            }
          />
          {children}
          <Footer></Footer>
        </I18nProvider>
      </body>
    </html>
  );
}
