import React, { useState, useEffect, useContext } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { WalletContext } from '../context/WalletContext';
import { UserContext } from '../context/UserContext';
import { NotificationContext } from '../context/NotificationContext';
import { ThemeContext } from '../context/ThemeContext';

const Settings = () => {
  const { preferences, updatePreferences } = useContext(UserContext);
  const { wallet, isConnected, disconnect } = useContext(WalletContext);
  const { showNotification } = useContext(NotificationContext);
  const { theme, setTheme } = useContext(ThemeContext);
  
  const [formData, setFormData] = useState({
    riskProfile: 'balanced',
    autoOptimizeEnabled: false,
    autoOptimizeInterval: 24,
    autoOptimizeThreshold: 5,
    slippageTolerance: 1,
    gasBuffer: 1.15,
    preserveStakedPositions: true,
    darkMode: false,
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

  // Load initial settings from UserContext
  useEffect(() => {
    if (preferences) {
      setFormData(prev => ({
        ...prev,
        ...preferences,
        darkMode: theme === 'dark'
      }));
    }
  }, [preferences, theme]);

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

  const handleSave = async () => {
    try {
      // Update theme if it changed
      if (formData.darkMode !== (theme === 'dark')) {
        setTheme(formData.darkMode ? 'dark' : 'light');
      }
      
      // Remove UI-only settings before saving to user preferences
      const userPreferences = { ...formData };
      delete userPreferences.darkMode; // This is handled by ThemeContext
      
      await updatePreferences(userPreferences);
      showNotification('Settings saved successfully', 'success');
      setUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save settings:', error);
      showNotification('Failed to save settings: ' + error.message, 'error');
    }
  };

  const handleReset = () => {
    if (preferences) {
      setFormData({
        ...preferences,
        darkMode: theme === 'dark'
      });
      setUnsavedChanges(false);
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all application data? This cannot be undone.')) {
      // Clear localStorage
      localStorage.clear();
      
      // Reset settings to defaults
      setFormData({
        riskProfile: 'balanced',
        autoOptimizeEnabled: false,
        autoOptimizeInterval: 24,
        autoOptimizeThreshold: 5,
        slippageTolerance: 1,
        gasBuffer: 1.15,
        preserveStakedPositions: true,
        darkMode: false,
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
      disconnect();
      showNotification('Wallet disconnected successfully', 'success');
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
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
          <Card>
            <CardContent className="p-0">
              <nav className="flex flex-col">
                <button
                  className={`py-3 px-4 text-left ${activeTab === 'general' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('general')}
                >
                  General
                </button>
                <button
                  className={`py-3 px-4 text-left ${activeTab === 'optimizer' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('optimizer')}
                >
                  Auto-Optimizer
                </button>
                <button
                  className={`py-3 px-4 text-left ${activeTab === 'appearance' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('appearance')}
                >
                  Appearance
                </button>
                <button
                  className={`py-3 px-4 text-left ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  Notifications
                </button>
                <button
                  className={`py-3 px-4 text-left ${activeTab === 'privacy' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'}`}
                  onClick={() => setActiveTab('privacy')}
                >
                  Privacy
                </button>
                <button
                  className={`py-3 px-4 text-left ${activeTab === 'advanced' ? 'bg-blue-50 text-blue-600 font-medium' : 'hover:bg-gray-50'}`}
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
          <Card>
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
                    <label className="block text-sm font-medium mb-2">
                      Risk Profile
                    </label>
                    <select
                      name="riskProfile"
                      value={formData.riskProfile}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="conservative">Conservative (Lower Risk)</option>
                      <option value="balanced">Balanced (Moderate Risk)</option>
                      <option value="aggressive">Aggressive (Higher Risk)</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                      This affects AI recommendations and auto-optimization strategies
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Default Currency
                    </label>
                    <select
                      name="defaultCurrency"
                      value={formData.defaultCurrency}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Language
                    </label>
                    <select
                      name="language"
                      value={formData.language}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="ja">日本語</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="advancedMode"
                      name="advancedMode"
                      checked={formData.advancedMode}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label htmlFor="advancedMode" className="text-sm font-medium">
                      Enable Advanced Mode
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 ml-6 -mt-4">
                    Shows additional options and technical information
                  </p>
                  
                  {isConnected && (
                    <div className="pt-4 border-t border-gray-200">
                      <Button 
                        onClick={handleDisconnectWallet}
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Disconnect Wallet ({wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)})
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
                      <label className="block text-sm font-medium">
                        Auto-Optimization
                      </label>
                      <p className="text-sm text-gray-500">
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
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Rebalance Interval (Hours)
                    </label>
                    <input
                      type="number"
                      name="autoOptimizeInterval"
                      value={formData.autoOptimizeInterval}
                      onChange={handleInputChange}
                      min="1"
                      max="168"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      How often the auto-optimizer will check your portfolio (1-168 hours)
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
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
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Minimum portfolio drift percentage required to trigger rebalancing
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
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
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <p className="text-sm text-gray-500 mt-1">
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
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <label htmlFor="preserveStakedPositions" className="text-sm font-medium">
                      Preserve Staked Positions
                    </label>
                  </div>
                  <p className="text-sm text-gray-500 ml-6 -mt-4">
                    When enabled, auto-optimizer will not unstake existing positions
                  </p>
                </div>
              )}
              
              {/* Appearance Settings */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium">
                        Dark Mode
                      </label>
                      <p className="text-sm text-gray-500">
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
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Animation Level
                    </label>
                    <select
                      name="animationLevel"
                      value={formData.animationLevel || 'medium'}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="none">None</option>
                      <option value="minimal">Minimal</option>
                      <option value="medium">Medium</option>
                      <option value="full">Full</option>
                    </select>
                    <p className="text-sm text-gray-500 mt-1">
                      Controls the amount of animations displayed in the application
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Chart Style
                    </label>
                    <select
                      name="chartStyle"
                      value={formData.chartStyle || 'modern'}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="modern">Modern</option>
                      <option value="classic">Classic</option>
                      <option value="minimalist">Minimalist</option>
                      <option value="colorful">Colorful</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Dashboard Layout
                    </label>
                    <select
                      name="dashboardLayout"
                      value={formData.dashboardLayout || 'standard'}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="standard">Standard</option>
                      <option value="compact">Compact</option>
                      <option value="expanded">Expanded</option>
                      <option value="data-focused">Data-Focused</option>
                    </select>
                  </div>
                </div>
              )}
              
              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Notification Channels</h3>
                    
                    <div className="flex items-center justify-between">
                      <label htmlFor="notifications.email" className="text-sm">
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
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label htmlFor="notifications.push" className="text-sm">
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
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium">Notification Types</h3>
                    
                    <div className="flex items-center justify-between">
                      <label htmlFor="notifications.transactionAlerts" className="text-sm">
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
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label htmlFor="notifications.priceAlerts" className="text-sm">
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
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <label htmlFor="notifications.newsletterUpdates" className="text-sm">
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
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Data Sharing</h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor="dataSharing.anonymizedData" className="text-sm font-medium">
                          Share Anonymized Data
                        </label>
                        <p className="text-xs text-gray-500">
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
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor="dataSharing.portfolioData" className="text-sm font-medium">
                          Share Portfolio Data
                        </label>
                        <p className="text-xs text-gray-500">
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
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor="dataSharing.walletActivity" className="text-sm font-medium">
                          Share Wallet Activity
                        </label>
                        <p className="text-xs text-gray-500">
                          Share wallet activity data for better transaction suggestions
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          id="dataSharing.walletActivity"
                          name="dataSharing.walletActivity"
                          checked={formData.dataSharing?.walletActivity}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <Button
                      onClick={() => {/* Implement privacy policy modal */}}
                      variant="outline"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      View Privacy Policy
                    </Button>
                    
                    <Button
                      onClick={() => {/* Implement terms of service modal */}}
                      variant="outline"
                      className="ml-2 text-blue-600 border-blue-200 hover:bg-blue-50"
                    >
                      Terms of Service
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Advanced Settings */}
              {activeTab === 'advanced' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
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
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Multiplier applied to estimated gas costs (1.0-2.0)
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Network RPC URL (Advanced)
                    </label>
                    <input
                      type="text"
                      name="customRpcUrl"
                      value={formData.customRpcUrl || ''}
                      onChange={handleInputChange}
                      placeholder="https://fullnode.mainnet.aptoslabs.com/v1"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Custom Aptos RPC endpoint (leave empty for default)
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      API Request Timeout (seconds)
                    </label>
                    <input
                      type="number"
                      name="apiTimeout"
                      value={formData.apiTimeout || 30}
                      onChange={handleInputChange}
                      min="5"
                      max="120"
                      step="5"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div className="pt-6 border-t border-gray-200">
                    <Button
                      onClick={handleClearData}
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      Clear All Application Data
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">
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
  );
};

export default Settings;