import React, { useState } from 'react';
import Button from './Button';

/**
 * WalletConnect component for connecting various wallet providers
 * @param {Object} props - Component props
 * @param {Function} props.onConnect - Callback when wallet is connected
 * @param {boolean} props.loading - Whether connection is in progress
 * @param {string} props.className - Additional CSS classes
 */
const WalletConnect = ({ 
  onConnect,
  loading = false,
  className = '',
  size = 'md'
}) => {
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [showWalletList, setShowWalletList] = useState(false);
  const [error, setError] = useState(null);

  // List of supported wallets
  const supportedWallets = [
    { id: 'petra', name: 'Petra Wallet', icon: '/icons/petra-wallet.svg' },
    { id: 'martian', name: 'Martian Wallet', icon: '/icons/martian-wallet.svg' },
    { id: 'pontem', name: 'Pontem Wallet', icon: '/icons/pontem-wallet.svg' },
    { id: 'rise', name: 'Rise Wallet', icon: '/icons/rise-wallet.svg' },
  ];

  // Handle wallet selection
  const handleWalletSelect = (wallet) => {
    setSelectedWallet(wallet);
    setShowWalletList(false);
    connectToWallet(wallet);
  };

  // Connect to the selected wallet
  const connectToWallet = async (wallet) => {
    try {
      setError(null);
      
      // Check if wallet extension exists
      if (!window[wallet.id]) {
        setError(`${wallet.name} extension not found. Please install it first.`);
        return;
      }
      
      // Attempt connection based on wallet type
      let address;
      
      switch (wallet.id) {
        case 'petra':
          const petraResponse = await window.petra.connect();
          address = petraResponse.address;
          break;
          
        case 'martian':
          const martianResponse = await window.martian.connect();
          address = martianResponse.address;
          break;
          
        case 'pontem':
          const pontemResponse = await window.pontem.connect();
          address = pontemResponse.address;
          break;
          
        case 'rise':
          const riseResponse = await window.rise.connect();
          address = riseResponse.address;
          break;
          
        default:
          throw new Error(`Unsupported wallet: ${wallet.id}`);
      }
      
      if (!address) {
        throw new Error('Failed to get wallet address');
      }
      
      // Save to localStorage
      localStorage.setItem('connectedWallet', address);
      localStorage.setItem('walletProvider', wallet.id);
      
      // Call onConnect callback with wallet info
      if (onConnect) {
        onConnect({ provider: wallet.id, address });
      }
      
    } catch (error) {
      console.error('Wallet connection error:', error);
      setError(error.message || 'Failed to connect wallet');
    }
  };

  return (
    <div className={`wallet-connect ${className}`}>
      {error && (
        <div className="bg-red-500/20 border border-red-600 rounded-lg p-3 mb-4 text-sm text-red-200">
          {error}
        </div>
      )}
      
      <div className="relative">
        {!showWalletList ? (
          <Button
            variant="primary"
            size={size}
            isLoading={loading}
            onClick={() => setShowWalletList(true)}
            className="flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Connect Wallet
          </Button>
        ) : (
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-2 min-w-[250px]">
            <div className="flex justify-between items-center mb-2 border-b border-gray-700 pb-2">
              <h3 className="text-sm font-medium">Select Wallet</h3>
              <button 
                onClick={() => setShowWalletList(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-1">
              {supportedWallets.map(wallet => (
                <button
                  key={wallet.id}
                  className="flex items-center w-full p-2 text-left rounded-md hover:bg-gray-700 transition-colors"
                  onClick={() => handleWalletSelect(wallet)}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                    <img 
                      src={wallet.icon} 
                      alt={wallet.name} 
                      className="w-5 h-5"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/icons/default-wallet.svg';
                      }}
                    />
                  </div>
                  <span className="font-medium">{wallet.name}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-400">
              <p>First time using Aptos wallets?</p>
              <a 
                href="https://petra.app" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Learn more about wallets →
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletConnect;