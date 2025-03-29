// src/components/optimizer/OptimizerStatus.jsx
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import Button from '../common/Button';

/**
 * OptimizerStatus component
 * Displays the current status of the auto-optimizer
 */
const OptimizerStatus = ({ enabled, settings, metrics, strategy, loading, onRunNow, onToggle }) => {
  // Format time until next run
  const formatTimeUntil = (timestamp) => {
    if (!timestamp) return 'Not scheduled';
    
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      const now = Date.now();
      const diff = timestamp - now;
      
      if (diff <= 0) {
        return 'Imminent';
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      return `${hours}h ${minutes}m`;
    }
  };
  
  // Calculate the progress percentage until next run
  const calculateProgress = () => {
    if (!settings.lastRun || !settings.nextRun) return 0;
    
    const totalDuration = settings.nextRun - settings.lastRun;
    const elapsed = Date.now() - settings.lastRun;
    const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    
    return progress;
  };
  
  const progress = calculateProgress();
  
  return (
    <div className="bg-gray-750 rounded-lg p-4">
      {enabled ? (
        <>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium">Auto-Optimizer Active</h3>
              <p className="text-sm text-gray-400">
                Automatically optimizing your portfolio for maximum yield
              </p>
            </div>
            <div className="bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full text-sm flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse"></span>
              {loading ? 'Optimizing...' : 'Active'}
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Next optimization in:</span>
                <span className="text-white">{formatTimeUntil(settings.nextRun)}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Strategy:</span>
                <span className="text-white ml-2">{strategy?.name || 'Balanced Yield'}</span>
              </div>
              <div>
                <span className="text-gray-400">Expected APR:</span>
                <span className="text-green-400 ml-2">{strategy?.expectedAPR || '7.5'}%</span>
              </div>
              <div>
                <span className="text-gray-400">Rebalance Threshold:</span>
                <span className="text-white ml-2">{settings.rebalanceThreshold}%</span>
              </div>
              <div>
                <span className="text-gray-400">Check Interval:</span>
                <span className="text-white ml-2">{settings.interval} hours</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={onToggle}
                disabled={loading}
              >
                Disable Auto-Optimizer
              </Button>
              
              <Button
                variant="primary"
                size="sm"
                onClick={onRunNow}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Optimizing...
                  </span>
                ) : 'Optimize Now'}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <h3 className="font-medium mb-2">Auto-Optimizer Disabled</h3>
          <p className="text-gray-400 mb-4">
            Enable the auto-optimizer to automatically maintain optimal yield across market conditions.
          </p>
          <div className="flex justify-center space-x-3">
            <Button
              variant="outline"
              onClick={onRunNow}
              disabled={loading}
            >
              Run Once
            </Button>
            <Button
              variant="primary"
              onClick={onToggle}
              disabled={loading}
            >
              Enable Auto-Optimizer
            </Button>
          </div>
        </div>
      )}
      
      {/* Metrics summary */}
      {metrics && metrics.totalOptimizations > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Optimization History</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-400">Total Optimizations:</span>
              <span className="text-white ml-1">{metrics.totalOptimizations}</span>
            </div>
            <div>
              <span className="text-gray-400">Value Saved:</span>
              <span className="text-green-400 ml-1">${metrics.totalSaved?.toFixed(2) || '0.00'}</span>
            </div>
            <div>
              <span className="text-gray-400">Avg. APR Increase:</span>
              <span className="text-green-400 ml-1">{metrics.averageAPRIncrease?.toFixed(2) || '0.00'}%</span>
            </div>
            <div>
              <span className="text-gray-400">Last Run:</span>
              <span className="text-white ml-1">
                {settings.lastRun ? formatTimeUntil(settings.lastRun) : 'Never'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizerStatus;