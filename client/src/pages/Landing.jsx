// src/pages/Landing.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Protocols from '../components/landing/Protocols';
import ConnectSection from '../components/landing/ConnectSection';
import { useWalletContext } from '../context/WalletContext';
import { useUserContext } from '../context/UserContext';

const Landing = () => {
  const navigate = useNavigate();
  const { connected, connecting, connectWallet } = useWalletContext();
  const { user } = useUserContext();
  const [showConnectModal, setShowConnectModal] = useState(false);

  // Check if user is already connected and redirect to dashboard
  React.useEffect(() => {
    if (connected && user) {
      navigate('/dashboard');
    }
  }, [connected, user, navigate]);

  const handleConnect = () => {
    setShowConnectModal(true);
  };

  const handleConnected = () => {
    navigate('/onboarding');
  };

  return (
    <div className="bg-gradient-to-b from-blue-900 to-black min-h-screen text-white">
      <Hero 
        onConnect={handleConnect} 
        isConnected={connected}
      />
      
      <Features />
      
      <Protocols />
      
      <ConnectSection 
        show={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        onConnected={handleConnected}
        isConnecting={connecting}
      />
      
      <footer className="py-8 text-center">
        <p>© 2025 CompounDefi - AI-Powered DeFi Optimization</p>
      </footer>
    </div>
  );
};

export default Landing;