// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import { useWalletContext } from '../context/WalletContext';
import { useNotification } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/common/Card';
import { CardHeader, CardTitle, CardDescription, CardContent } from '../components/common/Card';
import Button from '../components/common/Button';

const Settings = () => {
  const { connected, address, disconnectWallet, provider } = useWalletContext();
  const { showNotification } = useNotification();
  const { theme, setTheme } = useTheme();
  
  const [formData, setFormData] = useState({
    riskProfile: 'balanced',
    autoOptimizeEnabled: false,
    autoOptimizeInterval: 24,
    autoOptimizeThreshold: 5,
    slippageTolerance: 1,
    gasBuffer: 1.15,
    preserveStakedPositions: true,
    darkMode: theme === 'dark',
    notifications: {
      email: true,
      push: true,
      transactionAlerts: true,
      newsletterUpdates: false,
      priceAlerts: true
    },
    dataSharing: {
      anonymizedData: true,
      portfolioData: false,
      walletActivity: false
    },
    defaultCurrency: 'USD',
    language: 'en',
    advancedMode: false
  });

  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setFormData(prev => ({
          ...prev,
          ...parsedSettings,
          darkMode: theme === 'dark'
        }));
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
    
    // Load auto-optimizer settings
    const autoOptimizeEnabled = localStorage.getItem('autoOptimizeEnabled') === 'true';
    const autoOptimizerSettings = localStorage.getItem('autoOptimizerSettings');
    if (autoOptimizerSettings) {
      try {
        const parsedSettings = JSON.parse(autoOptimizerSettings);
        setFormData(prev => ({
          ...prev,
          autoOptimizeEnabled,
          autoOptimizeInterval: parsedSettings.interval || prev.autoOptimizeInterval,
          autoOptimizeThreshold: parsedSettings.rebalanceThreshold || prev.autoOptimizeThreshold,
          slippageTolerance: parsedSettings.maxSlippage || prev.slippageTolerance,
          preserveStakedPositions: parsedSettings.preserveStakedPositions ?? prev.preserveStakedPositions
        }));
      } catch (error) {
        console.error('Failed to parse auto-optimizer settings:', error);
      }
    }
  }, [theme]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev };
      
      // Handle nested objects (e.g., notifications.email)
      if (name.includes('.')) {
        const [category, setting] = name.split('.');
        newData[category] = {
          ...newData[category],
          [setting]: type === 'checkbox' ? checked : value
        };
      } else {
        // Handle regular inputs
        newData[name] = type === 'checkbox' ? checked : 
                        type === 'number' ? parseFloat(value) : value;
      }
      
      setUnsavedChanges(true);
      return newData;
    });
  };

  const handleSave = () => {
    try {
      // Update theme if it changed
      if (formData.darkMode !== (theme === 'dark')) {
        setTheme(formData.darkMode ? 'dark' : 'light');
      }
      
      // Save user settings
      const userSettings = { ...formData };
      delete userSettings.darkMode; // This is handled by ThemeContext
      
      localStorage.setItem('userSettings', JSON.stringify(userSettings));
      
      // Update auto-optimizer settings if they exist
      const autoOptimizerSettings = {
        interval: formData.autoOptimizeInterval,
        rebalanceThreshold: formData.autoOptimizeThreshold,
        maxSlippage: formData.slippageTolerance,
        preserveStakedPositions: formData.preserveStakedPositions
      };
      
      localStorage.setItem('autoOptimizerSettings', JSON.stringify(autoOptimizerSettings));
      localStorage.setItem('autoOptimizeEnabled', formData.autoOptimizeEnabled.toString());
      
      showNotification('Settings saved successfully', 'success');
      setUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
      showNotification('Failed to save settings: ' + error.message, 'error');
    }
  };

  const handleReset = () => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setFormData(prev => ({
          ...prev,
          ...parsedSettings,
          darkMode: theme === 'dark'
        }));
        setUnsavedChanges(false);
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all application data? This cannot be undone.')) {
      // Clear localStorage except for theme
      const currentTheme = localStorage.getItem('theme');
      localStorage.clear();
      if (currentTheme) {
        localStorage.setItem('theme', currentTheme);
      }
      
      // Reset form data to defaults
      setFormData({
        riskProfile: 'balanced',
        autoOptimizeEnabled: false,
        autoOptimizeInterval: 24,
        autoOptimizeThreshold: 5,
        slippageTolerance: 1,
        gasBuffer: 1.15,
        preserveStakedPositions: true,
        darkMode: theme === 'dark',
        notifications: {
          email: true,
          push: true,
          transactionAlerts: true,
          newsletterUpdates: false,
          priceAlerts: true
        },
        dataSharing: {
          anonymizedData: true,
          portfolioData: false,
          walletActivity: false
        },
        defaultCurrency: 'USD',
        language: 'en',
        advancedMode: false
      });
      
      showNotification('All application data has been cleared', 'success');
      setUnsavedChanges(true);
    }
  };

  const handleDisconnectWallet = () => {
    if (window.confirm('Are you sure you want to disconnect your wallet?')) {
      disconnectWallet();
      showNotification('Wallet disconnected successfully', 'success');
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          {unsavedChanges && (
            <div className="flex space-x-2">
              <Button onClick={handleReset} variant="outline">
                Discard Changes
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="md:col-span-1">
            <Card className="bg-gray-800 border border-gray-700">
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <button
                    className={`py-3 px-4 text-left ${activeTab === 'general' ? 'bg-blue-900/50 text-blue-400 font-medium' : 'hover:bg-gray-700'}`}
                    onClick={() => setActiveTab('general')}
                  >
                    General
                  </button>
                  <button
                    className={`py-3 px-4 text-left ${activeTab === 'optimizer' ? 'bg-blue-900/50 text-blue-400 font-medium' : 'hover:bg-gray-700'}`}
                    onClick={() => setActiveTab('optimizer')}
                  >
                    Auto-Optimizer
                  </button>
                  <button
                    className={`py-3 px-4 text-left ${activeTab === 'appearance' ? 'bg-blue-900/50 text-blue-400 font-medium' : 'hover:bg-gray-700'}`}
                    onClick={() => setActiveTab('appearance')}
                  >
                    Appearance
                  </button>
                  <button
                    className={`py-3 px-4 text-left ${activeTab === 'notifications' ? 'bg-blue-900/50 text-blue-400 font-medium' : 'hover:bg-gray-700'}`}
                    onClick={() => setActiveTab('notifications')}
                  >
                    Notifications
                  </button>
                  <button
                    className={`py-3 px-4 text-left ${activeTab === 'privacy' ? 'bg-blue-900/50 text-blue-400 font-medium' : 'hover:bg-gray-700'}`}
                    onClick={() => setActiveTab('privacy')}
                  >
                    Privacy
                  </button>
                  <button
                    className={`py-3 px-4 text-left ${activeTab === 'advanced' ? 'bg-blue-900/50 text-blue-400 font-medium' : 'hover:bg-gray-700'}`}
                    onClick={() => setActiveTab('advanced')}
                  >
                    Advanced
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Settings Content */}
          <div className="md:col-span-3">
            <Card className="bg-gray-800 border border-gray-700">
              <CardHeader>
                <CardTitle>
                  {activeTab === 'general' && 'General Settings'}
                  {activeTab === 'optimizer' && 'Auto-Optimizer Settings'}
                  {activeTab === 'appearance' && 'Appearance Settings'}
                  {activeTab === 'notifications' && 'Notification Settings'}
                  {activeTab === 'privacy' && 'Privacy Settings'}
                  {activeTab === 'advanced' && 'Advanced Settings'}
                </CardTitle>
                <CardDescription>
                  {activeTab === 'general' && 'Configure your profile and account preferences'}
                  {activeTab === 'optimizer' && 'Configure AI-powered portfolio optimization settings'}
                  {activeTab === 'appearance' && 'Customize the look and feel of the application'}
                  {activeTab === 'notifications' && 'Manage how and when you receive notifications'}
                  {activeTab === 'privacy' && 'Control your data sharing and privacy settings'}
                  {activeTab === 'advanced' && 'Advanced configuration options for experienced users'}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* General Settings */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Risk Profile
                      </label>
                      <select
                        name="riskProfile"
                        value={formData.riskProfile}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="conservative">Conservative (Lower Risk)</option>
                        <option value="balanced">Balanced (Moderate Risk)</option>
                        <option value="aggressive">Aggressive (Higher Risk)</option>
                      </select>
                      <p className="text-sm text-gray-400 mt-1">
                        This affects AI recommendations and auto-optimization strategies
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Default Currency
                      </label>
                      <select
                        name="defaultCurrency"
                        value={formData.defaultCurrency}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="JPY">JPY (¥)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Language
                      </label>
                      <select
                        name="language"
                        value={formData.language}
                        onChange={handleInputChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="advancedMode"
                        name="advancedMode"
                        checked={formData.advancedMode}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                      />
                      <label htmlFor="advancedMode" className="text-sm font-medium text-gray-200">
                        Enable Advanced Mode
                      </label>
                    </div>
                    <p className="text-sm text-gray-400 ml-6 -mt-4">
                      Shows additional options and technical information
                    </p>
                    
                    {connected && (
                      <div className="pt-4 border-t border-gray-600">
                        <h3 className="text-sm font-medium text-gray-200 mb-2">Connected Wallet</h3>
                        <div className="bg-gray-700 rounded-lg p-3 mb-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-gray-400 text-sm">Address:</span>
                              <span className="text-white ml-2">{address.substring(0, 8)}...{address.substring(address.length - 6)}</span>
                            </div>
                            <div>
                              <span className="text-gray-400 text-sm">Provider:</span>
                              <span className="text-white ml-2">{provider}</span>
                            </div>
                          </div>
                        </div>
                        <Button 
                          onClick={handleDisconnectWallet}
                          variant="outline"
                          className="text-red-400 border-red-900/50 hover:bg-red-900/20"
                        >
                          Disconnect Wallet
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Auto-Optimizer Settings */}
                {activeTab === 'optimizer' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-gray-200">
                          Auto-Optimization
                        </label>
                        <p className="text-sm text-gray-400">
                          Automatically rebalance your portfolio based on AI recommendations
                        </p>
                      </div>
                      <div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="autoOptimizeEnabled"
                            checked={formData.autoOptimizeEnabled}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Rebalance Interval (Hours)
                      </label>
                      <input
                        type="number"
                        name="autoOptimizeInterval"
                        value={formData.autoOptimizeInterval}
                        onChange={handleInputChange}
                        min="1"
                        max="168"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-sm text-gray-400 mt-1">
                        How often the auto-optimizer will check your portfolio (1-168 hours)
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Rebalance Threshold (%)
                      </label>
                      <input
                        type="number"
                        name="autoOptimizeThreshold"
                        value={formData.autoOptimizeThreshold}
                        onChange={handleInputChange}
                        min="1"
                        max="20"
                        step="0.5"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-sm text-gray-400 mt-1">
                        Minimum portfolio drift percentage required to trigger rebalancing
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Slippage Tolerance (%)
                      </label>
                      <input
                        type="number"
                        name="slippageTolerance"
                        value={formData.slippageTolerance}
                        onChange={handleInputChange}
                        min="0.1"
                        max="5"
                        step="0.1"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-sm text-gray-400 mt-1">
                        Maximum allowed price slippage during transactions
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="preserveStakedPositions"
                        name="preserveStakedPositions"
                        checked={formData.preserveStakedPositions}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                      />
                      <label htmlFor="preserveStakedPositions" className="text-sm font-medium text-gray-200">
                        Preserve Staked Positions
                      </label>
                    </div>
                    <p className="text-sm text-gray-400 ml-6 -mt-4">
                      When enabled, auto-optimizer will not unstake existing positions
                    </p>
                  </div>
                )}
                
                {/* Appearance Settings */}
                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-sm font-medium text-gray-200">
                          Dark Mode
                        </label>
                        <p className="text-sm text-gray-400">
                          Use dark theme for the application
                        </p>
                      </div>
                      <div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="darkMode"
                            checked={formData.darkMode}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Notifications Settings */}
                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-gray-200">Notification Channels</h3>
                      
                      <div className="flex items-center justify-between">
                        <label htmlFor="notifications.email" className="text-sm text-gray-200">
                          Email Notifications
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            id="notifications.email"
                            name="notifications.email"
                            checked={formData.notifications?.email}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label htmlFor="notifications.push" className="text-sm text-gray-200">
                          Push Notifications
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            id="notifications.push"
                            name="notifications.push"
                            checked={formData.notifications?.push}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-4 border-t border-gray-600">
                      <h3 className="text-sm font-medium text-gray-200">Notification Types</h3>
                      
                      <div className="flex items-center justify-between">
                        <label htmlFor="notifications.transactionAlerts" className="text-sm text-gray-200">
                          Transaction Alerts
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            id="notifications.transactionAlerts"
                            name="notifications.transactionAlerts"
                            checked={formData.notifications?.transactionAlerts}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label htmlFor="notifications.priceAlerts" className="text-sm text-gray-200">
                          Price Alerts
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            id="notifications.priceAlerts"
                            name="notifications.priceAlerts"
                            checked={formData.notifications?.priceAlerts}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <label htmlFor="notifications.newsletterUpdates" className="text-sm text-gray-200">
                          Newsletter Updates
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            id="notifications.newsletterUpdates"
                            name="notifications.newsletterUpdates"
                            checked={formData.notifications?.newsletterUpdates}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Privacy Settings */}
                {activeTab === 'privacy' && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-gray-200">Data Sharing</h3>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <label htmlFor="dataSharing.anonymizedData" className="text-sm font-medium text-gray-200">
                            Share Anonymized Data
                          </label>
                          <p className="text-xs text-gray-400">
                            Share anonymized usage data to help improve the application
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            id="dataSharing.anonymizedData"
                            name="dataSharing.anonymizedData"
                            checked={formData.dataSharing?.anonymizedData}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <label htmlFor="dataSharing.portfolioData" className="text-sm font-medium text-gray-200">
                            Share Portfolio Data
                          </label>
                          <p className="text-xs text-gray-400">
                            Share portfolio data for personalized recommendations
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            id="dataSharing.portfolioData"
                            name="dataSharing.portfolioData"
                            checked={formData.dataSharing?.portfolioData}
                            onChange={handleInputChange}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Advanced Settings */}
                {activeTab === 'advanced' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Gas Buffer
                      </label>
                      <input
                        type="number"
                        name="gasBuffer"
                        value={formData.gasBuffer}
                        onChange={handleInputChange}
                        min="1"
                        max="2"
                        step="0.05"
                        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-sm text-gray-400 mt-1">
                        Multiplier applied to estimated gas costs (1.0-2.0)
                      </p>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-600">
                      <Button
                        onClick={handleClearData}
                        variant="outline"
                        className="text-red-400 border-red-900/50 hover:bg-red-900/20"
                      >
                        Clear All Application Data
                      </Button>
                      <p className="text-xs text-gray-400 mt-1">
                        This will reset all settings and clear all cached data
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;