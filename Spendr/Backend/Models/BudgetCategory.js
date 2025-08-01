const mongoose = require('mongoose');

const budgetCategorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  name: {
    type: String,
    required: [true, 'Category name is required'],
    trim: true,
    maxlength: [50, 'Category name must be less than 50 characters']
  },
  budget: {
    type: Number,
    required: [true, 'Budget amount is required'],
    min: [0, 'Budget amount cannot be negative']
  },
  spent: {
    type: Number,
    default: 0,
    min: [0, 'Spent amount cannot be negative']
  },
  icon: {
    type: String,
    default: '📝',
    maxlength: [10, 'Icon must be less than 10 characters']
  },
  color: {
    type: String,
    default: 'from-gray-500 to-gray-600',
    maxlength: [100, 'Color must be less than 100 characters']
  }
}, {
  timestamps: true
});

// Compound index to ensure unique category names per user
budgetCategorySchema.index({ userId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('BudgetCategory', budgetCategorySchema);
