// server/models/index.js
// Exports all MongoDB models for the CompounDefi application
const mongoose = require('mongoose');
const User = require('./user');
const Portfolio = require('./portfolio');
const Recommendation = require('./recommendation');
const Transaction = require('./transaction');
const RebalanceEvent = require('./rebalanceEvent');
const { TokenPrice, ProtocolMetrics, MarketOverview, StakingRates } = require('./marketData');

// Database connection management
const connectDB = async (uri = process.env.MONGODB_URI) => {
  try {
    // Configure mongoose
    mongoose.set('strictQuery', true);
    
    // Create connection
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    // If this is a dev environment, use in-memory database as fallback
    if (process.env.NODE_ENV === 'development') {
      console.log('Attempting to use in-memory database for development');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        
        await mongoose.connect(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
        
        console.log('Connected to in-memory MongoDB instance');
        return mongoose.connection;
      } catch (fallbackError) {
        console.error('Failed to connect to in-memory database:', fallbackError);
        process.exit(1);
      }
    } else {
      // In production, exit the process on connection failure
      console.error('Failed to connect to MongoDB. Terminating application.');
      process.exit(1);
    }
  }
};

// Database disconnection
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
  }
};

// Check connection status
const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Get connection object
const getConnection = () => {
  return mongoose.connection;
};

// Create indexes for better query performance
const createIndexes = async () => {
  try {
    // User model indexes
    await User.collection.createIndex({ walletAddress: 1 }, { unique: true });
    await User.collection.createIndex({ email: 1 }, { sparse: true });
    
    // Portfolio model indexes
    await Portfolio.collection.createIndex({ walletAddress: 1 }, { unique: true });
    await Portfolio.collection.createIndex({ lastUpdated: -1 });
    
    // Recommendation model indexes
    await Recommendation.collection.createIndex({ walletAddress: 1 });
    await Recommendation.collection.createIndex({ timestamp: -1 });
    await Recommendation.collection.createIndex({ walletAddress: 1, timestamp: -1 });
    
    // Transaction model indexes
    await Transaction.collection.createIndex({ walletAddress: 1 });
    await Transaction.collection.createIndex({ timestamp: -1 });
    await Transaction.collection.createIndex({ transactionHash: 1 }, { unique: true, sparse: true });
    await Transaction.collection.createIndex({ walletAddress: 1, timestamp: -1 });
    
    // RebalanceEvent model indexes
    await RebalanceEvent.collection.createIndex({ walletAddress: 1 });
    await RebalanceEvent.collection.createIndex({ timestamp: -1 });
    await RebalanceEvent.collection.createIndex({ walletAddress: 1, timestamp: -1 });
    
    // Market data indexes
    await TokenPrice.collection.createIndex({ symbol: 1, timestamp: -1 });
    await ProtocolMetrics.collection.createIndex({ protocol: 1, timestamp: -1 });
    await MarketOverview.collection.createIndex({ timestamp: -1 });
    await StakingRates.collection.createIndex({ protocol: 1, timestamp: -1 });
    
    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating database indexes:', error);
  }
};

// Clean old data to prevent database bloat
const cleanOldData = async () => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  try {
    // Keep only one month of market data
    await TokenPrice.deleteMany({ timestamp: { $lt: oneMonthAgo } });
    await ProtocolMetrics.deleteMany({ timestamp: { $lt: oneMonthAgo } });
    await MarketOverview.deleteMany({ timestamp: { $lt: oneMonthAgo } });
    
    // Keep only the last 100 transactions per wallet
    const wallets = await Transaction.distinct('walletAddress');
    for (const wallet of wallets) {
      const transactionCount = await Transaction.countDocuments({ walletAddress: wallet });
      if (transactionCount > 100) {
        const oldestToKeep = await Transaction.find({ walletAddress: wallet })
          .sort({ timestamp: -1 })
          .skip(100)
          .limit(1);
          
        if (oldestToKeep.length > 0) {
          await Transaction.deleteMany({ 
            walletAddress: wallet, 
            timestamp: { $lt: oldestToKeep[0].timestamp } 
          });
        }
      }
    }
    
    // Keep only the last 50 rebalance events per wallet
    const rebalanceWallets = await RebalanceEvent.distinct('walletAddress');
    for (const wallet of rebalanceWallets) {
      const eventCount = await RebalanceEvent.countDocuments({ walletAddress: wallet });
      if (eventCount > 50) {
        const oldestToKeep = await RebalanceEvent.find({ walletAddress: wallet })
          .sort({ timestamp: -1 })
          .skip(50)
          .limit(1);
          
        if (oldestToKeep.length > 0) {
          await RebalanceEvent.deleteMany({ 
            walletAddress: wallet, 
            timestamp: { $lt: oldestToKeep[0].timestamp } 
          });
        }
      }
    }
    
    console.log('Old data cleanup completed successfully');
  } catch (error) {
    console.error('Error cleaning old data:', error);
  }
};

// Initialize database with required setup
const initializeDatabase = async (uri = process.env.MONGODB_URI) => {
  try {
    await connectDB(uri);
    await createIndexes();
    
    // Schedule periodic data cleanup
    if (process.env.NODE_ENV === 'production') {
      // Run cleanup at midnight every day
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const msUntilMidnight = midnight - new Date();
      
      setTimeout(() => {
        cleanOldData();
        // After first run, schedule to run daily
        setInterval(cleanOldData, 24 * 60 * 60 * 1000);
      }, msUntilMidnight);
    }
    
    return mongoose.connection;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

module.exports = {
  connectDB,
  disconnectDB,
  isConnected,
  getConnection,
  createIndexes,
  cleanOldData,
  initializeDatabase,
  models: {
    User,
    Portfolio,
    Recommendation,
    Transaction,
    RebalanceEvent,
    TokenPrice,
    ProtocolMetrics,
    MarketOverview,
    StakingRates
  }
};