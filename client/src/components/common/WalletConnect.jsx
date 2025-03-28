// src/components/common/WalletConnect.jsx
import React, { useState } from 'react';
import { useWalletContext } from '../../context/WalletContext';
import Button from './Button';

const WalletConnect = ({ size = 'md', className = '', onConnect }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const { connected, shortenedAddress, balance, connectWallet, disconnectWallet } = useWalletContext();

  // Toggle dropdown
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // Handle wallet connection
  const handleConnectWallet = async () => {
    if (connected) {
      toggleDropdown();
      return;
    }
    
    try {
      setConnecting(true);
      await connectWallet();
      
      // Call onConnect callback if provided
      if (onConnect && typeof onConnect === 'function') {
        onConnect({ address: shortenedAddress });
      }
      
      setIsDropdownOpen(false);
    } catch (error) {
      console.error('Wallet connection failed:', error);
      // Error is handled in WalletContext
    } finally {
      setConnecting(false);
    }
  };

  // Handle wallet disconnection
  const handleDisconnect = () => {
    disconnectWallet();
    setIsDropdownOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`}>
      {connected ? (
        <div>
          <button
            onClick={toggleDropdown}
            type="button"
            className={`flex items-center space-x-2 px-4 ${
              size === 'lg' ? 'py-3 text-base' : 'py-2 text-sm'
            } bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium`}
          >
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span>{shortenedAddress}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
              <div className="py-1">
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Connected as</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{shortenedAddress}</p>
                </div>
                
                {balance !== null && (
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Balance</p>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{balance} APT</p>
                  </div>
                )}
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(shortenedAddress);
                    setIsDropdownOpen(false);
                  }}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Copy Address
                </button>
                
                <button
                  onClick={() => {
                    window.open(`https://explorer.aptoslabs.com/account/${shortenedAddress}`, '_blank');
                    setIsDropdownOpen(false);
                  }}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View on Explorer
                </button>
                
                <button
                  onClick={handleDisconnect}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Button
          onClick={handleConnectWallet}
          disabled={connecting}
          variant="primary"
          size={size}
        >
          {connecting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              Connect Wallet
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default WalletConnect;