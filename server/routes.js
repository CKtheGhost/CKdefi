const express = require('express');
const router = express.Router();
const { getMemeCoinData } = require('./modules/token_tracker');
const { getLatestNews } = require('./modules/news_tracker');
const { getPortfolioData } = require('./modules/portfolio_tracker');
const { getStakingData, getPersonalizedRecommendations } = require('./modules/staking_optimizer');

// Token data endpoint
router.get('/tokens/latest', async (req, res) => {
  try {
    const tokenData = await getMemeCoinData();
    res.json(tokenData);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch token data: ${error.message}`, lastUpdated: new Date().toISOString() });
  }
});

// News endpoint
router.get('/news/latest', async (req, res) => {
  try {
    const newsData = await getLatestNews();
    res.json(newsData);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch news: ${error.message}`, lastUpdated: new Date().toISOString() });
  }
});

// Wallet data endpoint
router.get('/wallet/:address', async (req, res) => {
  try {
    const walletAddress = req.params.address;
    
    if (!walletAddress || !walletAddress.startsWith('0x') || walletAddress.length !== 66) {
      return res.status(400).json({ error: 'Invalid wallet address format' });
    }

    const portfolioData = await getPortfolioData(walletAddress);
    const recommendations = await getPersonalizedRecommendations(walletAddress, portfolioData);
    
    res.json({ 
      wallet: walletAddress, 
      portfolio: portfolioData, 
      stakingRecommendations: recommendations,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Error analyzing wallet', 
      details: error.message,
      lastUpdated: new Date().toISOString()
    });
  }
});

// Staking data endpoint
router.get('/staking/latest', async (req, res) => {
  try {
    const stakingData = await getStakingData();
    res.json(stakingData);
  } catch (error) {
    res.status(500).json({ 
      error: 'Error fetching staking data', 
      details: error.message,
      lastUpdated: new Date().toISOString()
    });
  }
});

module.exports = router;
