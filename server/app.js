require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { Anthropic } = require('anthropic');
const { OpenAI } = require('openai');
const mongoose = require('mongoose');
const morgan = require('morgan');
const { expressjwt: jwt } = require('express-jwt');

// Import controllers
const userController = require('./controllers/userController');
const portfolioController = require('./controllers/portfolioController');
const recommendationController = require('./controllers/recommendationController');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Rate limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    error: 'Too many requests, please try again later.'
  }
});

// Middleware setup
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Request logging
app.use('/api/', apiLimiter);

// JWT authentication middleware
app.use('/api', jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
}).unless({ path: ['/api/users', '/api/status'] })); // Public routes

// Serve static files with caching
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
app.post('/api/users', userController.createUser); // Create a new user
app.get('/api/portfolios/:userId', portfolioController.getPortfolio); // Fetch user portfolio
app.get('/api/recommendations/ai', recommendationController.getAIRecommendation); // AI recommendations

// Root route - Dashboard
app.get('/', async (req, res) => {
  try {
    const portfolios = await portfolioController.getRecentPortfolios(10); // Fetch recent portfolios
    res.render('dashboard', {
      portfolios,
      stakingData: { protocols: {}, strategies: {} }, // Placeholder
      newsData: { articles: [], lastUpdated: new Date().toISOString() }, // Placeholder
      tokenData: { coins: [], lastUpdated: new Date().toISOString() }, // Placeholder
      walletData: null,
      error: null,
      pageTitle: 'CompounDefi - AI-Powered Yield Optimizer',
      lastUpdated: new Date().toISOString()
    });
  } catch (e) {
    console.error('Dashboard rendering error:', e);
    res.status(500).render('dashboard', {
      portfolios: [],
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

// Health check endpoint
app.get('/api/status', async (req, res) => {
  res.json({
    status: 'online',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the application
app.listen(PORT, () => {
  console.log(`CompounDefi is running on http://localhost:${PORT}`);
});

module.exports = app;