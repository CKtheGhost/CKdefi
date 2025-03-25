// src/pages/Landing.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import socialService from '../services/socialService';
import storageService from '../services/storageService';

// Components
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Protocols from '../components/landing/Protocols';
import ConnectSection from '../components/landing/ConnectSection';

const Landing = () => {
  const navigate = useNavigate();
  const { walletConnected, walletAddress, connectWallet } = useWallet();
  const [socialConnections, setSocialConnections] = useState({
    twitter: false,
    discord: false,
    telegram: false
  });
  const [loading, setLoading] = useState(true);
  const [connectStage, setConnectStage] = useState('intro'); // intro, wallet, social, complete

  // Check if user should be redirected to dashboard
  useEffect(() => {
    const checkPreviousConnection = async () => {
      setLoading(true);
      
      // Check for existing wallet connection
      const savedWallet = storageService.getConnectedWallet();
      
      if (savedWallet || walletConnected) {
        // If wallet is connected, check social accounts
        const wallet = walletAddress || savedWallet;
        const connections = socialService.getConnectedAccounts(wallet);
        setSocialConnections(connections);
        
        // If wallet is connected and onboarding was completed before, redirect to dashboard
        const onboardingCompleted = storageService.get('onboardingCompleted');
        if (onboardingCompleted) {
          navigate('/dashboard');
          return;
        }
        
        // Otherwise set stage to social connections
        setConnectStage('social');
      }
      
      setLoading(false);
    };
    
    checkPreviousConnection();
  }, [walletConnected, walletAddress, navigate]);

  // Handle wallet connection
  const handleConnectWallet = async () => {
    setLoading(true);
    try {
      const address = await connectWallet();
      if (address) {
        setConnectStage('social');
        setSocialConnections(socialService.getConnectedAccounts(address));
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle social media connection
  const handleConnectSocial = async (platform) => {
    if (!walletAddress) return;
    
    setLoading(true);
    try {
      const result = await socialService.connectAccount(platform, walletAddress);
      
      if (result.connected) {
        setSocialConnections(prev => ({
          ...prev,
          [platform]: true
        }));
      }
    } catch (error) {
      console.error(`Failed to connect ${platform}:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Handle completion of onboarding
  const handleContinueToDashboard = () => {
    storageService.set('onboardingCompleted', true);
    navigate('/dashboard');
  };

  // Show intro screen with features
  const renderIntroStage = () => (
    <>
      <Hero onGetStarted={() => setConnectStage('wallet')} />
      <Features />
      <Protocols />
    </>
  );

  // Show wallet connection screen
  const renderWalletStage = () => (
    <div className="min-h-screen flex items-center justify-center bg-blue-900 px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Connect Your Wallet</h2>
        <p className="text-gray-300 mb-8 text-center">
          Connect your Aptos wallet to unlock AI-powered yield optimization and portfolio management.
        </p>
        
        <button
          onClick={handleConnectWallet}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              Connect Wallet
            </>
          )}
        </button>
        
        <p className="text-gray-500 mt-6 text-sm text-center">
          Supported wallets: Petra, Martian, Pontem, and more.
        </p>
        
        <button 
          className="mt-6 text-gray-400 hover:text-white text-sm text-center w-full"
          onClick={() => setConnectStage('intro')}
        >
          ← Back to home
        </button>
      </div>
    </div>
  );

  // Show social connection screen
  const renderSocialStage = () => (
    <div className="min-h-screen flex items-center justify-center bg-blue-900 px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Connect Social Media</h2>
        <p className="text-gray-300 mb-8 text-center">
          Connect your social media accounts to enhance your experience (optional).
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => handleConnectSocial('twitter')}
            disabled={loading || socialConnections.twitter}
            className={`w-full ${
              socialConnections.twitter 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center`}
          >
            {socialConnections.twitter ? (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Twitter Connected
              </>
            ) : (
              <>Connect Twitter</>
            )}
          </button>
          
          <button
            onClick={() => handleConnectSocial('discord')}
            disabled={loading || socialConnections.discord}
            className={`w-full ${
              socialConnections.discord 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center`}
          >
            {socialConnections.discord ? (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Discord Connected
              </>
            ) : (
              <>Connect Discord</>
            )}
          </button>
          
          <button
            onClick={() => handleConnectSocial('telegram')}
            disabled={loading || socialConnections.telegram}
            className={`w-full ${
              socialConnections.telegram 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center`}
          >
            {socialConnections.telegram ? (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Telegram Connected
              </>
            ) : (
              <>Connect Telegram</>
            )}
          </button>
          
          <div className="border-t border-gray-700 my-6 pt-6">
            <button
              onClick={handleContinueToDashboard}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Continue to Dashboard
            </button>
            
            <p className="text-gray-500 mt-4 text-sm text-center">
              Social connections are optional, but enhance your experience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading && !connectStage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-900">
        <div className="text-center">
          <div className="loader mb-4 mx-auto"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Render the appropriate stage
  switch (connectStage) {
    case 'wallet':
      return renderWalletStage();
    case 'social':
      return renderSocialStage();
    case 'intro':
    default:
      return renderIntroStage();
  }
};

export default Landing;