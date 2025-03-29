// src/pages/SocialConnections.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useWalletContext } from '../context/WalletContext';
import { useNotification } from '../context/NotificationContext';
import { checkSocialConnections } from '../services/socialService';
import SocialIntegrationPanel from '../components/common/SocialIntegrationPanel';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

const SocialConnections = () => {
  const { isConnected } = useWalletContext();
  const { showNotification } = useNotification();
  const [activeTab, setActiveTab] = useState('connections');
  const [socialConnections, setSocialConnections] = useState({
    twitter: false,
    discord: false,
    telegram: false
  });
  const navigate = useNavigate();

  // Check connections on component mount
  useEffect(() => {
    loadConnections();
  }, []);

  const loadConnections = () => {
    const connections = checkSocialConnections();
    setSocialConnections(connections);
  };

  // If wallet not connected, redirect to wallet page or show connect wallet UI
  if (!isConnected) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Social Connections</h1>
          
          <Card className="bg-gray-800 p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 className="text-xl font-semibold mb-2">Wallet Connection Required</h2>
            <p className="text-gray-400 mb-6">
              Please connect your wallet to set up social connections and manage notifications.
            </p>
            <Button 
              onClick={() => navigate('/wallet')}
              variant="primary"
            >
              Connect Wallet
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-4 md:mb-0">Social Connections</h1>
          
          <div className="inline-flex bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('connections')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'connections'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Connections
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'notifications'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Settings
            </button>
          </div>
        </div>
        
        {activeTab === 'connections' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SocialIntegrationPanel />
            </div>
            
            <div className="space-y-6">
              <Card className="bg-gray-800 border border-gray-700">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Connection Benefits</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-blue-900/30 p-2 rounded-full mr-3 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Real-time Alerts</h3>
                        <p className="text-sm text-gray-400">
                          Receive instant notifications about market movements and yield opportunities.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-green-900/30 p-2 rounded-full mr-3 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Portfolio Updates</h3>
                        <p className="text-sm text-gray-400">
                          Get daily or weekly summaries of your portfolio performance.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-purple-900/30 p-2 rounded-full mr-3 flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">Community Access</h3>
                        <p className="text-sm text-gray-400">
                          Join our community of DeFi users and get exclusive insights.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-gray-800 border border-gray-700">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-white mb-3">Connection Status</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                      <span className="text-gray-400">Twitter</span>
                      <span className={socialConnections.twitter ? "text-green-400" : "text-red-400"}>
                        {socialConnections.twitter ? "Connected" : "Not Connected"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-2 border-b border-gray-700">
                      <span className="text-gray-400">Discord</span>
                      <span className={socialConnections.discord ? "text-green-400" : "text-red-400"}>
                        {socialConnections.discord ? "Connected" : "Not Connected"}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Telegram</span>
                      <span className={socialConnections.telegram ? "text-green-400" : "text-red-400"}>
                        {socialConnections.telegram ? "Connected" : "Not Connected"}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
        
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <Card className="bg-gray-800 border border-gray-700">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Notification Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-700">
                    <div>
                      <h3 className="font-medium text-white">Price Alerts</h3>
                      <p className="text-sm text-gray-400">Receive alerts when token prices change significantly</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between pb-4 border-b border-gray-700">
                    <div>
                      <h3 className="font-medium text-white">Portfolio Updates</h3>
                      <p className="text-sm text-gray-400">Daily summary of your portfolio performance</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between pb-4 border-b border-gray-700">
                    <div>
                      <h3 className="font-medium text-white">Protocol Updates</h3>
                      <p className="text-sm text-gray-400">Updates about protocol changes and upgrades</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between pb-4 border-b border-gray-700">
                    <div>
                      <h3 className="font-medium text-white">Security Alerts</h3>
                      <p className="text-sm text-gray-400">Critical security notifications about your account</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={true} />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">Newsletter</h3>
                      <p className="text-sm text-gray-400">Weekly digest of important DeFi news</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={false} />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button>Save Settings</Button>
                </div>
              </div>
            </Card>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <Card className="bg-gray-800 border border-gray-700">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Notification Frequency</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Price Alert Threshold (%)
                    </label>
                    <input
                      type="number"
                      min="0.5"
                      max="20"
                      step="0.5"
                      defaultValue="5"
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Minimum price change percentage to trigger an alert
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Portfolio Update Frequency
                    </label>
                    <select
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Do Not Disturb Hours
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">From</label>
                        <input
                          type="time"
                          defaultValue="22:00"
                          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">To</label>
                        <input
                          type="time"
                          defaultValue="07:00"
                          className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      No notifications will be sent during this time period
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-700">
                    <button
                      className="text-red-400 hover:text-red-300"
                    >
                      Disconnect All Social Accounts
                    </button>
                    <p className="text-xs text-gray-400 mt-1">
                      This will disconnect all social media accounts and stop all notifications
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button variant="outline" className="mr-2">
                    Reset to Default
                  </Button>
                  <Button>
                    Save Settings
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SocialConnections;