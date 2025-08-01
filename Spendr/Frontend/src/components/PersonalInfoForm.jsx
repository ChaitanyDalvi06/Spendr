import React, { useState, useEffect } from 'react';
import { 
  User, 
  Phone, 
  Briefcase, 
  DollarSign, 
  Calculator,
  CreditCard,
  ChevronRight,
  CheckCircle
} from 'lucide-react';

const PersonalInfoForm = ({ user, onComplete }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    age: '',
    mobileNumber: '',
    occupation: '',
    monthlyIncome: '',
    monthlyExpenses: '',
    aadharNumber: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isFirstTimeSetup, setIsFirstTimeSetup] = useState(true);

  // Check if personal info already exists and load it
  useEffect(() => {
    const checkExistingPersonalInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:3001/api/personal-info', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (data.success && data.data) {
          // Personal info exists, populate the form
          setFormData({
            firstName: data.data.firstName || '',
            lastName: data.data.lastName || '',
            age: data.data.age || '',
            mobileNumber: data.data.mobileNumber || '',
            occupation: data.data.occupation || '',
            monthlyIncome: data.data.monthlyIncome || '',
            monthlyExpenses: data.data.monthlyExpenses || '',
            aadharNumber: data.data.aadharNumber || ''
          });
          setIsEditing(true);
          setIsFirstTimeSetup(false); // Not first time if data exists
        }
      } catch (error) {
        console.log('No existing personal info found, creating new one');
        setIsFirstTimeSetup(true);
      }
    };

    checkExistingPersonalInfo();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.age || formData.age < 13 || formData.age > 120) {
      newErrors.age = 'Age must be between 13 and 120';
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^[\+]?[1-9][\d]{9,15}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid mobile number';
    }

    if (!formData.occupation.trim()) {
      newErrors.occupation = 'Occupation is required';
    }

    if (!formData.monthlyIncome || parseFloat(formData.monthlyIncome) <= 0) {
      newErrors.monthlyIncome = 'Monthly income must be greater than 0';
    }

    if (!formData.monthlyExpenses || parseFloat(formData.monthlyExpenses) < 0) {
      newErrors.monthlyExpenses = 'Monthly expenses cannot be negative';
    }

    if (parseFloat(formData.monthlyIncome) < parseFloat(formData.monthlyExpenses)) {
      newErrors.monthlyExpenses = 'Monthly expenses cannot be greater than monthly income';
    }

    if (!formData.aadharNumber.trim()) {
      newErrors.aadharNumber = 'Aadhar number is required';
    } else if (!/^\d{12}$/.test(formData.aadharNumber)) {
      newErrors.aadharNumber = 'Aadhar number must be exactly 12 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const method = isEditing ? 'PUT' : 'POST';
      const response = await fetch('http://localhost:3001/api/personal-info', {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          age: parseInt(formData.age),
          monthlyIncome: parseFloat(formData.monthlyIncome),
          monthlyExpenses: parseFloat(formData.monthlyExpenses)
        })
      });

      const data = await response.json();

      if (data.success) {
        setIsFirstTimeSetup(false); // Mark as no longer first-time setup
        onComplete(data.data);
      } else {
        if (data.errors) {
          const newErrors = {};
          data.errors.forEach(error => {
            if (error.includes('Aadhar')) {
              newErrors.aadharNumber = error;
            } else if (error.includes('mobile')) {
              newErrors.mobileNumber = error;
            }
          });
          setErrors(newErrors);
        } else {
          setErrors({ general: data.message });
        }
      }
    } catch (error) {
      console.error('Personal info submission error:', error);
      setErrors({ general: 'Network error. Please try again.' });
    }

    setLoading(false);
  };

  const calculateMonthlySavings = () => {
    const income = parseFloat(formData.monthlyIncome) || 0;
    const expenses = parseFloat(formData.monthlyExpenses) || 0;
    return income - expenses;
  };

  const monthlySavings = calculateMonthlySavings();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-2 sm:p-4">
      <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-8 w-full max-w-2xl mx-2 sm:mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {isEditing ? 'Update Personal Information' : 'Personal Information'}
          </h1>
          <p className="text-sm sm:text-base text-gray-400">
            {isEditing 
              ? 'Update your profile information to keep your financial insights current'
              : 'Complete your profile to get personalized financial insights'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                First Name {!isFirstTimeSetup && <span className="text-xs text-gray-500">(Cannot be changed)</span>}
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={!isFirstTimeSetup}
                className={`w-full px-4 py-3 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${
                  !isFirstTimeSetup 
                    ? 'bg-gray-700 cursor-not-allowed opacity-75' 
                    : 'bg-gray-800 focus:border-purple-500'
                }`}
                placeholder="Enter your first name"
              />
              {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Last Name {!isFirstTimeSetup && <span className="text-xs text-gray-500">(Cannot be changed)</span>}
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={!isFirstTimeSetup}
                className={`w-full px-4 py-3 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${
                  !isFirstTimeSetup 
                    ? 'bg-gray-700 cursor-not-allowed opacity-75' 
                    : 'bg-gray-800 focus:border-purple-500'
                }`}
                placeholder="Enter your last name"
              />
              {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>

          {/* Age and Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Age {!isFirstTimeSetup && <span className="text-xs text-gray-500">(Cannot be changed)</span>}
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                disabled={!isFirstTimeSetup}
                min="13"
                max="120"
                className={`w-full px-4 py-3 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${
                  !isFirstTimeSetup 
                    ? 'bg-gray-700 cursor-not-allowed opacity-75' 
                    : 'bg-gray-800 focus:border-purple-500'
                }`}
                placeholder="Enter your age"
              />
              {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age}</p>}
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Enter your mobile number"
              />
              {errors.mobileNumber && <p className="text-red-400 text-sm mt-1">{errors.mobileNumber}</p>}
            </div>
          </div>

          {/* Occupation */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              <Briefcase className="w-4 h-4 inline mr-1" />
              Occupation
            </label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="Enter your occupation"
            />
            {errors.occupation && <p className="text-red-400 text-sm mt-1">{errors.occupation}</p>}
          </div>

          {/* Financial Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                <span className="inline-block w-4 h-4 mr-1 text-center font-bold">₹</span>
                Monthly Income
              </label>
              <input
                type="number"
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Enter monthly income"
              />
              {errors.monthlyIncome && <p className="text-red-400 text-sm mt-1">{errors.monthlyIncome}</p>}
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                <span className="inline-block w-4 h-4 mr-1 text-center font-bold">₹</span>
                Monthly Expenses
              </label>
              <input
                type="number"
                name="monthlyExpenses"
                value={formData.monthlyExpenses}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="Enter monthly expenses"
              />
              {errors.monthlyExpenses && <p className="text-red-400 text-sm mt-1">{errors.monthlyExpenses}</p>}
            </div>
          </div>

          {/* Monthly Savings Calculation */}
          {formData.monthlyIncome && formData.monthlyExpenses && (
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calculator className="w-5 h-5 text-purple-400 mr-2" />
                  <span className="text-gray-300">Monthly Savings:</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium text-gray-300">
                    ₹{parseFloat(formData.monthlyIncome).toLocaleString()} - ₹{parseFloat(formData.monthlyExpenses).toLocaleString()} = 
                  </p>
                  <p className={`text-xl font-bold ${monthlySavings >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ₹{monthlySavings.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Aadhar Number */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              <CreditCard className="w-4 h-4 inline mr-1" />
              Aadhar Card Number (12 digits) {!isFirstTimeSetup && <span className="text-xs text-gray-500">(Cannot be changed)</span>}
            </label>
            <input
              type="text"
              name="aadharNumber"
              value={formData.aadharNumber}
              onChange={handleInputChange}
              disabled={!isFirstTimeSetup}
              maxLength="12"
              pattern="\d{12}"
              className={`w-full px-4 py-3 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${
                !isFirstTimeSetup 
                  ? 'bg-gray-700 cursor-not-allowed opacity-75' 
                  : 'bg-gray-800 focus:border-purple-500'
              }`}
              placeholder="Enter 12-digit Aadhar number"
            />
            {errors.aadharNumber && <p className="text-red-400 text-sm mt-1">{errors.aadharNumber}</p>}
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Complete Profile
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
