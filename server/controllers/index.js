// index.js
// Export all controllers for easy importing elsewhere in the application

const portfolioController = require('./portfolioController');
const recommendationController = require('./recommendationController');
const userController = require('./userController');

module.exports = {
  portfolioController,
  recommendationController,
  userController
};