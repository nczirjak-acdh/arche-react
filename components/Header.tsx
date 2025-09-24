import React from 'react';
import HeaderHome from './Header/HeaderHome';
import HeaderFront from './FrontPage/HeaderFront';
import HeaderFrontHero from './Header/HeaderFrontHero';

const Header = () => {
  return (
    <>
      <HeaderFront
        mainNavigation={
          <>
            <a
              href="#"
              className="text-[rgba(91,89,91,0.2)] hover:underline header-nav-text"
            >
              Discover
            </a>
            <a href="#" className="text-[rgba(91,89,91,0.2)] hover:underline">
              Deposit
            </a>
            <a href="#" className="text-[rgba(91,89,91,0.2)] hover:underline">
              Policies
            </a>
            <a href="#" className="text-[rgba(91,89,91,0.2)] hover:underline">
              About Arche
            </a>
          </>
        }
        mobileNavigation={
          <>
            <a
              href="#"
              className="block py-2 text-[rgba(91,89,91,0.2)] hover:underline"
            >
              Discover
            </a>
            <a
              href="#"
              className="block py-2 text-[rgba(91,89,91,0.2)] hover:underline"
            >
              Deposit
            </a>
            <a
              href="#"
              className="block py-2 text-[rgba(91,89,91,0.2)] hover:underline"
            >
              Policies
            </a>
            <a
              href="#"
              className="block py-2 text-[rgba(91,89,91,0.2)] hover:underline"
            >
              About Arche
            </a>
          </>
        }
      />

      <HeaderFrontHero></HeaderFrontHero>
    </>
  );
};

export default Header;
