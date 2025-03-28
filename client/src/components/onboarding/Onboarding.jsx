import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import WalletConnect from '../components/common/WalletConnect';
import Card from '../components/common/Card';
import LoadingScreen from '../components/common/LoadingScreen';
import { useWalletContext } from '../context/WalletContext';
import { useNotification } from '../context/NotificationContext';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [socialConnections, setSocialConnections] = useState({
    twitter: false,
    discord: false,
    telegram: false
  });
  const [preferences, setPreferences] = useState({
    riskProfile: 'balanced',
    notifications: true,
    autoRebalance: false
  });
  
  const navigate = useNavigate();
  const { isConnected, address, connectWallet } = useWalletContext();
  const { showNotification } = useNotification();

  // Check if wallet is already connected
  useEffect(() => {
    if (isConnected && address) {
      // Move to step 2 if wallet is connected
      setStep(2);
    }
    
    // Check if onboarding already completed
    if (localStorage.getItem('onboardingCompleted') === 'true') {
      navigate('/dashboard');
    }
  }, [isConnected, address, navigate]);

  // Handle wallet connection
  const handleWalletConnect = async () => {
    try {
      setLoading(true);
      await connectWallet();
      showNotification('Wallet connected successfully!', 'success');
      setStep(2);
    } catch (error) {
      showNotification(`Failed to connect wallet: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle social connection (mock)
  const connectSocial = (platform) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSocialConnections(prev => ({
        ...prev,
        [platform]: true
      }));
      localStorage.setItem(`${platform}Connected`, 'true');
      showNotification(`Connected to ${platform} successfully!`, 'success');
      setLoading(false);
    }, 1000);
  };

  // Handle preferences change
  const handlePreferenceChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Complete onboarding and redirect to dashboard
  const completeOnboarding = () => {
    setLoading(true);
    
    // Save preferences to localStorage
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    localStorage.setItem('onboardingCompleted', 'true');
    
    // Save social connections
    Object.entries(socialConnections).forEach(([platform, isConnected]) => {
      if (isConnected) {
        localStorage.setItem(`${platform}Connected`, 'true');
      }
    });
    
    // Simulate API call to save preferences
    setTimeout(() => {
      setLoading(false);
      showNotification('Setup completed successfully!', 'success');
      navigate('/dashboard');
    }, 1500);
  };

  // Skip to dashboard directly
  const skipOnboarding = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      {loading && <LoadingScreen message="Processing..." transparent />}
      
      <div className="max-w-2xl w-full">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src="/assets/images/logo.svg" 
              alt="CompounDefi Logo" 
              className="h-16 w-16"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/favicon.ico';
              }}
            />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to CompounDefi</h1>
          <p className="text-gray-400">Let's get you set up in just a few steps</p>
        </header>
        
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm">Start</span>
            <span className="text-sm">Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-gray-500">Connect Wallet</span>
            <span className="text-xs text-gray-500">Social & Alerts</span>
            <span className="text-xs text-gray-500">Preferences</span>
          </div>
        </div>
        
        {/* Step 1: Connect Wallet */}
        {step === 1 && (
          <Card className="border-gray-700">
            <h2 className="text-xl font-bold mb-4">Step 1: Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6">
              Connect your Aptos wallet to access your dashboard. This is required to proceed.
            </p>
            
            <div className="flex justify-center mb-6">
              <WalletConnect 
                onConnect={handleWalletConnect}
                size="lg"
              />
            </div>
            
            <div className="border-t border-gray-700 pt-4 mt-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">
                  Already have an account but don't want to connect now?
                </p>
                <Button 
                  variant="ghost" 
                  onClick={skipOnboarding}
                >
                  Skip for Now
                </Button>
              </div>
            </div>
          </Card>
        )}
        
        {/* Step 2: Social Connections */}
        {step === 2 && (
          <Card className="border-gray-700">
            <h2 className="text-xl font-bold mb-4">Step 2: Social Connections</h2>
            <p className="text-gray-400 mb-6">
              Connect your social accounts to get updates and participate in the community. This step is optional.
            </p>
            
            <div className="space-y-4 mb-6">
              {/* Twitter */}
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-900/50 rounded-full flex items-center justify-center mr-3">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </div>
                  <span>Twitter</span>
                </div>
                
                {socialConnections.twitter ? (
                  <div className="flex items-center text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Connected
                  </div>
                ) : (
                  <Button
                    variant="light"
                    onClick={() => connectSocial('twitter')}
                    disabled={loading}
                  >
                    Connect
                  </Button>
                )}
              </div>
              
              {/* Discord */}
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-indigo-900/50 rounded-full flex items-center justify-center mr-3">
                    <svg className="h-5 w-5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
                    </svg>
                  </div>
                  <span>Discord</span>
                </div>
                
                {socialConnections.discord ? (
                  <div className="flex items-center text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Connected
                  </div>
                ) : (
                  <Button
                    variant="light"
                    onClick={() => connectSocial('discord')}
                    disabled={loading}
                  >
                    Connect
                  </Button>
                )}
              </div>
              
              {/* Telegram */}
              <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-900/50 rounded-full flex items-center justify-center mr-3">
                    <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0Zm3.566 17.16c-.069.135-.151.172-.346.172h-.15c-.138 0-.273-.055-.418-.167-.161-.125-1.066-.933-1.513-1.303-.296-.243-.503-.303-.686-.303-.151 0-.358.018-.639.563-.274.5361-1.432.588-.543.588-.163 0-.54-.03-.79-.585-.25-.553-.932-2.248-.932-2.248s-.279-.441-.922-.441c-.667 0-2.203.057-3.41.627-1.21.57-1.854 1.781-1.854 1.781l.835.492s.103-.56.542-.56h.106c.388 0 .794.609.794 1.009v1.052c0 .29-.133.455-.343.455-.19 0-.342-.137-.342-.455v-.988c0-.334-.15-.512-.485-.512h-.165c-.335 0-.97.176-.97.652 0 .478 0 2.057 0 2.107 0 .137-.151.288-.343.288-.214 0-.343-.137-.343-.288V14.31c0-.384-.069-.685-.481-.685h-.138c-.343 0-.998.158-.998.712v.895c0 .177-.137.288-.33.288-.193 0-.33-.111-.33-.288v-.865c0-.36-.082-.686-.453-.686h-.16c-.343 0-.983.177-.983.669v.865c0 .202-.124.329-.316.329-.193 0-.317-.127-.317-.329v-2.25c0-.236-.261-.368-.261-.368l-.832.479s-.172.088-.172.227c0 .138 0 3.25 0 3.336 0 .31.016.619.133.885.117.265.426.404.75.404.234 0 .939-.04 1.12-.59.18-.02.058 0 .09 0 .062 0 .138.02.192.035.248.07.535.303.535.765 0 .314-.01 1.306-.01 1.306s-.028.177-.124.233c-.096.056-.233.015-.233.015l-.789-.26s-.054-.2-.054-.113c0-.89.003-1.117.003-1.152 0-.235-.159-.437-.422-.437h-.193c-.262 0-.425.213-.425.437v1.282c0 .075-.02.135-.088.177-.069.042-.158.014-.158.014l-1.232-.409s-.102-.034-.102-.138c0-.104 0-4.08 0-4.21 0-.128.096-.272.207-.312l1.87-.707s.22-.05.365.055c.146.106.2.274.2.364v.187c0 .166.234.236.234.236s.15-.79.343-.079c.166 0 .316.07.454.281.262.397.729 1.112.729 1.112s.096.144.096.227c0 .236-.193.236-.193.236h-.193c-.386 0-.64-.302-.64-.302s-.124-.15-.124.013c0 .047-.003 1.306-.003 1.306s-.014.07-.069.112c-.054.041-.151.034-.151.034l-.789-.26s-.055-.02-.055-.112c0-.93.003-1.104.003-1.153 0-.235-.158-.437-.413-.437h-.193c-.262 0-.425.213-.425.437v1.105c0 .184-.179.247-.179.247l-.868-.288s-.081-.027-.081-.108c0-.082.004-4.607.004-4.607C9.125 14.556 9.262 14.39 9.4 14.335l4.6-1.54c.27-.36.4-.5.434.096.34.102.034 2.023.034 2.023s.04.203-.8.266c-.117.063-.316.035-.316.035l-2.022-.688s-.081-.028-.081-.11c0-.08 0-.454 0-.531 0-.177.166-.272.166-.272s2.08-.708 2.162-.737c.083-.28.143-.21.18.069.25.063.042.45.042.45l.67 2.244" />
                    </svg>
                  </div>
                  <span>Telegram</span>
                </div>
                
                {socialConnections.telegram ? (
                  <div className="flex items-center text-green-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Connected
                  </div>
                ) : (
                  <Button
                    variant="light"
                    onClick={() => connectSocial('telegram')}
                    disabled={loading}
                  >
                    Connect
                  </Button>
                )}
              </div>
            </div>
            
            <div className="bg-gray-900/50 p-5 rounded-lg mb-6">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-blue-300">Why Connect?</h3>
                  <div className="mt-2 text-sm text-gray-300">
                    <p>
                      Get personalized news feeds and instant updates from your chosen channels, curated by AI to highlight the latest
                      Aptos DeFi developments. Your social connections are entirely optional.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <Button
                variant="ghost"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={() => setStep(3)}
              >
                Continue
              </Button>
            </div>
          </Card>
        )}
        
        {/* Step 3: Preferences */}
        {step === 3 && (
          <Card className="border-gray-700">
            <h2 className="text-xl font-bold mb-4">Step 3: Set Your Preferences</h2>
            <p className="text-gray-400 mb-6">
              Customize your experience with CompounDefi. You can change these settings anytime.
            </p>
            
            <div className="space-y-6 mb-6">
              {/* Risk Profile */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Risk Profile
                </label>
                <select
                  name="riskProfile"
                  value={preferences.riskProfile}
                  onChange={handlePreferenceChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="conservative">Conservative - Lower risk, stable returns</option>
                  <option value="balanced">Balanced - Moderate risk and returns</option>
                  <option value="aggressive">Aggressive - Higher risk, higher potential returns</option>
                </select>
                <p className="mt-1 text-xs text-gray-400">
                  This affects the strategies our AI will recommend to you.
                </p>
              </div>
              
              {/* Notifications */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="notifications"
                    checked={preferences.notifications}
                    onChange={handlePreferenceChange}
                    className="h-4 w-4 text-blue-600 rounded border-gray-600 bg-gray-700 focus:ring-blue-500"
                  />
                  <span className="ml-2">Enable Notifications</span>
                </label>
                <p className="mt-1 text-xs text-gray-400 ml-6">
                  Receive alerts for market changes, optimization opportunities, and transaction updates.
                </p>
              </div>
              
              {/* Auto-Rebalance */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="autoRebalance"
                    checked={preferences.autoRebalance}
                    onChange={handlePreferenceChange}
                    className="h-4 w-4 text-blue-600 rounded border-gray-600 bg-gray-700 focus:ring-blue-500"
                  />
                  <span className="ml-2">Enable Auto-Rebalancing</span>
                </label>
                <p className="mt-1 text-xs text-gray-400 ml-6">
                  Automatically adjust your portfolio to maintain optimal yield as market conditions change.
                </p>
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <Button
                variant="ghost"
                onClick={() => setStep(2)}
              >
                Back
              </Button>
              <Button
                variant="primary"
                onClick={completeOnboarding}
                disabled={loading}
              >
                Complete Setup
              </Button>
            </div>
          </Card>
        )}
        
        {/* Skip link at bottom */}
        <div className="text-center mt-4">
          <button 
            onClick={skipOnboarding}
            className="text-sm text-gray-500 hover:text-gray-400"
          >
            Skip onboarding and go to dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;