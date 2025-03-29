// src/pages/AutoOptimizer.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useWalletContext } from '../context/WalletContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import OptimizerStatus from '../components/optimizer/OptimizerStatus';
import OptimizerSettings from '../components/optimizer/OptimizerSettings';
import PortfolioBalance from '../components/optimizer/PortfolioBalance';
import ExecutionHistory from '../components/optimizer/ExecutionHistory';
import Card from '../components/common/Card';
import { CardHeader, CardTitle, CardDescription, CardContent } from '../components/common/Card';
import Button from '../components/common/Button';
import usePortfolio from '../hooks/usePortfolio';
import { useNotification } from '../context/NotificationContext';
import api from '../services/api';

const AutoOptimizer = () => {
  const { connected, address } = useWalletContext();
  const { portfolio, fetchPortfolioData, loading: portfolioLoading } = usePortfolio();
  const { showNotification } = useNotification();

  const [isEnabled, setIsEnabled] = useState(false);
  const [nextRunTime, setNextRunTime] = useState(null);
  const [lastRunTime, setLastRunTime] = useState(null);
  const [history, setHistory] = useState([]);
  const [settings, setSettings] = useState({
    interval: 24, // hours
    rebalanceThreshold: 5, // percentage drift
    maxSlippage: 1, // percentage
    preserveStakedPositions: true
  });
  const [isRebalancing, setIsRebalancing] = useState(false);
  const [statusInfo, setStatusInfo] = useState(null);
  const [optimizationMetrics, setOptimizationMetrics] = useState(null);

  // Load settings from localStorage
  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = localStorage.getItem('autoOptimizerSettings');
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings(prev => ({ ...prev, ...parsedSettings }));
        } catch (error) {
          console.error('Failed to parse saved settings:', error);
        }
      }

      // Load state from localStorage
      const isEnabledSaved = localStorage.getItem('autoOptimizeEnabled') === 'true';
      setIsEnabled(isEnabledSaved);

      const lastRun = localStorage.getItem('lastAutoOptimizeRun');
      if (lastRun) {
        setLastRunTime(parseInt(lastRun));
      }

      const nextRun = localStorage.getItem('nextAutoOptimizeRun');
      if (nextRun) {
        setNextRunTime(parseInt(nextRun));
      }

      // Load history from localStorage
      const savedHistory = localStorage.getItem('autoOptimizeHistory');
      if (savedHistory) {
        try {
          setHistory(JSON.parse(savedHistory));
        } catch (error) {
          console.error('Failed to parse optimization history:', error);
        }
      }

      // Load metrics from localStorage
      const savedMetrics = localStorage.getItem('optimizationMetrics');
      if (savedMetrics) {
        try {
          setOptimizationMetrics(JSON.parse(savedMetrics));
        } catch (error) {
          console.error('Failed to parse optimization metrics:', error);
        }
      }
    };
    
    loadSettings();
    
    // Also fetch portfolio data if connected
    if (connected && address) {
      fetchPortfolioData(address);
    }
  }, [connected, address, fetchPortfolioData]);

  // Update settings in localStorage when they change
  useEffect(() => {
    localStorage.setItem('autoOptimizerSettings', JSON.stringify(settings));
  }, [settings]);

  // Check for scheduled runs periodically
  useEffect(() => {
    if (!isEnabled || !nextRunTime) return;

    const checkInterval = setInterval(() => {
      const now = Date.now();
      
      // Check if it's time to run optimization
      if (now >= nextRunTime) {
        executeRebalance();
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [isEnabled, nextRunTime]);

  // Function to toggle auto-optimization
  const toggleAutoOptimize = () => {
    const newStatus = !isEnabled;
    setIsEnabled(newStatus);
    localStorage.setItem('autoOptimizeEnabled', newStatus.toString());

    if (newStatus) {
      // Schedule next run
      const now = Date.now();
      const nextRun = now + (settings.interval * 60 * 60 * 1000);
      setNextRunTime(nextRun);
      localStorage.setItem('nextAutoOptimizeRun', nextRun.toString());
      
      // Update status information
      setStatusInfo({
        status: 'active',
        message: `Auto-optimization enabled. Next run in ${formatTimeRemaining(nextRun)}`,
        nextRun
      });
      
      showNotification('Auto-optimization enabled', 'success');
    } else {
      // Clear scheduler
      setStatusInfo({
        status: 'disabled',
        message: 'Auto-optimization disabled'
      });
      
      showNotification('Auto-optimization disabled', 'info');
    }
  };

  // Format time remaining until next run
  const formatTimeRemaining = (timestamp) => {
    if (!timestamp) return 'Not scheduled';
    
    const now = Date.now();
    const diff = timestamp - now;
    
    if (diff <= 0) return 'Imminent';
    
    const hours = Math.floor(diff / (60 * 60 * 1000));
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
    
    return `${hours}h ${minutes}m`;
  };

  // Schedule next run
  const scheduleNextRun = () => {
    if (!isEnabled) return;
    
    const now = Date.now();
    const nextRun = now + (settings.interval * 60 * 60 * 1000);
    setNextRunTime(nextRun);
    localStorage.setItem('nextAutoOptimizeRun', nextRun.toString());
    
    // Update status info
    setStatusInfo(prev => ({
      ...prev,
      nextRun,
      message: `Next optimization in ${formatTimeRemaining(nextRun)}`
    }));
  };

  // Function to execute rebalance
  const executeRebalance = async () => {
    if (isRebalancing || !connected) return;
    
    setIsRebalancing(true);
    showNotification('Portfolio rebalancing in progress...', 'info');
    
    try {
      // Call API to execute rebalance
      const response = await api.post('/auto-rebalance/execute', {
        walletAddress: address,
        settings
      });
      
      // Save result to history
      const historyEntry = {
        timestamp: Date.now(),
        type: 'rebalance',
        status: response.data.success ? 'success' : 'partial',
        operations: response.data.operations?.length || 0,
        failedOperations: response.data.failedOperations?.length || 0,
        driftPercentage: response.data.driftAnalysis?.maxDrift || 0
      };
      
      addToHistory(historyEntry);
      
      // Update last run time
      const now = Date.now();
      setLastRunTime(now);
      localStorage.setItem('lastAutoOptimizeRun', now.toString());
      
      // Schedule next run
      scheduleNextRun();
      
      // Update metrics
      updateOptimizationMetrics(response.data);
      
      // Show result notification
      showNotification(
        response.data.success 
          ? `Portfolio rebalance completed successfully` 
          : `Portfolio rebalance completed with some issues`,
        response.data.success ? 'success' : 'warning'
      );
      
      // Refresh portfolio data
      fetchPortfolioData(address);
      
      return response.data;
    } catch (error) {
      console.error('Rebalance error:', error);
      
      // Add error to history
      const errorEntry = {
        timestamp: Date.now(),
        type: 'error',
        status: 'failed',
        reason: error.message || 'Unknown error'
      };
      
      addToHistory(errorEntry);
      
      showNotification(`Rebalance failed: ${error.message}`, 'error');
      
      // Schedule next attempt in half the normal interval
      const retryTime = Date.now() + (settings.interval * 60 * 60 * 1000 / 2);
      setNextRunTime(retryTime);
      localStorage.setItem('nextAutoOptimizeRun', retryTime.toString());
      
      return { success: false, error: error.message };
    } finally {
      setIsRebalancing(false);
    }
  };

  // Update optimization metrics
  const updateOptimizationMetrics = (data) => {
    const currentMetrics = optimizationMetrics || {
      totalOptimizations: 0,
      totalValueSaved: 0,
      averageAPRIncrease: 0,
      totalAPRIncrease: 0
    };
    
    // Calculate new metrics
    const newTotalOptimizations = currentMetrics.totalOptimizations + 1;
    const newValueSaved = currentMetrics.totalValueSaved + (data.valueSaved || 0);
    const newTotalAPRIncrease = currentMetrics.totalAPRIncrease + (data.aprIncrease || 0);
    const newAverageAPRIncrease = newTotalAPRIncrease / newTotalOptimizations;
    
    const updatedMetrics = {
      totalOptimizations: newTotalOptimizations,
      totalValueSaved: newValueSaved,
      averageAPRIncrease: newAverageAPRIncrease,
      totalAPRIncrease: newTotalAPRIncrease,
      lastOptimizationDate: new Date().toISOString()
    };
    
    // Update state and save to localStorage
    setOptimizationMetrics(updatedMetrics);
    localStorage.setItem('optimizationMetrics', JSON.stringify(updatedMetrics));
  };

  // Add entry to history
  const addToHistory = (entry) => {
    const updatedHistory = [entry, ...history];
    if (updatedHistory.length > 10) {
      updatedHistory.length = 10; // Keep only the 10 most recent entries
    }
    setHistory(updatedHistory);
    localStorage.setItem('autoOptimizeHistory', JSON.stringify(updatedHistory));
  };

  // Handle saving settings
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('autoOptimizerSettings', JSON.stringify(newSettings));
    showNotification('Settings saved successfully', 'success');
    
    // If auto-optimize is enabled, reschedule next run
    if (isEnabled) {
      const now = Date.now();
      const nextRun = now + (newSettings.interval * 60 * 60 * 1000);
      setNextRunTime(nextRun);
      localStorage.setItem('nextAutoOptimizeRun', nextRun.toString());
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Portfolio Auto-Optimizer</h1>
          {!connected && (
            <div className="bg-yellow-600/20 border border-yellow-600 text-yellow-200 px-4 py-2 rounded-md text-sm">
              Please connect your wallet to use auto-optimization
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="bg-gray-800 border border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Auto-Optimization</CardTitle>
                    <CardDescription>
                      Let AI automatically optimize your portfolio for maximum yield
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={toggleAutoOptimize}
                    disabled={!connected}
                    variant={isEnabled ? 'danger' : 'primary'}
                  >
                    {isEnabled ? 'Disable' : 'Enable'} Auto-Optimize
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <OptimizerStatus 
                  enabled={isEnabled}
                  onToggle={toggleAutoOptimize}
                  nextRun={nextRunTime}
                  onExecuteNow={executeRebalance}
                  isRebalancing={isRebalancing}
                  settings={settings}
                  metrics={optimizationMetrics}
                  strategy={{
                    name: 'Balanced Yield',
                    expectedAPR: portfolio?.expectedAPR || 7.5
                  }}
                />
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border border-gray-700 mt-6">
              <CardHeader>
                <CardTitle>Portfolio Balance</CardTitle>
                <CardDescription>
                  Current allocation versus optimal allocation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PortfolioBalance 
                  portfolioData={portfolio} 
                  stakingData={{
                    strategies: {
                      balanced: {
                        allocation: [
                          { protocol: 'native', percentage: 20 },
                          { protocol: 'amnis', percentage: 30 },
                          { protocol: 'thala', percentage: 15 },
                          { protocol: 'tortuga', percentage: 15 },
                          { protocol: 'liquidity', percentage: 20 }
                        ]
                      }
                    }
                  }}
                />
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border border-gray-700 mt-6">
              <CardHeader>
                <CardTitle>Execution History</CardTitle>
                <CardDescription>
                  Recent auto-optimization activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExecutionHistory history={history} />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="bg-gray-800 border border-gray-700">
              <CardHeader>
                <CardTitle>Optimizer Settings</CardTitle>
                <CardDescription>
                  Configure auto-optimization parameters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <OptimizerSettings 
                  settings={settings} 
                  onSave={handleSaveSettings} 
                  disabled={!connected || isRebalancing}
                />
              </CardContent>
            </Card>
            
            <div className="bg-blue-900/30 rounded-lg p-6 mt-6 border border-blue-800/50">
              <h3 className="text-lg font-semibold text-blue-300 mb-3">How Auto-Optimizer Works</h3>
              <div className="space-y-3 text-sm text-blue-200">
                <p>
                  The Auto-Optimizer uses AI to analyze market conditions and your portfolio allocation to automatically maintain the optimal balance for maximum yield.
                </p>
                <p>
                  It will only rebalance when the drift between your current allocation and the optimal allocation exceeds your configured threshold.
                </p>
                <p>
                  Each rebalance requires your wallet approval for the transactions. Make sure your wallet is accessible when a scheduled rebalance occurs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AutoOptimizer;