// server/models/recommendation.js
// MongoDB model for storing AI-generated recommendations and execution history

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Protocol allocation schema
const AllocationSchema = new Schema({
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
  percentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  amount: Number,
  expectedApr: Number,
  assetType: {
    type: String,
    enum: ['staking', 'lending', 'liquidity', 'yield', 'other'],
    default: 'staking'
  },
  contractAddress: String,
  functionName: String
});

// Operation schema for tracking executed steps
const OperationSchema = new Schema({
  protocol: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['stake', 'unstake', 'lend', 'withdraw', 'addLiquidity', 'removeLiquidity', 'swap', 'deposit'],
    default: 'stake'
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
  executedAt: Date
});

// Recommendation schema
const RecommendationSchema = new Schema({
  walletAddress: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  summary: String,
  riskProfile: {
    type: String,
    enum: ['conservative', 'balanced', 'aggressive'],
    required: true
  },
  totalApr: {
    type: Number,
    required: true
  },
  totalInvestment: {
    type: Number,
    required: true
  },
  allocation: {
    type: [AllocationSchema],
    required: true
  },
  steps: [String],
  risks: [String],
  mitigations: [String],
  additionalNotes: String,
  marketConditions: {
    aptPrice: Number,
    marketTrend: {
      type: String,
      enum: ['bullish', 'bearish', 'neutral', 'volatile'],
      default: 'neutral'
    },
    volatilityIndex: Number,
    riskAssessment: String
  },
  executionStatus: {
    type: String,
    enum: ['pending', 'executing', 'completed', 'failed', 'partial'],
    default: 'pending'
  },
  operations: [OperationSchema],
  executed: {
    type: Boolean,
    default: false
  },
  executedAt: Date,
  successPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  aiModelUsed: {
    type: String,
    enum: ['claude', 'gpt-4o', 'hybrid'],
    default: 'hybrid'
  },
  aiConfidenceScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.85
  },
  userFeedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    timestamp: Date
  },
  performanceTracking: {
    startValue: Number,
    startDate: Date,
    checkpoints: [{
      value: Number,
      date: Date,
      percentageChange: Number
    }],
    currentValue: Number,
    currentDate: Date,
    totalReturn: Number
  }
}, { timestamps: true });

// Add compound index for wallet and timestamp
RecommendationSchema.index({ walletAddress: 1, timestamp: -1 });

// Static method to create a new recommendation
RecommendationSchema.statics.createRecommendation = async function(recommendationData) {
  return this.create(recommendationData);
};

// Method to update execution status
RecommendationSchema.methods.updateExecutionStatus = async function(status, operations = []) {
  this.executionStatus = status;
  
  if (status === 'completed' || status === 'partial' || status === 'failed') {
    this.executed = true;
    this.executedAt = new Date();
  }
  
  // Calculate success percentage
  if (operations.length > 0) {
    const successfulOps = operations.filter(op => op.status === 'success').length;
    this.successPercentage = (successfulOps / operations.length) * 100;
    this.operations = operations;
  }
  
  return this.save();
};

// Method to add user feedback
RecommendationSchema.methods.addUserFeedback = async function(rating, comment = '') {
  this.userFeedback = {
    rating,
    comment,
    timestamp: new Date()
  };
  
  return this.save();
};

// Method to track performance
RecommendationSchema.methods.trackPerformance = async function(currentValue) {
  // Initialize if not already set
  if (!this.performanceTracking || !this.performanceTracking.startValue) {
    this.performanceTracking = {
      startValue: currentValue,
      startDate: new Date(),
      checkpoints: [],
      currentValue,
      currentDate: new Date(),
      totalReturn: 0
    };
  } else {
    // Add new checkpoint
    const percentageChange = ((currentValue - this.performanceTracking.startValue) / this.performanceTracking.startValue) * 100;
    
    this.performanceTracking.checkpoints.push({
      value: currentValue,
      date: new Date(),
      percentageChange
    });
    
    // Update current values
    this.performanceTracking.currentValue = currentValue;
    this.performanceTracking.currentDate = new Date();
    this.performanceTracking.totalReturn = percentageChange;
    
    // Limit checkpoints to 30
    if (this.performanceTracking.checkpoints.length > 30) {
      this.performanceTracking.checkpoints = this.performanceTracking.checkpoints.slice(-30);
    }
  }
  
  return this.save();
};

// Static method to find recommendations for a wallet
RecommendationSchema.statics.findByWallet = function(walletAddress, limit = 10) {
  return this.find({ walletAddress })
    .sort({ timestamp: -1 })
    .limit(limit);
};

// Static method to find executed recommendations
RecommendationSchema.statics.findExecuted = function(walletAddress) {
  return this.find({
    walletAddress,
    executed: true
  }).sort({ executedAt: -1 });
};

// Static method to get performance metrics for wallet
RecommendationSchema.statics.getPerformanceMetrics = async function(walletAddress) {
  // Find all executed recommendations with performance tracking
  const recommendations = await this.find({
    walletAddress,
    executed: true,
    'performanceTracking.startValue': { $exists: true }
  }).sort({ executedAt: -1 });
  
  if (recommendations.length === 0) {
    return null;
  }
  
  // Calculate average returns
  let totalReturn = 0;
  let successCount = 0;
  let bestReturn = -Infinity;
  let worstReturn = Infinity;
  let bestRecommendation = null;
  let worstRecommendation = null;
  
  recommendations.forEach(rec => {
    if (rec.performanceTracking && rec.performanceTracking.totalReturn) {
      const returnValue = rec.performanceTracking.totalReturn;
      totalReturn += returnValue;
      successCount++;
      
      if (returnValue > bestReturn) {
        bestReturn = returnValue;
        bestRecommendation = {
          id: rec._id,
          title: rec.title,
          return: returnValue
        };
      }
      
      if (returnValue < worstReturn) {
        worstReturn = returnValue;
        worstRecommendation = {
          id: rec._id,
          title: rec.title,
          return: returnValue
        };
      }
    }
  });
  
  // Calculate averages
  const averageReturn = successCount > 0 ? totalReturn / successCount : 0;
  
  return {
    totalRecommendations: recommendations.length,
    successfulExecutions: successCount,
    averageReturn,
    bestRecommendation,
    worstRecommendation
  };
};

// Create recommendation model
const Recommendation = mongoose.model('Recommendation', RecommendationSchema);

module.exports = Recommendation;