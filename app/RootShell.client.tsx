'use client';

import '../i18n';
import I18nProvider from '@/components/I18nProvider';
import Footer from '@/components/Footer';
import HomePage from '@/components/FrontPage/HomePage';
import HeaderMain from '@/components/Header/HeaderMain';
import HeaderFront from '@/components/FrontPage/HeaderFront';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
  const router = useRouter();
  const pathname = usePathname(); // e.g. /browser/discover
  const searchParams = useSearchParams(); // current querystring

  const [lang, setLang] = useState(initialLang);

  // On mount: prefer localStorage if present, keep everything in sync
  useEffect(() => {
    const stored =
      typeof window !== 'undefined' ? localStorage.getItem('i18nextLng') : null;
    const desired = stored || initialLang;

    setLang(desired);
    if (i18n.language !== desired) i18n.changeLanguage(desired);

    if (
      typeof document !== 'undefined' &&
      document.documentElement.lang !== desired
    ) {
      document.documentElement.lang = desired;
    }

    document.cookie = `i18nextLng=${desired}; path=/; max-age=31536000; SameSite=Lax`;
  }, [initialLang]);

  // Helper to update preferredLang in the URL while preserving other params
  const updatePreferredLangInUrl = (next: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '');
    params.set('preferredLang', next);
    const nextUrl = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    router.replace(nextUrl, { scroll: false });
  };

  const changeLanguage = (next: string) => {
    // Persist
    try {
      localStorage.setItem('i18nextLng', next);
    } catch {}
    document.cookie = `i18nextLng=${next}; path=/; max-age=31536000; SameSite=Lax`;
    i18n.changeLanguage(next);
    if (typeof document !== 'undefined') document.documentElement.lang = next;
    setLang(next);

    // Update URL param (works for any route; if the page doesn’t care, it’s harmless)
    updatePreferredLangInUrl(next);

    // Refresh SSR parts that depend on the cookie
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
