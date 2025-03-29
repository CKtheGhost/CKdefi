// src/components/onboarding/Onboarding.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WalletStep from './WalletStep';
import PreferenceStep from './PreferenceStep';
import SocialConnectionStep from './SocialConnectionStep';
import { useWalletContext } from '../../context/WalletContext';
import { useUserContext } from '../../context/UserContext';

const Onboarding = () => {
  const navigate = useNavigate();
  const { connected } = useWalletContext();
  const { user, updateUserPreferences } = useUserContext();
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    riskProfile: 'balanced',
    autoRebalance: false,
    theme: 'dark',
    notifications: true
  });

  // If wallet not connected, redirect to landing
  React.useEffect(() => {
    if (!connected) {
      navigate('/');
    }
  }, [connected, navigate]);

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handlePreferenceUpdate = (newPrefs) => {
    setPreferences(prev => ({
      ...prev,
      ...newPrefs
    }));
  };

  const handleComplete = async () => {
    try {
      // Save preferences to backend
      await updateUserPreferences(preferences);
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  };

  const handleSkip = () => {
    // If user skips, we still save default preferences
    handleComplete();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Welcome to CompounDefi</h1>
          <p className="text-gray-300">Let's set up your account to get the most out of AI-powered yield optimization.</p>
          
          {/* Progress indicator */}
          <div className="w-full bg-gray-700 h-2 rounded-full mt-6">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {step === 1 && (
          <WalletStep 
            onNext={handleNext}
            walletAddress={user?.walletAddress || ''}
          />
        )}
        
        {step === 2 && (
          <PreferenceStep 
            preferences={preferences}
            onChange={handlePreferenceUpdate}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}
        
        {step === 3 && (
          <SocialConnectionStep 
            onComplete={handleComplete}
            onBack={handleBack}
            onSkip={handleSkip}
          />
        )}
      </div>
    </div>
  );
};

export default Onboarding;