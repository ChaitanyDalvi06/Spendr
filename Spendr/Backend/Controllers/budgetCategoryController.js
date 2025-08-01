const BudgetCategory = require('../Models/BudgetCategory');

// Get all budget categories for a user
const getBudgetCategories = async (req, res) => {
  try {
    const userId = req.user.userId;

    const categories = await BudgetCategory.find({ userId }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: categories
    });

  } catch (error) {
    console.error('Get budget categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// Create a new budget category
const createBudgetCategory = async (req, res) => {
  try {
    const { name, budget, icon, color } = req.body;
    const userId = req.user.userId;

    // Check if category with this name already exists for this user
    const existingCategory = await BudgetCategory.findOne({ userId, name });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'A category with this name already exists'
      });
    }

    const category = new BudgetCategory({
      userId,
      name,
      budget,
      icon: icon || '📝',
      color: color || 'from-gray-500 to-gray-600'
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: 'Budget category created successfully',
      data: category
    });

  } catch (error) {
    console.error('Create budget category error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A category with this name already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// Update a budget category
const updateBudgetCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, budget, icon, color, spent } = req.body;
    const userId = req.user.userId;

    const category = await BudgetCategory.findOneAndUpdate(
      { _id: id, userId },
      { name, budget, icon, color, spent },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Budget category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Budget category updated successfully',
      data: category
    });

  } catch (error) {
    console.error('Update budget category error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// Delete a budget category
const deleteBudgetCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const category = await BudgetCategory.findOneAndDelete({ _id: id, userId });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Budget category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Budget category deleted successfully'
    });

  } catch (error) {
    console.error('Delete budget category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// Initialize default categories for a user
const initializeDefaultCategories = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Check if user already has categories
    const existingCategories = await BudgetCategory.find({ userId });
    if (existingCategories.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Categories already exist',
        data: existingCategories
      });
    }

    const defaultCategories = [
      { name: 'Food & Dining', budget: 300, icon: '🍕', color: 'from-orange-500 to-orange-600' },
      { name: 'Transportation', budget: 150, icon: '🚗', color: 'from-blue-500 to-blue-600' },
      { name: 'Entertainment', budget: 200, icon: '🎬', color: 'from-purple-500 to-purple-600' },
      { name: 'Clothing', budget: 100, icon: '👕', color: 'from-pink-500 to-pink-600' },
      { name: 'Education', budget: 250, icon: '📚', color: 'from-green-500 to-green-600' },
      { name: 'Savings', budget: 400, icon: '💰', color: 'from-emerald-500 to-emerald-600' }
    ];

    const categories = await BudgetCategory.insertMany(
      defaultCategories.map(cat => ({ ...cat, userId }))
    );

    res.status(201).json({
      success: true,
      message: 'Default categories created successfully',
      data: categories
    });

  } catch (error) {
    console.error('Initialize default categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

module.exports = {
  getBudgetCategories,
  createBudgetCategory,
  updateBudgetCategory,
  deleteBudgetCategory,
  initializeDefaultCategories
};
