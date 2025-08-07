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
            <a href="#" className="text-[#2c3e50] hover:underline">
              Discover
            </a>
            <a href="#" className="text-[#2c3e50] hover:underline">
              Deposit
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
            <a href="#" className="block py-2 text-[#2c3e50] hover:underline">
              Discover
            </a>
            <a href="#" className="block py-2 text-[#2c3e50] hover:underline">
              Deposit
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

      <HeaderFrontHero></HeaderFrontHero>
    </>
  );
};

export default Header;
