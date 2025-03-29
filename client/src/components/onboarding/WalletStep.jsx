// src/components/onboarding/WalletStep.jsx
import React, { useState, useEffect } from 'react';
import { useWalletContext } from '../../context/WalletContext';
import { useNotification } from '../../context/NotificationContext';
import WalletConnect from '../common/WalletConnect';
import Button from '../common/Button';

/**
 * WalletStep component for onboarding flow
 * 
 * @param {Object} props Component props
 * @param {Function} props.onWalletConnected Callback when wallet connected
 * @param {Function} props.onSkip Function to skip wallet connection
 */
const WalletStep = ({ onWalletConnected, onSkip }) => {
  // State
  const [loading, setLoading] = useState(false);
  
  // Hooks
  const { isConnected, connectWallet, address } = useWalletContext();
  const { showNotification } = useNotification();
  
  // Check if wallet is already connected
  useEffect(() => {
    if (isConnected && address) {
      // If wallet is already connected, notify parent
      if (onWalletConnected) {
        onWalletConnected({ address });
      }
    }
  }, [isConnected, address, onWalletConnected]);
  
  // Handle wallet connection
  const handleWalletConnect = async (data) => {
    // If we got data from the WalletConnect component, wallet is connected
    if (data && data.address) {
      if (onWalletConnected) {
        onWalletConnected(data);
      }
    }
  };
  
  // Handle manual connection
  const handleManualConnect = async () => {
    setLoading(true);
    
    try {
      const result = await connectWallet();
      
      if (result) {
        showNotification('Wallet connected successfully!', 'success');
        
        if (onWalletConnected) {
          onWalletConnected({ address });
        }
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      showNotification(`Failed to connect wallet: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle skip button click
  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
        <p className="text-gray-400">
          Connect your Aptos wallet to use CompounDefi. This is required to access your dashboard and optimize your DeFi investments.
        </p>
      </div>
      
      <div className="flex justify-center mb-8">
        <WalletConnect
          size="lg"
          onConnect={handleWalletConnect}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col items-center p-4 bg-gray-750 rounded-lg border border-gray-700 hover:border-blue-500/30 transition-colors">
          <img
            src="/assets/images/wallets/petra.png"
            alt="Petra Wallet"
            className="h-16 w-16 mb-3"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/images/wallets/default.png';
            }}
          />
          <h3 className="font-medium text-white mb-1">Petra Wallet</h3>
          <p className="text-xs text-gray-400 text-center mb-3">
            Official Aptos wallet with great security features
          </p>
          <a
            href="https://petra.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 mt-auto"
          >
            Download
          </a>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-gray-750 rounded-lg border border-gray-700 hover:border-blue-500/30 transition-colors">
          <img
            src="/assets/images/wallets/martian.png"
            alt="Martian Wallet"
            className="h-16 w-16 mb-3"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/images/wallets/default.png';
            }}
          />
          <h3 className="font-medium text-white mb-1">Martian Wallet</h3>
          <p className="text-xs text-gray-400 text-center mb-3">
            Feature-rich wallet with NFT support
          </p>
          <a
            href="https://martianwallet.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 mt-auto"
          >
            Download
          </a>
        </div>
        
        <div className="flex flex-col items-center p-4 bg-gray-750 rounded-lg border border-gray-700 hover:border-blue-500/30 transition-colors">
          <img
            src="/assets/images/wallets/rise.png"
            alt="Rise Wallet"
            className="h-16 w-16 mb-3"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/assets/images/wallets/default.png';
            }}
          />
          <h3 className="font-medium text-white mb-1">Rise Wallet</h3>
          <p className="text-xs text-gray-400 text-center mb-3">
            Simple and user-friendly wallet
          </p>
          <a
            href="https://risewallet.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 mt-auto"
          >
            Download
          </a>
        </div>
      </div>
      
      <div className="bg-yellow-900/20 border border-yellow-800/30 rounded-lg p-4 mt-4">
        <div className="flex items-start">
          <svg
            className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="text-sm text-yellow-300">
              If you don't have an Aptos wallet yet, install one of the wallets above.
              After installation, refresh this page and connect your wallet.
            </p>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-700 pt-6 mt-6">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-3">
            Want to explore without connecting a wallet?
          </p>
          <Button
            variant="ghost"
            onClick={handleSkip}
          >
            Enter Demo Mode
          </Button>
          <p className="text-xs text-gray-500 mt-2">
            Note: In demo mode, you won't be able to execute real transactions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletStep;