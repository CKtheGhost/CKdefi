import React, { useState } from 'react';

/**
 * Component for configuring auto-optimizer settings
 * 
 * @param {Object} props
 * @param {Object} props.settings - Current optimizer settings
 * @param {Function} props.onSave - Function to save settings changes
 * @param {boolean} props.disabled - Whether the form should be disabled
 */
const OptimizerSettings = ({ settings, onSave, disabled = false }) => {
  const [formData, setFormData] = useState({
    interval: settings?.interval || 24,
    rebalanceThreshold: settings?.rebalanceThreshold || 5,
    maxSlippage: settings?.maxSlippage || 1,
    preserveStakedPositions: settings?.preserveStakedPositions !== undefined ? settings.preserveStakedPositions : true
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseFloat(value) : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setIsEditing(false);
  };
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Optimizer Settings</h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            disabled={disabled}
            className={`text-sm px-3 py-1 rounded ${disabled ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            Edit Settings
          </button>
        )}
      </div>
      
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Rebalance Interval (hours)
              </label>
              <input
                type="number"
                name="interval"
                value={formData.interval}
                onChange={handleChange}
                min="1"
                max="168"
                step="1"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={disabled}
              />
              <p className="text-gray-500 text-xs mt-1">
                How often the auto-optimizer will check and rebalance your portfolio (1-168 hours)
              </p>
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Rebalance Threshold (%)
              </label>
              <input
                type="number"
                name="rebalanceThreshold"
                value={formData.rebalanceThreshold}
                onChange={handleChange}
                min="0.5"
                max="20"
                step="0.5"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={disabled}
              />
              <p className="text-gray-500 text-xs mt-1">
                Minimum percentage drift before rebalancing is triggered (0.5-20%)
              </p>
            </div>
            
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1">
                Max Slippage (%)
              </label>
              <input
                type="number"
                name="maxSlippage"
                value={formData.maxSlippage}
                onChange={handleChange}
                min="0.1"
                max="5"
                step="0.1"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={disabled}
              />
              <p className="text-gray-500 text-xs mt-1">
                Maximum allowed slippage for transactions (0.1-5%)
              </p>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                name="preserveStakedPositions"
                id="preserveStakedPositions"
                checked={formData.preserveStakedPositions}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                disabled={disabled}
              />
              <label htmlFor="preserveStakedPositions" className="ml-2 block text-gray-300 text-sm">
                Preserve staked positions (avoid unstaking if possible)
              </label>
            </div>
            
            <div className="flex justify-end space-x-3 pt-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-white"
                disabled={disabled}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 rounded-md text-white ${disabled ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                disabled={disabled}
              >
                Save Settings
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-700">
            <span className="text-gray-400">Rebalance interval:</span>
            <span className="text-white font-medium">{settings?.interval || 24} hours</span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-gray-700">
            <span className="text-gray-400">Rebalance threshold:</span>
            <span className="text-white font-medium">{settings?.rebalanceThreshold || 5}%</span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-gray-700">
            <span className="text-gray-400">Max slippage:</span>
            <span className="text-white font-medium">{settings?.maxSlippage || 1}%</span>
          </div>
          
          <div className="flex justify-between py-2">
            <span className="text-gray-400">Preserve staked positions:</span>
            <span className="text-white font-medium">{settings?.preserveStakedPositions ? 'Yes' : 'No'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizerSettings;