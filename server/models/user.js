// server/models/user.js
// MongoDB model for storing user data, preferences, and authentication

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

// Linked wallet schema
const LinkedWalletSchema = new Schema({
  address: {
    type: String,
    required: true,
    trim: true
  },
  label: {
    type: String,
    trim: true
  },
  network: {
    type: String,
    default: 'MAINNET'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  dateLinked: {
    type: Date,
    default: Date.now
  },
  isPrimary: {
    type: Boolean,
    default: false
  }
});

// User preference schema
const UserPreferenceSchema = new Schema({
  theme: {
    type: String,
    enum: ['light', 'dark', 'system'],
    default: 'system'
  },
  riskProfile: {
    type: String,
    enum: ['conservative', 'balanced', 'aggressive'],
    default: 'balanced'
  },
  rebalancingFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'biweekly', 'monthly', 'manual'],
    default: 'weekly'
  },
  rebalancingThreshold: {
    type: Number,
    default: 5, // 5% drift before rebalancing
    min: 1,
    max: 20
  },
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    },
    rebalance: {
      type: Boolean,
      default: true
    },
    priceAlert: {
      type: Boolean,
      default: true
    },
    newsletter: {
      type: Boolean,
      default: true
    }
  },
  dashboard: {
    favoriteProtocols: [String],
    defaultSection: {
      type: String,
      default: 'market-overview'
    }
  },
  aiSettings: {
    preferredModel: {
      type: String,
      enum: ['claude', 'gpt-4o', 'auto'],
      default: 'auto'
    },
    autoRecommend: {
      type: Boolean,
      default: true
    },
    preserveStakedPositions: {
      type: Boolean,
      default: true
    }
  }
});

// API key schema for integrations
const ApiKeySchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  key: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  lastUsed: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  permissions: [String]
});

// User schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  name: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'premium'],
    default: 'user'
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  lastLogin: Date,
  linkedWallets: [LinkedWalletSchema],
  preferences: {
    type: UserPreferenceSchema,
    default: () => ({})
  },
  savedRecommendations: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    title: String,
    summary: String,
    totalApr: Number,
    allocation: Array,
    steps: Array,
    riskProfile: String,
    isFavorite: {
      type: Boolean,
      default: false
    }
  }],
  subscriptionStatus: {
    type: String,
    enum: ['free', 'premium', 'enterprise'],
    default: 'free'
  },
  subscriptionExpiry: Date,
  apiKeys: [ApiKeySchema],
  metrics: {
    totalLogins: {
      type: Number,
      default: 0
    },
    lastActive: Date,
    recommendations: {
      total: {
        type: Number,
        default: 0
      },
      executed: {
        type: Number,
        default: 0
      }
    },
    autoRebalance: {
      total: {
        type: Number,
        default: 0
      },
      lastRun: Date
    },
    portfolioGrowth: {
      startValue: Number,
      currentValue: Number,
      startDate: Date
    }
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.verificationToken;
      delete ret.resetPasswordToken;
      delete ret.resetPasswordExpires;
      return ret;
    }
  }
});

// Password hashing middleware
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
UserSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Method to add a linked wallet
UserSchema.methods.addLinkedWallet = async function(walletData) {
  // Check if wallet already exists
  const exists = this.linkedWallets.some(wallet => 
    wallet.address.toLowerCase() === walletData.address.toLowerCase() &&
    wallet.network === walletData.network
  );
  
  if (exists) {
    throw new Error('Wallet already linked to this account');
  }
  
  // If this is the first wallet, make it primary
  if (this.linkedWallets.length === 0) {
    walletData.isPrimary = true;
  }
  
  this.linkedWallets.push(walletData);
  return this.save();
};

// Method to set a wallet as primary
UserSchema.methods.setPrimaryWallet = async function(walletAddress) {
  // Reset all primary flags
  this.linkedWallets.forEach(wallet => {
    wallet.isPrimary = false;
  });
  
  // Set the new primary wallet
  const targetWallet = this.linkedWallets.find(wallet => 
    wallet.address.toLowerCase() === walletAddress.toLowerCase()
  );
  
  if (!targetWallet) {
    throw new Error('Wallet not found');
  }
  
  targetWallet.isPrimary = true;
  return this.save();
};

// Method to save a recommendation
UserSchema.methods.saveRecommendation = async function(recommendationData) {
  this.savedRecommendations.push(recommendationData);
  
  // Increment recommendations count
  if (!this.metrics) {
    this.metrics = {};
  }
  if (!this.metrics.recommendations) {
    this.metrics.recommendations = { total: 0, executed: 0 };
  }
  
  this.metrics.recommendations.total += 1;
  
  // Limit saved recommendations to last 20
  if (this.savedRecommendations.length > 20) {
    this.savedRecommendations = this.savedRecommendations.slice(-20);
  }
  
  return this.save();
};

// Method to update user metrics for portfolio tracking
UserSchema.methods.updatePortfolioMetrics = async function(portfolioValue) {
  if (!this.metrics) {
    this.metrics = {};
  }
  
  if (!this.metrics.portfolioGrowth) {
    this.metrics.portfolioGrowth = {
      startValue: portfolioValue,
      currentValue: portfolioValue,
      startDate: new Date()
    };
  } else {
    this.metrics.portfolioGrowth.currentValue = portfolioValue;
  }
  
  return this.save();
};

// Method to log successful auto-rebalance
UserSchema.methods.logAutoRebalance = async function() {
  if (!this.metrics) {
    this.metrics = {};
  }
  
  if (!this.metrics.autoRebalance) {
    this.metrics.autoRebalance = { total: 0 };
  }
  
  this.metrics.autoRebalance.total += 1;
  this.metrics.autoRebalance.lastRun = new Date();
  
  return this.save();
};

// Static method to find user by email with wallet info
UserSchema.statics.findByEmailWithWallets = function(email) {
  return this.findOne({ email }).select('+linkedWallets');
};

// Static method to record user login
UserSchema.statics.recordLogin = async function(userId) {
  return this.findByIdAndUpdate(
    userId,
    {
      $set: { lastLogin: new Date() },
      $inc: { 'metrics.totalLogins': 1 }
    },
    { new: true }
  );
};

// Static method to find by verification token
UserSchema.statics.findByVerificationToken = function(token) {
  return this.findOne({ verificationToken: token });
};

// Create user model
const User = mongoose.model('User', UserSchema);

module.exports = User;