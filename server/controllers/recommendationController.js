const { anthropicClient, openaiClient } = require('../utils/aiClients');
const Portfolio = require('../models/portfolio');

exports.getAIRecommendation = async (req, res) => {
  try {
    const { amount, riskProfile, walletAddress } = req.query;

    if (!amount || isNaN(parseFloat(amount)) || !riskProfile) {
      return res.status(400).json({
        error: 'Invalid parameters. Required: amount (number) and riskProfile (conservative/balanced/aggressive)',
      });
    }

    if (!anthropicClient && !openaiClient) {
      throw new Error('No AI API keys available. Set ANTHROPIC_API_KEY or OPENAI_API_KEY in .env file.');
    }

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

    let aiResponse;
    try {
      if (anthropicClient) {
        const response = await anthropicClient.messages.create({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 4000,
          temperature: 0.2,
          messages: [{ role: 'user', content: prompt }],
        });
        aiResponse = { content: response.content[0].text };
      } else {
        throw new Error('Anthropic API client not available');
      }
    } catch (anthropicError) {
      console.error('Anthropic API failed:', anthropicError.message);
      if (openaiClient) {
        try {
          const openaiResponse = await openaiClient.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.2,
            response_format: { type: 'json_object' },
          });
          aiResponse = { content: openaiResponse.choices[0].message.content };
        } catch (openaiError) {
          console.error('OpenAI API also failed:', openaiError.message);
          throw new Error('Both AI providers failed to generate a recommendation');
        }
      } else {
        throw new Error('No OpenAI API key available as fallback');
      }
    }

    let aiRecommendation;
    try {
      const content = aiResponse.content || aiResponse;
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/{[\s\S]*}/);
      if (!jsonMatch) {
        throw new Error('Could not parse AI response as JSON');
      }
      aiRecommendation = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError.message);
      throw new Error(`Failed to parse AI recommendation: ${parseError.message}`);
    }

    res.json(aiRecommendation);
  } catch (error) {
    console.error('AI recommendation error:', error.message);
    res.status(500).json({
      error: 'Error generating AI recommendation',
      details: error.message,
    });
  }
};