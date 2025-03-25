import React from 'react';
import { formatDistanceToNow } from 'date-fns';

/**
 * Displays the status of the auto-optimizer and allows enabling/disabling
 * 
 * @param {Object} props
 * @param {boolean} props.enabled - Whether auto-optimization is enabled
 * @param {Function} props.onToggle - Function to toggle auto-optimization
 * @param {number|string} props.nextRun - Timestamp for next scheduled run
 * @param {Function} props.onExecuteNow - Function to execute optimization immediately
 * @param {boolean} props.isRebalancing - Whether rebalancing is currently in progress
 */
const OptimizerStatus = ({ enabled, onToggle, nextRun, onExecuteNow, isRebalancing }) => {
  // Format next run time for display
  const formatNextRun = () => {
    if (!nextRun) return 'Not scheduled';
    
    try {
      if (typeof nextRun === 'string') {
        return formatDistanceToNow(new Date(nextRun), { addSuffix: true });
      } else {
        return formatDistanceToNow(new Date(nextRun), { addSuffix: true });
      }
    } catch (error) {
      console.error('Error formatting next run time:', error);
      return 'Unknown';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Auto-Optimizer Status</h2>
        <div className="flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full mr-2 ${enabled ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span className="text-gray-300">{enabled ? 'Enabled' : 'Disabled'}</span>
        </div>
      </div>
      
      <div className="mb-6">
        <p className="text-gray-400 mb-2">
          The auto-optimizer will automatically rebalance your portfolio to maintain optimal yield based on market conditions and your risk preferences.
        </p>
        
        {enabled && nextRun && (
          <div className="bg-gray-700 rounded p-3 flex justify-between items-center">
            <div>
              <span className="text-gray-400 text-sm">Next scheduled run:</span>
              <div className="text-white font-medium">{formatNextRun()}</div>
            </div>
            <button 
              onClick={onExecuteNow} 
              disabled={isRebalancing}
              className={`px-3 py-1 rounded text-sm ${isRebalancing 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'}`}>
              {isRebalancing ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Optimizing...
                </span>
              ) : 'Run Now'}
            </button>
          </div>
        )}
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={onToggle}
          disabled={isRebalancing}
          className={`px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 ${
            isRebalancing ? 'bg-gray-600 cursor-not-allowed' : 
            enabled ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {enabled ? 'Disable Auto-Optimizer' : 'Enable Auto-Optimizer'}
        </button>
      </div>
    </div>
  );
};

export default OptimizerStatus;