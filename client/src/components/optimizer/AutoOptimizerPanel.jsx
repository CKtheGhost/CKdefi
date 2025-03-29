import React, { useState, useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { usePortfolio } from '../../hooks/usePortfolio';
import { useNotification } from '../../hooks/useNotification';
import OptimizerStatus from './OptimizerStatus';
import OptimizerSettings from './OptimizerSettings';
import PortfolioBalance from './PortfolioBalance';
import ExecutionHistory from './ExecutionHistory';

const AutoOptimizerPanel = () => {
  const { walletAddress, connected } = useWallet();
  const { portfolio, loading: portfolioLoading } = usePortfolio();
  const { showNotification } = useNotification();
  
  const [optimizerStatus, setOptimizerStatus] = useState({
    enabled: false,
    lastRebalanced: null,
    nextScheduled: null,
    monitoring: false
  });
  
  const [settings, setSettings] = useState({
    minRebalanceThreshold: 5, // 5% drift
    maxSlippage: 2.0, // 2% max slippage
    preserveStakedPositions: true,
    cooldownPeriod: 24 * 60 * 60 * 1000, // 24 hours
    autoExecute: true
  });
  
  const [rebalanceHistory, setRebalanceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch optimizer status when wallet is connected
  useEffect(() => {
    if (connected && walletAddress) {
      fetchOptimizerStatus();
      fetchRebalanceHistory();
    }
  }, [connected, walletAddress]);
  
  // Fetch optimizer status from API
  const fetchOptimizerStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/auto-rebalance/status?walletAddress=${walletAddress}`);
      const data = await response.json();
      
      if (response.ok) {
        setOptimizerStatus({
          enabled: data.monitoring || false,
          lastRebalanced: data.lastRebalanced || null,
          nextScheduled: data.nextCheck || null,
          monitoring: data.monitoring || false
        });
        
        // Also update settings if provided
        if (data.settings) {
          setSettings(prevSettings => ({
            ...prevSettings,
            ...data.settings
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching optimizer status:', error);
      showNotification('Failed to fetch optimizer status', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch rebalance history from API
  const fetchRebalanceHistory = async () => {
    try {
      const response = await fetch(`/api/auto-rebalance/history?walletAddress=${walletAddress}`);
      const data = await response.json();
      
      if (response.ok) {
        setRebalanceHistory(data.history || []);
      }
    } catch (error) {
      console.error('Error fetching rebalance history:', error);
    }
  };
  
  // Update optimizer settings
  const updateSettings = async (newSettings) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auto-rebalance/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress,
          ...newSettings
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSettings(prevSettings => ({
          ...prevSettings,
          ...newSettings
        }));
        showNotification('Settings updated successfully', 'success');
        
        // Refresh status if enabled/disabled
        if (newSettings.enabled !== undefined) {
          fetchOptimizerStatus();
        }
      } else {
        showNotification(data.error || 'Failed to update settings', 'error');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      showNotification('Failed to update settings', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Execute rebalance immediately
  const executeRebalance = async (force = false) => {
    try {
      setLoading(true);
      const response = await fetch('/api/auto-rebalance/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress,
          force
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showNotification('Rebalance initiated successfully', 'success');
        fetchOptimizerStatus();
        fetchRebalanceHistory();
      } else {
        showNotification(data.error || 'Failed to execute rebalance', 'error');
      }
    } catch (error) {
      console.error('Error executing rebalance:', error);
      showNotification('Failed to execute rebalance', 'error');
    } finally {
      setLoading(false);
    }
  };
  
  // Check if portfolio needs rebalancing
  const checkRebalanceNeeded = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/auto-rebalance/check?walletAddress=${walletAddress}`);
      const data = await response.json();
      
      if (response.ok) {
        return data.needsRebalancing;
      }
      return false;
    } catch (error) {
      console.error('Error checking rebalance status:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle auto-optimization
  const toggleAutoOptimization = async (enabled) => {
    await updateSettings({ enabled });
  };
  
  if (!connected) {
    return (
      <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-6 shadow-md">
        <h3 className="text-lg font-semibold mb-4">Auto-Optimizer</h3>
        <p className="text-gray-600 dark:text-gray-300">
          Please connect your wallet to use the Auto-Optimizer feature.
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <OptimizerStatus 
          status={optimizerStatus} 
          loading={loading} 
          onToggle={toggleAutoOptimization}
          onExecuteNow={executeRebalance}
          portfolio={portfolio}
        />
        
        <PortfolioBalance 
          portfolio={portfolio} 
          loading={portfolioLoading}
          checkRebalanceNeeded={checkRebalanceNeeded}
        />
        
        <ExecutionHistory history={rebalanceHistory} loading={loading} />
      </div>
      
      <div className="lg:col-span-1">
        <OptimizerSettings 
          settings={settings} 
          updateSettings={updateSettings}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default AutoOptimizerPanel;