import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletContext } from '../context/WalletContext';
import LandingLayout from '../components/layout/LandingLayout';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Protocols from '../components/landing/Protocols';
import ConnectSection from '../components/landing/ConnectSection';
import { useMarketData } from '../hooks/useMarketData';
import { useNotification } from '../context/NotificationContext';

const Landing = () => {
  const navigate = useNavigate();
  const { isConnected, address, connectWallet } = useWalletContext();
  const { stakingData, loading, fetchMarketData } = useMarketData();
  const { showNotification } = useNotification();
  const [topProtocols, setTopProtocols] = useState([]);

  useEffect(() => {
    // If user is already connected and has completed onboarding, redirect to dashboard
    if (isConnected && address && localStorage.getItem('onboardingCompleted') === 'true') {
      navigate('/dashboard');
    }
    
    // If connected but onboarding not completed, redirect to onboarding
    if (isConnected && address && localStorage.getItem('onboardingCompleted') !== 'true') {
      navigate('/onboarding');
    }
  }, [isConnected, address, navigate]);

  useEffect(() => {
    // Fetch market data for protocol showcase
    fetchMarketData();
  }, [fetchMarketData]);

  useEffect(() => {
    // Extract top protocols by APR when data is loaded
    if (stakingData?.protocols) {
      const protocols = Object.entries(stakingData.protocols)
        .map(([name, data]) => ({
          name,
          apr: parseFloat(data.staking?.apr || 0),
          tvl: parseFloat(data.tvl || 0),
          type: data.type || 'staking',
          description: data.description || `${name} is a ${data.type || 'staking'} protocol on Aptos.`,
          logo: data.logo || '/assets/images/protocols/default.png'
        }))
        .filter(protocol => protocol.apr > 0)
        .sort((a, b) => b.apr - a.apr)
        .slice(0, 6);

      setTopProtocols(protocols);
    }
  }, [stakingData]);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      showNotification('Wallet connected successfully!', 'success');
      
      // Check if onboarding is completed
      if (localStorage.getItem('onboardingCompleted') === 'true') {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (error) {
      showNotification(`Failed to connect wallet: ${error.message}`, 'error');
    }
  };

  const handleGetStarted = () => {
    if (isConnected) {
      if (localStorage.getItem('onboardingCompleted') === 'true') {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } else {
      // Scroll to connect wallet section
      const connectSection = document.getElementById('connect-section');
      if (connectSection) {
        connectSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <LandingLayout>
      <Hero 
        onGetStarted={handleGetStarted}
        topYield={topProtocols[0]?.apr || 0}
      />
      
      <Features />
      
      <Protocols 
        protocols={topProtocols} 
        loading={loading}
      />
      
      <ConnectSection 
        id="connect-section"
        onConnect={handleConnectWallet} 
        connected={isConnected}
      />
    </LandingLayout>
  );
};

export default Landing;