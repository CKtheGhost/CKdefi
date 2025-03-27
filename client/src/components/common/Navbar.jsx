import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWalletContext } from '../../context/WalletContext';
import { useTheme } from '../../context/ThemeContext';

const Navbar = ({ onToggleSidebar }) => {
  const { walletConnected, walletAddress, disconnectWallet } = useWalletContext();
  const { darkMode, toggleTheme } = useTheme();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Format wallet address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  
  // Toggle user dropdown menu
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
    if (notificationsOpen) setNotificationsOpen(false);
  };
  
  // Toggle notifications panel
  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (userMenuOpen) setUserMenuOpen(false);
  };
  
  return (
    <nav className="bg-gray-900 border-b border-gray-800 py-3">
      <div className="px-4 md:px-6 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center">
          {/* Mobile sidebar toggle */}
          <button
            className="md:hidden mr-3 text-gray-400 hover:text-white"
            onClick={onToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Logo on mobile */}
          <div className="md:hidden text-xl font-bold text-blue-400">CompounDefi</div>
          
          {/* Search bar */}
          <div className="hidden md:flex items-center ml-4 w-64">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right section */}
        <div className="flex items-center space-x-4">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="text-gray-400 hover:text-white"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className="text-gray-400 hover:text-white relative"
              aria-label="View notifications"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            
            {/* Notifications dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg py-1 z-10 border border-gray-700">
                <div className="px-4 py-2 border-b border-gray-700">
                  <h3 className="text-sm font-medium text-white">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="px-4 py-3 hover:bg-gray-700 border-b border-gray-700">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 bg-blue-500 rounded-full p-1">
                          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="ml-3 w-0 flex-1">
                          <p className="text-sm font-medium text-white">Strategy Recommendation</p>
                          <p className="text-xs text-gray-400">New yield optimization strategy available.</p>
                          <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 text-center border-t border-gray-700">
                  <Link to="/notifications" className="text-xs text-blue-400 hover:text-blue-300">View all notifications</Link>
                </div>
              </div>
            )}
          </div>
          
          {/* User menu */}
          <div className="relative ml-3">
            <button
              onClick={toggleUserMenu}
              className="flex items-center space-x-1 text-gray-300 hover:text-white"
              aria-label="User menu"
            >
              <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-white">
                {walletAddress ? walletAddress.substring(2, 4).toUpperCase() : 'A'}
              </div>
              <span className="hidden md:inline-block">{formatAddress(walletAddress)}</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* User dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-1 z-10 border border-gray-700">
                <Link
                  to="/dashboard/settings"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Settings
                </Link>
                <Link
                  to="/dashboard/profile"
                  className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Your Profile
                </Link>
                <button
                  onClick={disconnectWallet}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Disconnect Wallet
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;