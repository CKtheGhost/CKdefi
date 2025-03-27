// server/models/transaction.js
// MongoDB model for storing blockchain transaction data and execution status

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Transaction schema
const TransactionSchema = new Schema({
  hash: {
    type: String,
    trim: true,
    index: true,
    sparse: true
  },
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
  recommendationId: {
    type: Schema.Types.ObjectId,
    ref: 'Recommendation',
    index: true,
    sparse: true
  },
  type: {
    type: String,
    required: true,
    enum: ['stake', 'unstake', 'lend', 'withdraw', 'addLiquidity', 'removeLiquidity', 'swap', 'deposit', 'execute', 'other'],
    default: 'other'
  },
  subType: String,
  protocol: {
    type: String,
    trim: true,
    required: true
  },
  token: {
    type: String,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  amountUSD: Number,
  status: {
    type: String,
    enum: ['pending', 'submitted', 'confirmed', 'failed', 'expired'],
    default: 'pending'
  },
  networkFee: Number,
  executionTimestamp: Date,
  completionTimestamp: Date,
  contractAddress: {
    type: String,
    trim: true
  },
  functionName: String,
  functionArgs: Array,
  blockNumber: Number,
  network: {
    type: String,
    default: 'MAINNET',
    required: true
  },
  error: {
    code: String,
    message: String,
    details: Schema.Types.Mixed
  },
  source: {
    type: String,
    enum: ['manual', 'recommendation', 'auto-rebalance', 'api'],
    default: 'manual'
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },
  retryCount: {
    type: Number,
    default: 0
  },
  isSimulated: {
    type: Boolean,
    default: false
  },
  isUserConfirmed: {
    type: Boolean,
    default: false
  }
}, { 
  timestamps: true,
  strict: false // Allow additional fields for future compatibility
});

// Compound indexes
TransactionSchema.index({ walletAddress: 1, status: 1 });
TransactionSchema.index({ protocol: 1, type: 1, status: 1 });

// Add TTL index to automatically remove old pending transactions
TransactionSchema.index({ createdAt: 1 }, { 
  expireAfterSeconds: 7 * 24 * 60 * 60, // 7 days
  partialFilterExpression: { status: 'pending' }
});

// Check if transaction is pending
TransactionSchema.methods.isPending = function() {
  return this.status === 'pending' || this.status === 'submitted';
};

// Mark transaction as submitted
TransactionSchema.methods.markAsSubmitted = async function(hash) {
  this.status = 'submitted';
  this.hash = hash;
  this.executionTimestamp = new Date();
  return this.save();
};

// Mark transaction as confirmed
TransactionSchema.methods.markAsConfirmed = async function(blockNumber) {
  this.status = 'confirmed';
  this.completionTimestamp = new Date();
  if (blockNumber) this.blockNumber = blockNumber;
  return this.save();
};

// Mark transaction as failed
TransactionSchema.methods.markAsFailed = async function(error) {
  this.status = 'failed';
  this.completionTimestamp = new Date();
  
  if (error) {
    this.error = {
      code: error.code || 'unknown',
      message: error.message || 'Unknown error',
      details: error.details || {}
    };
  }
  
  return this.save();
};

// Increment retry count
TransactionSchema.methods.incrementRetry = async function() {
  this.retryCount += 1;
  return this.save();
};

// Static method to create a new transaction
TransactionSchema.statics.createTransaction = async function(transactionData) {
  return this.create(transactionData);
};

// Static method to find transactions by wallet
TransactionSchema.statics.findByWallet = function(walletAddress, limit = 50) {
  return this.find({ walletAddress })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to find pending transactions
TransactionSchema.statics.findPending = function(walletAddress) {
  return this.find({
    walletAddress,
    status: { $in: ['pending', 'submitted'] }
  }).sort({ createdAt: -1 });
};

// Static method to find transactions by recommendation
TransactionSchema.statics.findByRecommendation = function(recommendationId) {
  return this.find({ recommendationId })
    .sort({ createdAt: -1 });
};

// Static method to get transaction metrics
TransactionSchema.statics.getTransactionMetrics = async function(walletAddress, days = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  const metrics = await this.aggregate([
    { 
      $match: { 
        walletAddress, 
        createdAt: { $gte: cutoffDate } 
      } 
    },
    {
      $group: {
        _id: {
          status: '$status',
          protocol: '$protocol',
          type: '$type'
        },
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        avgAmount: { $avg: '$amount' },
        totalAmountUSD: { $sum: '$amountUSD' }
      }
    },
    {
      $group: {
        _id: '$_id.status',
        protocols: {
          $push: {
            protocol: '$_id.protocol',
            type: '$_id.type',
            count: '$count',
            totalAmount: '$totalAmount',
            avgAmount: '$avgAmount',
            totalAmountUSD: '$totalAmountUSD'
          }
        },
        totalCount: { $sum: '$count' }
      }
    }
  ]);
  
  // Transform to more usable format
  const result = {
    total: 0,
    confirmed: { count: 0, protocols: {} },
    failed: { count: 0, protocols: {} },
    pending: { count: 0, protocols: {} }
  };
  
  metrics.forEach(metric => {
    const status = metric._id;
    result[status] = {
      count: metric.totalCount,
      protocols: {}
    };
    
    metric.protocols.forEach(p => {
      if (!result[status].protocols[p.protocol]) {
        result[status].protocols[p.protocol] = {};
      }
      result[status].protocols[p.protocol][p.type] = {
        count: p.count,
        totalAmount: p.totalAmount,
        avgAmount: p.avgAmount,
        totalAmountUSD: p.totalAmountUSD
      };
    });
    
    result.total += metric.totalCount;
  });
  
  return result;
};

// Create transaction model
const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = Transaction;