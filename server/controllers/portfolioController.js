// portfolioController.js
// Handles portfolio analysis and tracking operations
const portfolioTracker = require('../modules/portfolio_tracker');
const stakingOptimizer = require('../modules/staking_optimizer');
const { Aptos, AptosConfig, Network } = require('@aptos-labs/ts-sdk');
const { handleError } = require('../middleware/errorHandler');
const { cacheData } = require('../middleware/caching');
const config = require('../config');

// Initialize Aptos client
const aptosConfig = new AptosConfig({
  network: process.env.APTOS_NETWORK === 'TESTNET' ? Network.TESTNET : Network.MAINNET
});
const aptos = new Aptos(aptosConfig);

/**
 * Get full portfolio analysis for a wallet address
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getPortfolioAnalysis = async (req, res) => {
  try {
    const walletAddress = req.params.address;
    
    if (!walletAddress || !walletAddress.startsWith('0x') || walletAddress.length !== 66) {
      return res.status(400).json({ error: 'Invalid wallet address format' });
    }

    // Check cache first
    const cacheKey = `portfolio_${walletAddress}`;
    const cachedData = cacheData.get(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    // Fetch portfolio data
    let portfolioData;
    try {
      portfolioData = await portfolioTracker.getPortfolioData(walletAddress);
    } catch (portfolioError) {
      throw new Error(`Failed to fetch portfolio data: ${portfolioError.message}`);
    }
    
    // Get staking recommendations
    let stakingRecommendations;
    try {
      stakingRecommendations = await stakingOptimizer.getPersonalizedRecommendations(
        walletAddress, 
        portfolioData
      );
    } catch (recommendationsError) {
      console.warn(`Failed to generate recommendations: ${recommendationsError.message}`);
      stakingRecommendations = {
        riskProfile: 'balanced',
        recommendedStrategy: null,
        actionItems: []
      };
    }

    // Combine response data
    const responseData = { 
      wallet: walletAddress, 
      portfolio: portfolioData, 
      stakingRecommendations,
      lastUpdated: new Date().toISOString()
    };

    // Cache the result
    cacheData.set(cacheKey, responseData, 60 * 5); // 5 minutes cache

    res.json(responseData);
  } catch (error) {
    handleError(error, req, res, 'Failed to analyze wallet');
  }
};

/**
 * Get historical portfolio performance
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getPortfolioHistory = async (req, res) => {
  try {
    const walletAddress = req.params.address;
    const period = req.query.period || '30d'; // Default to 30 days
    
    if (!walletAddress || !walletAddress.startsWith('0x') || walletAddress.length !== 66) {
      return res.status(400).json({ error: 'Invalid wallet address format' });
    }

    // Get historical data
    const historicalData = await portfolioTracker.getHistoricalPerformance(walletAddress, period);
    
    res.json({
      wallet: walletAddress,
      period,
      historicalData,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    handleError(error, req, res, 'Failed to fetch portfolio history');
  }
};

/**
 * Get staking and yield positions
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getYieldPositions = async (req, res) => {
  try {
    const walletAddress = req.params.address;
    
    if (!walletAddress || !walletAddress.startsWith('0x') || walletAddress.length !== 66) {
      return res.status(400).json({ error: 'Invalid wallet address format' });
    }

    // Get staking positions
    const stakingPositions = await portfolioTracker.getStakingPositions(walletAddress);
    
    // Get yield farming positions
    const yieldPositions = await portfolioTracker.getYieldFarmingPositions(walletAddress);
    
    // Get lending positions
    const lendingPositions = await portfolioTracker.getLendingPositions(walletAddress);
    
    res.json({
      wallet: walletAddress,
      stakingPositions,
      yieldPositions,
      lendingPositions,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    handleError(error, req, res, 'Failed to fetch yield positions');
  }
};

/**
 * Get portfolio APY breakdown
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getApyBreakdown = async (req, res) => {
  try {
    const walletAddress = req.params.address;
    
    if (!walletAddress || !walletAddress.startsWith('0x') || walletAddress.length !== 66) {
      return res.status(400).json({ error: 'Invalid wallet address format' });
    }

    // Get portfolio data first
    const portfolioData = await portfolioTracker.getPortfolioData(walletAddress);
    
    // Calculate APY breakdown
    const apyBreakdown = await portfolioTracker.calculateApyBreakdown(portfolioData);
    
    res.json({
      wallet: walletAddress,
      portfolio: {
        totalValueUSD: portfolioData.totalValueUSD,
        totalApy: apyBreakdown.totalApy
      },
      apyByProtocol: apyBreakdown.byProtocol,
      apyByAsset: apyBreakdown.byAsset,
      apyByStrategy: apyBreakdown.byStrategy,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    handleError(error, req, res, 'Failed to calculate APY breakdown');
  }
};

/**
 * Get transaction history for a wallet
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getTransactionHistory = async (req, res) => {
  try {
    const walletAddress = req.params.address;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    
    if (!walletAddress || !walletAddress.startsWith('0x') || walletAddress.length !== 66) {
      return res.status(400).json({ error: 'Invalid wallet address format' });
    }

    // Fetch transactions directly from Aptos
    let transactions;
    try {
      transactions = await aptos.getAccountTransactions({
        accountAddress: walletAddress,
        limit,
        start: offset
      });
    } catch (txError) {
      throw new Error(`Failed to fetch transactions: ${txError.message}`);
    }
    
    // Enrich transaction data with protocol information
    const enrichedTransactions = await portfolioTracker.enrichTransactions(transactions);
    
    res.json({
      wallet: walletAddress,
      transactions: enrichedTransactions,
      pagination: {
        limit,
        offset,
        total: enrichedTransactions.length
      },
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    handleError(error, req, res, 'Failed to fetch transaction history');
  }
};

/**
 * Get portfolio risk analysis
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getRiskAnalysis = async (req, res) => {
  try {
    const walletAddress = req.params.address;
    
    if (!walletAddress || !walletAddress.startsWith('0x') || walletAddress.length !== 66) {
      return res.status(400).json({ error: 'Invalid wallet address format' });
    }

    // Get portfolio data
    const portfolioData = await portfolioTracker.getPortfolioData(walletAddress);
    
    // Calculate risk metrics
    const riskAnalysis = await portfolioTracker.analyzePortfolioRisk(portfolioData);
    
    res.json({
      wallet: walletAddress,
      riskProfile: riskAnalysis.riskProfile,
      riskScore: riskAnalysis.riskScore,
      riskBreakdown: riskAnalysis.breakdown,
      suggestedImprovements: riskAnalysis.suggestions,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    handleError(error, req, res, 'Failed to analyze portfolio risk');
  }
};