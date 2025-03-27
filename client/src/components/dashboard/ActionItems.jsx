import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';

const ActionItems = ({ walletConnected }) => {
  const { portfolioData, stakingData } = useData();
  const [autoOptimizeEnabled, setAutoOptimizeEnabled] = useState(false);
  const [nextRunTime, setNextRunTime] = useState(null);
  const [socialConnections, setSocialConnections] = useState({
    twitter: false,
    discord: false,
    telegram: false
  });

  // Load auto-optimize state and next run time from localStorage
  useEffect(() => {
    const loadSettings = () => {
      const enabled = localStorage.getItem('autoOptimizeEnabled') === 'true';
      const nextRun = localStorage.getItem('nextAutoOptimizeRun');
      setAutoOptimizeEnabled(enabled);
      setNextRunTime(nextRun ? parseInt(nextRun) : null);
      
      // Load social connections from localStorage
      setSocialConnections({
        twitter: localStorage.getItem('twitterConnected') === 'true',
        discord: localStorage.getItem('discordConnected') === 'true',
        telegram: localStorage.getItem('telegramConnected') === 'true'
      });
    };
    
    loadSettings();
    
    // Set up an interval to check for changes
    const interval = setInterval(loadSettings, 60000);
    return () => clearInterval(interval);
  }, []);

  // Toggle auto-optimization
  const toggleAutoOptimize = () => {
    const newState = !autoOptimizeEnabled;
    setAutoOptimizeEnabled(newState);
    localStorage.setItem('autoOptimizeEnabled', newState.toString());
    
    if (newState) {
      // Calculate next run time (24 hours from now)
      const nextRun = Date.now() + 24 * 60 * 60 * 1000;
      setNextRunTime(nextRun);
      localStorage.setItem('nextAutoOptimizeRun', nextRun.toString());
    } else {
      setNextRunTime(null);
      localStorage.removeItem('nextAutoOptimizeRun');
    }
  };

  // Connect social media
  const connectSocial = (platform) => {
    console.log(`Connecting to ${platform}...`);
    
    // Simulate successful connection
    setTimeout(() => {
      setSocialConnections(prev => ({
        ...prev,
        [platform]: true
      }));
      localStorage.setItem(`${platform}Connected`, 'true');
    }, 1000);
  };

  // Format time until next run
  const formatTimeUntil = (timestamp) => {
    const now = Date.now();
    const diff = timestamp - now;
    
    if (diff <= 0) {
      return 'Imminent';
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  // Generate action items based on portfolio data
  const getActionItems = () => {
    const actions = [];
    
    // Always prompt for wallet connection if not connected
    if (!walletConnected) {
      actions.push({
        title: 'Connect Your Wallet',
        description: 'Connect your wallet to get personalized DeFi insights',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        ),
        link: '#',
        buttonText: 'Connect Wallet',
        onClick: () => window.dh?.connectWallet()
      });
      
      // Also prompt for social connections
      if (!socialConnections.twitter) {
        actions.push({
          title: 'Connect Twitter',
          description: 'Get personalized news and updates',
          icon: (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
            </svg>
          ),
          link: '#',
          buttonText: 'Connect',
          onClick: () => connectSocial('twitter')
        });
      }
      
      return actions;
    }
    
    // If wallet is connected, check for optimization opportunities
    if (portfolioData) {
      const hasStakedAssets = 
        (portfolioData.stAPT && parseFloat(portfolioData.stAPT.amount) > 0) ||
        (portfolioData.sthAPT && parseFloat(portfolioData.sthAPT.amount) > 0) ||
        (portfolioData.tAPT && parseFloat(portfolioData.tAPT.amount) > 0) ||
        (portfolioData.dAPT && parseFloat(portfolioData.dAPT.amount) > 0);
      
      const hasUnstakedAssets = portfolioData.apt && parseFloat(portfolioData.apt.amount) > 1;
      
      // Auto-optimizer opportunity
      if (!autoOptimizeEnabled && (hasStakedAssets || hasUnstakedAssets)) {
        actions.push({
          title: 'Enable Auto-Optimizer',
          description: 'Automatically maintain the optimal DeFi strategy for your portfolio',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          ),
          link: '/auto-optimizer',
          buttonText: 'Enable',
          onClick: toggleAutoOptimize
        });
      }
      
      // Stakes available
      if (hasUnstakedAssets) {
        actions.push({
          title: 'Stake Available APT',
          description: `You have ${portfolioData.apt.amount} APT available to stake for passive income`,
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          ),
          link: '/ai-recommendations',
          buttonText: 'Get Recommendations'
        });
      }
      
      // Optimization opportunity
      if (stakingData && stakingData.comparisonAnalysis && hasStakedAssets) {
        const highestAPR = parseFloat(stakingData.comparisonAnalysis.highestBlendedAPR.apr);
        const currentAPR = hasStakedAssets ? 7.5 : 0; // Placeholder, ideally get from portfolio data
        
        if (highestAPR > currentAPR + 1) { // If there's more than 1% gain available
          actions.push({
            title: 'Optimize Your Yield',
            description: `You could earn up to ${highestAPR.toFixed(2)}% APR by optimizing your portfolio`,
            icon: (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            ),
            link: '/ai-recommendations',
            buttonText: 'View Strategy'
          });
        }
      }
      
      // Prompt social connections if wallet is connected but socials aren't
      if (!socialConnections.discord) {
        actions.push({
          title: 'Connect Discord',
          description: 'Get alerts for important portfolio events',
          icon: (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
            </svg>
          ),
          link: '#',
          buttonText: 'Connect',
          onClick: () => connectSocial('discord')
        });
      }
    }
    
    // Return up to 4 actions
    return actions.slice(0, 4);
  };

  const actionItems = getActionItems();

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-6">Action Items</h2>
      
      <div className="space-y-4">
        {actionItems.map((item, index) => (
          <div key={index} className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-start">
              <div className={`p-3 rounded-full ${walletConnected ? 'bg-blue-900 text-blue-300' : 'bg-indigo-900 text-indigo-300'} mr-4`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-gray-400 mb-3">{item.description}</p>
                {item.onClick ? (
                  <button 
                    onClick={item.onClick}
                    className={`${walletConnected ? 'bg-blue-600 hover:bg-blue-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-4 py-2 rounded-lg text-sm font-medium`}
                  >
                    {item.buttonText}
                  </button>
                ) : (
                  <Link 
                    to={item.link}
                    className={`${walletConnected ? 'bg-blue-600 hover:bg-blue-700' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-4 py-2 rounded-lg text-sm font-medium inline-block`}
                  >
                    {item.buttonText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {actionItems.length === 0 && (
          <div className="bg-gray-700 rounded-lg p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-green-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-semibold text-lg mb-2">All Caught Up!</h3>
            <p className="text-gray-400">
              Your portfolio is optimized and running efficiently.
            </p>
          </div>
        )}
      </div>
      
      {/* Auto-optimization status */}
      {walletConnected && autoOptimizeEnabled && (
        <div className="mt-6 bg-blue-900/30 rounded-lg p-4 border border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-700 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Auto-Optimizer Active</p>
                {nextRunTime && (
                  <p className="text-xs text-blue-300">Next run: {formatTimeUntil(nextRunTime)}</p>
                )}
              </div>
            </div>
            <button 
              onClick={toggleAutoOptimize}
              className="text-xs bg-blue-800 hover:bg-blue-700 text-white px-2 py-1 rounded"
            >
              Disable
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionItems;