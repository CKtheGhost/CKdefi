import React, { useState } from 'react';
import { Switch } from '@headlessui/react';
import { AlertCircleIcon, InfoIcon } from 'lucide-react';

const OptimizerSettings = ({ settings, updateSettings, loading }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [isEditing, setIsEditing] = useState(false);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setLocalSettings({
      ...localSettings,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    });
  };
  
  // Handle toggle changes
  const handleToggle = (name, value) => {
    setLocalSettings({
      ...localSettings,
      [name]: value
    });
  };
  
  // Save settings
  const saveSettings = async () => {
    await updateSettings(localSettings);
    setIsEditing(false);
  };
  
  // Convert hours to milliseconds
  const hoursToMs = (hours) => hours * 60 * 60 * 1000;
  
  // Convert milliseconds to hours
  const msToHours = (ms) => ms / (60 * 60 * 1000);
  
  // Handle cooldown period change (convert hours to ms internally)
  const handleCooldownChange = (e) => {
    const hours = parseFloat(e.target.value);
    setLocalSettings({
      ...localSettings,
      cooldownPeriod: hoursToMs(hours)
    });
  };
  
  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Optimizer Settings</h3>
        {isEditing ? (
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md dark:border-gray-600 dark:text-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={saveSettings}
              disabled={loading}
              className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-md"
          >
            Edit
          </button>
        )}
      </div>
      
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Minimum Rebalance Threshold (%)
            </label>
            {isEditing ? (
              <input
                type="number"
                name="minRebalanceThreshold"
                value={localSettings.minRebalanceThreshold}
                onChange={handleChange}
                min={1}
                max={20}
                step={0.5}
                className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
            ) : (
              <div className="text-gray-900 dark:text-gray-100">
                {localSettings.minRebalanceThreshold}%
              </div>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Portfolio will rebalance when drift exceeds this percentage
            </p>
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Maximum Slippage Tolerance (%)
            </label>
            {isEditing ? (
              <input
                type="number"
                name="maxSlippage"
                value={localSettings.maxSlippage}
                onChange={handleChange}
                min={0.1}
                max={5}
                step={0.1}
                className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
            ) : (
              <div className="text-gray-900 dark:text-gray-100">
                {localSettings.maxSlippage}%
              </div>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Maximum allowed price impact when executing transactions
            </p>
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rebalance Cooldown Period (hours)
            </label>
            {isEditing ? (
              <input
                type="number"
                name="cooldownPeriod"
                value={msToHours(localSettings.cooldownPeriod)}
                onChange={handleCooldownChange}
                min={1}
                max={168} // 1 week max
                step={1}
                className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              />
            ) : (
              <div className="text-gray-900 dark:text-gray-100">
                {msToHours(localSettings.cooldownPeriod)} hours
              </div>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Minimum time between rebalance operations
            </p>
          </div>
        </div>
        
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Preserve Staked Positions
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Avoid unstaking existing positions during rebalancing
              </p>
            </div>
            <Switch
              checked={localSettings.preserveStakedPositions}
              onChange={(checked) => handleToggle('preserveStakedPositions', checked)}
              disabled={!isEditing || loading}
              className={`${
                localSettings.preserveStakedPositions ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  localSettings.preserveStakedPositions ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Auto-Execute Transactions
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Automatically execute transactions without confirmation
              </p>
            </div>
            <Switch
              checked={localSettings.autoExecute}
              onChange={(checked) => handleToggle('autoExecute', checked)}
              disabled={!isEditing || loading}
              className={`${
                localSettings.autoExecute ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
              } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              <span
                className={`${
                  localSettings.autoExecute ? 'translate-x-6' : 'translate-x-1'
                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
              />
            </Switch>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-md flex items-start">
          <AlertCircleIcon className="h-5 w-5 text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Important Note</h4>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
              Auto-optimization will use your wallet for gas fees and transactions. Make sure you have enough APT for gas and transaction fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizerSettings;