const Portfolio = require('../models/portfolio');

exports.getAIRecommendation = async (req, res) => {
  try {
    const { amount, riskProfile, walletAddress } = req.query;

    if (!amount || isNaN(parseFloat(amount)) || !riskProfile) {
      return res.status(400).json({ 
        error: 'Invalid parameters. Required: amount (number) and riskProfile (conservative/balanced/aggressive)' 
      });
    }

    // Fetch portfolio if walletAddress is provided
    let portfolio = null;
    if (walletAddress) {
      portfolio = await Portfolio.findOne({ walletAddress });
    }

    const prompt = `As an AI financial advisor specialized in Aptos DeFi, provide a personalized staking and investment strategy for a user with:
1. Amount to invest: ${amount} APT
2. Risk profile: ${riskProfile}
3. Current portfolio: ${portfolio ? JSON.stringify(portfolio.assets) : 'Not provided'}

Provide a JSON response with:
- title: Recommendation title
- summary: Brief summary (2-3 sentences)
- allocation: Array of {protocol, product, percentage, expectedApr}
- totalApr: Blended APR
- steps: Array of implementation instructions
- risks: Array of investment risks
- mitigations: Array of risk mitigation strategies
- additionalNotes: Additional insights or recommendations`;

    // Placeholder for AI logic (using Anthropic or OpenAI client)
    const aiRecommendation = { /* AI response here */ };
    res.json(aiRecommendation);
  } catch (error) {
    res.status(500).json({ error: 'Error generating AI recommendation', details: error.message });
  }
};