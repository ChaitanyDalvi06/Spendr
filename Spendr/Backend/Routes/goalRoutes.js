const express = require('express');
const router = express.Router();
const { 
  getGoals, 
  createGoal, 
  updateGoal, 
  deleteGoal, 
  addToGoal,
  initializeDefaultGoals 
} = require('../Controllers/goalController');
const { protect } = require('../Middleware/auth');

// All routes require authentication
router.use(protect);

// Get all goals for the authenticated user
router.get('/', getGoals);

// Create a new goal
router.post('/', createGoal);

// Update a goal
router.put('/:id', updateGoal);

// Delete a goal
router.delete('/:id', deleteGoal);

// Add money to a goal
router.patch('/:id/add', addToGoal);

// Initialize default goals
router.post('/initialize', initializeDefaultGoals);

module.exports = router;
