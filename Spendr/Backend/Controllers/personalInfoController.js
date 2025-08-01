const PersonalInfo = require('../Models/PersonalInfo');
const User = require('../Models/User');

// Create personal info
const createPersonalInfo = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      age,
      mobileNumber,
      occupation,
      monthlyIncome,
      monthlyExpenses,
      aadharNumber
    } = req.body;

    const userId = req.user.userId; // Get userId from decoded JWT token

    // Check if personal info already exists for this user
    const existingPersonalInfo = await PersonalInfo.findOne({ userId });
    if (existingPersonalInfo) {
      return res.status(400).json({
        success: false,
        message: 'Personal information already exists for this user'
      });
    }

    // Validate that monthly income is greater than or equal to monthly expenses
    if (monthlyIncome < monthlyExpenses) {
      return res.status(400).json({
        success: false,
        message: 'Monthly income cannot be less than monthly expenses'
      });
    }

    // Create new personal info
    const personalInfo = new PersonalInfo({
      userId,
      firstName,
      lastName,
      age,
      mobileNumber,
      occupation,
      monthlyIncome,
      monthlyExpenses,
      aadharNumber
    });

    await personalInfo.save();

    res.status(201).json({
      success: true,
      message: 'Personal information saved successfully',
      data: personalInfo
    });

  } catch (error) {
    console.error('Personal info creation error:', error);

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    if (error.code === 11000) {
      if (error.keyPattern.aadharNumber) {
        return res.status(400).json({
          success: false,
          message: 'This Aadhar number is already registered'
        });
      }
    }

    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// Get personal info by user ID
const getPersonalInfo = async (req, res) => {
  try {
    const userId = req.user.userId;

    const personalInfo = await PersonalInfo.findOne({ userId }).populate('userId', 'username email');

    if (!personalInfo) {
      return res.status(404).json({
        success: false,
        message: 'Personal information not found'
      });
    }

    res.status(200).json({
      success: true,
      data: personalInfo
    });

  } catch (error) {
    console.error('Get personal info error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again later.'
    });
  }
};

// Update personal info
const updatePersonalInfo = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updateData = req.body;

    // Validate that monthly income is greater than or equal to monthly expenses if both are provided
    if (updateData.monthlyIncome !== undefined && updateData.monthlyExpenses !== undefined) {
      if (updateData.monthlyIncome < updateData.monthlyExpenses) {
        return res.status(400).json({
          success: false,
          message: 'Monthly income cannot be less than monthly expenses'
        });
      }
    }

    const personalInfo = await PersonalInfo.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!personalInfo) {
      return res.status(404).json({
        success: false,
        message: 'Personal information not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Personal information updated successfully',
      data: personalInfo
    });

  } catch (error) {
    console.error('Update personal info error:', error);

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

module.exports = {
  createPersonalInfo,
  getPersonalInfo,
  updatePersonalInfo
};
