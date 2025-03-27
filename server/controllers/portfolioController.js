const Portfolio = require('../models/portfolio');

exports.getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.params.userId });
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });
    res.json(portfolio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRecentPortfolios = async (limit) => {
  return await Portfolio.find().sort({ updatedAt: -1 }).limit(limit);
};