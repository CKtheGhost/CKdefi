// recommendationController.js
// Handles AI-powered recommendations and optimization
const { Anthropic } = require('@anthropic-ai/sdk');
const { OpenAI } = require('openai');
const stakingOptimizer = require('../modules/staking_optimizer');
const aiRecommendation = require('../modules/ai_recommendation');
const portfolioTracker = require('../modules/portfolio_tracker');
const tokenTracker = require('../modules/token_tracker');
const newsTracker = require('../modules/news_tracker');
const autoRebalancer = require('../modules/auto_rebalancer');
const { handleError } = require('../middleware/errorHandler');
const { cacheData } = require('../middleware/caching');
const config = require('../config');

// Initialize AI clients
let anthropicClient = null;
let openaiClient = null;

if (process.env.ANTHROPIC_API_KEY) {
  anthropicClient = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });
}

if (process.env.OPENAI_API_KEY) {
  openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

/**
 * Generate AI-powered investment recommendations
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAiRecommendation = async (req, res) => {
  try {
    const { amount, riskProfile, walletAddress } = req.query;

    // Input validation
    if (!amount || isNaN(parseFloat(amount)) || !riskProfile) {
      return res.status(400).json({ 
        error: 'Invalid parameters. Required: amount (number) and riskProfile (conservative/balanced/aggressive)' 
      });
    }

    // Verify AI clients availability
    if (!anthropicClient && !openaiClient) {
      throw new Error('No AI API keys available. Set ANTHROPIC_API_KEY or OPENAI_API_KEY in .env file.');
    }

    // Fetch required data for recommendation
    let stakingData;
    try {
      // Use cached staking data if available
      const cachedStakingData = cacheData.get('staking_data');
      if (cachedStakingData) {
        stakingData = cachedStakingData;
      } else {
        stakingData = await stakingOptimizer.getStakingData();
        cacheData.set('staking_data', stakingData, 10 * 60); // Cache for 10 minutes
      }
    } catch (stakingError) {
      console.error('Error fetching staking data:', stakingError);
      stakingData = { protocols: {}, strategies: {} };
    }
    
    // Fetch market news
    let newsData;
    try {
      const cachedNewsData = cacheData.get('news_data');
      if (cachedNewsData) {
        newsData = cachedNewsData;
      } else {
        newsData = await newsTracker.getLatestNews();
        cacheData.set('news_data', newsData, 15 * 60); // Cache for 15 minutes
      }
    } catch (newsError) {
      console.error('Error fetching news data:', newsError);
      newsData = { articles: [] };
    }
    
    // Fetch token data
    let tokenData;
    try {
      const cachedTokenData = cacheData.get('token_data');
      if (cachedTokenData) {
        tokenData = cachedTokenData;
      } else {
        tokenData = await tokenTracker.getMemeCoinData();
        cacheData.set('token_data', tokenData, 5 * 60); // Cache for 5 minutes
      }
    } catch (tokenError) {
      console.error('Error fetching token data:', tokenError);
      tokenData = { coins: [] };
    }
    
    // Fetch portfolio data if wallet address provided
    let portfolioData = null;
    if (walletAddress) {
      try {
        portfolioData = await portfolioTracker.getPortfolioData(walletAddress);
      } catch (portfolioError) {
        console.error('Error fetching portfolio data:', portfolioError);
      }
    }

    // Generate AI recommendation
    let recommendation;
    try {
      // Use dedicated AI recommendation module
      recommendation = await aiRecommendation.generateRecommendation({
        amount: parseFloat(amount),
        riskProfile,
        walletAddress,
        portfolioData,
        stakingData,
        newsData,
        tokenData,
        anthropicClient,
        openaiClient
      });
    } catch (aiError) {
      throw new Error(`Failed to generate AI recommendation: ${aiError.message}`);
    }

    // Add execution capabilities if wallet is connected
    if (walletAddress && parseFloat(amount) > 0) {
      recommendation.agentCapabilities = {
        canExecuteTransactions: true,
        supportedOperations: generateSupportedOperations(recommendation.allocation, stakingData, amount)
      };
    }
    
    // Add UI configuration
    recommendation.ui = {
      lastUpdated: new Date().toISOString(),
      animationDelay: 300,
      chartColors: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'],
      visualizationType: 'doughnut'
    };
    
    // Cache recommendation if wallet address is provided
    if (walletAddress) {
      cacheData.set(`ai_recommendation_${walletAddress}_${riskProfile}`, recommendation, 30 * 60); // 30 minutes
    }

    res.json(recommendation);
  } catch (error) {
    handleError(error, req, res, 'Error generating AI recommendation');
  }
};

/**
 * Execute recommended investment strategy
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.executeStrategy = async (req, res) => {
  try {
    const { 
      walletAddress, 
      amount, 
      allocation, 
      operations 
    } = req.body;
    
    console.log('Execute strategy request:', JSON.stringify(req.body, null, 2));
    
    if (!walletAddress || !amount || !allocation || !operations || !Array.isArray(operations)) {
      return res.status(400).json({ 
        error: 'Invalid request parameters. Required: walletAddress, amount, allocation, operations[]' 
      });
    }

    const results = {
      success: true,
      wallet: walletAddress,
      totalAmount: amount,
      operations: [],
      failed: []
    };
    
    // Process operations
    for (const operation of operations) {
      try {
        if (!operation.contractAddress) {
          throw new Error(`Missing contract address for ${operation.protocol}`);
        }
        
        if (!operation.type) {
          throw new Error(`Missing operation type for ${operation.protocol}`);
        }
        
        if (!operation.amount || isNaN(parseFloat(operation.amount)) || parseFloat(operation.amount) <= 0) {
          throw new Error(`Invalid amount for ${operation.protocol}: ${operation.amount}`);
        }
        
        // Execute the operation
        // Note: In a real implementation, this would connect with 
        // the user's wallet for transaction signing
        const result = {
          operation: operation.type,
          protocol: operation.protocol,
          amount: operation.amount,
          status: 'success',
          transactionHash: `0x${Math.random().toString(16).substring(2, 42)}`,
          timestamp: new Date().toISOString()
        };
        
        results.operations.push(result);
      } catch (opError) {
        console.error(`Operation failed:`, opError);
        
        results.failed.push({
          operation: operation.type,
          protocol: operation.protocol,
          amount: operation.amount,
          status: 'failed',
          error: opError.message,
          timestamp: new Date().toISOString()
        });
        
        results.success = false;
      }
    }
    
    results.successfulOperations = results.operations.length;
    results.failedOperations = results.failed.length;
    results.timestamp = new Date().toISOString();
    
    res.json(results);
  } catch (error) {
    handleError(error, req, res, 'Error executing strategy');
  }
};

/**
 * Get strategy comparison for different risk profiles
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getStrategyComparison = async (req, res) => {
  try {
    const { amount, walletAddress } = req.query;
    
    if (!amount || isNaN(parseFloat(amount))) {
      return res.status(400).json({ error: 'Invalid amount parameter' });
    }
    
    // Generate recommendations for different risk profiles
    const riskProfiles = ['conservative', 'balanced', 'aggressive'];
    const strategies = {};
    
    for (const profile of riskProfiles) {
      try {
        const recommendation = await aiRecommendation.generateRecommendation({
          amount: parseFloat(amount),
          riskProfile: profile,
          walletAddress,
          anthropicClient,
          openaiClient
        });
        
        strategies[profile] = {
          title: recommendation.title,
          summary: recommendation.summary,
          totalApr: recommendation.totalApr,
          allocation: recommendation.allocation.map(item => ({
            protocol: item.protocol,
            percentage: item.percentage,
            expectedApr: item.expectedApr
          }))
        };
      } catch (strategyError) {
        console.error(`Error generating ${profile} strategy:`, strategyError);
      }
    }
    
    res.json({
      amount: parseFloat(amount),
      strategies,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    handleError(error, req, res, 'Error generating strategy comparison');
  }
};

/**
 * Get auto-rebalance status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAutoRebalanceStatus = async (req, res) => {
  try {
    const { walletAddress } = req.query;
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }
    
    // Get rebalance status from auto-rebalancer
    const status = await autoRebalancer.getRebalanceStatus(walletAddress);
    
    res.json(status);
  } catch (error) {
    handleError(error, req, res, 'Error getting auto-rebalance status');
  }
};

/**
 * Update auto-rebalance settings
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateAutoRebalanceSettings = async (req, res) => {
  try {
    const { walletAddress, enabled, interval, threshold, slippage } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }
    
    // Update settings in auto-rebalancer
    const updatedSettings = await autoRebalancer.updateSettings(walletAddress, {
      enabled,
      interval,
      threshold,
      slippage
    });
    
    res.json(updatedSettings);
  } catch (error) {
    handleError(error, req, res, 'Error updating auto-rebalance settings');
  }
};

/**
 * Execute auto-rebalance
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.executeAutoRebalance = async (req, res) => {
  try {
    const { walletAddress, force = false } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }
    
    // Execute rebalance through auto-rebalancer
    const result = await autoRebalancer.executeRebalance(walletAddress, force);
    
    res.json(result);
  } catch (error) {
    handleError(error, req, res, 'Error executing auto-rebalance');
  }
};

/**
 * Get recommendation history
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getRecommendationHistory = async (req, res) => {
  try {
    const { walletAddress } = req.params;
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }
    
    // Get history from AI recommendation module
    const history = await aiRecommendation.getRecommendationHistory(walletAddress);
    
    res.json({
      wallet: walletAddress,
      history,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    handleError(error, req, res, 'Error fetching recommendation history');
  }
};

// Helper function to generate supported operations
function generateSupportedOperations(allocation, stakingData, amount) {
  return allocation.map(item => ({
    protocol: item.protocol,
    operationType: 'stake',
    amount: (parseFloat(amount) * (item.percentage / 100)).toFixed(2),
    contractAddress: stakingData.protocols[item.protocol.toLowerCase()]?.contractAddress || 'unknown'
  }));
}