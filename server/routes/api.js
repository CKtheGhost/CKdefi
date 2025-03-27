// /server/routes/api.js - Main API routes for CompounDefi
const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// Import modules
const stakingOptimizer = require('../modules/staking_optimizer');
const portfolioTracker = require('../modules/portfolio_tracker');
const tokenTracker = require('../modules/token_tracker');
const newsTracker = require('../modules/news_tracker');
const autoRebalancer = require('../modules/auto_rebalancer');
const { getLogger } = require('../utils/logging');

// Instantiate logger
const logger = getLogger('api');

// Import middleware
const { apiKeyAuth } = require('../middleware/auth');
const { errorHandler } = require('../middleware/errorHandler'); // Destructure to get the function

// Rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    status: 429,
    error: 'Too many requests, please try again later'
  }
});

// Apply rate limiting to all API routes
router.use(apiLimiter);

/**
 * @route   GET /api/status
 * @desc    Check API status and get configuration info
 * @access  Public
 */
router.get('/status', (req, res) => {
  try {
    res.json({
      status: 'online',
      version: process.env.npm_package_version || '1.0.0',
      network: process.env.APTOS_NETWORK || 'mainnet',
      timestamp: new Date().toISOString(),
      services: {
        staking: stakingOptimizer ? 'available' : 'unavailable',
        portfolio: portfolioTracker ? 'available' : 'unavailable',
        tokens: tokenTracker ? 'available' : 'unavailable',
        news: newsTracker ? 'available' : 'unavailable'
      }
    });
  } catch (error) {
    logger.error('Status API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route   GET /api/wallet/:address
 * @desc    Get wallet portfolio analysis
 * @access  Public
 */
router.get('/wallet/:address', async (req, res, next) => {
  try {
    const walletAddress = req.params.address;
    
    if (!walletAddress || !walletAddress.startsWith('0x') || walletAddress.length !== 66) {
      return res.status(400).json({ error: 'Invalid wallet address format' });
    }

    let portfolioData;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        portfolioData = await portfolioTracker.getPortfolioData(walletAddress);
        break;
      } catch (err) {
        if (attempt === 2) throw err;
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
    
    let stakingRecommendations;
    try {
      stakingRecommendations = await stakingOptimizer.getPersonalizedRecommendations(
        walletAddress, 
        portfolioData
      );
    } catch (recommendationsError) {
      logger.error('Recommendations error:', recommendationsError);
      stakingRecommendations = { error: recommendationsError.message };
    }

    res.json({ 
      wallet: walletAddress, 
      portfolio: portfolioData, 
      stakingRecommendations,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    next(error); // Passes to errorHandler middleware
  }
});

/**
 * @route   GET /api/tokens/latest
 * @desc    Get latest token data and market info
 * @access  Public
 */
router.get('/tokens/latest', async (req, res, next) => {
  try {
    const tokenData = await tokenTracker.getTokenData();
    res.json(tokenData);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/news/latest
 * @desc    Get latest DeFi news
 * @access  Public
 */
router.get('/news/latest', async (req, res, next) => {
  try {
    const newsData = await newsTracker.getLatestNews();
    res.json(newsData);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/staking/rates
 * @desc    Get latest staking rates across protocols
 * @access  Public
 */
router.get('/staking/rates', async (req, res, next) => {
  try {
    const stakingRates = await stakingOptimizer.getStakingData();
    res.json(stakingRates);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/contracts
 * @desc    Get list of contract addresses
 * @access  Public
 */
router.get('/contracts', (req, res) => {
  try {
    const contractData = {
      contracts: stakingOptimizer.contracts || {},
      lastUpdated: new Date().toISOString()
    };
    res.json(contractData);
  } catch (error) {
    logger.error('Error serving contract addresses:', error);
    res.status(500).json({
      error: 'Failed to fetch contract addresses',
      lastUpdated: new Date().toISOString()
    });
  }
});

/**
 * @route   GET /api/recommendations/ai
 * @desc    Get AI-powered investment recommendations
 * @access  Public
 */
router.get('/recommendations/ai', async (req, res, next) => {
  try {
    const { amount, riskProfile, walletAddress } = req.query;

    if (!amount || isNaN(parseFloat(amount)) || !riskProfile) {
      return res.status(400).json({ 
        error: 'Invalid parameters. Required: amount (number) and riskProfile (conservative/balanced/aggressive)' 
      });
    }

    let stakingData;
    try {
      stakingData = await stakingOptimizer.getStakingData();
    } catch (stakingError) {
      logger.error('Failed to fetch staking data:', stakingError);
      stakingData = { protocols: {}, strategies: {} };
    }
    
    let portfolioData = null;
    if (walletAddress) {
      try {
        portfolioData = await portfolioTracker.getPortfolioData(walletAddress);
      } catch (portfolioError) {
        logger.error('Failed to fetch portfolio data:', portfolioError);
      }
    }

    const aiRecommendation = await stakingOptimizer.generateAIRecommendation(
      parseFloat(amount),
      riskProfile,
      portfolioData,
      stakingData
    );

    res.json(aiRecommendation);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/execute-strategy
 * @desc    Execute investment strategy
 * @access  Public (but should be authenticated in production)
 */
router.post('/execute-strategy', async (req, res, next) => {
  try {
    const { 
      walletAddress, 
      amount, 
      allocation, 
      operations 
    } = req.body;
    
    if (!walletAddress || !amount || !allocation || !operations || !Array.isArray(operations)) {
      return res.status(400).json({ 
        error: 'Invalid request parameters. Required: walletAddress, amount, allocation, operations[]' 
      });
    }

    const results = await stakingOptimizer.executeStrategy(walletAddress, amount, operations);

    res.json(results);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/auto-rebalance/status
 * @desc    Get auto-rebalance status for a wallet
 * @access  Public (but should be authenticated in production)
 */
router.get('/auto-rebalance/status', async (req, res, next) => {
  try {
    const { walletAddress } = req.query;
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }
    
    const status = autoRebalancer.getAutoRebalanceMonitoringStatus(walletAddress) || {
      walletAddress,
      monitoring: false,
      message: 'No auto-rebalance monitoring active'
    };
    res.json(status);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auto-rebalance/settings
 * @desc    Update auto-rebalance settings
 * @access  Public (but should be authenticated in production)
 */
router.post('/auto-rebalance/settings', async (req, res, next) => {
  try {
    const { walletAddress, enabled, interval, threshold, slippage } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }
    
    const settings = {};
    if (threshold !== undefined) settings.minRebalanceThreshold = threshold;
    if (slippage !== undefined) settings.maxSlippage = slippage;
    if (interval !== undefined) settings.cooldownPeriod = interval;

    const result = await autoRebalancer.setRebalanceSettings(walletAddress, settings);
    
    if (enabled !== undefined) {
      if (enabled) {
        await autoRebalancer.enableAutoRebalanceMonitoring(walletAddress, { checkInterval: interval });
      } else {
        autoRebalancer.disableAutoRebalanceMonitoring(walletAddress);
      }
    }
    
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auto-rebalance/execute
 * @desc    Execute auto-rebalance immediately
 * @access  Public (but should be authenticated in production)
 */
router.post('/auto-rebalance/execute', async (req, res, next) => {
  try {
    const { walletAddress, force = false } = req.body;
    
    if (!walletAddress) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }
    
    const result = await autoRebalancer.executeRebalance(walletAddress, { force });
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/user/preferences
 * @desc    Update user preferences
 * @access  Public (but should be authenticated in production)
 */
router.post('/user/preferences', (req, res) => {
  const { riskProfile, activeSection, darkMode } = req.body;
  
  if (riskProfile) {
    res.cookie('riskProfile', riskProfile, { maxAge: 30 * 24 * 60 * 60 * 1000 });
  }
  
  if (activeSection) {
    res.cookie('activeSection', activeSection, { maxAge: 30 * 24 * 60 * 60 * 1000 });
  }
  
  if (darkMode !== undefined) {
    res.cookie('darkMode', darkMode, { maxAge: 30 * 24 * 60 * 60 * 1000 });
  }
  
  res.json({
    riskProfile: riskProfile || 'balanced',
    activeSection: activeSection || 'market-overview',
    darkMode: darkMode !== undefined ? darkMode : true,
    lastUpdated: new Date().toISOString()
  });
});

// Error handling middleware
router.use(errorHandler);

// Export the router
module.exports = router;