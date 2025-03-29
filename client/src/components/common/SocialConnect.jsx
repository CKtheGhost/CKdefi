// SocialConnect.jsx
import React, { useState } from 'react';
import { 
  ChatBubbleBottomCenterTextIcon, 
  HashtagIcon,
  PaperAirplaneIcon 
} from '@heroicons/react/24/outline';
import { useUser } from '../../context/UserContext';

const SocialConnect = () => {
  const { userProfile } = useUser();
  const [connecting, setConnecting] = useState(false);
  
  // Check if social accounts are connected
  const hasTwitter = userProfile?.socialConnections?.twitter?.connected;
  const hasDiscord = userProfile?.socialConnections?.discord?.connected;
  const hasTelegram = userProfile?.socialConnections?.telegram?.connected;
  
  const connectSocial = async (platform) => {
    setConnecting(true);
    try {
      const response = await fetch(`/api/social/connect/${platform}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const data = await response.json();
      
      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error(`Error connecting to ${platform}:`, error);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">Connect Social Accounts</h3>
      
      <div className="space-y-4">
        <SocialButton 
          platform="Twitter" 
          icon={HashtagIcon} 
          connected={hasTwitter}
          username={userProfile?.socialConnections?.twitter?.username}
          onClick={() => connectSocial('twitter')}
          loading={connecting}
          color="bg-blue-400"
        />
        
        <SocialButton 
          platform="Discord" 
          icon={ChatBubbleBottomCenterTextIcon} 
          connected={hasDiscord}
          username={userProfile?.socialConnections?.discord?.username}
          onClick={() => connectSocial('discord')}
          loading={connecting}
          color="bg-indigo-500"
        />
        
        <SocialButton 
          platform="Telegram" 
          icon={PaperAirplaneIcon} 
          connected={hasTelegram}
          username={userProfile?.socialConnections?.telegram?.username}
          onClick={() => connectSocial('telegram')}
          loading={connecting}
          color="bg-blue-500"
        />
      </div>
      
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
        Connect your social accounts to share your investment strategies and achievements.
      </p>
    </div>
  );
};

const SocialButton = ({ platform, icon: Icon, connected, username, onClick, loading, color }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color} text-white`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium">{platform}</p>
        {connected && username && (
          <p className="text-xs text-gray-500 dark:text-gray-400">@{username}</p>
        )}
      </div>
    </div>
    
    <button
      onClick={onClick}
      disabled={loading || connected}
      className={`px-3 py-1 text-sm rounded-full ${
        connected 
          ? 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400'
          : 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-800/30 dark:text-blue-400 dark:hover:bg-blue-700/40'
      }`}
    >
      {loading ? 'Connecting...' : connected ? 'Connected' : 'Connect'}
    </button>
  </div>
);

export default SocialConnect;