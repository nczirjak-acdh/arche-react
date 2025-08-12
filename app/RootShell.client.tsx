'use client';

import '../i18n';
import I18nProvider from '@/components/I18nProvider';
import Footer from '@/components/Footer';
import HomePage from '@/components/FrontPage/HomePage';
import HeaderMain from '@/components/Header/HeaderMain';
import HeaderFront from '@/components/FrontPage/HeaderFront';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

export default function RootShell({
  initialLang,
  children,
}: {
  initialLang: string;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();

  const [lang, setLang] = useState(initialLang);

  // On mount: prefer localStorage if present, keep everything in sync
  useEffect(() => {
    const stored = localStorage.getItem('i18nextLng');
    const desired = stored || initialLang;

    setLang(desired);
    if (i18n.language !== desired) i18n.changeLanguage(desired);

    // ensure <html lang> matches on the client too
    if (document.documentElement.lang !== desired) {
      document.documentElement.lang = desired;
    }

    // write cookie so future SSR uses the same lang
    document.cookie = `i18nextLng=${desired}; path=/; max-age=31536000; SameSite=Lax`;
  }, [initialLang]);

  // Optional: expose a handler to switch language from any button
  const changeLanguage = (next: string) => {
    localStorage.setItem('i18nextLng', next);
    document.cookie = `i18nextLng=${next}; path=/; max-age=31536000; SameSite=Lax`;
    i18n.changeLanguage(next);
    document.documentElement.lang = next;
    setLang(next);
    // If you fetch data on the server with Accept-Language/cookie, refresh:
    router.refresh();
  };

  if (pathname === '/') {
    return (
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
              {/* Example language toggle */}
              <button
                className="ml-4 underline"
                onClick={() => changeLanguage(lang === 'en' ? 'de' : 'en')}
              >
                {lang.toUpperCase()}
              </button>
            </>
          }
          mobileNavigation={
            <>
              <a href="#" className="block py-2 text-[#2c3e50] hover:underline">
                {t('menu_discover')}
              </a>
              <a href="#" className="block py-2 text-[#2c3e50] hover:underline">
                {t('menu_deposit')}
              </a>
              <a href="#" className="block py-2 text-[#2c3e50] hover:underline">
                Policies
              </a>
              <a href="#" className="block py-2 text-[#2c3e50] hover:underline">
                About Arche
              </a>
            </>
          }
        />
        <HomePage />
        <Footer />
      </I18nProvider>
    );
  }

  return (
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
            <button
              className="ml-4 underline"
              onClick={() => changeLanguage(lang === 'en' ? 'de' : 'en')}
            >
              {lang.toUpperCase()}
            </button>
          </>
        }
        mobileNavigation={
          <>
            <a href="#" className="block py-2 text-[#2c3e50] hover:underline">
              {t('menu_discover')}
            </a>
            <a href="#" className="block py-2 text-[#2c3e50] hover:underline">
              {t('menu_deposit')}
            </a>
            <a href="#" className="block py-2 text-[#2c3e50] hover:underline">
              Policies
            </a>
            <a href="#" className="block py-2 text-[#2c3e50] hover:underline">
              About Arche
            </a>
          </>
        }
      />
      {children}
      <Footer />
    </I18nProvider>
  );
}
