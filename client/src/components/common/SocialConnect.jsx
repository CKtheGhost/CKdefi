import React, { useState, useEffect } from 'react';
import Button from './Button';
import { connectTwitter, connectDiscord, connectTelegram, checkSocialConnections } from '../../services/socialService';
import { useNotification } from '../../hooks/useNotification';

/**
 * SocialConnect component for connecting to social media platforms
 * @param {Object} props Component props
 * @param {Function} props.onConnect Callback when connection is successful
 * @param {string} props.className Additional CSS classes
 */
const SocialConnect = ({ onConnect, className = '' }) => {
  const [loading, setLoading] = useState(false);
  const [connectingPlatform, setConnectingPlatform] = useState(null);
  const [connections, setConnections] = useState({
    twitter: false,
    discord: false,
    telegram: false
  });
  
  const { showNotification } = useNotification();
  
  // Check existing connections on mount
  useEffect(() => {
    const socialConnections = checkSocialConnections();
    setConnections(socialConnections);
  }, []);
  
  // Handle connecting to a platform
  const handleConnect = async (platform) => {
    setConnectingPlatform(platform);
    setLoading(true);
    
    try {
      let result;
      
      switch (platform) {
        case 'twitter':
          result = await connectTwitter();
          break;
        case 'discord':
          result = await connectDiscord();
          break;
        case 'telegram':
          result = await connectTelegram();
          break;
        default:
          throw new Error('Unknown platform');
      }
      
      if (result.success) {
        setConnections(prev => ({
          ...prev,
          [platform]: true
        }));
        
        showNotification(`Connected to ${platform} successfully!`, 'success');
        
        // Call the onConnect callback if provided
        if (onConnect && typeof onConnect === 'function') {
          onConnect(platform, result);
        }
      }
    } catch (error) {
      console.error(`Failed to connect to ${platform}:`, error);
      showNotification(`Failed to connect to ${platform}. Please try again.`, 'error');
    } finally {
      setLoading(false);
      setConnectingPlatform(null);
    }
  };
  
  // Handle disconnecting from a platform
  const handleDisconnect = async (platform) => {
    try {
      // In a real implementation, you would call the disconnect API
      localStorage.removeItem(`${platform}Connected`);
      
      setConnections(prev => ({
        ...prev,
        [platform]: false
      }));
      
      showNotification(`Disconnected from ${platform}.`, 'info');
    } catch (error) {
      console.error(`Failed to disconnect from ${platform}:`, error);
      showNotification(`Failed to disconnect from ${platform}.`, 'error');
    }
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Twitter Connection */}
      <div className="flex items-center justify-between p-4 bg-gray-750 rounded-lg border border-gray-700 hover:border-blue-500/30 transition-colors">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center mr-4">
            <svg className="h-6 w-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </div>
          <div>
            <div className="font-medium">Twitter</div>
            <div className="text-sm text-gray-400">Receive market alerts and updates</div>
          </div>
        </div>
        
        {connections.twitter ? (
          <div className="flex items-center">
            <div className="flex items-center text-green-400 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Connected
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDisconnect('twitter')}
              className="text-red-400 hover:text-red-300"
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => handleConnect('twitter')}
            disabled={loading}
          >
            {loading && connectingPlatform === 'twitter' ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </span>
            ) : (
              'Connect'
            )}
          </Button>
        )}
      </div>
      
      {/* Discord Connection */}
      <div className="flex items-center justify-between p-4 bg-gray-750 rounded-lg border border-gray-700 hover:border-indigo-500/30 transition-colors">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-indigo-900/50 rounded-full flex items-center justify-center mr-4">
            <svg className="h-6 w-6 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
            </svg>
          </div>
          <div>
            <div className="font-medium">Discord</div>
            <div className="text-sm text-gray-400">Join our community discussions</div>
          </div>
        </div>
        
        {connections.discord ? (
          <div className="flex items-center">
            <div className="flex items-center text-green-400 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Connected
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDisconnect('discord')}
              className="text-red-400 hover:text-red-300"
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => handleConnect('discord')}
            disabled={loading}
          >
            {loading && connectingPlatform === 'discord' ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </span>
            ) : (
              'Connect'
            )}
          </Button>
        )}
      </div>
      
      {/* Telegram Connection */}
      <div className="flex items-center justify-between p-4 bg-gray-750 rounded-lg border border-gray-700 hover:border-blue-500/30 transition-colors">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-blue-900/50 rounded-full flex items-center justify-center mr-4">
            <svg className="h-6 w-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0Zm3.566 17.16c-.069.135-.151.172-.346.172h-.15c-.138 0-.273-.055-.418-.167-.161-.125-1.066-.933-1.513-1.303-.296-.243-.503-.303-.686-.303-.151 0-.358.018-.639.563-.274.5361-1.432.588-.543.588-.163 0-.54-.03-.79-.585-.25-.553-.932-2.248-.932-2.248s-.279-.441-.922-.441c-.667 0-2.203.057-3.41.627-1.21.57-1.854 1.781-1.854 1.781l.835.492s.103-.56.542-.56h.106c.388 0 .794.609.794 1.009v1.052c0 .29-.133.455-.343.455-.19 0-.342-.137-.342-.455v-.988c0-.334-.15-.512-.485-.512h-.165c-.335 0-.97.176-.97.652 0 .478 0 2.057 0 2.107 0 .137-.151.288-.343.288-.214 0-.343-.137-.343-.288V14.31c0-.384-.069-.685-.481-.685h-.138c-.343 0-.998.158-.998.712v.895c0 .177-.137.288-.33.288-.193 0-.33-.111-.33-.288v-.865c0-.36-.082-.686-.453-.686h-.16c-.343 0-.983.177-.983.669v.865c0 .202-.124.329-.316.329-.193 0-.317-.127-.317-.329v-2.25c0-.236-.261-.368-.261-.368l-.832.479s-.172.088-.172.227c0 .138 0 3.25 0 3.336 0 .31.016.619.133.885.117.265.426.404.75.404.234 0 .939-.04 1.12-.59.18-.02.058 0 .09 0 .062 0 .138.02.192.035.248.07.535.303.535.765 0 .314-.01 1.306-.01 1.306s-.028.177-.124.233c-.096.056-.233.015-.233.015l-.789-.26s-.054-.2-.054-.113c0-.89.003-1.117.003-1.152 0-.235-.159-.437-.422-.437h-.193c-.262 0-.425.213-.425.437v1.282c0 .075-.02.135-.088.177-.069.042-.158.014-.158.014l-1.232-.409s-.102-.034-.102-.138c0-.104 0-4.08 0-4.21 0-.128.096-.272.207-.312l1.87-.707s.22-.05.365.055c.146.106.2.274.2.364v.187c0 .166.234.236.234.236s.15-.79.343-.079c.166 0 .316.07.454.281.262.397.729 1.112.729 1.112s.096.144.096.227c0 .236-.193.236-.193.236h-.193c-.386 0-.64-.302-.64-.302s-.124-.15-.124.013c0 .047-.003 1.306-.003 1.306s-.014.07-.069.112c-.054.041-.151.034-.151.034l-.789-.26s-.055-.02-.055-.112c0-.93.003-1.104.003-1.153 0-.235-.158-.437-.413-.437h-.193c-.262 0-.425.213-.425.437v1.105c0 .184-.179.247-.179.247l-.868-.288s-.081-.027-.081-.108c0-.082.004-4.607.004-4.607C9.125 14.556 9.262 14.39 9.4 14.335l4.6-1.54c.27-.36.4-.5.434.096.34.102.034 2.023.034 2.023s.04.203-.8.266c-.117.063-.316.035-.316.035l-2.022-.688s-.081-.028-.081-.11c0-.08 0-.454 0-.531 0-.177.166-.272.166-.272s2.08-.708 2.162-.737c.083-.28.143-.21.18.069.25.063.042.45.042.45l.67 2.244"></path>
            </svg>
          </div>
          <div>
            <div className="font-medium">Telegram</div>
            <div className="text-sm text-gray-400">Get real-time portfolio alerts</div>
          </div>
        </div>
        
        {connections.telegram ? (
          <div className="flex items-center">
            <div className="flex items-center text-green-400 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Connected
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDisconnect('telegram')}
              className="text-red-400 hover:text-red-300"
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            onClick={() => handleConnect('telegram')}
            disabled={loading}
          >
            {loading && connectingPlatform === 'telegram' ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </span>
            ) : (
              'Connect'
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SocialConnect;