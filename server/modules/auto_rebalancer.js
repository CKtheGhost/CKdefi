/**
 * auto_rebalancer.js
 * 
 * AI-powered portfolio auto-rebalancing module for CompounDefi
 * Automatically optimizes user portfolios based on market conditions and AI recommendations
 * 
 * Features:
 * - Analyzes portfolio drift and determines when rebalancing is needed
 * - Executes optimal rebalancing operations with minimal gas costs
 * - Supports scheduled automatic rebalancing with configurable thresholds
 * - Integrates with AI recommendation system for optimal allocation targets
 * - Includes safety mechanisms to prevent excessive operations during market volatility
 */

const { Aptos, AptosConfig, Network } = require('@aptos-labs/ts-sdk');
const axios = require('axios');
const aiRecommendation = require('./ai_recommendation');
const portfolioTracker = require('./portfolio_tracker');
const transactionManager = require('./transaction_manager');
const stakingOptimizer = require('./staking_optimizer');
const { getLogger } = require('../utils/logging');
const config = require('../config');

// Instantiate logger once for the module
const logger = getLogger('auto_rebalancer');

// Global configuration
const DEFAULT_SETTINGS = {
  minRebalanceThreshold: 5, // Minimum percentage drift to trigger rebalancing
  maxSlippage: 2.0, // Maximum allowed slippage percentage
  gasBuffer: 1.15, // Gas estimation buffer (15%)
  maxOperationsPerRebalance: 6, // Maximum number of operations per rebalancing session
  cooldownPeriod: 24 * 60 * 60 * 1000, // 24 hours between rebalances
  volatilityThreshold: 15, // Percentage of market volatility to pause rebalancing
  preserveStakedPositions: true, // Don't unstake existing positions by default
  maxPortionToRebalance: 0.5, // Maximum portion of portfolio to rebalance at once
  prioritizeFeeGeneration: true, // Prioritize fee-generating positions
  retryAttempts: 3, // Number of retry attempts for failed operations
  retryDelay: 2000, // Delay between retries (ms)
  safetyChecks: true // Enable safety checks
};

// Contract addresses for major Aptos DeFi protocols
const PROTOCOL_ADDRESSES = {
  // Liquid staking protocols
  amnis: "0x111ae3e5bc816a5e63c2da97d0aa3886519e0cd5e4b046659fa35796bd11542a",
  thala: "0xfaf4e633ae9eb31366c9ca24214231760926576c7b625313b3688b5e900731f6",
  tortuga: "0x952c1b1fc8eb75ee80f432c9d0a84fcda1d5c7481501a7eca9199f1596a60b53",
  ditto: "0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5",
  
  // Lending/borrowing protocols
  aries: "0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3",
  echo: "0xeab7ea4d635b6b6add79d5045c4a45d8148d88287b1cfa1c3b6a4b56f46839ed",
  
  // DEXes
  pancakeswap: "0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa",
  liquidswap: "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12"
};

// Operation types
const OPERATION_TYPES = {
  STAKE: 'stake',
  UNSTAKE: 'unstake',
  LEND: 'lend',
  WITHDRAW: 'withdraw',
  ADD_LIQUIDITY: 'addLiquidity',
  REMOVE_LIQUIDITY: 'removeLiquidity'
};

class AutoRebalancer {
  constructor(userSettings = {}) {
    // Merge default settings with user settings
    this.settings = { ...DEFAULT_SETTINGS, ...userSettings };
    
    // Initialize Aptos client
    this.initializeAptosClient();
    
    // Track rebalancing states
    this.rebalancingInProgress = false;
    this.lastRebalanceTime = {}; // Map of wallet address -> timestamp
    this.rebalanceHistory = {}; // Map of wallet address -> history array
    this.scheduledRebalances = new Map(); // Map of wallet address -> timeout ID
  }
  
  /**
   * Initialize Aptos client with configured network
   */
  async initializeAptosClient() {
    try {
      const network = process.env.APTOS_NETWORK === 'TESTNET' ? Network.TESTNET : Network.MAINNET;
      const aptosConfig = new AptosConfig({ network });
      this.aptos = new Aptos(aptosConfig);
      logger.info('Aptos client initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Aptos client:', error);
      throw new Error('Failed to initialize Aptos client: ' + error.message);
    }
  }

  /**
   * Check if rebalancing is needed for a wallet
   * @param {string} walletAddress - User's wallet address
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Analysis result with drift percentages
   */
  async checkRebalanceNeeded(walletAddress, options = {}) {
    try {
      logger.info(`Checking if rebalance needed for wallet: ${walletAddress}`);
      
      // Get current portfolio data
      const portfolioData = await portfolioTracker.getPortfolioData(walletAddress);
      
      // Get AI recommendation for optimal allocation
      const riskProfile = options.riskProfile || await this.determineRiskProfile(walletAddress, portfolioData);
      
      // Request AI recommendation with cached=true to use existing recommendation if recent enough
      const recommendation = await aiRecommendation.generateRecommendation({
        walletAddress,
        riskProfile,
        amount: portfolioData.totalValueUSD || 100,
        cached: true
      });
      
      // Calculate drift between current and recommended allocation
      const driftAnalysis = this.calculateDrift(portfolioData, recommendation);
      
      // Check if market conditions are too volatile for rebalancing
      const marketVolatility = await this.checkMarketVolatility();
      const isVolatile = marketVolatility > this.settings.volatilityThreshold;
      
      // Return analysis
      return {
        walletAddress,
        needsRebalancing: driftAnalysis.maxDrift >= this.settings.minRebalanceThreshold && !isVolatile,
        maxDrift: driftAnalysis.maxDrift,
        avgDrift: driftAnalysis.avgDrift,
        driftDetails: driftAnalysis.drifts,
        marketConditions: {
          volatility: marketVolatility,
          isVolatile
        },
        lastRebalanced: this.lastRebalanceTime[walletAddress] || null,
        cooldownRemaining: this.calculateCooldownRemaining(walletAddress)
      };
    } catch (error) {
      logger.error(`Error checking rebalance need for ${walletAddress}:`, error);
      throw new Error(`Failed to check rebalance need: ${error.message}`);
    }
  }
  
  /**
   * Calculate drift between current portfolio and recommended allocation
   * @param {Object} portfolio - Current portfolio data
   * @param {Object} recommendation - AI recommendation with target allocation
   * @returns {Object} Drift analysis
   */
  calculateDrift(portfolio, recommendation) {
    // Normalize portfolio data to percentage allocations
    const totalValue = parseFloat(portfolio.totalValueUSD || 0);
    if (totalValue <= 0) {
      return { maxDrift: 0, avgDrift: 0, drifts: [] };
    }
    
    const currentAllocation = [];
    
    // Extract native APT allocation
    if (portfolio.apt && parseFloat(portfolio.apt.amount) > 0) {
      currentAllocation.push({
        protocol: 'native',
        percentage: (portfolio.apt.valueUSD / totalValue * 100).toFixed(2),
        amount: portfolio.apt.amount,
        valueUSD: portfolio.apt.valueUSD
      });
    }
    
    // Extract staked tokens allocation
    const stakedTokens = {
      'amnis': 'stAPT',
      'thala': 'sthAPT', 
      'tortuga': 'tAPT',
      'ditto': 'dAPT'
    };
    
    for (const [protocol, tokenKey] of Object.entries(stakedTokens)) {
      if (portfolio[tokenKey] && parseFloat(portfolio[tokenKey].amount) > 0) {
        currentAllocation.push({
          protocol,
          percentage: (portfolio[tokenKey].valueUSD / totalValue * 100).toFixed(2),
          amount: portfolio[tokenKey].amount,
          valueUSD: portfolio[tokenKey].valueUSD,
          type: 'staking'
        });
      }
    }
    
    // Extract AMM liquidity positions
    if (portfolio.ammLiquidity && portfolio.ammLiquidity.hasLiquidity) {
      if (portfolio.ammLiquidity.positions && portfolio.ammLiquidity.positions.length > 0) {
        portfolio.ammLiquidity.positions.forEach(position => {
          if (position.valueUSD > 0) {
            currentAllocation.push({
              protocol: position.protocol || 'amm',
              percentage: (position.valueUSD / totalValue * 100).toFixed(2),
              valueUSD: position.valueUSD,
              type: 'liquidity'
            });
          }
        });
      } else {
        currentAllocation.push({
          protocol: 'amm',
          percentage: (portfolio.ammLiquidity.valueUSD / totalValue * 100).toFixed(2),
          valueUSD: portfolio.ammLiquidity.valueUSD,
          type: 'liquidity'
        });
      }
    }
    
    // Get recommended allocation
    const targetAllocation = recommendation.allocation.reduce((map, item) => {
      map[item.protocol.toLowerCase()] = {
        percentage: parseFloat(item.percentage),
        protocol: item.protocol,
        product: item.product
      };
      return map;
    }, {});
    
    // Calculate drifts
    const drifts = [];
    let maxDrift = 0, totalDrift = 0;
    
    // Check drift for current allocations vs targets
    currentAllocation.forEach(current => {
      const protocolKey = current.protocol.toLowerCase();
      const target = targetAllocation[protocolKey];
      
      if (target) {
        // Protocol exists in both current and target
        const currentPct = parseFloat(current.percentage);
        const targetPct = target.percentage;
        const drift = Math.abs(currentPct - targetPct);
        
        drifts.push({
          protocol: current.protocol,
          type: current.type || 'holding',
          current: currentPct,
          target: targetPct,
          drift,
          action: currentPct > targetPct ? 'decrease' : 'increase'
        });
        
        maxDrift = Math.max(maxDrift, drift);
        totalDrift += drift;
        
        // Remove from target map to track what's left
        delete targetAllocation[protocolKey];
      } else {
        // Protocol in current but not in target (should be reduced to 0)
        drifts.push({
          protocol: current.protocol,
          type: current.type || 'holding',
          current: parseFloat(current.percentage),
          target: 0,
          drift: parseFloat(current.percentage),
          action: 'decrease'
        });
        
        maxDrift = Math.max(maxDrift, parseFloat(current.percentage));
        totalDrift += parseFloat(current.percentage);
      }
    });
    
    // Add protocols that are in target but not in current
    Object.values(targetAllocation).forEach(target => {
      drifts.push({
        protocol: target.protocol,
        type: this.determineProtocolType(target.product),
        current: 0,
        target: target.percentage,
        drift: target.percentage,
        action: 'add'
      });
      
      maxDrift = Math.max(maxDrift, target.percentage);
      totalDrift += target.percentage;
    });
    
    // Calculate average drift
    const avgDrift = drifts.length > 0 ? totalDrift / drifts.length : 0;
    
    return {
      maxDrift,
      avgDrift,
      drifts: drifts.sort((a, b) => b.drift - a.drift) // Sort by highest drift first
    };
  }
  
  /**
   * Determines the protocol type based on product description
   * @param {string} product - Product description
   * @returns {string} Protocol type
   */
  determineProtocolType(product) {
    if (!product) return 'holding';
    
    const lowerProduct = product.toLowerCase();
    
    if (lowerProduct.includes('stake') || lowerProduct.includes('stapt') || lowerProduct.includes('apt') && lowerProduct.includes('st')) {
      return 'staking';
    }
    
    if (lowerProduct.includes('lend') || lowerProduct.includes('supply') || lowerProduct.includes('deposit')) {
      return 'lending';
    }
    
    if (lowerProduct.includes('liquidity') || lowerProduct.includes('pool') || lowerProduct.includes('swap')) {
      return 'liquidity';
    }
    
    return 'holding';
  }
  
  /**
   * Check market volatility to determine if rebalancing is safe
   * @returns {Promise<number>} Volatility percentage
   */
  async checkMarketVolatility() {
    try {
      // Get APT price volatility as indicator
      const response = await axios.get('https://api.coingecko.com/api/v3/coins/aptos/market_chart', {
        params: {
          vs_currency: 'usd',
          days: 1,
          interval: 'hourly'
        }
      });
      
      // Calculate 24h volatility from price data
      const prices = response.data.prices.map(p => p[1]);
      if (prices.length < 2) return 0;
      
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      const volatility = ((max - min) / min) * 100;
      
      logger.info(`Market volatility: ${volatility.toFixed(2)}%`);
      return volatility;
    } catch (error) {
      logger.warn('Failed to check market volatility:', error);
      return 0; // Return 0 to not block rebalancing on API failure
    }
  }
  
  /**
   * Calculate remaining cooldown time for a wallet
   * @param {string} walletAddress - User's wallet address
   * @returns {number} Milliseconds remaining in cooldown (0 if ready)
   */
  calculateCooldownRemaining(walletAddress) {
    const lastRebalance = this.lastRebalanceTime[walletAddress];
    if (!lastRebalance) return 0;
    
    const now = Date.now();
    const elapsed = now - lastRebalance;
    const remaining = Math.max(0, this.settings.cooldownPeriod - elapsed);
    
    return remaining;
  }
  
  /**
   * Determine user's risk profile based on portfolio data
   * @param {string} walletAddress - User's wallet address
   * @param {Object} portfolioData - Current portfolio data
   * @returns {Promise<string>} Risk profile (conservative/balanced/aggressive)
   */
  async determineRiskProfile(walletAddress, portfolioData) {
    try {
      // First check if user has a saved preference
      const userPreferences = await this.getUserPreferences(walletAddress);
      if (userPreferences && userPreferences.riskProfile) {
        return userPreferences.riskProfile;
      }
      
      // Default to balanced if no portfolio data available
      if (!portfolioData || !portfolioData.totalValueUSD) {
        return 'balanced';
      }
      
      // Analyze portfolio composition to determine risk profile
      const totalValue = parseFloat(portfolioData.totalValueUSD);
      const nativeApt = parseFloat(portfolioData.apt?.valueUSD || 0);
      const stakedValue = ['stAPT', 'sthAPT', 'tAPT', 'dAPT'].reduce((sum, key) => {
        return sum + parseFloat(portfolioData[key]?.valueUSD || 0);
      }, 0);
      const liquidityValue = parseFloat(portfolioData.ammLiquidity?.valueUSD || 0);
      
      // Calculate portfolio distribution percentages
      const nativePercentage = (nativeApt / totalValue) * 100;
      const stakedPercentage = (stakedValue / totalValue) * 100;
      const liquidityPercentage = (liquidityValue / totalValue) * 100;
      
      // Risk profile determination logic
      if (liquidityPercentage > 30) {
        // High liquidity provision indicates aggressive risk profile
        return 'aggressive';
      } else if (stakedPercentage > 60) {
        // Mostly staking indicates balanced risk profile
        return 'balanced';
      } else if (nativePercentage > 70) {
        // Mostly native APT indicates conservative risk profile
        return 'conservative';
      }
      
      // Default to balanced
      return 'balanced';
    } catch (error) {
      logger.warn(`Error determining risk profile for ${walletAddress}:`, error);
      return 'balanced'; // Default to balanced risk profile on error
    }
  }
  
  /**
   * Get user preferences from database
   * @param {string} walletAddress - User's wallet address
   * @returns {Promise<Object>} User preferences
   */
  async getUserPreferences(walletAddress) {
    // This would typically be fetched from a database
    // For now, we'll return a mock implementation
    return {
      riskProfile: 'balanced', // Default risk profile
      autoRebalance: true,
      rebalanceThreshold: 5,
      preserveStakedPositions: true
    };
  }
  
  /**
   * Execute portfolio rebalancing
   * @param {string} walletAddress - User's wallet address
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} Rebalancing result
   */
  async executeRebalance(walletAddress, options = {}) {
    // Check if rebalancing is already in progress
    if (this.rebalancingInProgress) {
      throw new Error('Another rebalancing is already in progress');
    }
    
    this.rebalancingInProgress = true;
    logger.info(`Starting rebalance for wallet: ${walletAddress}`);
    
    try {
      // Check cooldown period if not forced
      if (!options.force) {
        const cooldownRemaining = this.calculateCooldownRemaining(walletAddress);
        if (cooldownRemaining > 0) {
          throw new Error(`Rebalancing in cooldown. Try again in ${Math.ceil(cooldownRemaining / (60 * 1000))} minutes`);
        }
      }
      
      // Get current portfolio data
      const portfolioData = await portfolioTracker.getPortfolioData(walletAddress);
      
      // Get AI recommendation for optimal allocation
      const riskProfile = options.riskProfile || await this.determineRiskProfile(walletAddress, portfolioData);
      const recommendation = await aiRecommendation.generateRecommendation({
        walletAddress,
        riskProfile,
        amount: portfolioData.totalValueUSD || 100,
        cached: false // Force fresh recommendation
      });
      
      // Check if rebalancing is needed
      const driftAnalysis = this.calculateDrift(portfolioData, recommendation);
      
      if (driftAnalysis.maxDrift < this.settings.minRebalanceThreshold && !options.force) {
        logger.info(`Rebalancing not needed for ${walletAddress}. Max drift: ${driftAnalysis.maxDrift.toFixed(2)}%`);
        
        this.rebalancingInProgress = false;
        return {
  walletAddress,
  success: executionResult.failed.length === 0,
  message: `Rebalancing executed with ${executionResult.successful.length} successful operations`,
  operations: executionResult.successful,
  failedOperations: executionResult.failed,
  driftAnalysis
};
      }
      
      // Generate rebalancing operations
      const operations = await this.generateRebalanceOperations(portfolioData, recommendation, options);
      
      if (operations.length === 0) {
        logger.info(`No viable operations generated for ${walletAddress}`);
        
        this.rebalancingInProgress = false;
        return {
          walletAddress,
          success: true,
          message: 'No viable operations needed for rebalancing',
          operations: [],
          driftAnalysis
        };
      }
      
      // Limit the number of operations if necessary
      const operationsToExecute = operations.slice(0, this.settings.maxOperationsPerRebalance);
      
      logger.info(`Executing ${operationsToExecute.length} rebalance operations for ${walletAddress}`);
      
      // Execute operations using transaction manager
      const executionResult = await transactionManager.executeOperations(walletAddress, operationsToExecute);
      
      // Update last rebalance time and add to history
      this.lastRebalanceTime[walletAddress] = Date.now();
      this.addToRebalanceHistory(walletAddress, {
        timestamp: new Date().toISOString(),
        operations: operationsToExecute.length,
        successfulOperations: executionResult.successful.length,
        failedOperations: executionResult.failed.length,
        driftBefore: driftAnalysis.maxDrift
      });
      
      // Clear any scheduled rebalance for this wallet
      this.clearScheduledRebalance(walletAddress);
      
      // Return result
      return {
        walletAddress,
        success: executionResult.failed.length === 0,
        message: `Rebalancing executed with ${executionResult.successful.length} successful operations`,
        operations: executionResult.successful,
        failedOperations: executionResult.failed,
        driftAnalysis
      };
    } catch (error) {
      logger.error(`Error executing rebalance for ${walletAddress}:`, error);
      
      // Add error to history
      this.addToRebalanceHistory(walletAddress, {
        timestamp: new Date().toISOString(),
        error: error.message,
        success: false
      });
      
      throw error;
    } finally {
      this.rebalancingInProgress = false;
    }
  }
  
  /**
   * Generate optimal rebalancing operations
   * @param {Object} portfolioData - Current portfolio data
   * @param {Object} recommendation - AI recommendation
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} Array of operations to execute
   */
  async generateRebalanceOperations(portfolioData, recommendation, options = {}) {
    logger.info('Generating rebalance operations');
    
    const operations = [];
    const driftAnalysis = this.calculateDrift(portfolioData, recommendation);
    
    // Get APT price for calculations
    const aptPrice = portfolioData.apt?.valueUSD / portfolioData.apt?.amount || 10; // Fallback price
    
    // First process all withdrawals and unstaking
    const withdrawOperations = driftAnalysis.drifts
      .filter(drift => drift.action === 'decrease' && drift.drift >= this.settings.minRebalanceThreshold)
      .filter(drift => {
        // Skip staked positions if setting is enabled
        if (this.settings.preserveStakedPositions && drift.type === 'staking') {
          return false;
        }
        return true;
      })
      .map(drift => {
        const protocol = drift.protocol;
        
        // Skip native APT (can't "withdraw" it)
        if (protocol === 'native') return null;
        
        // Determine operation type based on protocol type
        let operationType;
        if (drift.type === 'staking') {
          operationType = OPERATION_TYPES.UNSTAKE;
        } else if (drift.type === 'lending') {
          operationType = OPERATION_TYPES.WITHDRAW;
        } else if (drift.type === 'liquidity') {
          operationType = OPERATION_TYPES.REMOVE_LIQUIDITY;
        } else {
          return null; // Skip if unknown type
        }
        
        // Calculate amount to withdraw (based on drift percentage)
        const amountInUSD = (drift.drift / 100) * portfolioData.totalValueUSD;
        const amountInAPT = amountInUSD / aptPrice;
        
        // Get contract address
        const contractAddress = PROTOCOL_ADDRESSES[protocol.toLowerCase()] || null;
        if (!contractAddress) return null;
        
        return {
          protocol,
          type: operationType,
          amount: amountInAPT.toFixed(4),
          amountUSD: amountInUSD.toFixed(2),
          contractAddress,
          functionName: this.getFunctionName(protocol, operationType)
        };
      })
      .filter(op => op !== null); // Remove null operations
    
    operations.push(...withdrawOperations);
    
    // Then process all deposits and staking
    const depositOperations = driftAnalysis.drifts
      .filter(drift => (drift.action === 'increase' || drift.action === 'add') && drift.drift >= this.settings.minRebalanceThreshold)
      .map(drift => {
        const protocol = drift.protocol;
        
        // Skip native APT (can't "stake" it directly)
        if (protocol === 'native') return null;
        
        // Determine operation type based on protocol type
        let operationType;
        if (drift.type === 'staking') {
          operationType = OPERATION_TYPES.STAKE;
        } else if (drift.type === 'lending') {
          operationType = OPERATION_TYPES.LEND;
        } else if (drift.type === 'liquidity') {
          operationType = OPERATION_TYPES.ADD_LIQUIDITY;
        } else {
          return null; // Skip if unknown type
        }
        
        // Calculate amount to deposit (based on drift percentage)
        const amountInUSD = (drift.drift / 100) * portfolioData.totalValueUSD;
        const amountInAPT = amountInUSD / aptPrice;
        
        // Get contract address
        const contractAddress = PROTOCOL_ADDRESSES[protocol.toLowerCase()] || null;
        if (!contractAddress) return null;
        
        return {
          protocol,
          type: operationType,
          amount: amountInAPT.toFixed(4),
          amountUSD: amountInUSD.toFixed(2),
          contractAddress,
          functionName: this.getFunctionName(protocol, operationType)
        };
      })
      .filter(op => op !== null); // Remove null operations
    
    operations.push(...depositOperations);
    
    // Filter out operations with amounts that are too small
    return operations.filter(op => parseFloat(op.amount) >= 0.01);
  }
  
  /**
   * Get appropriate function name for protocol and operation type
   * @param {string} protocol - Protocol name
   * @param {string} operationType - Operation type
   * @returns {string} Function name
   */
  getFunctionName(protocol, operationType) {
    // Protocol-specific function mappings
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
      'ditto': { 
        'stake': '::staking::stake', 
        'unstake': '::staking::unstake' 
      },
      'echo': { 
        'lend': '::lending::supply', 
        'withdraw': '::lending::withdraw' 
      },
      'pancakeswap': { 
        'addLiquidity': '::router::add_liquidity', 
        'removeLiquidity': '::router::remove_liquidity' 
      },
      'liquid cardiacswap': { 
        'addLiquidity': '::router::add_liquidity', 
        'removeLiquidity': '::router::remove_liquidity' 
      }
    };
    
    const protocolLower = protocol.toLowerCase();
    const operationLower = operationType.toLowerCase();
    
    // Check for protocol-specific function
    if (functionMappings[protocolLower]?.[operationLower]) {
      return functionMappings[protocolLower][operationLower];
    }
    
    // Generic function name mapping
    const genericFunctionNames = {
      'stake': '::staking::stake',
      'unstake': '::staking::unstake',
      'lend': '::lending::supply',
      'withdraw': '::lending::withdraw',
      'addLiquidity': '::router::add_liquidity',
      'removeLiquidity': '::router::remove_liquidity'
    };
    
    return genericFunctionNames[operationLower] || `::${operationLower}::execute`;
  }
  
  /**
   * Add entry to rebalance history
   * @param {string} walletAddress - User's wallet address
   * @param {Object} entry - History entry
   */
  addToRebalanceHistory(walletAddress, entry) {
    if (!this.rebalanceHistory[walletAddress]) {
      this.rebalanceHistory[walletAddress] = [];
    }
    
    this.rebalanceHistory[walletAddress].unshift(entry);
    
    // Keep history size manageable
    const maxHistorySize = 10;
    if (this.rebalanceHistory[walletAddress].length > maxHistorySize) {
      this.rebalanceHistory[walletAddress] = this.rebalanceHistory[walletAddress].slice(0, maxHistorySize);
    }
    
    logger.info(`Added rebalance history entry for ${walletAddress}`);
  }
  
  /**
   * Get rebalance history for a wallet
   * @param {string} walletAddress - User's wallet address
   * @param {number} limit - Maximum number of entries to return
   * @returns {Array} Rebalance history entries
   */
  getRebalanceHistory(walletAddress, limit = 10) {
    if (!this.rebalanceHistory[walletAddress]) {
      return [];
    }
    
    return this.rebalanceHistory[walletAddress].slice(0, limit);
  }
  
  /**
   * Schedule a rebalance for a future time
   * @param {string} walletAddress - User's wallet address
   * @param {Object} options - Schedule options
   * @returns {Promise<Object>} Schedule result
   */
  async scheduleRebalance(walletAddress, options = {}) {
    try {
      // Clear any existing scheduled rebalance
      this.clearScheduledRebalance(walletAddress);
      
      // Determine when to schedule the rebalance
      const delayMs = options.delayMs || this.settings.cooldownPeriod;
      
      // Check if portfolio analysis is needed before scheduling
      let shouldSchedule = true;
      if (options.onlyIfNeeded) {
        const analysis = await this.checkRebalanceNeeded(walletAddress);
        shouldSchedule = analysis.needsRebalancing;
        
        if (!shouldSchedule) {
          logger.info(`Not scheduling rebalance for ${walletAddress} - not needed`);
          return {
            walletAddress,
            scheduled: false,
            message: 'Rebalance not needed based on current portfolio',
            driftAnalysis: analysis
          };
        }
      }
      
      // Schedule the rebalance
      const scheduledTime = Date.now() + delayMs;
      const timeoutId = setTimeout(() => {
        this.executeRebalance(walletAddress, options)
          .catch(error => {
            logger.error(`Scheduled rebalance failed for ${walletAddress}:`, error);
          });
      }, delayMs);
      
      // Store the timeout ID for potential cancellation
      this.scheduledRebalances.set(walletAddress, {
        timeoutId,
        scheduledTime,
        options
      });
      
      logger.info(`Scheduled rebalance for ${walletAddress} at ${new Date(scheduledTime).toISOString()}`);
      
      return {
        walletAddress,
        scheduled: true,
        scheduledTime: new Date(scheduledTime).toISOString(),
        timeRemaining: delayMs
      };
    } catch (error) {
      logger.error(`Error scheduling rebalance for ${walletAddress}:`, error);
      throw error;
    }
  }
  
  /**
   * Clear a scheduled rebalance
   * @param {string} walletAddress - User's wallet address
   * @returns {boolean} Whether a scheduled rebalance was cleared
   */
  clearScheduledRebalance(walletAddress) {
    const scheduled = this.scheduledRebalances.get(walletAddress);
    if (scheduled) {
      clearTimeout(scheduled.timeoutId);
      this.scheduledRebalances.delete(walletAddress);
      logger.info(`Cleared scheduled rebalance for ${walletAddress}`);
      return true;
    }
    return false;
  }
  
  /**
   * Get scheduled rebalance info
   * @param {string} walletAddress - User's wallet address
   * @returns {Object|null} Scheduled rebalance info or null if none
   */
  getScheduledRebalance(walletAddress) {
    const scheduled = this.scheduledRebalances.get(walletAddress);
    if (!scheduled) return null;
    
    const now = Date.now();
    const timeRemaining = Math.max(0, scheduled.scheduledTime - now);
    
    return {
      walletAddress,
      scheduledTime: new Date(scheduled.scheduledTime).toISOString(),
      timeRemaining,
      options: scheduled.options
    };
  }
  
  /**
   * Set auto-rebalance settings for a user
   * @param {string} walletAddress - User's wallet address
   * @param {Object} settings - New settings
   * @returns {Object} Updated settings
   */
  async setRebalanceSettings(walletAddress, settings = {}) {
    try {
      // This would typically update settings in a database
      // For now, we'll just update in-memory settings
      
      // Update settings with valid values
      if (settings.minRebalanceThreshold !== undefined) {
        this.settings.minRebalanceThreshold = Math.max(1, Math.min(20, settings.minRebalanceThreshold));
      }
      
      if (settings.maxSlippage !== undefined) {
        this.settings.maxSlippage = Math.max(0.1, Math.min(5, settings.maxSlippage));
      }
      
      if (settings.cooldownPeriod !== undefined) {
        // Convert hours to milliseconds if needed
        const cooldown = settings.cooldownPeriod > 1000 ? 
          settings.cooldownPeriod : 
          settings.cooldownPeriod * 60 * 60 * 1000;
          
        this.settings.cooldownPeriod = Math.max(1 * 60 * 60 * 1000, cooldown); // Min 1 hour
      }
      
      if (settings.preserveStakedPositions !== undefined) {
        this.settings.preserveStakedPositions = Boolean(settings.preserveStakedPositions);
      }
      
      if (settings.maxOperationsPerRebalance !== undefined) {
        this.settings.maxOperationsPerRebalance = Math.max(1, Math.min(10, settings.maxOperationsPerRebalance));
      }
      
      logger.info(`Updated rebalance settings for ${walletAddress}`);
      
      return { ...this.settings };
    } catch (error) {
      logger.error(`Error setting rebalance settings for ${walletAddress}:`, error);
      throw error;
    }
  }
  
  /**
   * Get current rebalance settings
   * @returns {Object} Current settings
   */
  getRebalanceSettings() {
    return { ...this.settings };
  }
  
  /**
   * Monitor a wallet for drift and auto-rebalance when needed
   * @param {string} walletAddress - User's wallet address
   * @param {Object} options - Monitoring options
   * @returns {Object} Monitoring status
   */
  async enableAutoRebalanceMonitoring(walletAddress, options = {}) {
    try {
      // Check if already scheduled
      const existing = this.getScheduledRebalance(walletAddress);
      if (existing) {
        logger.info(`Auto-rebalance already scheduled for ${walletAddress}`);
        return existing;
      }
      
      // Check current portfolio status
      const analysis = await this.checkRebalanceNeeded(walletAddress);
      
      // If rebalancing is needed now, execute immediately
      if (analysis.needsRebalancing && !analysis.marketConditions.isVolatile) {
        logger.info(`Immediate rebalance needed for ${walletAddress}`);
        
        // Schedule immediate rebalance (small delay to not block the response)
        return this.scheduleRebalance(walletAddress, {
          delayMs: 5000, // 5 seconds
          ...options
        });
      }
      
      // Otherwise, schedule for next check
      const checkInterval = options.checkInterval || (4 * 60 * 60 * 1000); // Default 4 hours
      
      logger.info(`Scheduling auto-rebalance monitoring for ${walletAddress} every ${checkInterval/3600000} hours`);
      
      // Store interval ID for later cleanup
      const intervalId = setInterval(async () => {
        try {
          // Check if rebalance is needed
          const checkResult = await this.checkRebalanceNeeded(walletAddress);
          
          if (checkResult.needsRebalancing && !checkResult.marketConditions.isVolatile) {
            logger.info(`Auto-rebalance check triggered rebalance for ${walletAddress}`);
            
            // Execute rebalance
            await this.executeRebalance(walletAddress, options);
          } else {
            logger.info(`Auto-rebalance check: no action needed for ${walletAddress}`);
          }
        } catch (error) {
          logger.error(`Error in auto-rebalance check for ${walletAddress}:`, error);
        }
      }, checkInterval);
      
      // Store monitoring info
      this.autoRebalanceMonitoring = this.autoRebalanceMonitoring || new Map();
      this.autoRebalanceMonitoring.set(walletAddress, {
        intervalId,
        startTime: Date.now(),
        options,
        checkInterval
      });
      
      return {
        walletAddress,
        monitoring: true,
        checkInterval,
        nextCheck: new Date(Date.now() + checkInterval).toISOString()
      };
    } catch (error) {
      logger.error(`Error enabling auto-rebalance monitoring for ${walletAddress}:`, error);
      throw error;
    }
  }
  
  /**
   * Disable auto-rebalance monitoring for a wallet
   * @param {string} walletAddress - User's wallet address
   * @returns {boolean} Whether monitoring was disabled
   */
  disableAutoRebalanceMonitoring(walletAddress) {
    if (!this.autoRebalanceMonitoring) return false;
    
    const monitoring = this.autoRebalanceMonitoring.get(walletAddress);
    if (monitoring) {
      clearInterval(monitoring.intervalId);
      this.autoRebalanceMonitoring.delete(walletAddress);
      
      // Also clear any scheduled rebalance
      this.clearScheduledRebalance(walletAddress);
      
      logger.info(`Disabled auto-rebalance monitoring for ${walletAddress}`);
      return true;
    }
    
    return false;
  }
  
  /**
   * Get auto-rebalance monitoring status
   * @param {string} walletAddress - User's wallet address
   * @returns {Object|null} Monitoring status or null if not monitored
   */
  getAutoRebalanceMonitoringStatus(walletAddress) {
    if (!this.autoRebalanceMonitoring) return null;
    
    const monitoring = this.autoRebalanceMonitoring.get(walletAddress);
    if (!monitoring) return null;
    
    const now = Date.now();
    const elapsed = now - monitoring.startTime;
    const nextCheck = monitoring.startTime + monitoring.checkInterval - (elapsed % monitoring.checkInterval);
    
    return {
      walletAddress,
      monitoring: true,
      startTime: new Date(monitoring.startTime).toISOString(),
      checkInterval: monitoring.checkInterval,
      nextCheck: new Date(nextCheck).toISOString(),
      timeUntilNextCheck: nextCheck - now,
      options: monitoring.options
    };
  }
}

module.exports = new AutoRebalancer();