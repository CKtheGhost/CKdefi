const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');
const portfolioController = require('./controllers/portfolioController');
const recommendationController = require('./controllers/recommendationController');

// User routes
router.post('/users', userController.createUser);

// Portfolio routes
router.get('/portfolios/:userId', portfolioController.getPortfolio);

// Recommendation routes
router.get('/recommendations/ai', recommendationController.getAIRecommendation);

module.exports = router;