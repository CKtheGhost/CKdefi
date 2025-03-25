import React, { useState } from 'react';

/**
 * Third onboarding step - User preferences setup
 * 
 * @param {Object} props
 * @param {Function} props.onNext - Function to advance to next step
 * @param {Function} props.onSkip - Function to skip this step
 * @param {boolean} props.completed - Whether this step is completed
 */
const Preferences = ({ onNext, onSkip, completed }) => {
  const [preferences, setPreferences] = useState({
    riskProfile: 'balanced',
    notificationsEnabled: true,
    autoRebalance: false,
    theme: 'dark',
    newsFrequency: 'daily',
    autoExecute: false
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save preferences to local storage
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    
    // Apply theme preference
    document.documentElement.classList.toggle('dark-theme', preferences.theme === 'dark');
    document.documentElement.classList.toggle('light-theme', preferences.theme === 'light');
    
    onNext();
  };
  
  return (
    <div className="preferences-step">
      <h2 className="text-2xl font-bold text-white mb-6">Set Your Preferences</h2>
      
      <p className="text-gray-300 mb-6">
        Customize your CompounDefi experience to match your investment style and notification preferences.
        You can always change these settings later from the dashboard.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Risk Profile */}
          <div className="space-y-2">
            <label className="block text-white font-medium">Investment Risk Profile</label>
            <select
              name="riskProfile"
              value={preferences.riskProfile}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="conservative">Conservative (Low Risk)</option>
              <option value="balanced">Balanced (Medium Risk)</option>
              <option value="aggressive">Aggressive (High Risk)</option>
              <option value="yield_optimizer">Yield Optimizer (Advanced)</option>
            </select>
            <p className="text-gray-400 text-sm">
              This affects the strategies our AI will recommend for your portfolio.
            </p>
          </div>
          
          {/* Theme */}
          <div className="space-y-2">
            <label className="block text-white font-medium">Theme Preference</label>
            <select
              name="theme"
              value={preferences.theme}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="dark">Dark Theme</option>
              <option value="light">Light Theme</option>
              <option value="system">System Default</option>
            </select>
            <p className="text-gray-400 text-sm">
              Choose the visual theme for the application.
            </p>
          </div>
          
          {/* News Frequency */}
          <div className="space-y-2">
            <label className="block text-white font-medium">News Updates Frequency</label>
            <select
              name="newsFrequency"
              value={preferences.newsFrequency}
              onChange={handleChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="realtime">Real-time</option>
              <option value="daily">Daily Digest</option>
              <option value="weekly">Weekly Summary</option>
              <option value="disabled">Disabled</option>
            </select>
            <p className="text-gray-400 text-sm">
              How often you want to receive news and updates from Aptos ecosystem.
            </p>
          </div>
          
          {/* Toggle options */}
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notificationsEnabled"
                name="notificationsEnabled"
                checked={preferences.notificationsEnabled}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="notificationsEnabled" className="ml-2 text-white">
                Enable notifications
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoRebalance"
                name="autoRebalance"
                checked={preferences.autoRebalance}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="autoRebalance" className="ml-2 text-white">
                Enable auto-rebalancing
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoExecute"
                name="autoExecute"
                checked={preferences.autoExecute}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="autoExecute" className="ml-2 text-white">
                Enable automatic strategy execution
              </label>
            </div>
          </div>
        </div>
        
        {/* Risk profile explanation */}
        <div className="bg-gray-900/50 p-5 rounded-lg mb-8">
          <h3 className="text-lg font-medium text-white mb-2">Understanding Risk Profiles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-blue-400">Conservative</p>
              <p className="text-gray-400">Focuses on capital preservation with stable yields. Primarily recommends liquid staking and lower-risk lending protocols.</p>
            </div>
            <div>
              <p className="font-medium text-green-400">Balanced</p>
              <p className="text-gray-400">Moderate approach that balances risk and reward. Mixes staking, lending, and some AMM exposure.</p>
            </div>
            <div>
              <p className="font-medium text-yellow-400">Aggressive</p>
              <p className="text-gray-400">Prioritizes high yields with greater volatility. Includes AMMs, yield farming, and newer protocols.</p>
            </div>
            <div>
              <p className="font-medium text-purple-400">Yield Optimizer</p>
              <p className="text-gray-400">Advanced strategy leveraging yield aggregators and auto-compounding to maximize returns.</p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
          >
            Save Preferences & Continue
          </button>
        </div>
      </form>
    </div>
  );
};

export default Preferences;