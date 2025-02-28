import mongoose from 'mongoose';

const AssetSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: [true, 'Please provide asset symbol'],
    uppercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide asset name'],
  },
  quantity: {
    type: Number,
    required: [true, 'Please provide quantity'],
    min: [0, 'Quantity cannot be negative'],
  },
  buyPrice: {
    type: Number,
    required: [true, 'Please provide buy price'],
    min: [0, 'Buy price cannot be negative'],
  },
  currentPrice: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  key: {
    type: String,
    default: 'Bitget',
  },
  wallet: {
    type: String,
    default: 'Bitget',
  },
});

const PortfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide portfolio name'],
    default: 'Main Portfolio',
  },
  assets: [AssetSchema],
  totalInvestedValue: {
    type: Number,
    default: 0,
  },
  totalCurrentValue: {
    type: Number,
    default: 0,
  },
  targetAmount: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Calculate total portfolio values before saving
PortfolioSchema.pre('save', function (next) {
  let totalInvestedValue = 0;
  let totalCurrentValue = 0;

  this.assets.forEach(asset => {
    totalInvestedValue += asset.quantity * asset.buyPrice;
    totalCurrentValue += asset.quantity * asset.currentPrice;
  });

  this.totalInvestedValue = totalInvestedValue;
  this.totalCurrentValue = totalCurrentValue;
  next();
});

export default mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);
