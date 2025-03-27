// server/models/portfolio.js
const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  name: {
    type: String,
    trim: true,
    default: 'Default Portfolio',
  },
  assets: [
    {
      token: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
  historicalData: [
    {
      date: {
        type: Date,
        required: true,
      },
      value: {
        type: Number,
        required: true,
      },
    },
  ],
  currentValue: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Validator to ensure unique dates in historicalData
portfolioSchema.path('historicalData').validate(function (historicalData) {
  const dates = historicalData.map(entry => entry.date.getTime());
  const uniqueDates = new Set(dates);
  return dates.length === uniqueDates.size;
}, 'Historical data dates must be unique');

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

module.exports = Portfolio;