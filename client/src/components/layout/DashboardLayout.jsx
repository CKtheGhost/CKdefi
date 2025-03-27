import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletContext } from '../../context/WalletContext';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import Notifications from '../common/Notifications';
import LoadingScreen from '../common/LoadingScreen';

const DashboardLayout = ({ children }) => {
  const { walletConnected, walletAddress } = useWalletContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Check if user is authorized to access dashboard
  useEffect(() => {
    const checkAuth = async () => {
      // If no wallet is connected and we're not on the landing page, redirect
      if (!walletConnected) {
        const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
        
        if (onboardingComplete) {
          // They need to reconnect their wallet
          navigate('/dashboard/reconnect');
        } else {
          // They need to complete onboarding
          navigate('/');
        }
      } else {
        // Check if onboarding is complete
        const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
        if (!onboardingComplete) {
          navigate('/onboarding');
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [walletConnected, navigate]);
  
  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar - hidden on mobile unless toggled */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} md:block md:flex-shrink-0`}>
        <Sidebar 
          walletAddress={walletAddress} 
          onCloseMobile={() => setSidebarOpen(false)}
        />
      </div>
      
      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar 
          onToggleSidebar={toggleSidebar} 
          walletAddress={walletAddress}
        />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-800">
          {children}
        </main>
      </div>
      
      {/* Global notifications */}
      <Notifications />
    </div>
  );
};

export default DashboardLayout;