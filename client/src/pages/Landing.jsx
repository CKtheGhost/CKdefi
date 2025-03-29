import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletContext } from '../context/WalletContext';
import { useNotification } from '../context/NotificationContext';
import LandingLayout from '../components/layout/LandingLayout';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Protocols from '../components/landing/Protocols';
import ConnectSection from '../components/landing/ConnectSection';
import SocialIntegrationPanel from '../components/common/SocialIntegrationPanel';
import { checkSocialConnections, getConnectedAccountsCount } from '../services/socialService';

const Landing = () => {
  // Hooks
  const navigate = useNavigate();
  const { isConnected, address, connectWallet } = useWalletContext();
  const { showNotification } = useNotification();
  
  // State
  const [topYield, setTopYield] = useState(7.8);
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSocialConnect, setShowSocialConnect] = useState(false);
  const [socialConnections, setSocialConnections] = useState({
    twitter: false,
    discord: false,
    telegram: false
  });

  // Check for existing connections on mount
  useEffect(() => {
    const connections = checkSocialConnections();
    setSocialConnections(connections);
  }, []);
  
  // If user is connected and has completed onboarding, redirect to dashboard
  useEffect(() => {
    if (isConnected && address) {
      const onboardingCompleted = localStorage.getItem('onboardingCompleted');
      
      if (onboardingCompleted === 'true') {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    }
  }, [isConnected, address, navigate]);
  
  // Load protocol data on mount
  useEffect(() => {
    const fetchProtocolData = async () => {
      setLoading(true);
      
      try {
        // In a real implementation, this would fetch data from the API
        // For demo, we're using mock data
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockProtocols = [
          {
            id: 'amnis',
            name: 'Amnis Finance',
            type: 'liquid-staking',
            logo: '/assets/images/protocols/amnis.png',
            apr: 7.8,
            tvl: 84500000
          },
          {
            id: 'thala',
            name: 'Thala Labs',
            type: 'liquid-staking',
            logo: '/assets/images/protocols/thala.png',
            apr: 7.5,
            tvl: 78200000
          },
          {
            id: 'tortuga',
            name: 'Tortuga Finance',
            type: 'liquid-staking',
            logo: '/assets/images/protocols/tortuga.png',
            apr: 7.2,
            tvl: 45100000
          },
          {
            id: 'pancakeswap',
            name: 'PancakeSwap',
            type: 'dex',
            logo: '/assets/images/protocols/pancakeswap.png',
            apr: 9.5,
            tvl: 68300000
          },
          {
            id: 'cetus',
            name: 'Cetus Protocol',
            type: 'dex',
            logo: '/assets/images/protocols/cetus.png',
            apr: 10.2,
            tvl: 48700000
          },
          {
            id: 'aries',
            name: 'Aries Markets',
            type: 'lending',
            logo: '/assets/images/protocols/aries.png',
            apr: 8.2,
            tvl: 41200000
          }
        ];
        
        setProtocols(mockProtocols);
        
        // Find highest APR
        const highestApr = Math.max(...mockProtocols.map(p => p.apr));
        setTopYield(highestApr);
      } catch (error) {
        console.error('Failed to fetch protocol data:', error);
        showNotification({
          type: 'error',
          title: 'Data Error',
          message: 'Failed to load protocol data'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProtocolData();
  }, [showNotification]);
  
  // Handle Get Started button click
  const handleGetStarted = () => {
    const element = document.getElementById('connect-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Handle wallet connection success
  const handleWalletConnected = () => {
    // After wallet connection, show social integration panel
    setShowSocialConnect(true);
    
    showNotification({
      type: 'success',
      title: 'Wallet Connected',
      message: 'Your wallet has been connected successfully!'
    });
  };
  
  // Handle social connection completion
  const handleSocialConnected = (platform) => {
    showNotification({
      type: 'success',
      title: 'Connected',
      message: `Successfully connected to ${platform}`
    });
    
    // Update social connections state
    const connections = checkSocialConnections();
    setSocialConnections(connections);
  };
  
  // Handle skip social connections
  const handleSkipSocial = () => {
    // Check if onboarding is completed
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    
    if (onboardingCompleted === 'true') {
      navigate('/dashboard');
    } else {
      navigate('/onboarding');
    }
  };
  
  return (
    <LandingLayout>
      <Hero 
        onGetStarted={handleGetStarted}
        topYield={topYield}
      />
      
      <Features />
      
      <Protocols 
        protocols={protocols} 
        loading={loading}
      />
      
      <div id="connect-section">
        <ConnectSection 
          onWalletConnected={handleWalletConnected}
          socialConnections={socialConnections}
        />
      </div>
      
      {showSocialConnect && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Connect Your Social Accounts</h2>
                <button
                  onClick={() => setShowSocialConnect(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="text-gray-400 mb-6">
                Connect your social accounts to enhance your DeFi experience with social features. This step is optional.
              </p>
              
              <SocialIntegrationPanel
                onConnected={handleSocialConnected}
              />
              
              <div className="flex justify-between mt-6 pt-4 border-t border-gray-700">
                <button
                  onClick={handleSkipSocial}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                >
                  Skip for Now
                </button>
                
                <button
                  onClick={handleSkipSocial}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Continue to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </LandingLayout>
  );
};

export default Landing;