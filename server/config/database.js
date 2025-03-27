// server/config/database.js
const mongoose = require('mongoose');
const logger = require('../utils/logger');

// Get MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGO_URI;

// Connect to MongoDB
async function connectToDatabase() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MongoDB connection string not provided in environment variables');
    }
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    logger.info('Connected to MongoDB successfully');
    
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected, attempting to reconnect...');
    });
    
    return mongoose.connection;
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

// Export connection function and mongoose instance
module.exports = {
  connectToDatabase,
  mongoose
};