import React, { useState } from 'react';
import { useWallet } from '../../context/WalletContext';

/**
 * First onboarding step - Wallet connection
 * 
 * @param {Object} props
 * @param {Function} props.onNext - Function to advance to next step
 * @param {string} props.walletAddress - Connected wallet address
 * @param {boolean} props.completed - Whether this step is completed
 */
const WalletStep = ({ onNext, walletAddress, completed }) => {
  const { connectWallet, walletConnected } = useWallet();
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState(null);
  
  const handleConnect = async () => {
    if (walletConnected) {
      onNext();
      return;
    }
    
    setConnecting(true);
    setError(null);
    
    try {
      await connectWallet();
      // The connection status will be updated in the useWallet hook
      // which will trigger the useEffect in parent component
    } catch (error) {
      console.error("Wallet connection error:", error);
      setError(error.message || "Failed to connect wallet. Please try again.");
    } finally {
      setConnecting(false);
    }
  };
  
  return (
    <div className="wallet-step">
      <h2 className="text-2xl font-bold text-white mb-6">Connect Your Wallet</h2>
      
      <p className="text-gray-300 mb-6">
        Connect your Aptos wallet to access your DeFi portfolio and get personalized recommendations.
        CompounDefi needs to connect to your wallet to analyze your assets and provide optimized yield strategies.
      </p>
      
      <div className="flex justify-center mb-8">
        {walletConnected ? (
          <div className="bg-green-900/30 border border-green-800 rounded-lg py-4 px-6 text-center">
            <div className="flex items-center justify-center mb-2 text-green-400">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Wallet Connected</span>
            </div>
            <div className="text-gray-300 break-all">
              {walletAddress}
            </div>
          </div>
        ) : (
          <button
            onClick={handleConnect}
            disabled={connecting}
            className={`flex items-center px-8 py-3 rounded-lg font-medium ${
              connecting
                ? 'bg-blue-800 cursor-wait'
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {connecting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Connect Wallet
              </>
            )}
          </button>
        )}
      </div>
      
      {error && (
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 mb-6">
          <div className="flex">
            <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-300">Connection Error</h3>
              <div className="mt-2 text-sm text-red-300">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6 bg-gray-900/50 rounded-lg p-4">
        <h3 className="text-lg font-medium text-white mb-2">Supported Wallets</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {['Petra', 'Martian', 'Pontem', 'Rise'].map((wallet, index) => (
            <div key={index} className="bg-gray-800 p-3 rounded-lg border border-gray-700">
              <div className="w-10 h-10 mx-auto mb-2 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-blue-400 font-bold">{wallet.charAt(0)}</span>
              </div>
              <span className="text-sm text-gray-300">{wallet}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 text-gray-400 text-sm">
        <p>
          By connecting your wallet, you agree to our{' '}
          <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>.
        </p>
        <p className="mt-2">
          We never store your private keys and you always maintain full control of your assets.
        </p>
      </div>
    </div>
  );
};

export default WalletStep;