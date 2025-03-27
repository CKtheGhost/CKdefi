// routes.js - Unified routing configuration for CompounDefi
const express = require('express');
const path = require('path');
const portfolioController = require('./controllers/portfolioController');
const recommendationController = require('./controllers/recommendationController');
const userController = require('./controllers/userController');
const { rateLimiter } = require('./middleware/rateLimit');
const { validateWalletAddress, validateRecommendationParams } = require('./middleware/validation');
const { cacheMiddleware } = require('./middleware/caching');

/**
 * Configure all application routes
 * @param {Express} app - Express application instance
 */
function setupRoutes(app) {
  // API Routes with rate limiting
  const apiRouter = express.Router();
  app.use('/api', rateLimiter, apiRouter);

  // Status endpoint - no auth required
  apiRouter.get('/status', (req, res) => {
    res.json({
      status: 'online',
      version: process.env.npm_package_version || '1.0.0',
      timestamp: new Date().toISOString(),
      network: process.env.APTOS_NETWORK || 'mainnet'
    });
  });

  // Token data endpoints
  apiRouter.get('/tokens/latest', cacheMiddleware(5 * 60), async (req, res, next) => {
    try {
      const tokenModule = require('./modules/token_tracker');
      const tokenData = await tokenModule.getMemeCoinData();
      res.json(tokenData);
    } catch (error) {
      next(error);
    }
  });

  // News endpoints
  apiRouter.get('/news/latest', cacheMiddleware(15 * 60), async (req, res, next) => {
    try {
      const newsModule = require('./modules/news_tracker');
      const newsData = await newsModule.getLatestNews();
      res.json(newsData);
    } catch (error) {
      next(error);
    }
  });

  // Wallet analysis endpoint
  apiRouter.get('/wallet/:address', validateWalletAddress, async (req, res, next) => {
    try {
      const portfolioTracker = require('./modules/portfolio_tracker');
      const stakingOptimizer = require('./modules/staking_optimizer');
      
      const walletAddress = req.params.address;
      
      // Fetch portfolio data
      const portfolioData = await portfolioTracker.getPortfolioData(walletAddress);
      
      // Get staking recommendations
      const stakingRecommendations = await stakingOptimizer.getPersonalizedRecommendations(
        walletAddress, 
        portfolioData
      );
      
      res.json({
        wallet: walletAddress,
        portfolio: portfolioData,
        stakingRecommendations,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  });

  // AI recommendations endpoint
  apiRouter.get('/recommendations/ai', validateRecommendationParams, async (req, res, next) => {
    try {
      const { amount, riskProfile, walletAddress } = req.query;
      const aiModule = require('./modules/ai_recommendation');
      
      const recommendation = await aiModule.generateRecommendation(
        parseFloat(amount),
        riskProfile,
        walletAddress
      );
      
      res.json(recommendation);
    } catch (error) {
      next(error);
    }
  });

  // Contract addresses endpoint
  apiRouter.get('/contracts', cacheMiddleware(60 * 60), (req, res) => {
    const contracts = require('./config/contracts');
    res.json({
      contracts: contracts.addresses,
      lastUpdated: new Date().toISOString()
    });
  });

  // Transaction execution endpoint
  apiRouter.post('/execute', async (req, res, next) => {
    try {
      const { walletAddress, type, protocol, amount, contractAddress, functionName } = req.body;
      
      if (!walletAddress || !type || !protocol || !amount || !contractAddress) {
        return res.status(400).json({ 
          error: 'Missing required parameters',
          details: 'Required: walletAddress, type, protocol, amount, contractAddress'
        });
      }
      
      const txManager = require('./modules/transaction_manager');
      const result = await txManager.executeOperation(
        walletAddress,
        protocol,
        type,
        amount,
        contractAddress,
        functionName
      );
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  // Strategy execution endpoint
  apiRouter.post('/execute-strategy', async (req, res, next) => {
    try {
      const { walletAddress, operations } = req.body;
      
      if (!walletAddress || !operations || !Array.isArray(operations)) {
        return res.status(400).json({ 
          error: 'Missing required parameters',
          details: 'Required: walletAddress, operations[]'
        });
      }
      
      const txManager = require('./modules/transaction_manager');
      const result = await txManager.executeStrategy(walletAddress, operations);
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  // Auto-rebalance endpoints
  apiRouter.get('/auto-rebalance/status', async (req, res, next) => {
    try {
      const { walletAddress } = req.query;
      
      if (!walletAddress) {
        return res.status(400).json({ error: 'Wallet address is required' });
      }
      
      const rebalancer = require('./modules/auto_rebalancer');
      const status = await rebalancer.getRebalanceStatus(walletAddress);
      
      res.json(status);
    } catch (error) {
      next(error);
    }
  });

  apiRouter.post('/auto-rebalance/settings', async (req, res, next) => {
    try {
      const { walletAddress, enabled, interval, threshold, slippage } = req.body;
      
      if (!walletAddress) {
        return res.status(400).json({ error: 'Wallet address is required' });
      }
      
      const rebalancer = require('./modules/auto_rebalancer');
      const result = await rebalancer.updateSettings(walletAddress, {
        enabled,
        interval,
        threshold,
        slippage
      });
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  apiRouter.post('/auto-rebalance/execute', async (req, res, next) => {
    try {
      const { walletAddress, force = false } = req.body;
      
      if (!walletAddress) {
        return res.status(400).json({ error: 'Wallet address is required' });
      }
      
      const rebalancer = require('./modules/auto_rebalancer');
      const result = await rebalancer.executeRebalance(walletAddress, force);
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  // User preferences endpoint
  apiRouter.post('/user/preferences', async (req, res, next) => {
    try {
      const preferences = req.body;
      
      // Store preferences in database if user is registered
      // or in a cookie for anonymous users
      res.cookie('userPreferences', JSON.stringify(preferences), { 
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true
      });
      
      res.json({
        ...preferences,
        lastUpdated: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  });

  // Serve static files in production
  if (process.env.NODE_ENV === 'production') {
    // Set cache headers for static assets
    app.use('/static', express.static(path.join(__dirname, '../client/build/static'), {
      maxAge: '1d'
    }));
    
    // Serve the React app for any other routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
  }
}

module.exports = setupRoutes;