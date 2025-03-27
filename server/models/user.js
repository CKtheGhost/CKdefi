// server/models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  username: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  preferences: {
    riskTolerance: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    investmentGoals: {
      type: [String],
      default: [],
    },
  },
  connectedAccounts: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;