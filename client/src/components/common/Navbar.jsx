import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { UserContext } from '../../context/UserContext';
import { WalletContext } from '../../context/WalletContext';
import { NotificationContext } from '../../context/NotificationContext';
import { Moon, Sun, Menu, X, Bell, User } from 'lucide-react';
import { Button } from './Button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { user, logout } = useContext(UserContext);
  const { wallet, disconnectWallet } = useContext(WalletContext);
  const { notifications, markAllAsRead } = useContext(NotificationContext);
  const location = useLocation();

  const unreadNotificationsCount = notifications?.filter(n => !n.read)?.length || 0;

  // Format wallet address for display
  const formatWalletAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="/assets/images/defi-logo.png"
                alt="CompounDefi"
              />
              <span className="ml-2 text-xl font-bold text-slate-900 dark:text-white">CompounDefi</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <Link 
                to="/dashboard" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/dashboard' 
                    ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                to="/recommendations" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/recommendations' 
                    ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                AI Recommendations
              </Link>
              <Link 
                to="/optimizer" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/optimizer' 
                    ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Auto Optimizer
              </Link>
              <Link 
                to="/protocols" 
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/protocols' 
                    ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400' 
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Protocols
              </Link>
            </div>
          </div>
          
          {/* Right side navigation */}
          <div className="flex items-center">
            {/* Theme toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            {/* Notifications */}
            <div className="relative ml-3">
              <button 
                className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              >
                <Bell size={20} />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            </div>
            
            {/* Wallet display */}
            {wallet?.address ? (
              <div className="ml-3">
                <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 py-1 px-3 rounded-md text-sm border border-blue-200 dark:border-blue-800">
                  {formatWalletAddress(wallet.address)}
                </div>
              </div>
            ) : (
              <div className="ml-3">
                <Link to="/connect">
                  <Button 
                    size="sm" 
                    variant="gradient"
                  >
                    Connect Wallet
                  </Button>
                </Link>
              </div>
            )}
            
            {/* User menu */}
            {user && (
              <div className="ml-3 relative">
                <div>
                  <button
                    onClick={toggleUserMenu}
                    className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    id="user-menu"
                    aria-expanded="false"
                    aria-haspopup="true"
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200">
                      <User size={16} />
                    </div>
                  </button>
                </div>
                
                {isUserMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-slate-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      role="menuitem"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      role="menuitem"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        disconnectWallet();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      role="menuitem"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="md:hidden ml-3">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/dashboard"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/dashboard' 
                  ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/recommendations"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/recommendations' 
                  ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              onClick={() => setIsOpen(false)}
            >
              AI Recommendations
            </Link>
            <Link
              to="/optimizer"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/optimizer' 
                  ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Auto Optimizer
            </Link>
            <Link
              to="/protocols"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === '/protocols' 
                  ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400' 
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              onClick={() => setIsOpen(false)}
            >
              Protocols
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;