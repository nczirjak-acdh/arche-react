'use client';

import '../i18n';
import I18nProvider from '@/components/I18nProvider';
import Footer from '@/components/Footer';
import HomePage from '@/components/FrontPage/HomePage';
import HeaderMain from '@/components/Header/HeaderMain';
import HeaderFront from '@/components/FrontPage/HeaderFront';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';

// Language-normalized helper

const MENU_URLS = {
  discover: {
    EN: process.env.NEXT_PUBLIC_DISCOVER_URL_PARAMS_EN,
    DE: process.env.NEXT_PUBLIC_DISCOVER_URL_PARAMS_DE,
  },
  deposit: {
    DEPOSITION_PROCESS: {
      EN: process.env.NEXT_PUBLIC_DEPOSIT_DEPOSITION_PROCESS_EN,
      DE: process.env.NEXT_PUBLIC_DEPOSIT_DEPOSITION_PROCESS_DE,
    },
    DEPOSITION_AGREEMENT: {
      EN: process.env.NEXT_PUBLIC_DEPOSIT_DEPOSITION_AGREEMENT_EN,
      DE: process.env.NEXT_PUBLIC_DEPOSIT_DEPOSITION_AGREEMENT_DE,
    },
    FILENAMES_FORMATS: {
      EN: process.env.NEXT_PUBLIC_DEPOSIT_FILENAMES_FORMATS_EN,
      DE: process.env.NEXT_PUBLIC_DEPOSIT_FILENAMES_FORMATS_DE,
    },
    FAQ: {
      EN: process.env.NEXT_PUBLIC_DEPOSIT_FAQ_EN,
      DE: process.env.NEXT_PUBLIC_DEPOSIT_FAQ_DE,
    },
    FURTHER_GUIDANCE: {
      EN: process.env.NEXT_PUBLIC_DEPOSIT_FURTHER_GUIDANCE_EN,
      DE: process.env.NEXT_PUBLIC_DEPOSIT_FURTHER_GUIDANCE_DE,
    },
    TECHNICAL_SETUP: {
      EN: process.env.NEXT_PUBLIC_DEPOSIT_TECHNICAL_SETUP_EN,
      DE: process.env.NEXT_PUBLIC_DEPOSIT_TECHNICAL_SETUP_DE,
    },
    API_ACCESS: {
      EN: process.env.NEXT_PUBLIC_DEPOSIT_API_ACCESS_EN,
      DE: process.env.NEXT_PUBLIC_DEPOSIT_API_ACCESS_DE,
    },
  },
  policies: {
    COLLECTION_POLICY: {
      EN: process.env.NEXT_PUBLIC_POLICIES_COLLECTION_POLICY_EN,
      DE: process.env.NEXT_PUBLIC_POLICIES_COLLECTION_POLICY_DE,
    },
    PRESERVATION_POLICY: {
      EN: process.env.NEXT_PUBLIC_POLICIES_PRESERVATION_POLICY_EN,
      DE: process.env.NEXT_PUBLIC_POLICIES_PRESERVATION_POLICY_DE,
    },
    PRIVACY_POLICY: {
      EN: process.env.NEXT_PUBLIC_POLICIES_PRIVACY_POLICY_EN,
      DE: process.env.NEXT_PUBLIC_POLICIES_PRIVACY_POLICY_DE,
    },
    TERMS_OF_USE: {
      EN: process.env.NEXT_PUBLIC_POLICIES_TERMS_OF_USE_EN,
      DE: process.env.NEXT_PUBLIC_POLICIES_TERMS_OF_USE_DE,
    },
  },
  about: {
    EN: process.env.NEXT_PUBLIC_ABOUT_ARCHE_EN,
    DE: process.env.NEXT_PUBLIC_ABOUT_ARCHE_DE,
  },
} as const;

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
  const L = lang.toUpperCase();

  // --- dropdown state + outside-click handling ---
  const [open, setOpen] = useState<null | 'deposit' | 'policies'>(null);
  const navRef = useRef<HTMLUListElement | null>(null);

  const toggle = (which: 'deposit' | 'policies') =>
    setOpen((prev) => (prev === which ? null : which));

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpen(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

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
            <ul
              ref={navRef}
              className="inline-flex items-center gap-4 whitespace-nowrap list-none"
            >
              <li>
                <a
                  href={MENU_URLS.discover[L] ?? '#'}
                  className="header-nav-text"
                  aria-label={t('Discover')}
                >
                  {t('Discover')}
                </a>
              </li>

              {/* menu_deposit with dropdown */}
              <li className="relative">
                <button
                  type="button"
                  className="header-nav-text inline-flex items-center gap-1"
                  aria-haspopup="menu"
                  aria-expanded={open === 'deposit'}
                  onClick={() => toggle('deposit')}
                  aria-label={t('Deposit')}
                >
                  {t('Deposit')}
                  <span aria-hidden>▾</span>
                </button>
                <ul
                  role="menu"
                  className={`absolute left-0 top-full mt-2 min-w-56 rounded-md border bg-white shadow-lg z-20 p-1
                  ${open === 'deposit' ? 'block' : 'hidden'}`}
                >
                  <li role="none">
                    <a
                      role="menuitem"
                      className="block px-3 py-2 hover:bg-gray-50"
                      href="#"
                      aria-label={t('Deposition Process')}
                    >
                      {t('Deposition Process')}
                    </a>
                  </li>
                  <li role="none">
                    <a
                      role="menuitem"
                      className="block px-3 py-2 hover:bg-gray-50"
                      href="#"
                      aria-label={t('Deposition Agreement')}
                    >
                      {t('Deposition Agreement')}
                    </a>
                  </li>
                  <li role="none">
                    <a
                      role="menuitem"
                      className="block px-3 py-2 hover:bg-gray-50"
                      href="#"
                      aria-label={t('Filenames, Fomats, and Metadata')}
                    >
                      {t('Filenames, Fomats, and Metadata')}
                    </a>
                  </li>
                  <li role="none">
                    <a
                      role="menuitem"
                      className="block px-3 py-2 hover:bg-gray-50"
                      href="#"
                      aria-label={t('FAQ')}
                    >
                      {t('FAQ')}
                    </a>
                  </li>
                  <li role="none">
                    <a
                      role="menuitem"
                      className="block px-3 py-2 hover:bg-gray-50"
                      href="#"
                      aria-label={t('Further Guidance')}
                    >
                      {t('Further Guidance')}
                    </a>
                  </li>
                  <li role="none">
                    <a
                      role="menuitem"
                      className="block px-3 py-2 hover:bg-gray-50"
                      href="#"
                      aria-label={t('Technical Setup')}
                    >
                      {t('Technical Setup')}
                    </a>
                  </li>
                  <li role="none">
                    <a
                      role="menuitem"
                      className="block px-3 py-2 hover:bg-gray-50"
                      href="#"
                      aria-label={t('API Access')}
                    >
                      {t('API Access')}
                    </a>
                  </li>
                </ul>
              </li>

              {/* Policies with dropdown */}
              <li className="relative">
                <button
                  type="button"
                  className="header-nav-text inline-flex items-center gap-1"
                  aria-haspopup="menu"
                  aria-expanded={open === 'policies'}
                  onClick={() => toggle('policies')}
                  aria-label={t('Policies')}
                >
                  {t('Policies')}
                  <span aria-hidden>▾</span>
                </button>
                <ul
                  role="menu"
                  className={`absolute left-0 top-full mt-2 min-w-56 rounded-md border bg-white shadow-lg z-20 p-1
                  ${open === 'policies' ? 'block' : 'hidden'}`}
                >
                  <li role="none">
                    <a
                      role="menuitem"
                      className="block px-3 py-2 hover:bg-gray-50"
                      href="#"
                      aria-label={t('Collection Policy')}
                    >
                      {t('Collection Policy')}
                    </a>
                  </li>

                  <li role="none">
                    <a
                      role="menuitem"
                      className="block px-3 py-2 hover:bg-gray-50"
                      href="#"
                      aria-label={t('Preservation Policy')}
                    >
                      {t('Preservation Policy')}
                    </a>
                  </li>
                  <li role="none">
                    <a
                      role="menuitem"
                      className="block px-3 py-2 hover:bg-gray-50"
                      href="#"
                      aria-label={t('Privacy Policy')}
                    >
                      {t('Privacy Policy')}
                    </a>
                  </li>
                  <li role="none">
                    <a
                      role="menuitem"
                      className="block px-3 py-2 hover:bg-gray-50"
                      href="#"
                      aria-label={t('Terms of Use')}
                    >
                      {t('Terms of Use')}
                    </a>
                  </li>
                </ul>
              </li>

              <li>
                <a
                  href="#"
                  className="header-nav-text"
                  aria-label={t('About Arche')}
                >
                  {t('About Arche')}
                </a>
              </li>

              {/* language toggle as a proper list item */}
              <li>
                <button
                  className="ml-2 underline"
                  onClick={() => changeLanguage(lang === 'en' ? 'de' : 'en')}
                >
                  {lang.toUpperCase()}
                </button>
              </li>
            </ul>
          }
          mobileNavigation={
            <ul
              ref={navRef}
              className="inline-flex items-center gap-4 whitespace-nowrap list-none"
            >
              <li>
                <a
                  href={MENU_URLS.discover[L] ?? '#'}
                  className="header-nav-text"
                  aria-label={t('Discover')}
                >
                  {t('Discover')}
                </a>
              </li>

              {/* menu_deposit with dropdown */}
              <li className="relative">
                <button
                  type="button"
                  className="header-nav-text inline-flex items-center gap-1"
                  aria-haspopup="menu"
                  aria-expanded={open === 'deposit'}
                  onClick={() => toggle('deposit')}
                  aria-label={t('Deposit')}
                >
                  {t('Deposit')}
                  <span aria-hidden>▾</span>
                </button>
                <ul
                  role="menu"
                  className={`absolute left-0 top-full mt-2 min-w-56 rounded-md border bg-white shadow-lg z-20 p-1
                  ${open === 'deposit' ? 'block' : 'hidden'}`}
                >
                  <li role="none">
                    <a
                      role="menuitem"
                      className="block px-3 py-2 hover:bg-gray-50"
                      href="#"
                      aria-label={t('Deposition Process')}
                    >
                      {t('Deposition Process')}
                    </a>
                  </li>
                  <li role="none">
                    <a
                      role="menuitem"
                      className="block px-3 py-2 hover:bg-gray-50"
                      href="#"
                      aria-label={t('Deposition Agreement')}
                    >
                      {t('Deposition Agreement')}
                    </a>
                  </li>
                  <li role="none">
                    <a
                      role="menuitem"
                      className="block px-3 py-2 hover:bg-gray-50"
                      href="#"
                      aria-label={t('Filenames, Fomats, and Metadata')}
                    >
                      {t('Filenames, Fomats, and Metadata')}
                    </a>
                  </li>
                  <li role="none">
                    <a
                      role="menuitem"
                      className="block px-3 py-2 hover:bg-gray-50"
                      href="#"
                      aria-label={t('FAQ')}
                    >
                      {t('FAQ')}
                    </a>
                  </li>
                  <li role="none">
                    <a
                      role="menuitem"
                      className="block px-3 py-2 hover:bg-gray-50"
                      href="#"
                      aria-label={t('Further Guidance')}
                    >
                      {t('Further Guidance')}
                    </a>
                  </li>
                  <li role="none">
                    <a
                      role="menuitem"
                      className="block px-3 py-2 hover:bg-gray-50"
                      href="#"
                      aria-label={t('Technical Setup')}
                    >
                      {t('Technical Setup')}
                    </a>
                  </li>
                  <li role="none">
                    <a
                      role="menuitem"
                      className="block px-3 py-2 hover:bg-gray-50"
                      href="#"
                      aria-label={t('API Access')}
                    >
                      {t('API Access')}
                    </a>
                  </li>
                </ul>
              </li>

              {/* Policies with dropdown */}
              <li className="relative">
                <button
                  type="button"
                  className="header-nav-text inline-flex items-center gap-1"
                  aria-haspopup="menu"
                  aria-expanded={open === 'policies'}
                  onClick={() => toggle('policies')}
                  aria-label={t('Policies')}
                >
                  {t('Policies')}
                  <span aria-hidden>▾</span>
                </button>
                <ul
                  role="menu"
                  className={`absolute left-0 top-full mt-2 min-w-56 rounded-md border bg-white shadow-lg z-20 p-1
                  ${open === 'policies' ? 'block' : 'hidden'}`}
                >
                  <li role="none">
                    <a
                      role="menuitem"
                      className="block px-3 py-2 hover:bg-gray-50"
                      href="#"
                      aria-label={t('Collection Policy')}
                    >
                      {t('Collection Policy')}
                    </a>
                  </li>

                  <li role="none">
                    <a
                      role="menuitem"
                      className="block px-3 py-2 hover:bg-gray-50"
                      href="#"
                      aria-label={t('Preservation Policy')}
                    >
                      {t('Preservation Policy')}
                    </a>
                  </li>
                  <li role="none">
                    <a
                      role="menuitem"
                      className="block px-3 py-2 hover:bg-gray-50"
                      href="#"
                      aria-label={t('Privacy Policy')}
                    >
                      {t('Privacy Policy')}
                    </a>
                  </li>
                  <li role="none">
                    <a
                      role="menuitem"
                      className="block px-3 py-2 hover:bg-gray-50"
                      href="#"
                      aria-label={t('Terms of Use')}
                    >
                      {t('Terms of Use')}
                    </a>
                  </li>
                </ul>
              </li>

              <li>
                <a
                  href="#"
                  className="header-nav-text"
                  aria-label={t('About Arche')}
                >
                  {t('About Arche')}
                </a>
              </li>

              {/* language toggle as a proper list item */}
              <li>
                <button
                  className="ml-2 underline"
                  onClick={() => changeLanguage(lang === 'en' ? 'de' : 'en')}
                >
                  {lang.toUpperCase()}
                </button>
              </li>
            </ul>
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
          <ul
            ref={navRef}
            className="inline-flex items-center gap-4 whitespace-nowrap list-none"
          >
            <li>
              <a
                href={MENU_URLS.discover[L] ?? '#'}
                className="header-nav-text"
              >
                {t('Discover')}
              </a>
            </li>

            {/* menu_deposit with dropdown */}
            <li className="relative">
              <button
                type="button"
                className="header-nav-text inline-flex items-center gap-1"
                aria-haspopup="menu"
                aria-expanded={open === 'deposit'}
                onClick={() => toggle('deposit')}
              >
                {t('Deposit')}
                <span aria-hidden>▾</span>
              </button>
              <ul
                role="menu"
                className={`absolute left-0 top-full mt-2 min-w-56 rounded-md border bg-white shadow-lg z-20 p-1
                  ${open === 'deposit' ? 'block' : 'hidden'}`}
              >
                <li role="none">
                  <a
                    role="menuitem"
                    className="block px-3 py-2 hover:bg-gray-50"
                    href={MENU_URLS.deposit.DEPOSITION_PROCESS[L] ?? '#'}
                  >
                    {t('Deposition Process')}
                  </a>
                </li>
                <li role="none">
                  <a
                    role="menuitem"
                    className="block px-3 py-2 hover:bg-gray-50"
                    href={MENU_URLS.deposit.DEPOSITION_AGREEMENT[L] ?? '#'}
                  >
                    {t('Deposition Agreement')}
                  </a>
                </li>
                <li role="none">
                  <a
                    role="menuitem"
                    className="block px-3 py-2 hover:bg-gray-50"
                    href={MENU_URLS.deposit.FILENAMES_FORMATS[L] ?? '#'}
                  >
                    {t('Filenames, Fomats, and Metadata')}
                  </a>
                </li>
                <li role="none">
                  <a
                    role="menuitem"
                    className="block px-3 py-2 hover:bg-gray-50"
                    href={MENU_URLS.deposit.FAQ[L] ?? '#'}
                  >
                    {t('FAQ')}
                  </a>
                </li>
                <li role="none">
                  <a
                    role="menuitem"
                    className="block px-3 py-2 hover:bg-gray-50"
                    href={MENU_URLS.deposit.FURTHER_GUIDANCE[L] ?? '#'}
                  >
                    {t('Further Guidance')}
                  </a>
                </li>
                <li role="none">
                  <a
                    role="menuitem"
                    className="block px-3 py-2 hover:bg-gray-50"
                    href={MENU_URLS.deposit.TECHNICAL_SETUP[L] ?? '#'}
                  >
                    {t('Technical Setup')}
                  </a>
                </li>
                <li role="none">
                  <a
                    role="menuitem"
                    className="block px-3 py-2 hover:bg-gray-50"
                    href={MENU_URLS.deposit.API_ACCESS[L] ?? '#'}
                  >
                    {t('API Access')}
                  </a>
                </li>
              </ul>
            </li>

            {/* Policies with dropdown */}
            <li className="relative">
              <button
                type="button"
                className="header-nav-text inline-flex items-center gap-1"
                aria-haspopup="menu"
                aria-expanded={open === 'policies'}
                onClick={() => toggle('policies')}
              >
                {t('Policies')}
                <span aria-hidden>▾</span>
              </button>
              <ul
                role="menu"
                className={`absolute left-0 top-full mt-2 min-w-56 rounded-md border bg-white shadow-lg z-20 p-1
                  ${open === 'policies' ? 'block' : 'hidden'}`}
              >
                <li role="none">
                  <a
                    role="menuitem"
                    className="block px-3 py-2 hover:bg-gray-50"
                    href={MENU_URLS.policies.COLLECTION_POLICY[L] ?? '#'}
                  >
                    {t('Collection Policy')}
                  </a>
                </li>

                <li role="none">
                  <a
                    role="menuitem"
                    className="block px-3 py-2 hover:bg-gray-50"
                    href={MENU_URLS.policies.PRESERVATION_POLICY[L] ?? '#'}
                  >
                    {t('Preservation Policy')}
                  </a>
                </li>
                <li role="none">
                  <a
                    role="menuitem"
                    className="block px-3 py-2 hover:bg-gray-50"
                    href={MENU_URLS.policies.PRIVACY_POLICY[L] ?? '#'}
                  >
                    {t('Privacy Policy')}
                  </a>
                </li>
                <li role="none">
                  <a
                    role="menuitem"
                    className="block px-3 py-2 hover:bg-gray-50"
                    href={MENU_URLS.policies.TERMS_OF_USE[L] ?? '#'}
                  >
                    {t('Terms of Use')}
                  </a>
                </li>
              </ul>
            </li>

            <li>
              <a href={MENU_URLS.about[L] ?? '#'} className="header-nav-text">
                {t('About Arche')}
              </a>
            </li>

            {/* language toggle as a proper list item */}
            <li>
              <button
                className="ml-2 underline"
                onClick={() => changeLanguage(lang === 'en' ? 'de' : 'en')}
              >
                {lang.toUpperCase()}
              </button>
            </li>
          </ul>
        }
        mobileNavigation={
          <ul
            ref={navRef}
            className="inline-flex items-center gap-4 whitespace-nowrap list-none"
          >
            <li>
              <a
                href={MENU_URLS.discover[L] ?? '#'}
                className="header-nav-text"
              >
                {t('Discover')}
              </a>
            </li>

            {/* menu_deposit with dropdown */}
            <li className="relative">
              <button
                type="button"
                className="header-nav-text inline-flex items-center gap-1"
                aria-haspopup="menu"
                aria-expanded={open === 'deposit'}
                onClick={() => toggle('deposit')}
              >
                {t('Deposit')}
                <span aria-hidden>▾</span>
              </button>
              <ul
                role="menu"
                className={`absolute left-0 top-full mt-2 min-w-56 rounded-md border bg-white shadow-lg z-20 p-1
                  ${open === 'deposit' ? 'block' : 'hidden'}`}
              >
                <li role="none">
                  <a
                    role="menuitem"
                    className="block px-3 py-2 hover:bg-gray-50"
                    href={MENU_URLS.deposit.DEPOSITION_PROCESS[L] ?? '#'}
                  >
                    {t('Deposition Process')}
                  </a>
                </li>
                <li role="none">
                  <a
                    role="menuitem"
                    className="block px-3 py-2 hover:bg-gray-50"
                    href="#"
                  >
                    {t('Deposition Agreement')}
                  </a>
                </li>
                <li role="none">
                  <a
                    role="menuitem"
                    className="block px-3 py-2 hover:bg-gray-50"
                    href="#"
                  >
                    {t('Filenames, Fomats, and Metadata')}
                  </a>
                </li>
                <li role="none">
                  <a
                    role="menuitem"
                    className="block px-3 py-2 hover:bg-gray-50"
                    href="#"
                  >
                    {t('FAQ')}
                  </a>
                </li>
                <li role="none">
                  <a
                    role="menuitem"
                    className="block px-3 py-2 hover:bg-gray-50"
                    href="#"
                  >
                    {t('Further Guidance')}
                  </a>
                </li>
                <li role="none">
                  <a
                    role="menuitem"
                    className="block px-3 py-2 hover:bg-gray-50"
                    href="#"
                  >
                    {t('Technical Setup')}
                  </a>
                </li>
                <li role="none">
                  <a
                    role="menuitem"
                    className="block px-3 py-2 hover:bg-gray-50"
                    href="#"
                  >
                    {t('API Access')}
                  </a>
                </li>
              </ul>
            </li>

            {/* Policies with dropdown */}
            <li className="relative">
              <button
                type="button"
                className="header-nav-text inline-flex items-center gap-1"
                aria-haspopup="menu"
                aria-expanded={open === 'policies'}
                onClick={() => toggle('policies')}
              >
                {t('Policies')}
                <span aria-hidden>▾</span>
              </button>
              <ul
                role="menu"
                className={`absolute left-0 top-full mt-2 min-w-56 rounded-md border bg-white shadow-lg z-20 p-1
                  ${open === 'policies' ? 'block' : 'hidden'}`}
              >
                <li role="none">
                  <a
                    role="menuitem"
                    className="block px-3 py-2 hover:bg-gray-50"
                    href="#"
                  >
                    {t('Collection Policy')}
                  </a>
                </li>

                <li role="none">
                  <a
                    role="menuitem"
                    className="block px-3 py-2 hover:bg-gray-50"
                    href="#"
                  >
                    {t('Preservation Policy')}
                  </a>
                </li>
                <li role="none">
                  <a
                    role="menuitem"
                    className="block px-3 py-2 hover:bg-gray-50"
                    href="#"
                  >
                    {t('Privacy Policy')}
                  </a>
                </li>
                <li role="none">
                  <a
                    role="menuitem"
                    className="block px-3 py-2 hover:bg-gray-50"
                    href="#"
                  >
                    {t('Terms of Use')}
                  </a>
                </li>
              </ul>
            </li>

            <li>
              <a href="#" className="header-nav-text">
                {t('About Arche')}
              </a>
            </li>

            {/* language toggle as a proper list item */}
            <li>
              <button
                className="ml-2 underline"
                onClick={() => changeLanguage(lang === 'en' ? 'de' : 'en')}
              >
                {lang.toUpperCase()}
              </button>
            </li>
          </ul>
        }
      />
      {children}
      <Footer />
    </I18nProvider>
  );
}
