// server/models/portfolio.js
// MongoDB model for storing user portfolio data and historical balances

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Token holding schema
const TokenHoldingSchema = new Schema({
  symbol: {
    type: String,
    required: true,
    trim: true
  },
  name: String,
  amount: {
    type: Number,
    required: true,
    default: 0
  },
  valueUSD: {
    type: Number,
    required: true,
    default: 0
  },
  priceUSD: {
    type: Number,
    required: true,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Staking position schema
const StakingPositionSchema = new Schema({
  protocol: {
    type: String,
    required: true,
    trim: true
  },
  tokenSymbol: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    default: 0
  },
  valueUSD: {
    type: Number,
    required: true,
    default: 0
  },
  apr: {
    type: Number,
    default: 0
  },
  startDate: Date,
  endDate: Date,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Liquidity position schema
const LiquidityPositionSchema = new Schema({
  protocol: {
    type: String,
    required: true,
    trim: true
  },
  pairName: {
    type: String,
    required: true,
    trim: true
  },
  token0Symbol: String,
  token1Symbol: String,
  token0Amount: Number,
  token1Amount: Number,
  lpTokenAmount: Number,
  valueUSD: {
    type: Number,
    required: true,
    default: 0
  },
  apr: {
    type: Number,
    default: 0
  },
  startDate: Date,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Historical balance snapshot schema
const BalanceSnapshotSchema = new Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  totalValueUSD: {
    type: Number,
    required: true,
    default: 0
  },
  totalAptValue: {
    type: Number,
    default: 0
  },
  aptPrice: {
    type: Number,
    default: 0
  },
  nativeBalanceUSD: {
    type: Number,
    default: 0
  },
  stakedBalanceUSD: {
    type: Number,
    default: 0
  },
  liquidityBalanceUSD: {
    type: Number,
    default: 0
  },
  otherBalanceUSD: {
    type: Number,
    default: 0
  }
});

// Transaction schema for tracking user operations
const TransactionSchema = new Schema({
  hash: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['stake', 'unstake', 'addLiquidity', 'removeLiquidity', 'swap', 'transfer', 'other'],
    default: 'other'
  },
  protocol: {
    type: String,
    trim: true
  },
  tokenSymbol: String,
  amount: Number,
  valueUSD: Number,
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'pending'
  },
  metadata: {
    type: Object,
    default: {}
  }
});

// Portfolio schema
const PortfolioSchema = new Schema({
  walletAddress: {
    type: String,
    required: true,
    trim: true,
    index: true,
    unique: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  network: {
    type: String,
    required: true,
    default: 'MAINNET'
  },
  totalValueUSD: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  nativeTokens: [TokenHoldingSchema],
  stakedPositions: [StakingPositionSchema],
  liquidityPositions: [LiquidityPositionSchema],
  otherTokens: [TokenHoldingSchema],
  historicalBalances: [BalanceSnapshotSchema],
  transactions: [TransactionSchema],
  riskProfile: {
    type: String,
    enum: ['conservative', 'balanced', 'aggressive'],
    default: 'balanced'
  },
  performanceMetrics: {
    dailyChange: Number,
    weeklyChange: Number,
    monthlyChange: Number,
    yearlyChange: Number,
    totalReturn: Number
  },
  rebalanceHistory: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    previousAllocation: Object,
    newAllocation: Object,
    reason: String,
    success: Boolean,
    valueUSD: Number
  }]
}, { timestamps: true });

// Add unique compound index for walletAddress and network
PortfolioSchema.index({ walletAddress: 1, network: 1 }, { unique: true });

// Pre-save hook to update totalValueUSD and lastUpdated
PortfolioSchema.pre('save', function(next) {
  // Calculate total value
  let totalValue = 0;
  
  if (this.nativeTokens) {
    this.nativeTokens.forEach(token => {
      totalValue += token.valueUSD || 0;
    });
  }
  
  if (this.stakedPositions) {
    this.stakedPositions.forEach(position => {
      totalValue += position.valueUSD || 0;
    });
  }
  
  if (this.liquidityPositions) {
    this.liquidityPositions.forEach(position => {
      totalValue += position.valueUSD || 0;
    });
  }
  
  if (this.otherTokens) {
    this.otherTokens.forEach(token => {
      totalValue += token.valueUSD || 0;
    });
  }
  
  this.totalValueUSD = totalValue;
  this.lastUpdated = new Date();
  
  next();
});

// Static method to create or update portfolio
PortfolioSchema.statics.createOrUpdatePortfolio = async function(walletAddress, portfolioData, options = {}) {
  const { upsert = true, network = 'MAINNET' } = options;
  
  // Add historical balance snapshot
  if (!portfolioData.historicalBalances) {
    portfolioData.historicalBalances = [];
  }
  
  portfolioData.historicalBalances.push({
    timestamp: new Date(),
    totalValueUSD: portfolioData.totalValueUSD || 0,
    totalAptValue: portfolioData.totalAptos || 0,
    aptPrice: portfolioData.aptPrice || 0,
    nativeBalanceUSD: portfolioData.nativeBalanceUSD || 0,
    stakedBalanceUSD: portfolioData.stakedBalanceUSD || 0,
    liquidityBalanceUSD: portfolioData.liquidityBalanceUSD || 0,
    otherBalanceUSD: portfolioData.otherBalanceUSD || 0
  });
  
  // Limit historical balances to last 90 days (daily snapshots)
  if (portfolioData.historicalBalances.length > 90) {
    portfolioData.historicalBalances = portfolioData.historicalBalances.slice(-90);
  }
  
  // Set last updated timestamp
  portfolioData.lastUpdated = new Date();
  
  // Update or create portfolio
  const filter = { walletAddress, network };
  const update = { $set: portfolioData };
  const opts = { new: true, upsert, setDefaultsOnInsert: true };
  
  return this.findOneAndUpdate(filter, update, opts);
};

// Method to add a new transaction to portfolio
PortfolioSchema.methods.addTransaction = async function(transactionData) {
  this.transactions.push(transactionData);
  
  // Limit transactions history to last 100
  if (this.transactions.length > 100) {
    this.transactions = this.transactions.slice(-100);
  }
  
  return this.save();
};

// Method to add a rebalance event to history
PortfolioSchema.methods.addRebalanceEvent = async function(rebalanceData) {
  this.rebalanceHistory.push(rebalanceData);
  
  // Limit rebalance history to last 50 events
  if (this.rebalanceHistory.length > 50) {
    this.rebalanceHistory = this.rebalanceHistory.slice(-50);
  }
  
  return this.save();
};

// Create portfolio model
const Portfolio = mongoose.model('Portfolio', PortfolioSchema);

module.exports = Portfolio;