import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletContext } from '../context/WalletContext';
import { useNotification } from '../context/NotificationContext';
import { checkSocialConnections } from '../services/socialService';
import OnboardingLayout from '../components/layout/OnboardingLayout';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import LoadingScreen from '../components/common/LoadingScreen';
import WalletStep from '../components/onboarding/WalletStep';
import SocialConnectionStep from '../components/onboarding/SocialConnectionStep';
import PreferenceStep from '../components/onboarding/PreferenceStep';

/**
 * Onboarding component for guiding new users through the setup process
 */
const Onboarding = () => {
  // State
  const [step, setStep] = useState(1); // 1: Wallet, 2: Social, 3: Preferences
  const [loading, setLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    riskProfile: 'balanced',
    notifications: true,
    autoRebalance: false,
    maxSlippage: 1.0,
    rebalanceThreshold: 5.0,
    preserveStakedPositions: true,
    darkMode: true,
    email: '',
    notificationChannels: {
      email: false,
      push: true,
      social: true
    }
  });
  const [socialConnections, setSocialConnections] = useState({
    twitter: false,
    discord: false,
    telegram: false
  });
  
  // Hooks
  const navigate = useNavigate();
  const { isConnected, address, connectWallet } = useWalletContext();
  const { showNotification } = useNotification();
  
  // Check if user has already completed onboarding
  useEffect(() => {
    const onboardingCompleted = localStorage.getItem('onboardingCompleted');
    
    if (onboardingCompleted === 'true') {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  // Automatically advance to step 2 if wallet is connected
  useEffect(() => {
    if (isConnected && step === 1) {
      setStep(2);
      
      showNotification({
        type: 'success',
        title: 'Wallet Connected', 
        message: 'Your wallet has been connected successfully!'
      });
    }
    
    // Check if any social accounts are connected
    const connections = checkSocialConnections();
    setSocialConnections(connections);
  }, [isConnected, step, showNotification]);
  
  // Handle wallet connection
  const handleWalletConnected = () => {
    setStep(2);
  };
  
  // Handle social connections update
  const handleSocialConnectionsUpdate = (connections) => {
    setSocialConnections(connections);
  };
  
  // Handle preference changes
  const handlePreferenceChange = (newPreferences) => {
    setPreferences(prev => ({
      ...prev,
      ...newPreferences
    }));
  };
  
  // Handle advancing to next step
  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };
  
  // Handle going back to previous step
  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  // Handle skipping the current step
  const handleSkipStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      completeOnboarding();
    }
  };
  
  // Complete onboarding and redirect to dashboard
  const completeOnboarding = async () => {
    setLoading(true);
    
    try {
      // Save preferences to localStorage
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
      localStorage.setItem('onboardingCompleted', 'true');
      
      // If auto-rebalance is enabled, set up the auto-optimizer
      if (preferences.autoRebalance) {
        localStorage.setItem('autoOptimizeEnabled', 'true');
        
        const autoOptimizerSettings = {
          interval: 24,
          rebalanceThreshold: preferences.rebalanceThreshold,
          maxSlippage: preferences.maxSlippage,
          preserveStakedPositions: preferences.preserveStakedPositions
        };
        
        localStorage.setItem('autoOptimizerSettings', JSON.stringify(autoOptimizerSettings));
        
        // Set next run time
        const nextRunTime = Date.now() + (24 * 60 * 60 * 1000);
        localStorage.setItem('nextAutoOptimizeRun', nextRunTime.toString());
      }
      
      // Set theme preference
      localStorage.setItem('theme', preferences.darkMode ? 'dark' : 'light');
      
      // Show success notification
      showNotification({
        type: 'success',
        title: 'Setup Complete',
        message: 'Your CompounDefi account is ready!'
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
      showNotification({
        type: 'error',
        title: 'Setup Failed',
        message: `Failed to complete setup: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Skip onboarding completely
  const skipOnboarding = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    navigate('/dashboard');
  };
  
  // Render appropriate step
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <WalletStep
            onWalletConnected={handleWalletConnected}
            onSkip={skipOnboarding}
          />
        );
      case 2:
        return (
          <SocialConnectionStep
            connections={socialConnections}
            onConnectionsChange={handleSocialConnectionsUpdate}
            onNext={handleNextStep}
            onBack={handlePreviousStep}
            onSkip={handleSkipStep}
          />
        );
      case 3:
        return (
          <PreferenceStep
            preferences={preferences}
            onChange={handlePreferenceChange}
            onComplete={completeOnboarding}
            onBack={handlePreviousStep}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <OnboardingLayout>
      {loading && <LoadingScreen message="Saving your preferences..." />}
      
      <div className="mb-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
            Welcome to CompounDefi
          </h1>
          <p className="text-gray-400">Complete your setup to start optimizing your yields</p>
        </div>
        
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm">Start</span>
            <span className="text-sm">Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-600 to-green-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className={`text-xs ${step >= 1 ? 'text-blue-400' : 'text-gray-500'}`}>Connect Wallet</span>
            <span className={`text-xs ${step >= 2 ? 'text-blue-400' : 'text-gray-500'}`}>Social & Alerts</span>
            <span className={`text-xs ${step >= 3 ? 'text-blue-400' : 'text-gray-500'}`}>Preferences</span>
          </div>
        </div>
      </div>
      
      <Card className="bg-gray-800 border border-gray-700">
        <div className="p-6">
          {renderStep()}
        </div>
      </Card>
      
      <div className="text-center mt-6">
        <button 
          onClick={skipOnboarding}
          className="text-sm text-gray-500 hover:text-gray-400"
        >
          Skip setup and go directly to dashboard
        </button>
      </div>
    </OnboardingLayout>
  );
};

export default Onboarding;