require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { Anthropic } = require('anthropic');
const { OpenAI } = require('openai');
const routes = require('./routes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Rate limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'Too many requests, please try again later.'
  }
});

// Enhanced middleware setup
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/', apiLimiter);

// Serve static files with proper caching
app.use('/js', express.static(path.join(__dirname, 'public/js'), { maxAge: '1d' }));
app.use('/css', express.static(path.join(__dirname, 'public/css'), { maxAge: '1d' }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '4h' }));

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

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

// Routes
app.use('/api', routes);

// Root route - Dashboard
app.get('/', async (req, res) => {
  try {
    const stakingData = { protocols: {}, strategies: {} };
    const newsData = { articles: [], lastUpdated: new Date().toISOString() };
    const tokenData = { coins: [], lastUpdated: new Date().toISOString() };
    
    res.render('dashboard', {
      stakingData,
      newsData,
      tokenData,
      walletData: null,
      error: null,
      pageTitle: 'CompounDefi - AI-Powered Yield Optimizer',
      lastUpdated: new Date().toISOString()
    });
  } catch (e) {
    console.error('Dashboard rendering error:', e);
    res.status(500).render('dashboard', {
      stakingData: { protocols: {}, strategies: {} },
      newsData: { articles: [], lastUpdated: new Date().toISOString() },
      tokenData: { coins: [], lastUpdated: new Date().toISOString() },
      walletData: null,
      error: `Server error: ${e.message}`,
      pageTitle: 'CompounDefi - Error',
      lastUpdated: new Date().toISOString()
    });
  }
});

// AI recommendations endpoint
app.get('/api/recommendations/ai', async (req, res) => {
  try {
    const { amount, riskProfile, walletAddress } = req.query;

    if (!amount || isNaN(parseFloat(amount)) || !riskProfile) {
      return res.status(400).json({ 
        error: 'Invalid parameters. Required: amount (number) and riskProfile (conservative/balanced/aggressive)' 
      });
    }

    if (!anthropicClient && !openaiClient) {
      throw new Error('No AI API keys available. Set ANTHROPIC_API_KEY or OPENAI_API_KEY in .env file.');
    }

    const prompt = `As an AI financial advisor specialized in Aptos DeFi, provide a personalized staking and investment strategy for a user with:
1. Amount to invest: ${amount} APT
2. Risk profile: ${riskProfile}
3. Current portfolio: ${walletAddress ? "Connected wallet" : 'Not provided'}

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
          model: "claude-3-sonnet-20240229",
          max_tokens: 4000,
          temperature: 0.2,
          messages: [
            { role: "user", content: prompt }
          ]
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
            model: "gpt-4",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.2,
            response_format: { type: "json_object" }
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
        throw new Error("Could not parse AI response as JSON");
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
      details: error.message 
    });
  }
});

// App status/health check endpoint
app.get('/api/status', async (req, res) => {
  res.json({
    status: 'online',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Start the application
app.listen(PORT, () => {
  console.log(`CompounDefi is running on http://localhost:${PORT}`);
});

module.exports = app;
