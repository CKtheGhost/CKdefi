// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const { connectToDatabase } = require('./config/database');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
const { metricsMiddleware, getMetrics } = require('./middleware/metrics');
const routes = require('./routes');
const logger = require('./utils/logger');

// Initialize Express app
const app = express();

// Set port
const PORT = process.env.PORT || 3000;

// Apply middleware
app.use(helmet()); // Security headers
app.use(cors());   // CORS support
app.use(compression()); // Compress responses
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(metricsMiddleware); // Collect metrics

// Routes
app.use('/api', routes);
app.get('/metrics', getMetrics); // Metrics endpoint

// Serve static files from the React app (in production)
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    
    // Start Express server
    app.listen(PORT, () => {
      logger.info(`CompounDefi server running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();