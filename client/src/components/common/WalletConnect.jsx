// WalletConnect.jsx
import React, { useState, useEffect } from 'react';
import { 
  WalletIcon, 
  ArrowsRightLeftIcon, 
  ChevronDownIcon 
} from '@heroicons/react/24/outline';
import { useWallet } from '../../hooks/useWallet';
import Spinner from './Spinner';

const WalletConnect = () => {
  const { 
    connected, 
    connecting, 
    walletAddress, 
    walletBalance, 
    connectWallet, 
    disconnectWallet 
  } = useWallet();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Format wallet address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="relative">
      {connected ? (
        <div>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg px-4 py-2"
          >
            <WalletIcon className="h-5 w-5" />
            <span>{formatAddress(walletAddress)}</span>
            <span className="font-medium">{walletBalance.toFixed(4)} APT</span>
            <ChevronDownIcon className="h-4 w-4" />
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50">
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">Connected Wallet</p>
                <p className="font-medium break-all text-sm">{walletAddress}</p>
              </div>
              
              <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">Balance</p>
                <p className="font-medium">{walletBalance.toFixed(6)} APT</p>
              </div>
              
              <div className="p-2">
                <button
                  onClick={() => {
                    disconnectWallet();
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  Disconnect Wallet
                </button>
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(walletAddress);
                    setDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  Copy Address
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={connecting}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 transition-colors"
        >
          {connecting ? (
            <>
              <Spinner size="sm" color="white" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <WalletIcon className="h-5 w-5" />
              <span>Connect Wallet</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default WalletConnect;