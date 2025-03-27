// useRecommendations.js - Hook for AI-powered investment recommendations
import { useState, useEffect, useCallback, useContext } from 'react';
import { useWallet } from './useWallet';
import { usePortfolio } from './usePortfolio';
import { NotificationContext } from '../context/NotificationContext';
import { TransactionContext } from '../context/TransactionContext';
import api from '../services/api';

/**
 * Hook for working with AI-powered investment recommendations
 */
const useRecommendations = () => {
  const { walletAddress } = useWalletContext();
  const { totalValue, portfolioData } = usePortfolio();
  const { showNotification } = useContext(NotificationContext);
  const { executeStrategy } = useContext(TransactionContext);
  
  // Recommendation states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [recommendationHistory, setRecommendationHistory] = useState([]);
  const [generatingRecommendation, setGeneratingRecommendation] = useState(false);
  const [executingRecommendation, setExecutingRecommendation] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  
  // Form states
  const [amount, setAmount] = useState(() => {
    // Initialize with portfolio value if available, otherwise default to 100
    return totalValue > 0 ? Math.floor(totalValue) : 100;
  });
  
  const [riskProfile, setRiskProfile] = useState(() => {
    // Try to get stored preference or default to 'balanced'
    return localStorage.getItem('defaultRiskProfile') || 'balanced';
  });
  
  const [preserveStakedPositions, setPreserveStakedPositions] = useState(true);
  
  // Update the amount when totalValue changes
  useEffect(() => {
    if (totalValue > 0 && !amount) {
      setAmount(Math.floor(totalValue));
    }
  }, [totalValue, amount]);
  
  /**
   * Generate a new AI recommendation based on current settings
   */
  const generateRecommendation = useCallback(async (amountParam, riskProfileParam, options = {}) => {
    // Use provided params or current state values
    const amountToUse = amountParam !== undefined ? amountParam : amount;
    const riskProfileToUse = riskProfileParam || riskProfile;
    
    setIsLoading(true);
    setGeneratingRecommendation(true);
    setError(null);
    
    try {
      // Build query parameters
      const params = {
        amount: amountToUse,
        riskProfile: riskProfileToUse,
        preserveStakedPositions: options.preserveStakedPositions !== undefined 
          ? options.preserveStakedPositions 
          : preserveStakedPositions
      };
      
      // Add wallet address if available
      if (walletAddress) {
        params.walletAddress = walletAddress;
      }
      
      // Add optional parameters
      if (options.includeMemeTokens) {
        params.includeMemeTokens = true;
      }
      
      if (options.maxProtocols) {
        params.maxProtocols = options.maxProtocols;
      }
      
      if (options.preferredProtocols) {
        params.preferredProtocols = options.preferredProtocols.join(',');
      }
      
      // Request recommendation from API
      const response = await api.get('/recommendations/ai', { params });
      const newRecommendation = response.data;
      
      // Update state
      setRecommendation(newRecommendation);
      
      // Add to history
      addToRecommendationHistory(newRecommendation);
      
      // Save preferences
      localStorage.setItem('lastInvestmentAmount', amountToUse.toString());
      localStorage.setItem('defaultRiskProfile', riskProfileToUse);
      
      // Dispatch event for tracking
      window.dispatchEvent(new CustomEvent('aiRecommendationDisplayed', { 
        detail: { recommendation: newRecommendation } 
      }));
      
      return newRecommendation;
    } catch (err) {
      console.error('Error generating recommendation:', err);
      setError(err.response?.data?.error || 'Failed to generate recommendation');
      
      showNotification({
        type: 'error',
        title: 'Recommendation Failed',
        message: err.response?.data?.error || 'Failed to generate AI recommendation'
      });
      
      return null;
    } finally {
      setIsLoading(false);
      setGeneratingRecommendation(false);
    }
  }, [amount, riskProfile, preserveStakedPositions, walletAddress, showNotification]);
  
  /**
   * Add recommendation to history
   */
  const addToRecommendationHistory = useCallback((newRecommendation) => {
    if (!newRecommendation) return;
    
    // Add timestamp if not present
    const recommendationWithTime = {
      ...newRecommendation,
      timestamp: newRecommendation.timestamp || new Date().toISOString()
    };
    
    setRecommendationHistory(prev => {
      // Check for duplicates
      const isDuplicate = prev.some(r => 
        r.title === recommendationWithTime.title && 
        JSON.stringify(r.allocation) === JSON.stringify(recommendationWithTime.allocation)
      );
      
      if (isDuplicate) return prev;
      
      // Add to beginning of array
      const newHistory = [recommendationWithTime, ...prev];
      
      // Limit history size to 10 items
      const limitedHistory = newHistory.slice(0, 10);
      
      // Store in localStorage
      try {
        localStorage.setItem('aiRecommendationsHistory', JSON.stringify(limitedHistory));
      } catch (error) {
        console.warn('Failed to save recommendation history to localStorage:', error);
      }
      
      return limitedHistory;
    });
  }, []);
  
  /**
   * Execute the recommended investment strategy
   */
  const executeRecommendation = useCallback(async (recommendationToExecute = recommendation) => {
    if (!recommendationToExecute) {
      showNotification({
        type: 'error',
        title: 'Execution Failed',
        message: 'No recommendation to execute'
      });
      return null;
    }
    
    setExecutingRecommendation(true);
    setExecutionResult(null);
    
    try {
      // Prepare operations from recommendation
      const operations = prepareOperationsFromRecommendation(recommendationToExecute);
      
      if (!operations || operations.length === 0) {
        throw new Error('No valid operations could be prepared from the recommendation');
      }
      
      // Request confirmation from the user
      const confirmMessage = `Execute ${operations.length} operations to implement this strategy?`;
      
      if (!window.confirm(confirmMessage)) {
        setExecutingRecommendation(false);
        return { success: false, message: 'Execution cancelled by user' };
      }
      
      // Execute the strategy
      const result = await executeStrategy(operations);
      
      // Update state with result
      setExecutionResult(result);
      
      // Show notification
      showNotification({
        type: result.success ? 'success' : 'warning',
        title: result.success ? 'Strategy Executed' : 'Execution Issues',
        message: result.success ? 
          `Strategy executed successfully! ${result.operations?.length || 0} operations completed.` : 
          `Strategy executed with ${result.failedOperations?.length || 0} failures.`
      });
      
      return result;
    } catch (err) {
      console.error('Strategy execution error:', err);
      
      // Set error result
      setExecutionResult({ 
        success: false, 
        error: err.message,
        message: `Strategy execution failed: ${err.message}`
      });
      
      // Show error notification
      showNotification({
        type: 'error',
        title: 'Execution Failed',
        message: `Error: ${err.message}`
      });
      
      return { success: false, error: err.message };
    } finally {
      setExecutingRecommendation(false);
    }
  }, [recommendation, executeStrategy, showNotification]);
  
  /**
   * Prepare operations from recommendation for execution
   */
  const prepareOperationsFromRecommendation = useCallback((recommendationData) => {
    if (!recommendationData?.allocation) {
      return [];
    }
    
    // Get contract addresses from global or context
    const contractAddresses = window.contractAddresses || {
      amnis: "0x111ae3e5bc816a5e63c2da97d0aa3886519e0cd5e4b046659fa35796bd11542a",
      thala: "0xfaf4e633ae9eb31366c9ca24214231760926576c7b625313b3688b5e900731f6",
      tortuga: "0x952c1b1fc8eb75ee80f432c9d0a84fcda1d5c7481501a7eca9199f1596a60b53",
      ditto: "0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5",
      aries: "0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3",
      echo: "0xeab7ea4d635b6b6add79d5045c4a45d8148d88287b1cfa1c3b6a4b56f46839ed",
      pancakeswap: "0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa",
      liquidswap: "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12",
      cetus: "0x27156bd56eb5637b9adde4d915b596f92d2f28f0ade2eaef48fa73e360e4e8a6"
    };
    
    return recommendationData.allocation.map(item => {
      // Determine operation type
      const type = determineOperationType(item.product);
      
      // Get contract address (normalize protocol name to lowercase)
      const protocolLower = item.protocol.toLowerCase();
      const contractAddress = contractAddresses[protocolLower] || null;
      
      // If no contract address, skip this allocation
      if (!contractAddress) {
        console.warn(`No contract address found for protocol: ${item.protocol}`);
        return null;
      }
      
      // Calculate amount if not explicitly provided
      const amount = item.amount || 
        ((parseFloat(recommendationData.totalInvestment || amount) * parseFloat(item.percentage || 0) / 100).toFixed(2));
      
      // Skip if amount is invalid
      if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        console.warn(`Invalid amount for ${item.protocol}: ${amount}`);
        return null;
      }
      
      return {
        protocol: item.protocol,
        type,
        amount,
        contractAddress,
        functionName: determineFunctionName(item.protocol, type),
        expectedApr: parseFloat(item.expectedApr || 0)
      };
    }).filter(Boolean); // Remove null items
  }, [amount]);
  
  /**
   * Determine operation type based on product description
   */
  const determineOperationType = useCallback((product) => {
    if (!product) return 'stake';
    
    const lower = product.toLowerCase();
    
    if (lower.includes('stake') || lower.includes('stapt') || lower.includes('tapt')) {
      return 'stake';
    }
    if (lower.includes('lend') || lower.includes('lending')) {
      return 'lend';
    }
    if (lower.includes('liquidity') || lower.includes('amm') || lower.includes('pool')) {
      return 'addLiquidity';
    }
    if (lower.includes('vault') || lower.includes('yield')) {
      return 'deposit';
    }
    
    return 'stake'; // Default to staking
  }, []);
  
  /**
   * Determine function name based on protocol and operation type
   */
  const determineFunctionName = useCallback((protocol, operationType) => {
    const functionMappings = {
      'amnis': { 
        'stake': '::staking::stake', 
        'unstake': '::staking::unstake', 
        'lend': '::lending::supply', 
        'withdraw': '::lending::withdraw', 
        'addLiquidity': '::router::add_liquidity', 
        'removeLiquidity': '::router::remove_liquidity' 
      },
      'thala': { 
        'stake': '::staking::stake_apt', 
        'unstake': '::staking::unstake_apt', 
        'lend': '::lending::supply_apt', 
        'withdraw': '::lending::withdraw_apt', 
        'addLiquidity': '::router::add_liquidity', 
        'removeLiquidity': '::router::remove_liquidity' 
      },
      'tortuga': { 
        'stake': '::staking::stake_apt', 
        'unstake': '::staking::unstake_apt' 
      },
      'echo': { 
        'lend': '::lending::supply', 
        'withdraw': '::lending::withdraw' 
      },
      'ditto': { 
        'stake': '::staking::stake', 
        'unstake': '::staking::unstake' 
      },
      'aries': { 
        'lend': '::lending::supply', 
        'withdraw': '::lending::withdraw' 
      },
      'cetus': { 
        'addLiquidity': '::pool::add_liquidity', 
        'removeLiquidity': '::pool::remove_liquidity' 
      },
      'pancakeswap': { 
        'addLiquidity': '::router::add_liquidity', 
        'removeLiquidity': '::router::remove_liquidity', 
        'swap': '::router::swap_exact_input' 
      },
      'liquidswap': { 
        'addLiquidity': '::router::add_liquidity', 
        'removeLiquidity': '::router::remove_liquidity' 
      }
    };

    // If we have a specific mapping for this protocol and operation type, use it
    if (functionMappings[protocol.toLowerCase()]?.[operationType]) {
      return functionMappings[protocol.toLowerCase()][operationType];
    }

    // Otherwise use general mappings
    switch (operationType) {
      case 'stake': return '::staking::stake';
      case 'unstake': return '::staking::unstake';
      case 'lend': return '::lending::supply';
      case 'withdraw': return '::lending::withdraw';
      case 'addLiquidity': return '::router::add_liquidity';
      case 'removeLiquidity': return '::router::remove_liquidity';
      case 'deposit': return '::yield::deposit';
      default: return `::${operationType}::execute`;
    }
  }, []);
  
  /**
   * Compare two recommendations to highlight differences
   */
  const compareRecommendations = useCallback((recommendation1, recommendation2) => {
    if (!recommendation1 || !recommendation2) return null;
    
    const result = {
      aprDifference: parseFloat(recommendation2.totalApr || 0) - parseFloat(recommendation1.totalApr || 0),
      allocationChanges: [],
      newProtocols: [],
      removedProtocols: [],
      riskLevelChange: false
    };
    
    // Compare allocations
    const alloc1Map = new Map();
    recommendation1.allocation?.forEach(item => {
      alloc1Map.set(item.protocol, item);
    });
    
    // Find changes and new protocols
    recommendation2.allocation?.forEach(item => {
      const prev = alloc1Map.get(item.protocol);
      if (prev) {
        // Protocol exists in both recommendations
        if (parseFloat(prev.percentage) !== parseFloat(item.percentage)) {
          result.allocationChanges.push({
            protocol: item.protocol,
            product: item.product,
            prevPercentage: parseFloat(prev.percentage),
            newPercentage: parseFloat(item.percentage),
            percentageChange: parseFloat(item.percentage) - parseFloat(prev.percentage),
            aprChange: parseFloat(item.expectedApr || 0) - parseFloat(prev.expectedApr || 0)
          });
        }
        // Remove from map to track removed protocols
        alloc1Map.delete(item.protocol);
      } else {
        // New protocol
        result.newProtocols.push(item);
      }
    });
    
    // Identify removed protocols
    result.removedProtocols = Array.from(alloc1Map.values());
    
    // Check for risk level change
    if (recommendation1.riskProfile && recommendation2.riskProfile && 
        recommendation1.riskProfile !== recommendation2.riskProfile) {
      result.riskLevelChange = {
        from: recommendation1.riskProfile,
        to: recommendation2.riskProfile
      };
    }
    
    return result;
  }, []);
  
  /**
   * Load stored recommendation history on mount
   */
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem('aiRecommendationsHistory');
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        if (Array.isArray(parsedHistory)) {
          setRecommendationHistory(parsedHistory);
        }
      }
    } catch (err) {
      console.warn('Failed to load recommendation history from localStorage:', err);
    }
  }, []);
  
  /**
   * Update amount input when portfolio data changes
   */
  useEffect(() => {
    if (portfolioData && !amount) {
      const totalValue = portfolioData.totalValueUSD || 0;
      if (totalValue > 0) {
        setAmount(Math.floor(totalValue));
      }
    }
  }, [portfolioData, amount]);
  
  return {
    // States
    isLoading,
    error,
    recommendation,
    recommendationHistory,
    generatingRecommendation,
    executingRecommendation,
    executionResult,
    
    // Form values
    amount,
    riskProfile,
    preserveStakedPositions,
    
    // Form setters
    setAmount,
    setRiskProfile,
    setPreserveStakedPositions,
    
    // Actions
    generateRecommendation,
    executeRecommendation,
    compareRecommendations,
    prepareOperationsFromRecommendation
  };
};

export default useRecommendations;