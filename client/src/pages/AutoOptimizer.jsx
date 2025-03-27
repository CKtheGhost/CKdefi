import React, { useState, useEffect, useContext } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/common/Card';
import { Button } from '../components/common/Button';
import OptimizerStatus from '../components/optimizer/OptimizerStatus';
import OptimizerSettings from '../components/optimizer/OptimizerSettings';
import PortfolioBalance from '../components/optimizer/PortfolioBalance';
import ExecutionHistory from '../components/optimizer/ExecutionHistory';
import { WalletContext } from '../context/WalletContext';
import { UserContext } from '../context/UserContext';
import { NotificationContext } from '../context/NotificationContext';
import usePortfolio from '../hooks/usePortfolio';
import useRecommendations from '../hooks/useRecommendations';
import useTransactions from '../hooks/useTransactions';

const AutoOptimizer = () => {
  const { wallet, isConnected } = useContext(WalletContext);
  const { preferences } = useContext(UserContext);
  const { showNotification } = useContext(NotificationContext);
  const { portfolio, fetchPortfolio, isLoading: isPortfolioLoading } = usePortfolio();
  const { getAIRecommendation } = useRecommendations();
  const { executeStrategy } = useTransactions();

  const [isEnabled, setIsEnabled] = useState(false);
  const [nextRunTime, setNextRunTime] = useState(null);
  const [lastRunTime, setLastRunTime] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [settings, setSettings] = useState({
    interval: 24, // hours
    threshold: 5, // percentage drift
    maxSlippage: 2.5, // percentage
    preserveStakedPositions: true,
    riskProfile: 'balanced',
    autoAdjustTiming: true
  });
  const [isRunningOptimization, setIsRunningOptimization] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
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

    // Load last result
    const lastResultSaved = localStorage.getItem('lastAutoOptimizeResult');
    if (lastResultSaved) {
      try {
        setLastResult(JSON.parse(lastResultSaved));
      } catch (error) {
        console.error('Failed to parse last optimization result:', error);
      }
    }
  }, []);

  // Update timer and check for scheduled runs
  useEffect(() => {
    if (!isEnabled || !nextRunTime) return;

    const checkInterval = setInterval(() => {
      const now = Date.now();
      
      // Update next run time display in UI
      setNextRunTime(prev => prev);
      
      // Check if it's time to run optimization
      if (now >= nextRunTime) {
        runAutoOptimization();
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, [isEnabled, nextRunTime]);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('autoOptimizerSettings', JSON.stringify(settings));
  }, [settings]);

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
      showNotification('Auto-optimization enabled', 'success');
    } else {
      showNotification('Auto-optimization disabled', 'info');
    }
  };

  const runAutoOptimization = async () => {
    if (isRunningOptimization || !isConnected) return;
    
    setIsRunningOptimization(true);
    showNotification('Auto-optimization in progress...', 'info');
    
    try {
      // 1. Fetch current portfolio
      const portfolioData = await fetchPortfolio(wallet.address);
      
      // 2. Get AI recommendation
      const recommendation = await getAIRecommendation({
        walletAddress: wallet.address,
        amount: portfolioData.totalValueUSD || 100,
        riskProfile: settings.riskProfile
      });
      
      // 3. Calculate drift and check if rebalancing is needed
      const driftResult = calculateDrift(portfolioData, recommendation);
      
      if (driftResult.maxDrift < settings.threshold) {
        // Rebalancing not needed - record in history
        const entry = {
          timestamp: Date.now(),
          type: 'check',
          status: 'skipped',
          reason: `Portfolio drift (${driftResult.maxDrift.toFixed(2)}%) below threshold (${settings.threshold}%)`,
          driftPercentage: driftResult.maxDrift
        };
        
        addToHistory(entry);
        
        showNotification('Portfolio already optimally balanced', 'success');
        
        // Schedule next run
        scheduleNextRun();
        setIsRunningOptimization(false);
        return;
      }
      
      // 4. Prepare operations
      const operations = prepareOperationsFromRecommendation(
        recommendation, 
        portfolioData,
        settings.preserveStakedPositions
      );
      
      // 5. Execute strategy
      const result = await executeStrategy(operations, {
        slippage: settings.maxSlippage / 100
      });
      
      // 6. Save result
      setLastResult(result);
      localStorage.setItem('lastAutoOptimizeResult', JSON.stringify(result));
      
      // 7. Record in history
      const historyEntry = {
        timestamp: Date.now(),
        type: 'rebalance',
        status: result.success ? 'success' : 'partial',
        operations: result.operations?.length || 0,
        failedOperations: result.failedOperations?.length || 0,
        driftPercentage: driftResult.maxDrift
      };
      
      addToHistory(historyEntry);
      
      // 8. Show notification
      showNotification(
        result.success 
          ? `Auto-optimization completed with ${result.operations.length} successful operations` 
          : `Auto-optimization completed with ${result.failedOperations.length} failures`,
        result.success ? 'success' : 'warning'
      );
      
      // 9. Update last run time and schedule next run
      const now = Date.now();
      setLastRunTime(now);
      localStorage.setItem('lastAutoOptimizeRun', now.toString());
      
      scheduleNextRun();
      
    } catch (error) {
      console.error('Auto-optimization failed:', error);
      
      // Record error in history
      const errorEntry = {
        timestamp: Date.now(),
        type: 'error',
        status: 'failed',
        reason: error.message || 'Unknown error'
      };
      
      addToHistory(errorEntry);
      
      showNotification(`Auto-optimization failed: ${error.message}`, 'error');
      
      // Schedule retry in 1 hour
      const retryTime = Date.now() + (1 * 60 * 60 * 1000);
      setNextRunTime(retryTime);
      localStorage.setItem('nextAutoOptimizeRun', retryTime.toString());
    } finally {
      setIsRunningOptimization(false);
    }
  };

  const scheduleNextRun = () => {
    if (!isEnabled) return;
    
    const now = Date.now();
    const nextRun = now + (settings.interval * 60 * 60 * 1000);
    setNextRunTime(nextRun);
    localStorage.setItem('nextAutoOptimizeRun', nextRun.toString());
  };

  const addToHistory = (entry) => {
    const updatedHistory = [entry, ...history];
    if (updatedHistory.length > 10) {
      updatedHistory.length = 10; // Keep only the 10 most recent entries
    }
    setHistory(updatedHistory);
    localStorage.setItem('autoOptimizeHistory', JSON.stringify(updatedHistory));
  };

  const prepareOperationsFromRecommendation = (recommendation, portfolioData, preserveStaked = true) => {
    if (!recommendation.allocation) return [];
    
    // Calculate current allocation percentages
    const currentAllocation = calculateCurrentAllocation(portfolioData);
    
    // Build target allocation map
    const targetAllocation = {};
    recommendation.allocation.forEach(item => {
      targetAllocation[item.protocol.toLowerCase()] = parseFloat(item.percentage);
    });
    
    // Generate operations
    const operations = [];
    
    // First handle decreases (unstakes, withdrawals)
    for (const [protocol, percentage] of Object.entries(currentAllocation)) {
      const target = targetAllocation[protocol.toLowerCase()] || 0;
      
      if (percentage > target) {
        // Skip staked positions if preserveStaked is true
        if (preserveStaked && isStakedProtocol(protocol)) {
          console.log(`Skipping unstake for ${protocol} due to preserveStakedPositions setting`);
          continue;
        }
        
        const percentageDiff = percentage - target;
        if (percentageDiff >= 1) { // Only rebalance if diff is at least 1%
          operations.push({
            protocol,
            type: getOperationType(protocol, 'decrease'),
            amount: calculateAmountFromPercentage(percentageDiff, portfolioData.totalValueUSD),
            action: 'decrease'
          });
        }
      }
    }
    
    // Then handle increases (stakes, deposits)
    for (const [protocol, target] of Object.entries(targetAllocation)) {
      const current = currentAllocation[protocol.toLowerCase()] || 0;
      
      if (target > current) {
        const percentageDiff = target - current;
        if (percentageDiff >= 1) { // Only rebalance if diff is at least 1%
          operations.push({
            protocol,
            type: getOperationType(protocol, 'increase'),
            amount: calculateAmountFromPercentage(percentageDiff, portfolioData.totalValueUSD),
            action: 'increase'
          });
        }
      }
    }
    
    return operations;
  };

  const calculateCurrentAllocation = (portfolioData) => {
    const result = {};
    const totalValue = parseFloat(portfolioData.totalValueUSD || 0);
    
    if (totalValue <= 0) return result;
    
    // Add native APT
    if (portfolioData.apt && parseFloat(portfolioData.apt.valueUSD) > 0) {
      result['native'] = (portfolioData.apt.valueUSD / totalValue * 100);
    }
    
    // Add staked tokens
    const stakedTokens = {
      'stAPT': 'amnis',
      'sthAPT': 'thala',
      'tAPT': 'tortuga',
      'dAPT': 'ditto'
    };
    
    for (const [key, protocol] of Object.entries(stakedTokens)) {
      if (portfolioData[key] && parseFloat(portfolioData[key].valueUSD) > 0) {
        result[protocol] = (portfolioData[key].valueUSD / totalValue * 100);
      }
    }
    
    // Add AMM liquidity if any
    if (portfolioData.ammLiquidity && portfolioData.ammLiquidity.hasLiquidity) {
      result['liquidity'] = (portfolioData.ammLiquidity.valueUSD / totalValue * 100);
    }
    
    return result;
  };

  const calculateDrift = (portfolioData, recommendation) => {
    const currentAllocation = calculateCurrentAllocation(portfolioData);
    
    // Build target allocation from recommendation
    const targetAllocation = {};
    recommendation.allocation.forEach(item => {
      targetAllocation[item.protocol.toLowerCase()] = parseFloat(item.percentage);
    });
    
    // Calculate drift for each protocol
    const drifts = [];
    let maxDrift = 0;
    let totalDrift = 0;
    
    // Check existing allocations against targets
    for (const [protocol, currentPct] of Object.entries(currentAllocation)) {
      const targetPct = targetAllocation[protocol.toLowerCase()] || 0;
      const drift = Math.abs(currentPct - targetPct);
      
      drifts.push({
        protocol,
        current: currentPct,
        target: targetPct,
        drift,
        action: currentPct > targetPct ? 'decrease' : 'increase'
      });
      
      maxDrift = Math.max(maxDrift, drift);
      totalDrift += drift;
    }
    
    // Check for targets not in current allocation
    for (const [protocol, targetPct] of Object.entries(targetAllocation)) {
      if (!currentAllocation[protocol.toLowerCase()]) {
        drifts.push({
          protocol,
          current: 0,
          target: targetPct,
          drift: targetPct,
          action: 'add'
        });
        
        maxDrift = Math.max(maxDrift, targetPct);
        totalDrift += targetPct;
      }
    }
    
    const avgDrift = drifts.length > 0 ? totalDrift / drifts.length : 0;
    
    return {
      drifts: drifts.sort((a, b) => b.drift - a.drift),
      maxDrift,
      avgDrift
    };
  };

  const getOperationType = (protocol, action) => {
    protocol = protocol.toLowerCase();
    
    if (action === 'decrease') {
      if (['amnis', 'thala', 'tortuga', 'ditto'].includes(protocol)) {
        return 'unstake';
      } else if (['aries', 'echelon', 'echo'].includes(protocol)) {
        return 'withdraw';
      } else if (['liquidity', 'pancakeswap', 'liquidswap', 'cetus'].includes(protocol)) {
        return 'removeLiquidity';
      }
      return 'withdraw';
    } else {
      if (['amnis', 'thala', 'tortuga', 'ditto'].includes(protocol)) {
        return 'stake';
      } else if (['aries', 'echelon', 'echo'].includes(protocol)) {
        return 'lend';
      } else if (['liquidity', 'pancakeswap', 'liquidswap', 'cetus'].includes(protocol)) {
        return 'addLiquidity';
      }
      return 'stake';
    }
  };

  const isStakedProtocol = (protocol) => {
    return ['amnis', 'thala', 'tortuga', 'ditto'].includes(protocol.toLowerCase());
  };

  const calculateAmountFromPercentage = (percentage, totalValueUSD) => {
    // Assume 1 APT = $10 if we don't have the data
    const aptPrice = 10;
    return ((percentage / 100) * totalValueUSD / aptPrice).toFixed(2);
  };

  const handleSettingsSave = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    showNotification('Auto-optimizer settings saved', 'success');
  };

  const handleRunNow = () => {
    if (!isConnected) {
      showNotification('Please connect your wallet first', 'error');
      return;
    }
    
    if (isRunningOptimization) {
      showNotification('Optimization already in progress', 'warning');
      return;
    }
    
    runAutoOptimization();
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Portfolio Auto-Optimizer</h1>
        {!isConnected && (
          <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md">
            Please connect your wallet to use auto-optimization
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
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
                  className={isEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
                >
                  {isEnabled ? 'Disable' : 'Enable'} Auto-Optimize
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <OptimizerStatus 
                isEnabled={isEnabled}
                nextRunTime={nextRunTime}
                lastRunTime={lastRunTime}
                lastResult={lastResult}
                isRunning={isRunningOptimization}
              />
              <div className="mt-6">
                <Button 
                  onClick={handleRunNow} 
                  disabled={!isConnected || isRunningOptimization}
                  className="w-full"
                >
                  {isRunningOptimization ? 'Optimization in Progress...' : 'Run Optimization Now'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Balance</CardTitle>
                <CardDescription>
                  Current allocation versus optimal allocation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PortfolioBalance 
                  portfolio={portfolio} 
                  settings={settings}
                  isLoading={isPortfolioLoading}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Optimization History</CardTitle>
                <CardDescription>
                  Recent auto-optimization activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ExecutionHistory history={history} />
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Optimizer Settings</CardTitle>
              <CardDescription>
                Configure auto-optimization parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OptimizerSettings 
                settings={settings} 
                onSave={handleSettingsSave} 
                isEnabled={isEnabled}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AutoOptimizer;