// src/hooks/useRecommendations.js
import { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../context/UserContext';
import { NotificationContext } from '../context/NotificationContext';
import { WalletContext } from '../context/WalletContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

/**
 * Hook for managing AI-powered investment recommendations
 * @returns {Object} Recommendation methods and state
 */
const useRecommendations = () => {
  const { user } = useContext(UserContext);
  const { showNotification } = useContext(NotificationContext);
  const { account, signAndSubmitTransaction } = useContext(WalletContext);
  
  const [recommendations, setRecommendations] = useState([]);
  const [currentRecommendation, setCurrentRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [executionStatus, setExecutionStatus] = useState({
    executing: false,
    progress: 0,
    status: null,
    results: null
  });

  /**
   * Generate an AI-powered recommendation based on params
   * @param {Object} params - Recommendation parameters
   * @returns {Promise<Object>} AI recommendation
   */
  const generateRecommendation = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      // Default to connected wallet address if available
      const walletAddress = params.walletAddress || account?.address;
      
      // Prepare request parameters
      const requestParams = {
        amount: params.amount || 100,
        riskProfile: params.riskProfile || 'balanced',
        ...(walletAddress && { walletAddress }),
      };
      
      // Call recommendation API
      const response = await axios.get(`${API_URL}/recommendations/ai`, { 
        params: requestParams
      });
      
      const newRecommendation = response.data;
      
      // Update current recommendation
      setCurrentRecommendation(newRecommendation);
      
      // Add to recommendations array (only keep last 5)
      setRecommendations(prev => {
        const updated = [newRecommendation, ...prev];
        return updated.slice(0, 5);
      });
      
      // Show success notification
      showNotification({
        type: 'success',
        title: 'Recommendation Generated',
        message: `AI recommendation with ${newRecommendation.totalApr}% APR has been generated.`
      });
      
      return newRecommendation;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to generate recommendation';
      setError(errorMsg);
      
      showNotification({
        type: 'error',
        title: 'Recommendation Error',
        message: errorMsg
      });
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [account, showNotification]);
  
  /**
   * Get recommendation history for a wallet
   * @param {string} walletAddress - Wallet address
   * @returns {Promise<Array>} Recommendation history
   */
  const getRecommendationHistory = useCallback(async (walletAddress = null) => {
    try {
      setLoading(true);
      const address = walletAddress || account?.address;
      
      if (!address) {
        throw new Error('Wallet address is required to fetch history');
      }
      
      const response = await axios.get(`${API_URL}/recommendations/history/${address}`);
      setHistory(response.data.history || []);
      return response.data.history;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to fetch recommendation history';
      setError(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, [account]);
  
  /**
   * Compare different investment strategies
   * @param {Object} params - Comparison parameters
   * @returns {Promise<Object>} Strategy comparison
   */
  const compareStrategies = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      
      // Default to connected wallet address if available
      const walletAddress = params.walletAddress || account?.address;
      
      // Prepare request parameters
      const requestParams = {
        amount: params.amount || 100,
        ...(walletAddress && { walletAddress }),
      };
      
      const response = await axios.get(`${API_URL}/recommendations/comparison`, {
        params: requestParams
      });
      
      return response.data.strategies;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to compare strategies';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [account]);
  
  /**
   * Execute a recommended strategy
   * @param {Object} recommendation - Recommendation to execute
   * @returns {Promise<Object>} Execution result
   */
  const executeRecommendation = useCallback(async (recommendation) => {
    try {
      if (!account?.address) {
        throw new Error('Please connect your wallet to execute a strategy');
      }
      
      setExecutionStatus({
        executing: true,
        progress: 10,
        status: 'preparing',
        results: null
      });
      
      // Prepare transaction payload from recommendation
      const operations = recommendation.agentCapabilities?.supportedOperations || [];
      
      if (operations.length === 0) {
        throw new Error('No executable operations found in recommendation');
      }
      
      // Prepare execution request
      const executionPayload = {
        walletAddress: account.address,
        amount: recommendation.totalInvestment || 100,
        allocation: recommendation.allocation,
        operations
      };
      
      setExecutionStatus(prev => ({
        ...prev,
        progress: 30,
        status: 'submitting'
      }));
      
      // First simulate the transaction to ensure it will succeed
      const simulateResponse = await axios.post(`${API_URL}/execute-strategy/simulate`, executionPayload);
      
      if (!simulateResponse.data.success) {
        throw new Error(`Simulation failed: ${simulateResponse.data.error}`);
      }
      
      setExecutionStatus(prev => ({
        ...prev,
        progress: 50,
        status: 'signing'
      }));
      
      // Construct and sign transactions
      const signedTransactions = [];
      for (const operation of operations) {
        // Create transaction payload
        const payload = {
          function: `${operation.contractAddress}${operation.functionName}`,
          type_arguments: [],
          arguments: [
            // Convert APT amount to octas (APT * 10^8)
            (parseFloat(operation.amount) * 100000000).toString()
          ]
        };
        
        // Sign the transaction using wallet
        const signedTx = await signAndSubmitTransaction({
          sender: account.address,
          payload
        });
        
        signedTransactions.push(signedTx);
        
        // Update progress incrementally
        setExecutionStatus(prev => ({
          ...prev,
          progress: Math.min(90, prev.progress + 10),
          status: 'processing'
        }));
      }
      
      // Submit execution results
      const executionResult = await axios.post(`${API_URL}/execute-strategy/confirm`, {
        walletAddress: account.address,
        recommendationId: recommendation.id,
        transactions: signedTransactions
      });
      
      setExecutionStatus({
        executing: false,
        progress: 100,
        status: 'completed',
        results: executionResult.data
      });
      
      // Show success notification
      showNotification({
        type: 'success',
        title: 'Strategy Executed',
        message: `Successfully executed strategy with ${executionResult.data.successfulOperations} operations.`
      });
      
      return executionResult.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to execute strategy';
      
      setExecutionStatus({
        executing: false,
        progress: 0,
        status: 'failed',
        error: errorMsg
      });
      
      setError(errorMsg);
      
      showNotification({
        type: 'error',
        title: 'Execution Failed',
        message: errorMsg
      });
      
      throw err;
    }
  }, [account, signAndSubmitTransaction, showNotification]);
  
  /**
   * Get auto-rebalance status
   * @returns {Promise<Object>} Rebalance status
   */
  const getAutoRebalanceStatus = useCallback(async () => {
    try {
      if (!account?.address) {
        throw new Error('Wallet not connected');
      }
      
      const response = await axios.get(`${API_URL}/auto-rebalance/status`, {
        params: { walletAddress: account.address }
      });
      
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      return { monitoring: false, error: errorMsg };
    }
  }, [account]);
  
  /**
   * Update auto-rebalance settings
   * @param {Object} settings - Rebalance settings
   * @returns {Promise<Object>} Updated settings
   */
  const updateAutoRebalanceSettings = useCallback(async (settings) => {
    try {
      if (!account?.address) {
        throw new Error('Wallet not connected');
      }
      
      const response = await axios.post(`${API_URL}/auto-rebalance/settings`, {
        walletAddress: account.address,
        ...settings
      });
      
      showNotification({
        type: 'success',
        title: 'Settings Updated',
        message: `Auto-rebalance settings have been updated.`
      });
      
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      
      showNotification({
        type: 'error',
        title: 'Settings Update Failed',
        message: errorMsg
      });
      
      throw err;
    }
  }, [account, showNotification]);
  
  /**
   * Execute auto-rebalance immediately
   * @param {Object} options - Rebalance options
   * @returns {Promise<Object>} Rebalance result
   */
  const executeAutoRebalance = useCallback(async (options = {}) => {
    try {
      if (!account?.address) {
        throw new Error('Wallet not connected');
      }
      
      setExecutionStatus({
        executing: true,
        progress: 10,
        status: 'rebalancing',
        results: null
      });
      
      const response = await axios.post(`${API_URL}/auto-rebalance/execute`, {
        walletAddress: account.address,
        force: options.force || false
      });
      
      setExecutionStatus({
        executing: false,
        progress: 100,
        status: 'completed',
        results: response.data
      });
      
      showNotification({
        type: 'success',
        title: 'Rebalance Complete',
        message: `Portfolio successfully rebalanced with ${response.data.successfulOperations || 0} operations.`
      });
      
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      
      setExecutionStatus({
        executing: false,
        progress: 0,
        status: 'failed',
        error: errorMsg
      });
      
      setError(errorMsg);
      
      showNotification({
        type: 'error',
        title: 'Rebalance Failed',
        message: errorMsg
      });
      
      throw err;
    }
  }, [account, showNotification]);
  
  // Effect to load recommendation history when wallet is connected
  useEffect(() => {
    if (account?.address) {
      getRecommendationHistory(account.address)
        .catch(err => console.error('Failed to load recommendation history:', err));
    }
  }, [account, getRecommendationHistory]);
  
  return {
    // State
    recommendations,
    currentRecommendation,
    loading,
    error,
    history,
    executionStatus,
    
    // Methods
    generateRecommendation,
    getRecommendationHistory,
    compareStrategies,
    executeRecommendation,
    getAutoRebalanceStatus,
    updateAutoRebalanceSettings,
    executeAutoRebalance,
    
    // Setters
    setCurrentRecommendation,
    clearError: () => setError(null)
  };
};

export default useRecommendations;