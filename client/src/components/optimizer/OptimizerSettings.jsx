// src/components/optimizer/OptimizerSettings.jsx
import React, { useState, useEffect } from 'react';
import { useWalletContext } from '../../context/WalletContext';
import { useNotification } from '../../context/NotificationContext';
import { useTransactionContext } from '../../context/TransactionContext';
import Card from '../common/Card';
import Button from '../common/Button';

/**
 * Component for configuring auto-optimizer settings
 */
const OptimizerSettings = () => {
  // State for optimizer settings
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [interval, setInterval] = useState(24); // Hours
  const [rebalanceThreshold, setRebalanceThreshold] = useState(5); // Percentage
  const [maxSlippage, setMaxSlippage] = useState(1.0); // Percentage
  const [preserveStakedPositions, setPreserveStakedPositions] = useState(true);
  const [nextRun, setNextRun] = useState(null); // Timestamp for next run
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  
  // Get wallet, notification, and transaction context
  const { isConnected, portfolioData } = useWalletContext();
  const { showNotification } = useNotification();
  const { transactionHistory } = useTransactionContext();
  
  // Load optimizer settings from localStorage on mount
  useEffect(() => {
    const loadSettings = () => {
      const enabled = localStorage.getItem('autoOptimizeEnabled') === 'true';
      const storedSettings = localStorage.getItem('autoOptimizerSettings');
      const nextRun = localStorage.getItem('nextAutoOptimizeRun');
      
      setEnabled(enabled);
      
      if (nextRun) {
        setNextRun(parseInt(nextRun));
      }
      
      if (storedSettings) {
        try {
          const parsedSettings = JSON.parse(storedSettings);
          setInterval(parsedSettings.interval || 24);
          setRebalanceThreshold(parsedSettings.rebalanceThreshold || 5);
          setMaxSlippage(parsedSettings.maxSlippage || 1.0);
          setPreserveStakedPositions(parsedSettings.preserveStakedPositions !== undefined ? parsedSettings.preserveStakedPositions : true);
        } catch (error) {
          console.error('Failed to parse auto-optimizer settings:', error);
        }
      }
    };
    
    loadSettings();
  }, []);
  
  // Handle slider/input changes
  const handleChange = (setter) => (e) => {
    setter(parseFloat(e.target.value));
    setUnsavedChanges(true);
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (setter) => (e) => {
    setter(e.target.checked);
    setUnsavedChanges(true);
  };
  
  // Toggle auto-optimizer
  const toggleAutoOptimizer = async () => {
    if (!isConnected) {
      showNotification('Please connect your wallet to use the auto-optimizer', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      const newState = !enabled;
      
      // Save to localStorage
      localStorage.setItem('autoOptimizeEnabled', newState.toString());
      
      if (newState) {
        // Calculate next run time based on interval
        const nextRunTime = Date.now() + (interval * 60 * 60 * 1000);
        setNextRun(nextRunTime);
        localStorage.setItem('nextAutoOptimizeRun', nextRunTime.toString());
        
        // Show notification
        showNotification(`Auto-optimizer enabled. Next run in ${formatTimeUntil(nextRunTime)}.`, 'success');
      } else {
        // Clear next run time
        setNextRun(null);
        localStorage.removeItem('nextAutoOptimizeRun');
        
        // Show notification
        showNotification('Auto-optimizer disabled.', 'info');
      }
      
      setEnabled(newState);
    } catch (error) {
      console.error('Failed to toggle auto-optimizer:', error);
      showNotification(`Failed to toggle auto-optimizer: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Save settings
  const saveSettings = () => {
    setLoading(true);
    
    try {
      // Save settings to localStorage
      const settings = {
        interval,
        rebalanceThreshold,
        maxSlippage,
        preserveStakedPositions
      };
      
      localStorage.setItem('autoOptimizerSettings', JSON.stringify(settings));
      
      // If enabled, recalculate next run time
      if (enabled) {
        const nextRunTime = Date.now() + (interval * 60 * 60 * 1000);
        setNextRun(nextRunTime);
        localStorage.setItem('nextAutoOptimizeRun', nextRunTime.toString());
      }
      
      setUnsavedChanges(false);
      showNotification('Auto-optimizer settings saved successfully.', 'success');
    } catch (error) {
      console.error('Failed to save auto-optimizer settings:', error);
      showNotification(`Failed to save settings: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Reset settings to defaults
  const resetSettings = () => {
    setInterval(24);
    setRebalanceThreshold(5);
    setMaxSlippage(1.0);
    setPreserveStakedPositions(true);
    setUnsavedChanges(true);
  };
  
  // Force run the auto-optimizer
  const forceRun = async () => {
    if (!isConnected) {
      showNotification('Please connect your wallet to use the auto-optimizer', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real implementation, this would trigger the auto-optimizer
      // For demo purposes, we'll simulate a delay and success
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Calculate next run time based on interval
      const nextRunTime = Date.now() + (interval * 60 * 60 * 1000);
      setNextRun(nextRunTime);
      localStorage.setItem('nextAutoOptimizeRun', nextRunTime.toString());
      
      showNotification('Auto-optimizer executed successfully. Portfolio rebalanced for optimal yield.', 'success');
    } catch (error) {
      console.error('Failed to run auto-optimizer:', error);
      showNotification(`Failed to run auto-optimizer: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Format time until next run
  const formatTimeUntil = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const now = Date.now();
    const diff = timestamp - now;
    
    if (diff <= 0) return 'Imminent';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };
  
  // Get portfolio value and potential optimizations
  const portfolioValue = portfolioData?.totalValueUSD || 0;
  const hasStakedAssets = 
    (portfolioData?.stAPT && parseFloat(portfolioData.stAPT.amount) > 0) ||
    (portfolioData?.sthAPT && parseFloat(portfolioData.sthAPT.amount) > 0) ||
    (portfolioData?.tAPT && parseFloat(portfolioData.tAPT.amount) > 0) ||
    (portfolioData?.dAPT && parseFloat(portfolioData.dAPT.amount) > 0);
  
  // Current average APR (simplified calculation)
  const currentAvgApr = hasStakedAssets ? 7.5 : 0; // Would be calculated from actual portfolio data
  
  // Potential optimized APR (simplified for demo)
  const potentialApr = currentAvgApr + 2;
  
  // Recent optimizations
  const recentOptimizations = transactionHistory
    .filter(entry => entry.strategy && entry.strategy.includes('Auto-Optimizer'))
    .slice(0, 3);
  
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-gray-800 border border-gray-700">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Auto-Optimizer Settings</h2>
                <div className="flex items-center">
                  <span className="text-gray-400 mr-3">Status:</span>
                  <div className="flex items-center">
                    <span className={`flex h-3 w-3 relative mr-2 ${enabled ? 'bg-green-500' : 'bg-gray-500'} rounded-full`}>
                      {enabled && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      )}
                    </span>
                    <span className={enabled ? 'text-green-400' : 'text-gray-400'}>
                      {enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-400 mb-6">
                The auto-optimizer monitors your portfolio and market conditions to automatically rebalance your investments for optimal yield.
              </p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rebalance Interval (Hours)
                  </label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="1"
                      max="72"
                      step="1"
                      value={interval}
                      onChange={handleChange(setInterval)}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="ml-3 w-12 text-center">{interval}</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    How often the auto-optimizer will check your portfolio (1-72 hours)
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rebalance Threshold (%)
                  </label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="0.5"
                      max="10"
                      step="0.5"
                      value={rebalanceThreshold}
                      onChange={handleChange(setRebalanceThreshold)}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="ml-3 w-12 text-center">{rebalanceThreshold}%</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Minimum APR improvement required to trigger rebalancing
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Maximum Slippage (%)
                  </label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={maxSlippage}
                      onChange={handleChange(setMaxSlippage)}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="ml-3 w-12 text-center">{maxSlippage}%</span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Maximum allowed price slippage for transactions
                  </p>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="preserveStaked"
                    checked={preserveStakedPositions}
                    onChange={handleCheckboxChange(setPreserveStakedPositions)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                  />
                  <label htmlFor="preserveStaked" className="ml-2 block text-sm text-gray-300">
                    Preserve Staked Positions
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500 ml-6">
                  When enabled, auto-optimizer will not unstake existing positions
                </p>
                
                <div className="pt-6 border-t border-gray-700 flex justify-between">
                  <Button
                    variant="outline"
                    onClick={resetSettings}
                    disabled={loading}
                  >
                    Reset to Default
                  </Button>
                  
                  <div className="space-x-3">
                    {unsavedChanges && (
                      <Button
                        variant="primary"
                        onClick={saveSettings}
                        disabled={loading}
                      >
                        Save Settings
                      </Button>
                    )}
                    
                    <Button
                      variant={enabled ? 'danger' : 'primary'}
                      onClick={toggleAutoOptimizer}
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : enabled ? 'Disable Auto-Optimizer' : 'Enable Auto-Optimizer'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          
          {enabled && (
            <Card className="bg-gray-800 border border-gray-700 mt-6">
              <div className="p-6">
                <h2 className="text-xl font-bold text-white mb-4">Optimizer Status</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-750 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Next Run</h3>
                    <p className="text-xl font-semibold text-white">{formatTimeUntil(nextRun)}</p>
                  </div>
                  
                  <div className="bg-gray-750 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Current APR</h3>
                    <p className="text-xl font-semibold text-green-400">{currentAvgApr.toFixed(2)}%</p>
                  </div>
                  
                  <div className="bg-gray-750 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-gray-400 mb-1">Potential APR</h3>
                    <p className="text-xl font-semibold text-green-400">{potentialApr.toFixed(2)}%</p>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    onClick={forceRun}
                    disabled={loading}
                  >
                    {loading ? 'Running...' : 'Run Now'}
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
        
        <div>
          <Card className="bg-gray-800 border border-gray-700">
            <div className="p-6">
              <h2 className="text-lg font-bold text-white mb-4">Optimization Benefits</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <div className="bg-blue-900/30 p-2 rounded-full mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Maximize Yield</h3>
                    <p className="text-sm text-gray-400">
                      Automatically shifts your assets to the highest-yielding protocols based on real-time APR changes.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-900/30 p-2 rounded-full mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Save Time</h3>
                    <p className="text-sm text-gray-400">
                      No need to manually monitor rates and execute transactions. The optimizer handles everything automatically.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-900/30 p-2 rounded-full mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white">Risk Management</h3>
                    <p className="text-sm text-gray-400">
                      AI-driven risk assessment ensures your portfolio maintains your desired risk profile.
                    </p>
                  </div>
                </div>
              </div>
              
              {portfolioValue > 0 && (
                <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 mb-6">
                  <h3 className="font-medium text-blue-400 mb-2">Potential Annual Yield</h3>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-bold text-white">${(portfolioValue * potentialApr / 100).toFixed(2)}</span>
                    <span className="ml-2 text-sm text-blue-300">with Auto-Optimizer</span>
                  </div>
                  <div className="flex items-baseline mt-1">
                    <span className="text-lg font-medium text-gray-400">${(portfolioValue * currentAvgApr / 100).toFixed(2)}</span>
                    <span className="ml-2 text-sm text-gray-500">current yield</span>
                  </div>
                  <p className="mt-2 text-xs text-blue-300">
                    Based on your current portfolio value of ${portfolioValue.toFixed(2)}
                  </p>
                </div>
              )}
              
              {recentOptimizations.length > 0 && (
                <div>
                  <h3 className="font-medium text-white mb-3">Recent Optimizations</h3>
                  <div className="space-y-3">
                    {recentOptimizations.map((opt, index) => (
                      <div key={index} className="bg-gray-750 rounded-lg p-3 text-sm">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-white">Portfolio Rebalanced</span>
                          <span className="text-gray-500">{new Date(opt.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div className="text-gray-400">
                          {opt.transactions.length} transaction{opt.transactions.length !== 1 ? 's' : ''} executed
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OptimizerSettings;