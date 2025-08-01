const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username must be less than 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(email) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      message: 'Please enter a valid email address'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name must be less than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name must be less than 50 characters']
  },
  dateOfBirth: {
    type: Date,
    required: false
  },
  phoneNumber: {
    type: String,
    required: false,
    validate: {
      validator: function(phone) {
        return !phone || /^\+?[\d\s\-\(\)]+$/.test(phone);
      },
      message: 'Please enter a valid phone number'
    }
  },
  profilePicture: {
    type: String,
    default: null
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  // Trading-related fields
  balance: {
    type: Number,
    default: 1000000 // Starting with ₹10,00,000
  },
  portfolio: [{
    symbol: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    avgPrice: {
      type: Number,
      required: true,
      min: 0
    },
    totalValue: {
      type: Number,
      default: 0
    },
    gainLoss: {
      type: Number,
      default: 0
    },
    gainLossPercent: {
      type: Number,
      default: 0
    }
  }],
  trades: [{
    type: {
      type: String,
      required: true,
      enum: ['BUY', 'SELL']
    },
    symbol: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    totalAmount: {
      type: Number,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true // This adds createdAt and updatedAt fields automatically
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get user profile (without sensitive data)
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Virtual for total portfolio value
userSchema.virtual('totalPortfolioValue').get(function() {
  return this.balance + this.portfolio.reduce((total, stock) => total + stock.totalValue, 0);
});

// Method to update portfolio values based on current prices
userSchema.methods.updatePortfolioValues = function(stockPrices) {
  this.portfolio.forEach(stock => {
    const currentPrice = stockPrices[stock.symbol];
    if (currentPrice) {
      stock.totalValue = stock.quantity * currentPrice;
      stock.gainLoss = (currentPrice - stock.avgPrice) * stock.quantity;
      stock.gainLossPercent = ((currentPrice - stock.avgPrice) / stock.avgPrice) * 100;
    }
  });
};

module.exports = mongoose.model('User', userSchema, 'Signup');
