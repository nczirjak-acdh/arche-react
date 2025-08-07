'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LanguageSwitcher from '../LanguageSwitcher';

interface HeaderProps {
  mainNavigation: React.ReactNode;
  mobileNavigation: React.ReactNode;
}

export default function HeaderFront({
  mainNavigation,
  mobileNavigation,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#e4eff5]  max-h-[300px]">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 bg-transparent">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/images/logos/arche_transparent_header.svg"
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

          <div className="flex items-center gap-1">
            <LanguageSwitcher />
          </div>
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
    </div>
  );
}
