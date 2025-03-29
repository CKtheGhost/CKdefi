import React from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { Switch } from '@headlessui/react';
import { ClockIcon, RefreshCwIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';

const OptimizerStatus = ({ status, loading, onToggle, onExecuteNow, portfolio }) => {
  const { enabled, lastRebalanced, nextScheduled, monitoring } = status;
  
  // Calculate drift if portfolio data is available
  const calculateDrift = () => {
    if (!portfolio || !portfolio.totalValueUSD) return null;
    
    // This is a simplified calculation
    // In a real implementation, you would compare current allocation to target allocation
    // and calculate the maximum percentage difference
    return {
      maxDrift: 4.8, // Example value, replace with actual calculation
      avgDrift: 2.3, // Example value, replace with actual calculation
      needsRebalancing: 4.8 > 5 ? false : true // Compare with threshold
    };
  };
  
  const drift = calculateDrift();
  
  return (
    <div className="rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Auto-Optimizer Status</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {enabled ? 'Enabled' : 'Disabled'}
          </span>
          <Switch
            checked={enabled}
            onChange={() => onToggle(!enabled)}
            disabled={loading}
            className={`${
              enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
          >
            <span
              className={`${
                enabled ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </Switch>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-1">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>Last Rebalanced</span>
          </div>
          <div className="font-medium">
            {lastRebalanced ? (
              <>
                <div>{format(new Date(lastRebalanced), 'MMM d, yyyy')}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(lastRebalanced), { addSuffix: true })}
                </div>
              </>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">Never</span>
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-1">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>Next Scheduled Check</span>
          </div>
          <div className="font-medium">
            {monitoring && nextScheduled ? (
              <>
                <div>{format(new Date(nextScheduled), 'MMM d, yyyy h:mm a')}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(nextScheduled), { addSuffix: true })}
                </div>
              </>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">Not scheduled</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Portfolio Drift</div>
          {drift && (
            <div className={`rounded-full px-2 py-1 text-xs font-medium ${
              drift.needsRebalancing 
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            }`}>
              {drift.needsRebalancing ? 'Rebalance Needed' : 'Balanced'}
            </div>
          )}
        </div>
        
        {drift ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Maximum Drift</div>
              <div className="text-2xl font-semibold">{drift.maxDrift.toFixed(1)}%</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Average Drift</div>
              <div className="text-2xl font-semibold">{drift.avgDrift.toFixed(1)}%</div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Connect your wallet to view portfolio drift metrics
          </div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => onExecuteNow(false)}
          disabled={loading}
          className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCwIcon className="h-4 w-4 mr-2" />
          Rebalance Now
        </button>
        
        <button
          onClick={() => onExecuteNow(true)}
          disabled={loading}
          className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCwIcon className="h-4 w-4 mr-2" />
          Force Rebalance
        </button>
        
        <button
          disabled={loading}
          className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Check Status
        </button>
      </div>
    </div>
  );
};

export default OptimizerStatus;