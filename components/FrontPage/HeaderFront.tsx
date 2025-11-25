'use client';

import React from 'react';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  mainNavigation: React.ReactNode;
  mobileNavigation: React.ReactNode;
}

export default function HeaderFront({
  mainNavigation,
  mobileNavigation,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <div className=" bg-[#e4eff5] max-h-[300px] background-image-front-div front-header-div">
      {/* Header */}
      <header className="flex items-center justify-between px-8 pt-5 bg-transparent">
        {/* Logo */}
        <div className="flex items-center gap-2 z-40">
          <Image
            src="/browser/images/logos/arche_transparent_header.svg"
            alt="ARCHE logo"
            width={160}
            height={40}
            className="w-[160px] h-[40px]"
          />
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-6 text-sm text-[#2c2c2c] font-medium">
          {/* Toggler Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-black inline-flex items-center justify-center p-2 ml-2 rounded md:hidden"
            aria-label="Toggle Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Main Navigation (desktop) */}
          <div className="hidden md:flex ml-auto items-center space-x-6">
            {mainNavigation}
          </div>

          <div className="flex items-center gap-1"></div>
          <button className="text-[#3B89AD]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6 2v20l6-6 6 6V2H6z" />
            </svg>
          </button>
        </nav>
        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 bg-white shadow-lg p-4 rounded">
            <div className="flex justify-end mb-2">
              <button
                className="text-2xl font-bold"
                onClick={() => setIsOpen(false)}
                aria-label="Close Menu"
              >
                &times;
              </button>
            </div>
            <div>{mobileNavigation}</div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center px-4 pt-5 pb-20">
        <h1 className="text-3xl font-bold text-[#2c2c2c] mb-2">
          {t('discover_resources')}
        </h1>
        <p className="text-[#5B595B] mb-6">{t('hero_browse_resources_text')}</p>

        {/* Search */}
        <div className="flex w-full max-w-xl">
          <input
            type="text"
            placeholder="Find resources..."
            className="flex-1 px-4 py-2 rounded-l-full text-sm border-none outline-none bg-white"
          />
          <button className="bg-[#3B89AD] px-4 py-2 rounded-r-full text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>

        {/* Logos */}
        <div className="flex gap-4 items-center mt-6">
          <Image
            src="/browser/images/partner-logos/core_trust_seal_64.png"
            alt="Core Trust Seal"
            width={40}
            height={40}
            className="h-[32px] w-auto"
          />
          <Image
            src="/browser/images/partner-logos/clarin_b_centre_72.png"
            alt="Clarin B Centre"
            width={120}
            height={40}
            className="h-[32px] w-auto"
          />
        </div>
      </section>
    </div>
  );
}
