import React, { useState } from 'react';

/**
 * Second onboarding step - Social media integrations
 * 
 * @param {Object} props
 * @param {Function} props.onNext - Function to advance to next step
 * @param {Function} props.onSkip - Function to skip this step
 * @param {boolean} props.completed - Whether this step is completed
 */
const SocialStep = ({ onNext, onSkip, completed }) => {
  const [socialConnections, setSocialConnections] = useState({
    twitter: false,
    discord: false,
    telegram: false
  });
  const [connecting, setConnecting] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState(null);
  
  const handleConnect = async (platform) => {
    if (socialConnections[platform]) {
      // Disconnect if already connected
      setSocialConnections(prev => ({
        ...prev,
        [platform]: false
      }));
      return;
    }
    
    setCurrentPlatform(platform);
    setConnecting(true);
    
    try {
      // Simulate API call to connect social media
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update connection status
      setSocialConnections(prev => ({
        ...prev,
        [platform]: true
      }));
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error);
    } finally {
      setConnecting(false);
      setCurrentPlatform(null);
    }
  };
  
  const handleContinue = () => {
    // At least one social media connected
    const hasConnections = Object.values(socialConnections).some(connected => connected);
    
    if (hasConnections) {
      // Save social connections to user profile
      localStorage.setItem('socialConnections', JSON.stringify(socialConnections));
    }
    
    onNext();
  };
  
  return (
    <div className="social-step">
      <h2 className="text-2xl font-bold text-white mb-6">Connect Social Media</h2>
      
      <p className="text-gray-300 mb-6">
        Connect your social media accounts to enhance your experience with integrated news and updates from your favorite Aptos projects.
        This step is optional - you can still use all core features without connecting social media.
      </p>
      
      <div className="space-y-4 mb-8">
        {/* Twitter */}
        <div className={`bg-gray-900 rounded-lg p-4 border ${socialConnections.twitter ? 'border-blue-600' : 'border-gray-700'}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-900/50 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium">Twitter</h3>
                <p className="text-gray-400 text-sm">Get the latest tweets from Aptos projects</p>
              </div>
            </div>
            <button
              onClick={() => handleConnect('twitter')}
              disabled={connecting && currentPlatform !== 'twitter'}
              className={`px-4 py-2 rounded-lg font-medium ${
                socialConnections.twitter
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : connecting && currentPlatform === 'twitter'
                  ? 'bg-blue-800 text-white cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {connecting && currentPlatform === 'twitter' ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </span>
              ) : socialConnections.twitter ? (
                'Disconnect'
              ) : (
                'Connect'
              )}
            </button>
          </div>
        </div>
        
        {/* Discord */}
        <div className={`bg-gray-900 rounded-lg p-4 border ${socialConnections.discord ? 'border-indigo-600' : 'border-gray-700'}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-indigo-900/50 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3847-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium">Discord</h3>
                <p className="text-gray-400 text-sm">Stay updated with your Discord communities</p>
              </div>
            </div>
            <button
              onClick={() => handleConnect('discord')}
              disabled={connecting && currentPlatform !== 'discord'}
              className={`px-4 py-2 rounded-lg font-medium ${
                socialConnections.discord
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : connecting && currentPlatform === 'discord'
                  ? 'bg-indigo-800 text-white cursor-wait'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {connecting && currentPlatform === 'discord' ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </span>
              ) : socialConnections.discord ? (
                'Disconnect'
              ) : (
                'Connect'
              )}
            </button>
          </div>
        </div>
        
        {/* Telegram */}
        <div className={`bg-gray-900 rounded-lg p-4 border ${socialConnections.telegram ? 'border-blue-500' : 'border-gray-700'}`}>
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-900/50 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-white font-medium">Telegram</h3>
                <p className="text-gray-400 text-sm">Follow Aptos Telegram channels</p>
              </div>
            </div>
            <button
              onClick={() => handleConnect('telegram')}
              disabled={connecting && currentPlatform !== 'telegram'}
              className={`px-4 py-2 rounded-lg font-medium ${
                socialConnections.telegram
                  ? 'bg-gray-700 hover:bg-gray-600 text-white'
                  : connecting && currentPlatform === 'telegram'
                  ? 'bg-blue-700 text-white cursor-wait'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {connecting && currentPlatform === 'telegram' ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </span>
              ) : socialConnections.telegram ? (
                'Disconnect'
              ) : (
                'Connect'
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-900/50 p-5 rounded-lg mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-300">How this helps</h3>
            <div className="mt-2 text-sm text-gray-300">
              <p>
                Connecting social media allows CompounDefi to personalize your news feed with updates from your favorite
                protocols and communities. We never post on your behalf without explicit permission.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <button
          onClick={handleContinue}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
        >
          {Object.values(socialConnections).some(connected => connected) 
            ? 'Continue with Connected Accounts' 
            : 'Continue without Connecting'}
        </button>
      </div>
    </div>
  );
};

export default SocialStep;