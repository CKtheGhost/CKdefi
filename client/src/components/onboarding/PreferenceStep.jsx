// src/components/onboarding/PreferenceStep.jsx
import React, { useState } from 'react';
import { useNotification } from '../../context/NotificationContext';
import Button from '../common/Button';

/**
 * PreferenceStep component for onboarding flow
 * 
 * @param {Object} props Component props
 * @param {Object} props.preferences Current preferences
 * @param {Function} props.onChange Callback for preference changes
 * @param {Function} props.onComplete Function to complete setup
 * @param {Function} props.onBack Function to go back to previous step
 */
const PreferenceStep = ({ 
  preferences = {}, 
  onChange, 
  onComplete, 
  onBack 
}) => {
  // Default preferences
  const defaultPreferences = {
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
    },
    showAdvanced: false
  };
  
  // Combine with provided preferences
  const [prefs, setPrefs] = useState({ ...defaultPreferences, ...preferences });
  const [loading, setLoading] = useState(false);
  
  // Hooks
  const { showNotification } = useNotification();
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setPrefs(prev => {
      const newPrefs = { ...prev };
      
      if (name.includes('.')) {
        // Handle nested properties (e.g., notificationChannels.email)
        const [parent, child] = name.split('.');
        newPrefs[parent] = {
          ...newPrefs[parent],
          [child]: type === 'checkbox' ? checked : value
        };
      } else {
        // Handle regular properties
        newPrefs[name] = type === 'checkbox' ? checked : 
                         type === 'number' ? parseFloat(value) : value;
      }
      
      // Notify parent of changes
      if (onChange) {
        onChange(newPrefs);
      }
      
      return newPrefs;
    });
  };
  
  // Toggle advanced settings
  const toggleAdvanced = () => {
    setPrefs(prev => {
      const newPrefs = {
        ...prev,
        showAdvanced: !prev.showAdvanced
      };
      
      // Notify parent of changes
      if (onChange) {
        onChange(newPrefs);
      }
      
      return newPrefs;
    });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    setLoading(true);
    
    try {
      // In a real implementation, we might validate the preferences here
      
      // Notify parent of completion
      if (onComplete) {
        onComplete(prefs);
      }
    } catch (error) {
      console.error('Failed to save preferences:', error);
      showNotification(`Failed to save preferences: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Set Your Preferences</h2>
        <p className="text-gray-400">
          Customize your CompounDefi experience. You can change these settings later from your profile.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Risk Profile */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Risk Profile
          </label>
          <select
            name="riskProfile"
            value={prefs.riskProfile}
            onChange={handleInputChange}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="conservative">Conservative (Lower Risk)</option>
            <option value="balanced">Balanced (Moderate Risk)</option>
            <option value="aggressive">Aggressive (Higher Risk)</option>
            <option value="yield_optimizer">Yield Optimizer (Maximum APY)</option>
            <option value="stablecoin_yield">Stablecoin Yield (Low Volatility)</option>
          </select>
          <p className="mt-1 text-xs text-gray-500">
            This affects the strategies our AI will recommend to you
          </p>
        </div>
        
        {/* Notifications */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="notifications"
            name="notifications"
            checked={prefs.notifications}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 rounded border-gray-600 bg-gray-700 focus:ring-blue-500"
          />
          <label htmlFor="notifications" className="ml-2 block text-sm text-gray-300">
            Enable Notifications
          </label>
        </div>
        <p className="mt-1 text-xs text-gray-500 ml-6">
          Receive alerts for market changes, optimization opportunities, and transaction updates
        </p>
        
        {/* Auto-Rebalance */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="autoRebalance"
            name="autoRebalance"
            checked={prefs.autoRebalance}
            onChange={handleInputChange}
            className="h-4 w-4 text-blue-600 rounded border-gray-600 bg-gray-700 focus:ring-blue-500"
          />
          <label htmlFor="autoRebalance" className="ml-2 block text-sm text-gray-300">
            Enable Auto-Rebalancing
          </label>
        </div>
        <p className="mt-1 text-xs text-gray-500 ml-6">
          Automatically adjust your portfolio to maintain optimal yield as market conditions change
        </p>
        
        {/* Theme Preference */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Interface Theme
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => {
                setPrefs(prev => {
                  const newPrefs = { ...prev, darkMode: true };
                  if (onChange) onChange(newPrefs);
                  return newPrefs;
                });
              }}
              className={`flex items-center justify-center py-3 px-4 rounded-lg border text-center ${
                prefs.darkMode 
                  ? 'bg-gray-700 border-blue-500 text-white' 
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              Dark Mode
            </button>
            <button
              type="button"
              onClick={() => {
                setPrefs(prev => {
                  const newPrefs = { ...prev, darkMode: false };
                  if (onChange) onChange(newPrefs);
                  return newPrefs;
                });
              }}
              className={`flex items-center justify-center py-3 px-4 rounded-lg border text-center ${
                !prefs.darkMode 
                  ? 'bg-gray-700 border-blue-500 text-white' 
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Light Mode
            </button>
          </div>
        </div>
        
        {/* Advanced Settings Toggle */}
        <div className="pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-gray-300">Advanced Settings</h3>
            <button
              type="button"
              onClick={toggleAdvanced}
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
            >
              {prefs.showAdvanced ? 'Hide' : 'Show'}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 ml-1 transition-transform ${prefs.showAdvanced ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          
          {prefs.showAdvanced && (
            <div className="space-y-4 mt-4 bg-gray-750 p-4 rounded-lg">
              {/* Max Slippage */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Max Slippage (%)
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    name="maxSlippage"
                    min="0.1"
                    max="5"
                    step="0.1"
                    value={prefs.maxSlippage}
                    onChange={handleInputChange}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-2 w-12 text-center">
                    {prefs.maxSlippage}%
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Maximum acceptable slippage for transactions
                </p>
              </div>
              
              {/* Rebalance Threshold */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Rebalance Threshold (%)
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    name="rebalanceThreshold"
                    min="1"
                    max="10"
                    step="0.5"
                    value={prefs.rebalanceThreshold}
                    onChange={handleInputChange}
                    className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-2 w-12 text-center">
                    {prefs.rebalanceThreshold}%
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Minimum portfolio drift percentage to trigger auto-rebalancing
                </p>
              </div>
              
              {/* Preserve Staked Positions */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="preserveStakedPositions"
                  name="preserveStakedPositions"
                  checked={prefs.preserveStakedPositions}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 rounded border-gray-600 bg-gray-700 focus:ring-blue-500"
                />
                <label htmlFor="preserveStakedPositions" className="ml-2 block text-sm text-gray-300">
                  Preserve Staked Positions
                </label>
              </div>
              <p className="mt-1 text-xs text-gray-500 ml-6">
                When enabled, auto-optimizer will not unstake existing positions
              </p>
              
              {/* Email Notifications */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email for Notifications (Optional)
                </label>
                <input
                  type="email"
                  name="email"
                  value={prefs.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Leave empty to receive notifications only via connected social accounts
                </p>
              </div>
              
              <div className="pt-3 pb-1">
                <span className="text-sm font-medium text-gray-300">Notification Channels</span>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notificationChannels.email"
                      name="notificationChannels.email"
                      checked={prefs.notificationChannels?.email}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 rounded border-gray-600 bg-gray-700 focus:ring-blue-500"
                    />
                    <label htmlFor="notificationChannels.email" className="ml-2 block text-sm text-gray-300">
                      Email
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notificationChannels.push"
                      name="notificationChannels.push"
                      checked={prefs.notificationChannels?.push}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 rounded border-gray-600 bg-gray-700 focus:ring-blue-500"
                    />
                    <label htmlFor="notificationChannels.push" className="ml-2 block text-sm text-gray-300">
                      Push Notifications
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="notificationChannels.social"
                      name="notificationChannels.social"
                      checked={prefs.notificationChannels?.social}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blue-600 rounded border-gray-600 bg-gray-700 focus:ring-blue-500"
                    />
                    <label htmlFor="notificationChannels.social" className="ml-2 block text-sm text-gray-300">
                      Connected Social Accounts
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-gradient-to-r from-blue-900/20 to-green-900/20 border border-blue-800/30 rounded-lg p-4 mt-6">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p className="text-sm text-blue-300">
              Our AI will use these preferences to tailor your experience and investment strategies. You can adjust these settings at any time from your profile.
            </p>
          </div>
        </div>
        
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={loading}
          >
            Back
          </Button>
          
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Complete Setup'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PreferenceStep;