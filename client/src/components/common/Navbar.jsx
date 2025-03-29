// Navbar.jsx - Header navigation component

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWalletContext } from '../../context/WalletContext';
import WalletConnect from './WalletConnect';

const Navbar = ({ toggleSidebar }) => {
  const { isConnected, walletProvider, shortenedAddress, balance, disconnectWallet } = useWalletContext();
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Toggle user dropdown
  const toggleDropdown = () => setShowDropdown(!showDropdown);

  // Close dropdown when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.user-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <nav className={`bg-white dark:bg-dark-lighter px-4 py-2.5 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-700 ${scrolled ? 'shadow-md' : ''}`}>
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        {/* Mobile menu button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={toggleSidebar}
            type="button"
            className="inline-flex items-center p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <span className="sr-only">Open menu</span>
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src="/assets/images/defi-logo.png"
            className="mr-3 h-8"
            alt="CompounDefi Logo"
          />
          <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            CompounDefi
          </span>
        </Link>

        {/* Navigation links - Desktop only */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          <Link to="/dashboard" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Dashboard
          </Link>
          <Link to="/recommendations" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            AI Recommendations
          </Link>
          <Link to="/optimizer" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Auto Optimizer
          </Link>
          <Link to="/protocols" className="text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Protocols
          </Link>
        </div>

        {/* Right section */}
        <div className="flex items-center">
          {/* Wallet connection */}
          {!isConnected ? (
            <WalletConnect />
          ) : (
            <div className="flex items-center">
              {/* Balance tag */}
              <div className="hidden md:flex items-center mr-4 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
                <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                  {balance ? `${balance.toFixed(4)} APT` : '0 APT'}
                </span>
              </div>

              {/* User dropdown */}
              <div className="relative user-dropdown">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-white p-2 rounded-full bg-gray-100 dark:bg-dark-lighter"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{walletProvider}</span>
                      <span className="text-sm font-medium">{shortenedAddress}</span>
                    </div>
                  </div>
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>

                {/* Dropdown menu */}
                {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-lighter rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
          <Link to="/wallet" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            Wallet Details
          </Link>
          <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
            Settings
          </Link>
          <button
            onClick={() => {
              disconnectWallet(); // Use the top-level destructured function
              setShowDropdown(false);
            }}
            className="w-full text-left block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Disconnect
          </button>
        </div>
                )}
              </div>
            </div>
          )}

          {/* Theme toggle button - Feature to be added later */}
          <button
            className="ml-3 p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white rounded-full"
            aria-label="Toggle dark mode"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;