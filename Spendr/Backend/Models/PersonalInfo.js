const mongoose = require('mongoose');

const personalInfoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
    unique: true
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
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [13, 'Age must be at least 13'],
    max: [120, 'Age must be less than 120']
  },
  mobileNumber: {
    type: String,
    required: [true, 'Mobile number is required'],
    validate: {
      validator: function(mobile) {
        return /^[\+]?[1-9][\d]{0,15}$/.test(mobile);
      },
      message: 'Please enter a valid mobile number'
    }
  },
  occupation: {
    type: String,
    required: [true, 'Occupation is required'],
    trim: true,
    maxlength: [100, 'Occupation must be less than 100 characters']
  },
  monthlyIncome: {
    type: Number,
    required: [true, 'Monthly income is required'],
    min: [0, 'Monthly income cannot be negative']
  },
  monthlyExpenses: {
    type: Number,
    required: [true, 'Monthly expenses is required'],
    min: [0, 'Monthly expenses cannot be negative']
  },
  monthlySavings: {
    type: Number,
    required: false // This will be calculated automatically
  },
  aadharNumber: {
    type: String,
    required: [true, 'Aadhar number is required'],
    validate: {
      validator: function(aadhar) {
        return /^\d{12}$/.test(aadhar);
      },
      message: 'Aadhar number must be exactly 12 digits'
    },
    unique: true
  }
}, {
  timestamps: true
});

// Pre-save middleware to calculate monthly savings
personalInfoSchema.pre('save', function(next) {
  this.monthlySavings = this.monthlyIncome - this.monthlyExpenses;
  next();
});

module.exports = mongoose.model('PersonalInfo', personalInfoSchema, 'Personalinfo');
