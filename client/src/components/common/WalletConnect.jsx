// src/components/common/WalletConnect.jsx
import React, { useState, useEffect } from 'react';
import { useWalletContext } from '../../context/WalletContext';
import { useNotification } from '../../context/NotificationContext';
import Button from './Button';
import { useNavigate } from 'react-router-dom';

const WalletConnect = ({ size = 'md', className = '', onConnect, redirectTo = null }) => {
  const [walletDropdownOpen, setWalletDropdownOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [availableWallets, setAvailableWallets] = useState([]);
  const navigate = useNavigate();

  const { 
    isConnected, 
    address,
    shortenedAddress, 
    balance, 
    connectWallet, 
    disconnectWallet 
  } = useWalletContext();
  
  const { showNotification } = useNotification();

  // Detect available wallet providers
  useEffect(() => {
    const wallets = [];
    
    if (window.aptos) {
      wallets.push({ name: 'Petra', provider: 'petra', icon: '/assets/images/wallets/petra.png' });
    }
    
    if (window.martian) {
      wallets.push({ name: 'Martian', provider: 'martian', icon: '/assets/images/wallets/martian.png' });
    }
    
    if (window.pontem) {
      wallets.push({ name: 'Pontem', provider: 'pontem', icon: '/assets/images/wallets/pontem.png' });
    }
    
    if (window.rise) {
      wallets.push({ name: 'Rise', provider: 'rise', icon: '/assets/images/wallets/rise.png' });
    }
    
    if (wallets.length === 0) {
      wallets.push({ name: 'No wallets detected', provider: null, icon: null });
    }
    
    setAvailableWallets(wallets);
  }, []);

  // Toggle wallet selection dropdown
  const toggleWalletDropdown = () => {
    if (isConnected) {
      setWalletDropdownOpen(!walletDropdownOpen);
    } else {
      setWalletDropdownOpen(true);
    }
  };

  // Handle wallet connection
  const handleConnectWallet = async (provider = null) => {
    if (connecting) return;
    
    try {
      setConnecting(true);
      
      const result = await connectWallet(provider);
      
      if (result) {
        showNotification({
          title: 'Wallet Connected',
          message: 'Your wallet has been connected successfully!',
          type: 'success'
        });
        
        // Call onConnect callback if provided
        if (onConnect && typeof onConnect === 'function') {
          onConnect({ address });
        }
        
        // Redirect if specified
        if (redirectTo && navigate) {
          navigate(redirectTo);
        }
      }
      
      setWalletDropdownOpen(false);
    } catch (error) {
      console.error('Wallet connection failed:', error);
      showNotification({
        title: 'Connection Failed',
        message: error.message || 'Failed to connect wallet',
        type: 'error'
      });
    } finally {
      setConnecting(false);
    }
  };

  // Handle wallet disconnection
  const handleDisconnect = () => {
    disconnectWallet();
    setWalletDropdownOpen(false);
    
    showNotification({
      title: 'Wallet Disconnected',
      message: 'Your wallet has been disconnected',
      type: 'info'
    });
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (walletDropdownOpen && !event.target.closest('.wallet-dropdown')) {
        setWalletDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [walletDropdownOpen]);

  return (
    <div className={`relative inline-block wallet-dropdown ${className}`}>
      {isConnected ? (
        <div>
          <button
            onClick={toggleWalletDropdown}
            type="button"
            className={`flex items-center space-x-2 px-4 ${
              size === 'lg' ? 'py-3 text-base' : 'py-2 text-sm'
            } bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium`}
          >
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            <span>{shortenedAddress}</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-transform ${walletDropdownOpen ? 'rotate-180' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {walletDropdownOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-20 border border-gray-700">
              <div className="py-1">
                <div className="px-4 py-3 border-b border-gray-700">
                  <p className="text-sm text-gray-400">Connected as</p>
                  <p className="text-sm font-medium text-white truncate">{address}</p>
                </div>
                
                {balance !== null && (
                  <div className="px-4 py-2 border-b border-gray-700">
                    <p className="text-sm text-gray-400">Balance</p>
                    <p className="text-sm font-medium text-white">{balance} APT</p>
                  </div>
                )}
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(address);
                    showNotification({
                      title: 'Address Copied',
                      message: 'Wallet address copied to clipboard',
                      type: 'info'
                    });
                    setWalletDropdownOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Copy Address
                </button>
                
                <button
                  onClick={() => {
                    window.open(`https://explorer.aptoslabs.com/account/${address}`, '_blank');
                    setWalletDropdownOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View on Explorer
                </button>
                
                <button
                  onClick={handleDisconnect}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700"
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
        <div>
          <Button
            onClick={toggleWalletDropdown}
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
          
          {walletDropdownOpen && availableWallets.length > 0 && (
            <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-20 border border-gray-700">
              <div className="py-2 px-4 border-b border-gray-700">
                <h3 className="text-white font-medium">Select a wallet</h3>
              </div>
              <div className="py-1">
                {availableWallets.map((wallet, index) => (
                  <button
                    key={index}
                    disabled={!wallet.provider}
                    onClick={() => handleConnectWallet(wallet.provider)}
                    className={`w-full flex items-center px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 ${!wallet.provider ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {wallet.icon ? (
                      <img src={wallet.icon} alt={wallet.name} className="h-6 w-6 mr-3" />
                    ) : (
                      <div className="h-6 w-6 bg-gray-600 rounded-full mr-3 flex items-center justify-center">
                        <svg className="h-3 w-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                    )}
                    <span>{wallet.name}</span>
                  </button>
                ))}
                
                {availableWallets.length === 1 && !availableWallets[0].provider && (
                  <div className="px-4 py-2 text-center text-xs text-gray-500">
                    <p>No wallet extension detected.</p>
                    <p className="mt-1">Please install Petra, Martian, Rise, or another Aptos wallet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnect;