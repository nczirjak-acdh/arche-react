// app/not-found.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import boxNotFoundImage from '@/public/images/404_image.png';
import acdhImage from '@/public/images/acdh_logo_with_text.svg';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen w-full bg-white">
      <section className="mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center px-6 py-12 text-center">
        {/* 404 box illustration */}
        <Image
          src={boxNotFoundImage} // <-- place your logo in /public
          alt="404 image"
          width={260}
          className="h-auto w-[260px] pb-5"
        />

        {/* Headline */}
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
          {t('Sorry, there’s nothing in here!')}
        </h1>

        {/* Lead paragraph */}
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600">
          {t(
            'Even though we do our best to keep our namespace tidy and persistent, there might still be a broken link here and there.'
          )}
        </p>

        {/* Apology */}
        <p className="mt-4 text-base text-gray-700">
          {t('We apologize for the inconvenience.')}
        </p>

        {/* Bottom area: left logo, right buttons */}
        <div className="mt-10 grid w-full max-w-3xl grid-cols-1 items-center gap-6 sm:grid-cols-2">
          {/* Logo (left) */}
          <div className="flex justify-center sm:justify-start">
            <Image
              src={acdhImage} // <-- place your logo in /public
              alt="Austrian Centre for Digital Humanities and Cultural Heritage"
              width={260}
              height={80}
              className="h-auto w-[260px]"
            />
          </div>

          {/* Buttons (right) */}
          <div className="flex flex-col items-center gap-4 sm:items-end">
            <Link
              href="https://www.oeaw.ac.at/acdh"
              className="inline-flex w-[240px] items-center justify-center border border-black px-5 py-3 !text-black text-sm font-medium transition hover:bg-black hover:!text-white hover:!no-underline"
            >
              {t('VISIT ACDH WEBSITE')}
            </Link>
            <Link
              href="/contact"
              className="inline-flex w-[240px] items-center justify-center  border border-black px-5 py-3 !text-black text-sm font-medium transition hover:bg-black hover:!text-white hover:!no-underline"
            >
              {t('CONTACT US')}
            </Link>
          </div>
        </div>
      </section>

      {/* subtle bottom vignette (optional) */}
      <div className="pointer-events-none h-24 w-full bg-gradient-to-t from-black/5 to-transparent" />
    </main>
  );
}
