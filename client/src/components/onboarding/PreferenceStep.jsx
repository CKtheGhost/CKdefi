// src/components/onboarding/PreferenceStep.jsx
import React from 'react';

const PreferenceStep = ({ preferences, updatePreferences }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updatePreferences({
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  return (
    <div>
      <p className="text-sm text-gray-500 mb-6">
        Set your investment preferences to personalize your experience
      </p>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="riskProfile" className="block text-sm font-medium text-gray-700">
            Risk Profile
          </label>
          <select
            id="riskProfile"
            name="riskProfile"
            value={preferences.riskProfile}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="conservative">Conservative</option>
            <option value="balanced">Balanced</option>
            <option value="aggressive">Aggressive</option>
          </select>
          <p className="mt-1 text-sm text-gray-500">
            {preferences.riskProfile === 'conservative' && 'Lower risk, stable returns'}
            {preferences.riskProfile === 'balanced' && 'Moderate risk and returns'}
            {preferences.riskProfile === 'aggressive' && 'Higher risk for maximum returns'}
          </p>
        </div>
        
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="autoRebalance"
              name="autoRebalance"
              type="checkbox"
              checked={preferences.autoRebalance}
              onChange={handleChange}
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="autoRebalance" className="font-medium text-gray-700">
              Enable Auto-Rebalancing
            </label>
            <p className="text-gray-500">
              Automatically rebalance your portfolio when it drifts from optimal allocation
            </p>
          </div>
        </div>
        
        {preferences.autoRebalance && (
          <div>
            <label htmlFor="rebalanceThreshold" className="block text-sm font-medium text-gray-700">
              Rebalance Threshold (%)
            </label>
            <select
              id="rebalanceThreshold"
              name="rebalanceThreshold"
              value={preferences.rebalanceThreshold}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="3">3% (More frequent rebalancing)</option>
              <option value="5">5% (Recommended)</option>
              <option value="10">10% (Less frequent rebalancing)</option>
            </select>
          </div>
        )}
        
        <div>
          <label htmlFor="theme" className="block text-sm font-medium text-gray-700">
            Theme
          </label>
          <select
            id="theme"
            name="theme"
            value={preferences.theme}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System default</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PreferenceStep;