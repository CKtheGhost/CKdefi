// server/models/rebalanceEvent.js
// MongoDB model for tracking auto-rebalancing events and performance

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Operation schema for rebalancing
const RebalanceOperationSchema = new Schema({
  protocol: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['stake', 'unstake', 'lend', 'withdraw', 'addLiquidity', 'removeLiquidity', 'swap', 'other'],
    default: 'other'
  },
  amount: {
    type: Number,
    required: true
  },
  contractAddress: String,
  functionName: String,
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },
  transactionHash: String,
  error: String,
  executedAt: Date,
  details: Schema.Types.Mixed
});

// Allocation item schema
const AllocationItemSchema = new Schema({
  protocol: {
    type: String,
    required: true,
    trim: true
  },
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  amount: Number,
  valueUSD: Number,
  priceUSD: Number
});

// Rebalance event schema
const RebalanceEventSchema = new Schema({
  walletAddress: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    sparse: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  },
  type: {
    type: String,
    enum: ['scheduled', 'manual', 'drift', 'recommendation'],
    default: 'scheduled'
  },
  trigger: {
    type: String,
    enum: ['time', 'drift', 'price', 'user', 'recommendation', 'other'],
    default: 'time'
  },
  recommendationId: {
    type: Schema.Types.ObjectId,
    ref: 'Recommendation',
    sparse: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'failed', 'partial', 'skipped'],
    default: 'pending'
  },
  startTime: Date,
  endTime: Date,
  duration: Number, // in milliseconds
  
  // Portfolio state before rebalancing
  previousState: {
    totalValueUSD: Number,
    allocation: [AllocationItemSchema],
    aptPrice: Number
  },
  
  // Target allocation
  targetAllocation: [AllocationItemSchema],
  
  // Drift analysis
  driftAnalysis: {
    maxDrift: Number,
    averageDrift: Number,
    driftDetails: [{
      protocol: String,
      currentPercentage: Number,
      targetPercentage: Number,
      drift: Number,
      action: String
    }],
    rebalanceNeeded: Boolean,
    threshold: Number
  },
  
  // Execution details
  operations: [RebalanceOperationSchema],
  successfulOperations: Number,
  failedOperations: Number,
  skippedOperations: Number,
  
  // Portfolio state after rebalancing
  newState: {
    totalValueUSD: Number,
    allocation: [AllocationItemSchema],
    aptPrice: Number
  },
  
  // Performance metrics
  performanceMetrics: {
    valueDifference: Number,
    percentChange: Number,
    feesPaid: Number,
    gasUsed: Number,
    slippage: Number,
    executionQuality: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      default: 'good'
    }
  },
  
  // Error information if rebalance failed
  error: {
    message: String,
    code: String,
    details: Schema.Types.Mixed
  },
  
  // Settings used for this rebalance
  settings: {
    minRebalanceThreshold: Number,
    maxSlippage: Number,
    preserveStakedPositions: Boolean,
    gasBuffer: Number,
    maxRetries: Number
  },
  
  // Market conditions during rebalancing
  marketConditions: {
    aptPrice: Number,
    marketTrend: String,
    volatilityIndex: Number,
    gasPrice: Number
  },
  
  // Additional notes
  notes: String,
  
  // AI feedback if using AI for rebalancing
  aiFeedback: {
    model: String,
    confidence: Number,
    reasoning: String,
    adjustments: [{
      protocol: String,
      originalPercentage: Number,
      adjustedPercentage: Number,
      reason: String
    }]
  }
}, { timestamps: true });

// Create indexes
RebalanceEventSchema.index({ walletAddress: 1, timestamp: -1 });
RebalanceEventSchema.index({ status: 1, walletAddress: 1 });
RebalanceEventSchema.index({ 'previousState.totalValueUSD': 1 });
RebalanceEventSchema.index({ 'performanceMetrics.percentChange': 1 });

// Static method to create a new rebalance event
RebalanceEventSchema.statics.createEvent = async function(eventData) {
  return this.create({
    ...eventData,
    startTime: new Date(),
    status: 'pending'
  });
};

// Method to update rebalance progress
RebalanceEventSchema.methods.updateProgress = async function(status, operations = []) {
  this.status = status;
  
  if (operations.length > 0) {
    this.operations = operations;
    this.successfulOperations = operations.filter(op => op.status === 'success').length;
    this.failedOperations = operations.filter(op => op.status === 'failed').length;
    this.skippedOperations = operations.filter(op => op.status === 'skipped').length;
  }
  
  return this.save();
};

// Method to complete rebalance event
RebalanceEventSchema.methods.complete = async function(newState = null, performanceMetrics = null) {
  this.status = this.failedOperations > 0 ? 
    (this.successfulOperations > 0 ? 'partial' : 'failed') : 
    'completed';
  
  this.endTime = new Date();
  this.duration = this.endTime - this.startTime;
  
  if (newState) {
    this.newState = newState;
  }
  
  if (performanceMetrics) {
    this.performanceMetrics = performanceMetrics;
  } else if (this.newState && this.previousState) {
    // Calculate performance metrics
    const valueDifference = this.newState.totalValueUSD - this.previousState.totalValueUSD;
    const percentChange = this.previousState.totalValueUSD > 0 ? 
      (valueDifference / this.previousState.totalValueUSD) * 100 : 0;
    
    this.performanceMetrics = {
      valueDifference,
      percentChange,
      ...this.performanceMetrics
    };
  }
  
  return this.save();
};

// Method to mark rebalance as failed
RebalanceEventSchema.methods.fail = async function(error) {
  this.status = 'failed';
  this.endTime = new Date();
  this.duration = this.endTime - this.startTime;
  
  if (error) {
    this.error = {
      message: error.message || 'Unknown error',
      code: error.code || 'unknown',
      details: error.details || {}
    };
  }
  
  return this.save();
};

// Method to mark rebalance as skipped
RebalanceEventSchema.methods.skip = async function(reason) {
  this.status = 'skipped';
  this.endTime = new Date();
  this.duration = 0;
  this.notes = reason || 'Rebalance skipped - portfolio already balanced';
  
  return this.save();
};

// Static method to find events by wallet
RebalanceEventSchema.statics.findByWallet = function(walletAddress, limit = 20) {
  return this.find({ walletAddress })
    .sort({ timestamp: -1 })
    .limit(limit);
};

// Static method to find latest rebalance event
RebalanceEventSchema.statics.findLatest = function(walletAddress) {
  return this.findOne({ walletAddress })
    .sort({ timestamp: -1 });
};

// Static method to get rebalance statistics
RebalanceEventSchema.statics.getStatistics = async function(walletAddress, days = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const events = await this.find({
    walletAddress,
    timestamp: { $gte: cutoffDate },
    status: { $in: ['completed', 'partial'] }
  });
  
  if (events.length === 0) {
    return {
      totalRebalances: 0,
      avgPerformance: 0,
      totalValueGain: 0,
      successRate: 0
    };
  }
  
  let totalGain = 0;
  let totalOperations = 0;
  let successfulOperations = 0;
  
  events.forEach(event => {
    if (event.performanceMetrics && event.performanceMetrics.valueDifference) {
      totalGain += event.performanceMetrics.valueDifference;
    }
    
    totalOperations += event.operations?.length || 0;
    successfulOperations += event.successfulOperations || 0;
  });
  
  return {
    totalRebalances: events.length,
    avgPerformance: events.length > 0 ? totalGain / events.length : 0,
    totalValueGain: totalGain,
    successRate: totalOperations > 0 ? (successfulOperations / totalOperations) * 100 : 0,
    bestPerformance: events.reduce((best, event) => {
      const performance = event.performanceMetrics?.percentChange || 0;
      return performance > best ? performance : best;
    }, 0),
    worstPerformance: events.reduce((worst, event) => {
      const performance = event.performanceMetrics?.percentChange || 0;
      return performance < worst ? performance : worst;
    }, 0)
  };
};

// Create rebalance event model
const RebalanceEvent = mongoose.model('RebalanceEvent', RebalanceEventSchema);

module.exports = RebalanceEvent;