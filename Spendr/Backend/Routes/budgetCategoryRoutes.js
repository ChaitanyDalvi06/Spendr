const express = require('express');
const {
  getBudgetCategories,
  createBudgetCategory,
  updateBudgetCategory,
  deleteBudgetCategory,
  initializeDefaultCategories
} = require('../Controllers/budgetCategoryController');
const { protect } = require('../Middleware/auth');

const router = express.Router();

// Get all budget categories for the user
router.get('/', protect, getBudgetCategories);

// Create a new budget category
router.post('/', protect, createBudgetCategory);

// Initialize default categories
router.post('/initialize', protect, initializeDefaultCategories);

// Update a budget category
router.put('/:id', protect, updateBudgetCategory);

// Delete a budget category
router.delete('/:id', protect, deleteBudgetCategory);

module.exports = router;
