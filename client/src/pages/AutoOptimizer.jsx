import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '../../context/WalletContext';
import { useData } from '../../context/DataContext';
import { useNotification } from '../../context/NotificationContext';
import OptimizerStatus from './OptimizerStatus';
import OptimizerSettings from './OptimizerSettings';
import ExecutionHistory from './ExecutionHistory';
import PortfolioBalance from './PortfolioBalance';
import WalletConnect from '../common/WalletConnect';

const AutoOptimizer = () => {
  const { walletConnected, walletAddress, connectWallet } = useWallet();
  const { portfolioData, stakingData, fetchWalletData } = useData();
  const { showNotification } = useNotification();
  
  const [enabled, setEnabled] = useState(false);
  const [settings, setSettings] = useState({
    interval: 24, // hours
    rebalanceThreshold: 5, // percent
    maxSlippage: 1, // percent
    preserveStakedPositions: true
  });
  const [nextRun, setNextRun] = useState(null);
  const [history, setHistory] = useState([]);
  const [rebalancing, setRebalancing] = useState(false);

  // Load settings on component mount
  useEffect(() => {
    const loadOptimizer = async () => {
      try {
        // Try to load from localStorage
        const storedEnabled = localStorage.getItem('autoOptimizeEnabled') === 'true';
        setEnabled(storedEnabled);
        
        const storedInterval = parseInt(localStorage.getItem('autoOptimizeInterval')) || 24 * 60 * 60 * 1000;
        const storedThreshold = parseFloat(localStorage.getItem('rebalanceThreshold')) || 5;
        const storedSlippage = parseFloat(localStorage.getItem('maxSlippage')) || 1;
        const storedPreserve = localStorage.getItem('preserveStakedPositions') === 'true';
        
        setSettings({
          interval: storedInterval / (60 * 60 * 1000), // Convert ms to hours
          rebalanceThreshold: storedThreshold,
          maxSlippage: storedSlippage,
          preserveStakedPositions: storedPreserve
        });
        
        // Parse next run time
        const nextRunTime = parseInt(localStorage.getItem('nextAutoOptimizeRun')) || 0;
        if (nextRunTime > Date.now()) {
          setNextRun(nextRunTime);
        } else if (storedEnabled) {
          // If enabled but no valid next run time, set it for interval from now
          const newNextRun = Date.now() + storedInterval;
          setNextRun(newNextRun);
          localStorage.setItem('nextAutoOptimizeRun', newNextRun.toString());
        }
        
        // Load history from localStorage
        const savedHistory = localStorage.getItem('autoRebalanceHistory');
        if (savedHistory) {
          try {
            setHistory(JSON.parse(savedHistory));
          } catch (e) {
            console.error('Error parsing rebalance history:', e);
          }
        }
      } catch (error) {
        console.error('Failed to load auto-optimizer settings:', error);
        showNotification('Failed to load optimizer settings', 'error');
      }
    };
    
    loadOptimizer();
    
    // Set up interval to check for auto-optimization
    const checkInterval = setInterval(() => {
      if (enabled && nextRun && Date.now() >= nextRun) {
        executeRebalance();
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(checkInterval);
  }, [enabled, nextRun]);

  // Format the next run time for display and update it every minute
  useEffect(() => {
    const updateInterval = setInterval(() => {
      // Just trigger a re-render to update the formatted time
      setNextRun(oldNextRun => oldNextRun);
    }, 60000); // Every minute
    
    return () => clearInterval(updateInterval);
  }, []);

  const toggleAutoOptimize = useCallback(() => {
    try {
      const newEnabled = !enabled;
      setEnabled(newEnabled);
      localStorage.setItem('autoOptimizeEnabled', newEnabled.toString());
      
      if (newEnabled) {
        // Calculate next run time
        const intervalMs = settings.interval * 60 * 60 * 1000;
        const newNextRun = Date.now() + intervalMs;
        setNextRun(newNextRun);
        localStorage.setItem('nextAutoOptimizeRun', newNextRun.toString());
        
        showNotification('Auto-optimization enabled. Next run scheduled.', 'success');
      } else {
        setNextRun(null);
        localStorage.removeItem('nextAutoOptimizeRun');
        
        showNotification('Auto-optimization disabled', 'info');
      }
    } catch (error) {
      console.error('Failed to toggle auto-optimizer:', error);
      showNotification('Failed to toggle auto-optimizer', 'error');
    }
  }, [enabled, settings.interval, showNotification]);

  const saveSettings = useCallback((newSettings) => {
    try {
      setSettings(newSettings);
      
      // Save to localStorage
      localStorage.setItem('rebalanceThreshold', newSettings.rebalanceThreshold.toString());
      localStorage.setItem('maxSlippage', newSettings.maxSlippage.toString());
      localStorage.setItem('preserveStakedPositions', newSettings.preserveStakedPositions.toString());
      localStorage.setItem('autoOptimizeInterval', (newSettings.interval * 60 * 60 * 1000).toString());
      
      // Recalculate next run time if enabled
      if (enabled) {
        const intervalMs = newSettings.interval * 60 * 60 * 1000;
        const lastRun = parseInt(localStorage.getItem('lastAutoOptimizeRun')) || Date.now();
        const newNextRun = Math.max(lastRun + intervalMs, Date.now() + 60000);
        
        setNextRun(newNextRun);
        localStorage.setItem('nextAutoOptimizeRun', newNextRun.toString());
      }
      
      showNotification('Settings saved successfully', 'success');
    } catch (error) {
      console.error('Failed to save settings:', error);
      showNotification('Failed to save settings', 'error');
    }
  }, [enabled, showNotification]);

  const executeRebalance = useCallback(async () => {
    if (rebalancing) return;
    
    if (!walletConnected) {
      showNotification('Please connect your wallet first', 'error');
      return;
    }
    
    setRebalancing(true);
    showNotification('Starting portfolio rebalance...', 'info');
    
    try {
      // API endpoint to execute auto-rebalance
      const response = await fetch('/api/auto-rebalance/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress, force: true })
      });
      
      const result = await response.json();
      
      // Update localStorage
      localStorage.setItem('lastAutoOptimizeRun', Date.now().toString());
      
      // Calculate next run time
      if (enabled) {
        const intervalMs = settings.interval * 60 * 60 * 1000;
        const newNextRun = Date.now() + intervalMs;
        setNextRun(newNextRun);
        localStorage.setItem('nextAutoOptimizeRun', newNextRun.toString());
      }
      
      // Add to history
      const historyEntry = {
        date: new Date().toISOString(),
        action: 'rebalanced',
        success: result.success,
        operations: result.operations?.length || 0,
        successfulOperations: result.successfulOperations || 0,
        failedOperations: result.failedOperations || 0
      };
      
      const updatedHistory = [historyEntry, ...history.slice(0, 9)]; // Keep last 10
      setHistory(updatedHistory);
      localStorage.setItem('autoRebalanceHistory', JSON.stringify(updatedHistory));
      
      // Show notification based on result
      if (result.success) {
        showNotification(
          `Rebalance completed: ${result.successfulOperations || 0} operations successful`,
          'success'
        );
      } else {
        showNotification(
          `Rebalance completed with issues: ${result.failedOperations || 0} operations failed`,
          'warning'
        );
      }
      
      // Refresh wallet data
      setTimeout(() => fetchWalletData(), 2000);
      
      return result;
    } catch (error) {
      console.error('Rebalance execution error:', error);
      showNotification(`Rebalance failed: ${error.message}`, 'error');
      
      // Add failure to history
      const historyEntry = {
        date: new Date().toISOString(),
        action: 'rebalanced',
        success: false,
        operations: 0,
        successfulOperations: 0,
        failedOperations: 0,
        error: error.message
      };
      
      const updatedHistory = [historyEntry, ...history.slice(0, 9)];
      setHistory(updatedHistory);
      localStorage.setItem('autoRebalanceHistory', JSON.stringify(updatedHistory));
      
      return { success: false, error: error.message };
    } finally {
      setRebalancing(false);
    }
  }, [walletConnected, walletAddress, enabled, settings.interval, history, showNotification, fetchWalletData, rebalancing]);

  if (!walletConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Auto-Optimizer</h1>
        <p className="text-gray-400 mb-6 text-center max-w-md">
          Connect your wallet to enable AI-powered automatic portfolio optimization
        </p>
        <WalletConnect onConnect={connectWallet} />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Auto-Optimizer</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <OptimizerStatus
            enabled={enabled}
            onToggle={toggleAutoOptimize}
            nextRun={nextRun}
            onExecuteNow={executeRebalance}
            isRebalancing={rebalancing}
          />
          
          <PortfolioBalance 
            portfolioData={portfolioData}
            stakingData={stakingData}
          />
          
          <OptimizerSettings 
            settings={settings}
            onSave={saveSettings}
            disabled={rebalancing}
          />
        </div>
        
        <div>
          <ExecutionHistory history={history} />
        </div>
      </div>
    </div>
  );
};

export default AutoOptimizer;