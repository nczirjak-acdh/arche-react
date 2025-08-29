'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function HeaderFrontHero() {
  return (
    <main className="w-full bg-[#eaf4f9]  h-full py-8 px-4">
      <div className="flex flex-wrap h-full pb-5">
        {/* Left character (hidden on small screens) */}
        <div className="hidden md:flex md:w-1/4 lg:w-1/4 xl:w-1/3 items-end justify-center">
          <Image
            src="/browser/images/common/dante_pc.svg"
            alt="DANTE ARCHE"
            width={180}
            height={200}
            className="w-auto h-auto"
          />
        </div>

        {/* Center content */}
        <div className="w-full sm:w-full md:w-6/12 lg:w-6/12 xl:w-1/3 flex flex-col items-center justify-center text-center px-4">
          <p className="text-xs text-[#005b9f] font-semibold tracking-wide uppercase mb-1">
            SEARCH NOW
          </p>
          <h1 className="text-2xl font-semibold text-[#2c3e50] mb-1">
            Discover Resources
          </h1>
          <span className="text-sm text-[#5b7083]">
            Browse the wide range of resources in ARCHE
          </span>

          {/* Search Form */}
          <div className="w-full pt-4 pb-2">
            <form
              className="flex w-full max-w-md mx-auto"
              id="hero-smart-search-form"
            >
              <input
                type="search"
                id="sm-hero-str"
                placeholder="Find resources..."
                className="flex-grow rounded-l-full border border-gray-300 px-4 py-2 text-sm text-gray-700 focus:outline-none"
                aria-label="Search"
              />
              <button
                type="submit"
                className="bg-[#22b6c0] px-4 py-2 rounded-r-full flex items-center justify-center"
              >
                <Image
                  src="/browser/images/common/search_icon.svg"
                  alt="Search"
                  width={16}
                  height={16}
                />
              </button>
            </form>
          </div>

          {/* Logos */}
          <div className="flex space-x-4 items-center mt-2">
            <Link
              href="https://www.coretrustseal.org/wp-content/uploads/2021/07/20210709-ARCHE-CTS_Certification_2020-2022.pdf"
              target="_blank"
            >
              <Image
                src="/images/partner-logos/core_trust_seal_64.png"
                alt="Core Trust Seal"
                width={64}
                height={32}
              />
            </Link>
            <Link href="http://hdl.handle.net/11372/DOC-105" target="_blank">
              <Image
                src="/images/partner-logos/clarin_b_centre_72.png"
                alt="CLARIN B-centre"
                width={72}
                height={32}
              />
            </Link>
          </div>
        </div>

        {/* Right character (hidden on small screens) */}
        <div className="hidden md:flex md:w-1/4 lg:w-1/4 xl:w-1/3 items-end justify-center">
          <Image
            src="/browser/images/common/nora.svg"
            alt="NORA ARCHE"
            width={180}
            height={200}
            className="w-auto h-auto"
          />
        </div>
      </div>
    </main>
  );
}
