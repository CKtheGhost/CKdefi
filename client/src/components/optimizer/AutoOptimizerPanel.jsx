import React, { useState, useEffect } from 'react';
import { Calendar, Clock, BarChart3, Settings, Activity, RefreshCw, AlertCircle } from 'lucide-react';
import { useWalletContext } from '../context/WalletContext';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';

const AutoOptimizerPanel = () => {
  const { walletAddress, isConnected } = useWalletContext();
  const { showNotification } = useNotification();
  
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    minRebalanceThreshold: 5,
    maxSlippage: 2.0,
    cooldownPeriod: 24,
    preserveStakedPositions: true,
    maxOperationsPerRebalance: 6
  });
  const [status, setStatus] = useState(null);
  const [history, setHistory] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  
  // Load initial state
  useEffect(() => {
    if (isConnected && walletAddress) {
      loadStatus();
      loadHistory();
    }
  }, [isConnected, walletAddress]);
  
  const loadStatus = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/api/auto-rebalance/status?walletAddress=${walletAddress}`);
      setIsEnabled(response.data.enabled);
      setStatus(response.data);
      
      // Also get settings
      const settingsResponse = await api.get(`/api/auto-rebalance/settings?walletAddress=${walletAddress}`);
      if (settingsResponse.data.settings) {
        setSettings(settingsResponse.data.settings);
      }
    } catch (error) {
      console.error('Failed to load auto-optimizer status:', error);
      showNotification('Failed to load auto-optimizer status', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadHistory = async () => {
    try {
      const response = await api.get(`/api/auto-rebalance/history?walletAddress=${walletAddress}`);
      setHistory(response.data);
    } catch (error) {
      console.error('Failed to load rebalance history:', error);
    }
  };
  
  const toggleAutoOptimize = async () => {
    try {
      setIsLoading(true);
      const response = await api.post('/api/auto-rebalance/settings', {
        walletAddress,
        enabled: !isEnabled
      });
      
      setIsEnabled(response.data.enabled);
      showNotification(
        response.data.enabled 
          ? 'Auto-optimization enabled successfully' 
          : 'Auto-optimization disabled',
        response.data.enabled ? 'success' : 'info'
      );
      
      loadStatus();
    } catch (error) {
      console.error('Failed to toggle auto-optimization:', error);
      showNotification('Failed to toggle auto-optimization', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const runManualRebalance = async () => {
    try {
      setIsLoading(true);
      showNotification('Executing portfolio rebalance...', 'info');
      
      const response = await api.post('/api/auto-rebalance/execute', {
        walletAddress,
        force: true
      });
      
      if (response.data.success) {
        showNotification('Portfolio rebalanced successfully!', 'success');
        loadHistory();
        loadStatus();
      } else {
        showNotification(response.data.message || 'Rebalance failed', 'error');
      }
    } catch (error) {
      console.error('Manual rebalance failed:', error);
      showNotification('Rebalance failed: ' + (error.response?.data?.message || error.message), 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const saveSettings = async () => {
    try {
      setIsLoading(true);
      const response = await api.post('/api/auto-rebalance/settings', {
        walletAddress,
        settings
      });
      
      setSettings(response.data.settings);
      setShowSettings(false);
      showNotification('Auto-optimizer settings saved', 'success');
    } catch (error) {
      console.error('Failed to save settings:', error);
      showNotification('Failed to save settings', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderStatus = () => {
    if (!status) return null;
    
    const formatTimeRemaining = (ms) => {
      if (!ms) return 'N/A';
      const hours = Math.floor(ms / (60 * 60 * 1000));
      const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
      return `${hours}h ${minutes}m`;
    };
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Auto-Optimizer Status</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${isEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isEnabled ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        {isEnabled && status.nextRun && (
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 mr-2 text-blue-500" />
              <span className="text-gray-600">Next optimization in:</span>
              <span className="ml-2 font-medium">{formatTimeRemaining(status.timeRemaining)}</span>
            </div>
            
            {status.driftAnalysis && (
              <div className="flex items-center text-sm">
                <Activity className="w-4 h-4 mr-2 text-blue-500" />
                <span className="text-gray-600">Current drift:</span>
                <span className={`ml-2 font-medium ${status.driftAnalysis.maxDrift >= settings.minRebalanceThreshold ? 'text-yellow-600' : 'text-green-600'}`}>
                  {status.driftAnalysis.maxDrift.toFixed(2)}%
                </span>
              </div>
            )}
            
            {status.driftAnalysis && status.driftAnalysis.maxDrift >= settings.minRebalanceThreshold && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800">
                <div className="flex items-start">
                  <AlertCircle className="w-4 h-4 mt-0.5 mr-2 text-yellow-500" />
                  <div>
                    <p className="font-medium">Portfolio drift detected</p>
                    <p className="text-yellow-700 text-xs mt-1">
                      Your portfolio has drifted {status.driftAnalysis.maxDrift.toFixed(2)}% from optimal allocation. Scheduled optimization will address this soon.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="flex space-x-2 mt-4">
          <button 
            onClick={toggleAutoOptimize}
            disabled={isLoading}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              isEnabled 
              ? 'bg-red-100 text-red-700 hover:bg-red-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Settings className="w-4 h-4 mr-2" />
            )}
            {isEnabled ? 'Disable Auto-Optimize' : 'Enable Auto-Optimize'}
          </button>
          
          <button 
            onClick={runManualRebalance}
            disabled={isLoading}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
          >
            {isLoading ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Activity className="w-4 h-4 mr-2" />
            )}
            Rebalance Now
          </button>
        </div>
      </div>
    );
  };
  
  const renderSettings = () => {
    if (!showSettings) {
      return (
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Optimizer Settings</h3>
            <button 
              onClick={() => setShowSettings(true)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Edit Settings
            </button>
          </div>
          
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-xs text-gray-500">Rebalance Threshold</p>
              <p className="font-medium">{settings.minRebalanceThreshold}%</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-xs text-gray-500">Max Slippage</p>
              <p className="font-medium">{settings.maxSlippage}%</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-xs text-gray-500">Cooldown Period</p>
              <p className="font-medium">{settings.cooldownPeriod} hours</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-xs text-gray-500">Preserve Staked Positions</p>
              <p className="font-medium">{settings.preserveStakedPositions ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3">Edit Optimizer Settings</h3>
        
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rebalance Threshold (%)
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={settings.minRebalanceThreshold}
              onChange={(e) => setSettings({...settings, minRebalanceThreshold: Number(e.target.value)})}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum portfolio drift to trigger rebalancing</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Slippage (%)
            </label>
            <input
              type="number"
              min="0.1"
              max="5"
              step="0.1"
              value={settings.maxSlippage}
              onChange={(e) => setSettings({...settings, maxSlippage: Number(e.target.value)})}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">Maximum acceptable slippage for transactions</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cooldown Period (hours)
            </label>
            <input
              type="number"
              min="1"
              max="168"
              value={settings.cooldownPeriod}
              onChange={(e) => setSettings({...settings, cooldownPeriod: Number(e.target.value)})}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum time between rebalances</p>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="preserveStakedPositions"
              checked={settings.preserveStakedPositions}
              onChange={(e) => setSettings({...settings, preserveStakedPositions: e.target.checked})}
              className="h-4 w-4 text-blue-600 rounded"
            />
            <label htmlFor="preserveStakedPositions" className="ml-2 block text-sm text-gray-700">
              Preserve staked positions
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Operations Per Rebalance
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={settings.maxOperationsPerRebalance}
              onChange={(e) => setSettings({...settings, maxOperationsPerRebalance: Number(e.target.value)})}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">Maximum number of operations in a single rebalance</p>
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <button 
              onClick={() => setShowSettings(false)}
              className="px-3 py-2 text-gray-700 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={saveSettings}
              disabled={isLoading}
              className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              {isLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  const renderHistory = () => {
    if (history.length === 0) {
      return (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold mb-3">Rebalance History</h3>
          <p className="text-sm text-gray-500 text-center py-6">No rebalance history yet</p>
        </div>
      );
    }
    
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold mb-3">Rebalance History</h3>
        
        <div className="space-y-3">
          {history.map((entry, index) => (
            <div key={index} className="border-b border-gray-100 pb-3 last:border-none last:pb-0">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {new Date(entry.timestamp).toLocaleString()}
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  entry.success 
                    ? 'bg-green-100 text-green-800' 
                    : entry.type === 'check' 
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-red-100 text-red-800'
                }`}>
                  {entry.success ? 'Success' : entry.type === 'check' ? 'Check' : 'Failed'}
                </span>
              </div>
              
              <p className="text-sm">
                {entry.message || (entry.type === 'check' 
                  ? 'Portfolio analysis performed' 
                  : entry.success 
                    ? `Rebalanced ${entry.operations || 0} positions successfully` 
                    : entry.error || 'Rebalance operation failed'
                )}
              </p>
              
              {entry.driftPercentage !== undefined && (
                <div className="flex items-center mt-1">
                  <BarChart3 className="w-3 h-3 mr-1 text-gray-500" />
                  <span className="text-xs text-gray-500">
                    Drift: {entry.driftPercentage.toFixed(2)}%
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold mb-2">Wallet Connection Required</h3>
        <p className="text-gray-600 mb-4">Please connect your wallet to use the Auto-Optimizer</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {renderStatus()}
      {renderSettings()}
      {renderHistory()}
      
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
          <div>
            <h4 className="font-medium text-blue-800 mb-1">About Auto-Optimizer</h4>
            <p className="text-sm text-blue-700">
              The Auto-Optimizer uses AI to monitor your portfolio and rebalance it according to the latest market conditions and yield opportunities. Set your preferences above and let CompounDefi maintain your optimal allocation automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoOptimizerPanel;