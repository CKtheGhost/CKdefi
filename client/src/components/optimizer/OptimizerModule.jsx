import React, { useState, useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { usePortfolio } from '../../hooks/usePortfolio';
import { useRecommendations } from '../../hooks/useRecommendations';
import { useTransactions } from '../../hooks/useTransactions';
import { useNotification } from '../../hooks/useNotification';
import OptimizerSettings from './OptimizerSettings';
import OptimizerStatus from './OptimizerStatus';
import PortfolioBalance from './PortfolioBalance';
import StrategyOperations from './StrategyOperations';
import ExecutionHistory from './ExecutionHistory';

const OptimizerModule = () => {
  const { connected, address } = useWallet();
  const { portfolioData, fetchPortfolio, loading: portfolioLoading } = usePortfolio();
  const { generateRecommendation, recommendations, loading: recommendationsLoading } = useRecommendations();
  const { executeOperations, transactionStatus } = useTransactions();
  const { showNotification } = useNotification();
  
  const [settings, setSettings] = useState({
    autoRebalance: false,
    rebalanceThreshold: 5,
    maxSlippage: 2.0,
    preserveStakedPositions: true,
    frequency: 'weekly'
  });
  
  const [executionStatus, setExecutionStatus] = useState('pending'); // pending, executing, completed, failed
  const [operations, setOperations] = useState([]);
  const [rebalanceHistory, setRebalanceHistory] = useState([]);
  
  useEffect(() => {
    if (connected && address) {
      fetchPortfolio(address);
      fetchRebalanceHistory(address);
    }
  }, [connected, address]);
  
  const fetchRebalanceHistory = async (walletAddress) => {
    try {
      // Fetch rebalance history from API
      // This would be implemented in your hooks or services
      const response = await fetch(`/api/auto-rebalance/history?walletAddress=${walletAddress}`);
      const data = await response.json();
      setRebalanceHistory(data.history || []);
    } catch (error) {
      console.error('Failed to fetch rebalance history:', error);
    }
  };
  
  const handleSettingsChange = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    // In a real app, you'd persist these settings to the backend
    saveSettingsToBackend(newSettings);
  };
  
  const saveSettingsToBackend = async (newSettings) => {
    if (!connected || !address) return;
    
    try {
      await fetch('/api/auto-rebalance/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          walletAddress: address,
          ...newSettings
        })
      });
      
      showNotification({
        type: 'success',
        title: 'Settings Saved',
        message: 'Your rebalance settings have been updated'
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
      showNotification({
        type: 'error',
        title: 'Settings Error',
        message: 'Failed to save your rebalance settings'
      });
    }
  };
  
  const checkRebalanceNeeded = async () => {
    if (!connected || !address) return;
    
    try {
      const response = await fetch(`/api/auto-rebalance/status?walletAddress=${address}`);
      const data = await response.json();
      
      if (data.needsRebalancing) {
        generateRebalanceOperations();
        showNotification({
          type: 'info',
          title: 'Rebalance Needed',
          message: `Portfolio drift of ${data.maxDrift.toFixed(2)}% detected`
        });
      } else {
        showNotification({
          type: 'success',
          title: 'Portfolio Balanced',
          message: 'Your portfolio is already optimally balanced'
        });
      }
    } catch (error) {
      console.error('Failed to check rebalance status:', error);
    }
  };
  
  const generateRebalanceOperations = async () => {
    if (!connected || !address) return;
    
    try {
      // In a real app, you'd get this from your backend
      const response = await fetch(`/api/auto-rebalance/operations?walletAddress=${address}&preserveStaked=${settings.preserveStakedPositions}`);
      const data = await response.json();
      
      setOperations(data.operations || []);
    } catch (error) {
      console.error('Failed to generate rebalance operations:', error);
    }
  };
  
  const handleApproveOperations = async () => {
    if (!connected || !address || operations.length === 0) return;
    
    setExecutionStatus('executing');
    
    try {
      const result = await executeOperations(operations);
      
      if (result.success) {
        setExecutionStatus('completed');
        showNotification({
          type: 'success',
          title: 'Rebalance Successful',
          message: 'Your portfolio has been rebalanced successfully'
        });
        
        // Refresh portfolio data and history
        fetchPortfolio(address);
        fetchRebalanceHistory(address);
      } else {
        setExecutionStatus('failed');
        showNotification({
          type: 'error',
          title: 'Rebalance Failed',
          message: result.error || 'Failed to execute some operations'
        });
      }
    } catch (error) {
      console.error('Failed to execute operations:', error);
      setExecutionStatus('failed');
    }
  };
  
  const handleRejectOperations = () => {
    setOperations([]);
    showNotification({
      type: 'info',
      title: 'Operations Rejected',
      message: 'Rebalance operations have been rejected'
    });
  };
  
  const executeManualRebalance = async () => {
    if (!connected || !address) return;
    
    try {
      await generateRebalanceOperations();
      showNotification({
        type: 'info',
        title: 'Rebalance Ready',
        message: 'Review and approve the operations to rebalance your portfolio'
      });
    } catch (error) {
      console.error('Failed to prepare manual rebalance:', error);
    }
  };
  
  if (!connected) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            Please connect your wallet to use the optimizer
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PortfolioBalance 
          portfolioData={portfolioData} 
          loading={portfolioLoading}
        />
        <OptimizerStatus 
          settings={settings}
          onCheckBalance={checkRebalanceNeeded}
          onManualRebalance={executeManualRebalance}
        />
      </div>
      
      {operations.length > 0 && (
        <StrategyOperations 
          operations={operations}
          executionStatus={executionStatus}
          onApprove={handleApproveOperations}
          onReject={handleRejectOperations}
        />
      )}
      
      <OptimizerSettings 
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
      
      <ExecutionHistory history={rebalanceHistory} />
    </div>
  );
};

export default OptimizerModule;