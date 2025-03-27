require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { expressjwt: jwt } = require('express-jwt');
const morgan = require('morgan');
const mongoose = require('mongoose');
const { AptosClient } = require('@aptos-labs/ts-sdk');
const routes = require('./routes');
const dataFetcher = require('./modules/dataFetcher');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Initialize Aptos client
const aptosClient = new AptosClient(process.env.APTOS_NETWORK === 'MAINNET'
  ? 'https://fullnode.mainnet.aptoslabs.com'
  : 'https://fullnode.testnet.aptoslabs.com');

// Rate limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { status: 429, error: 'Too many requests, please try again later.' },
});

// Middleware setup
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/api/', apiLimiter);

// JWT authentication middleware
app.use('/api', jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
}).unless({ path: ['/api/users', '/api/login', '/api/status'] }));

// Serve static files with caching
app.use('/js', express.static(path.join(__dirname, 'public/js'), { maxAge: '1d' }));
app.use('/css', express.static(path.join(__dirname, 'public/css'), { maxAge: '1d' }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '4h' }));

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// API Routes
app.use('/api', routes);

// Root route - Dashboard with real data
app.get('/', async (req, res) => {
  try {
    const portfolios = await portfolioController.getRecentPortfolios(10);
    const stakingData = await dataFetcher.getStakingData(aptosClient);
    const newsData = await dataFetcher.getNewsData();
    const tokenData = await dataFetcher.getTokenData();

    res.render('dashboard', {
      portfolios,
      stakingData,
      newsData,
      tokenData,
      walletData: null,
      error: null,
      pageTitle: 'CompounDefi - AI-Powered Yield Optimizer',
      lastUpdated: new Date().toISOString(),
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
      lastUpdated: new Date().toISOString(),
    });
  }
});

// Health check endpoint
app.get('/api/status', async (req, res) => {
  res.json({
    status: 'online',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`CompounDefi is running on http://localhost:${PORT}`);
});

module.exports = app;