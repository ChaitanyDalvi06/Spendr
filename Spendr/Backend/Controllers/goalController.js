const Goal = require('../Models/Goal');

// Get all goals for a user
const getGoals = async (req, res) => {
  try {
    const userId = req.user.userId;

    const goals = await Goal.find({ userId }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: goals
    });

  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// Create a new goal
const createGoal = async (req, res) => {
  try {
    const { name, targetAmount, deadline, monthlyContribution, priority, category, image } = req.body;
    const userId = req.user.userId;

    // Check if goal with this name already exists for this user
    const existingGoal = await Goal.findOne({ userId, name });
    if (existingGoal) {
      return res.status(400).json({
        success: false,
        message: 'A goal with this name already exists'
      });
    }

    const goal = new Goal({
      userId,
      name,
      targetAmount,
      currentAmount: 0,
      deadline,
      monthlyContribution: monthlyContribution || 0,
      priority: priority || 'medium',
      category,
      image: image || ''
    });

    await goal.save();

    res.status(201).json({
      success: true,
      message: 'Goal created successfully',
      data: goal
    });

  } catch (error) {
    console.error('Create goal error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// Update a goal
const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, targetAmount, currentAmount, deadline, monthlyContribution, priority, category, image } = req.body;
    const userId = req.user.userId;

    const goal = await Goal.findOneAndUpdate(
      { _id: id, userId },
      { name, targetAmount, currentAmount, deadline, monthlyContribution, priority, category, image },
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Goal updated successfully',
      data: goal
    });

  } catch (error) {
    console.error('Update goal error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: errors.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// Delete a goal
const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const goal = await Goal.findOneAndDelete({ _id: id, userId });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Goal deleted successfully'
    });

  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// Add money to a goal (increase currentAmount)
const addToGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;
    const userId = req.user.userId;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be a positive number'
      });
    }

    const goal = await Goal.findOne({ _id: id, userId });

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: 'Goal not found'
      });
    }

    goal.currentAmount = Math.min(goal.currentAmount + amount, goal.targetAmount);
    await goal.save();

    res.status(200).json({
      success: true,
      message: 'Amount added to goal successfully',
      data: goal
    });

  } catch (error) {
    console.error('Add to goal error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// Initialize default goals for new users
const initializeDefaultGoals = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Check if user already has goals
    const existingGoals = await Goal.findOne({ userId });
    if (existingGoals) {
      return res.status(200).json({
        success: true,
        message: 'User already has goals'
      });
    }

    const defaultGoals = [
      {
        userId,
        name: 'Emergency Fund',
        targetAmount: 1000,
        currentAmount: 0,
        deadline: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000), // 6 months from now
        monthlyContribution: 167,
        priority: 'high',
        category: 'Emergency Fund'
      },
      {
        userId,
        name: 'Vacation Fund',
        targetAmount: 500,
        currentAmount: 0,
        deadline: new Date(Date.now() + 12 * 30 * 24 * 60 * 60 * 1000), // 12 months from now
        monthlyContribution: 42,
        priority: 'medium',
        category: 'Travel'
      }
    ];

    await Goal.insertMany(defaultGoals);

    res.status(201).json({
      success: true,
      message: 'Default goals created successfully'
    });

  } catch (error) {
    console.error('Initialize default goals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  addToGoal,
  initializeDefaultGoals
};
