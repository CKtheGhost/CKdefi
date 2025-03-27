// server/models/marketData.js
// MongoDB model for storing market data, protocol stats, and token prices

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Token price schema
const TokenPriceSchema = new Schema({
  symbol: {
    type: String,
    required: true,
    trim: true
  },
  name: String,
  price: {
    type: Number,
    required: true
  },
  percentChange24h: Number,
  percentChange7d: Number,
  volume24h: Number,
  marketCap: Number,
  circulatingSupply: Number,
  totalSupply: Number,
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  dataSource: String
});

// Protocol metrics schema
const ProtocolMetricsSchema = new Schema({
  protocol: {
    type: String,
    required: true,
    trim: true
  },
  name: String,
  category: {
    type: String,
    enum: ['staking', 'lending', 'dex', 'yield', 'other'],
    default: 'other'
  },
  tvlUSD: Number,
  volumeUSD24h: Number,
  userCount24h: Number,
  transactionCount24h: Number,
  feesUSD24h: Number,
  revenueUSD24h: Number,
  stakingAPR: Number,
  lendingAPR: Number,
  borrowAPR: Number,
  tradingFee: Number,
  riskScore: Number,
  securityScore: Number,
  liquidityScore: Number,
  contractAddress: String,
  website: String,
  twitter: String,
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  products: [{
    name: String,
    type: String,
    apr: Number,
    tvlUSD: Number,
    riskLevel: String,
    contractAddress: String
  }]
});

// Market overview schema
const MarketOverviewSchema = new Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  aptosStats: {
    price: Number,
    priceChange24h: Number,
    volume24h: Number,
    marketCap: Number,
    totalSupply: Number,
    stakedSupply: Number,
    stakingAPR: Number,
    activeAddresses24h: Number,
    transactionCount24h: Number,
    tps: Number,
    gasPrice: Number
  },
  marketSentiment: {
    overall: {
      type: String,
      enum: ['bullish', 'bearish', 'neutral', 'volatile'],
      default: 'neutral'
    },
    volatilityIndex: Number,
    fearGreedIndex: Number,
    dominance: {
      apt: Number,
      other: Number
    }
  },
  defiStats: {
    totalTVL: Number,
    totalVolume24h: Number,
    totalActiveUsers24h: Number,
    totalTransactions24h: Number,
    topGainers: [{
      protocol: String,
      change24h: Number
    }],
    topLosers: [{
      protocol: String,
      change24h: Number
    }]
  },
  gasStats: {
    averageGas: Number,
    medianGas: Number,
    highestGas: Number,
    lowestGas: Number,
    gasUsed24h: Number
  },
  topStrategies: [{
    name: String,
    riskLevel: String,
    expectedAPR: Number,
    protocols: [String]
  }],
  riskAssessment: {
    systemicRisk: Number,
    marketRisk: Number,
    liquidityRisk: Number,
    volatilityRisk: Number,
    comments: String
  }
}, {
  timeseries: {
    timeField: 'timestamp',
    granularity: 'hours',
    metaField: 'type'
  }
});

// Staking rates schema
const StakingRatesSchema = new Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  protocol: {
    type: String,
    required: true,
    trim: true
  },
  product: {
    type: String,
    required: true,
    trim: true
  },
  apr: {
    type: Number,
    required: true
  },
  rewardType: String,
  lockupPeriod: Number, // in days
  minStake: Number,
  tvlUSD: Number,
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'very high'],
    default: 'medium'
  },
  impermanentLossRisk: {
    type: String,
    enum: ['none', 'low', 'medium', 'high'],
    default: 'none'
  },
  stakingTokenPrice: Number,
  rewardTokenPrice: Number,
  contractAddress: String
});

// Token schemas
TokenPriceSchema.index({ symbol: 1 }, { unique: true });
ProtocolMetricsSchema.index({ protocol: 1 }, { unique: true });
StakingRatesSchema.index({ protocol: 1, product: 1, timestamp: -1 });
MarketOverviewSchema.index({ timestamp: -1 });

// Collection name options with TTL indexes
const tokenPriceOptions = {
  timeseries: {
    timeField: 'lastUpdated',
    metaField: 'symbol',
    expireAfterSeconds: 90 * 24 * 60 * 60 // 90 days
  }
};

const stakingRatesOptions = {
  timeseries: {
    timeField: 'timestamp',
    metaField: 'protocol',
    expireAfterSeconds: 90 * 24 * 60 * 60 // 90 days
  }
};

// Create models
const TokenPrice = mongoose.model('TokenPrice', TokenPriceSchema, 'token_prices', tokenPriceOptions);
const ProtocolMetrics = mongoose.model('ProtocolMetrics', ProtocolMetricsSchema, 'protocol_metrics');
const MarketOverview = mongoose.model('MarketOverview', MarketOverviewSchema, 'market_overview');
const StakingRates = mongoose.model('StakingRates', StakingRatesSchema, 'staking_rates', stakingRatesOptions);

// Methods for token prices
TokenPrice.getLatestPrices = async function(limit = 100) {
  return this.find({})
    .sort({ marketCap: -1 })
    .limit(limit);
};

TokenPrice.getTokenPrice = async function(symbol) {
  return this.findOne({ symbol: symbol.toUpperCase() });
};

TokenPrice.updateTokenPrice = async function(symbol, priceData) {
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };
  return this.findOneAndUpdate(
    { symbol: symbol.toUpperCase() },
    { $set: { ...priceData, lastUpdated: new Date() } },
    options
  );
};

// Methods for protocol metrics
ProtocolMetrics.getProtocols = async function(category) {
  const query = category ? { category } : {};
  return this.find(query).sort({ tvlUSD: -1 });
};

ProtocolMetrics.getProtocol = async function(protocol) {
  return this.findOne({ protocol: protocol.toLowerCase() });
};

ProtocolMetrics.updateProtocol = async function(protocol, metricsData) {
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };
  return this.findOneAndUpdate(
    { protocol: protocol.toLowerCase() },
    { $set: { ...metricsData, lastUpdated: new Date() } },
    options
  );
};

// Methods for market overview
MarketOverview.getLatest = async function() {
  return this.findOne({}).sort({ timestamp: -1 });
};

MarketOverview.getHistorical = async function(days = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return this.find({ timestamp: { $gte: cutoffDate } })
    .sort({ timestamp: 1 });
};

MarketOverview.createSnapshot = async function(overviewData) {
  return this.create({
    ...overviewData,
    timestamp: new Date()
  });
};

// Methods for staking rates
StakingRates.getLatestRates = async function() {
  // Group by protocol and product to get the latest rate for each
  return this.aggregate([
    {
      $sort: { timestamp: -1 }
    },
    {
      $group: {
        _id: { protocol: '$protocol', product: '$product' },
        latestRate: { $first: '$$ROOT' }
      }
    },
    {
      $replaceRoot: { newRoot: '$latestRate' }
    },
    {
      $sort: { apr: -1 }
    }
  ]);
};

StakingRates.getProtocolRates = async function(protocol) {
  return this.find({ protocol: protocol.toLowerCase() })
    .sort({ timestamp: -1 });
};

StakingRates.addRate = async function(rateData) {
  return this.create({
    ...rateData,
    timestamp: new Date()
  });
};

StakingRates.getRateHistory = async function(protocol, product, days = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return this.find({
    protocol: protocol.toLowerCase(),
    product,
    timestamp: { $gte: cutoffDate }
  }).sort({ timestamp: 1 });
};

// Export models
module.exports = {
  TokenPrice,
  ProtocolMetrics,
  MarketOverview,
  StakingRates
};