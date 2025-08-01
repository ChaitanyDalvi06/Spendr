import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Minus, 
  Edit3, 
  Trash2, 
  TrendingUp, 
  TrendingDown,
  IndianRupee,
  Calendar,
  PieChart,
  Loader2
} from 'lucide-react';
import FinancialGoals from './FinancialGoals';

const BudgetTracker = ({ onNavigateToProfile }) => {
  const [personalInfo, setPersonalInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [transactions, setTransactions] = useState([
    { id: '1', description: 'Lunch at school cafeteria', amount: 12.50, category: 'Food & Dining', date: '2024-01-15', type: 'expense' },
    { id: '2', description: 'Bus fare', amount: 5.00, category: 'Transportation', date: '2024-01-15', type: 'expense' },
    { id: '3', description: 'Movie tickets', amount: 25.00, category: 'Entertainment', date: '2024-01-14', type: 'expense' },
    { id: '4', description: 'Part-time job payment', amount: 200.00, category: 'Income', date: '2024-01-14', type: 'income' },
    { id: '5', description: 'New textbook', amount: 45.00, category: 'Education', date: '2024-01-13', type: 'expense' }
  ]);

  // Fetch personal info data from backend
  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/budget-categories', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const result = await response.json();
      console.log('API Response:', result); // Debug log
      const categories = result.success ? result.data : [];
      console.log('Categories extracted:', categories); // Debug log
      setCategories(Array.isArray(categories) ? categories : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]); // Ensure categories is always an array
      // If no categories exist, initialize with defaults
      if (error.message.includes('No categories found')) {
        await initializeDefaultCategories();
      }
    } finally {
      setCategoriesLoading(false);
    }
  };

  // Initialize default categories
  const initializeDefaultCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/budget-categories/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        await fetchCategories();
      }
    } catch (error) {
      console.error('Error initializing categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:3001/api/personal-info', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        if (data.success) {
          setPersonalInfo(data.data);
        } else {
          setError(data.message || 'Failed to fetch personal information');
        }
      } catch (error) {
        console.error('Error fetching personal info:', error);
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalInfo();
  }, []);

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', budget: '', icon: '📝' });
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'expense'
  });

  // Calculate budget values using real personal info data and transactions
  const totalBudget = Array.isArray(categories) ? categories.reduce((sum, cat) => sum + (cat.budget || 0), 0) : 0;
  const totalSpent = Array.isArray(categories) ? categories.reduce((sum, cat) => sum + (cat.spent || 0), 0) : 0;
  
  // Calculate total expenses from transactions
  const totalExpensesFromTransactions = transactions.reduce((sum, transaction) => {
    return transaction.type === 'expense' ? sum + (transaction.amount || 0) : sum;
  }, 0);
  
  const monthlyIncome = personalInfo ? personalInfo.monthlyIncome : 0;
  const monthlyExpenses = personalInfo ? personalInfo.monthlyExpenses : 0;
  const monthlySavings = personalInfo ? personalInfo.monthlySavings : 0;
  const remainingBudget = totalBudget - totalExpensesFromTransactions;

  const handleAddCategory = async () => {
    if (newCategory.name && newCategory.budget) {
      const success = await addCategory(
        newCategory.name,
        newCategory.budget,
        newCategory.icon,
        'from-green-500 to-green-600'
      );
      
      if (success) {
        setNewCategory({ name: '', budget: '', icon: '📝' });
        setShowAddCategory(false);
      }
    }
  };

  const addCategory = async (name, budget, icon, color) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/budget-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          budget: parseFloat(budget),
          spent: 0,
          icon,
          color
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create category');
      }

      const result = await response.json();
      const newCategory = result.success ? result.data : null;
      if (newCategory) {
        setCategories(prev => [...prev, newCategory]);
      }
      return true;
    } catch (error) {
      console.error('Error adding category:', error);
      return false;
    }
  };

  const updateCategorySpending = async (categoryId, newSpent) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/budget-categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          spent: parseFloat(newSpent)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update category');
      }

      const result = await response.json();
      const updatedCategory = result.success ? result.data : null;
      if (updatedCategory) {
        setCategories(prev => 
          prev.map(cat => cat._id === categoryId ? updatedCategory : cat)
        );
      }
      return true;
    } catch (error) {
      console.error('Error updating category:', error);
      return false;
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/budget-categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      setCategories(prev => prev.filter(cat => cat._id !== categoryId));
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  };

  const handleAddTransaction = () => {
    if (newTransaction.description && newTransaction.amount && newTransaction.category) {
      const transaction = {
        id: Date.now().toString(),
        description: newTransaction.description,
        amount: parseFloat(newTransaction.amount),
        category: newTransaction.category,
        date: new Date().toISOString().split('T')[0],
        type: newTransaction.type
      };
      
      setTransactions([transaction, ...transactions]);
      
      // Update category spending if it's an expense
      if (newTransaction.type === 'expense') {
        setCategories(cats => 
          cats.map(cat => 
            cat.name === newTransaction.category 
              ? { ...cat, spent: cat.spent + parseFloat(newTransaction.amount) }
              : cat
          )
        );
      }
      
      setNewTransaction({ description: '', amount: '', category: '', type: 'expense' });
      setShowAddTransaction(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8 sm:py-12">
          <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 animate-spin" />
          <span className="ml-2 text-sm sm:text-base text-gray-400">Loading budget data...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 sm:p-4 mx-2 sm:mx-0">
          <p className="text-red-400 text-center text-sm sm:text-base">{error}</p>
        </div>
      )}

      {/* No Personal Info Found */}
      {!loading && !error && !personalInfo && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 sm:p-6 text-center mx-2 sm:mx-0">
          <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-2">Personal Information Required</h3>
          <p className="text-sm sm:text-base text-yellow-400 mb-4">
            Please complete your personal information form first to see your personalized budget data.
          </p>
          <button
            onClick={() => onNavigateToProfile && onNavigateToProfile()}
            className="px-4 sm:px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm sm:text-base"
          >
            Complete Personal Info
          </button>
        </div>
      )}

      {/* Budget Overview */}
      {!loading && !error && personalInfo && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-sm border border-green-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-green-300 font-medium text-sm sm:text-base">Monthly Income</h3>
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              </div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">₹{monthlyIncome.toLocaleString()}</p>
              <p className="text-green-400 text-xs sm:text-sm mt-1">From personal info</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm border border-blue-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-blue-300 font-medium text-sm sm:text-base">Monthly Expenses</h3>
                <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
              </div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">₹{monthlyExpenses.toLocaleString()}</p>
              <p className="text-blue-400 text-xs sm:text-sm mt-1">
                {monthlyIncome > 0 ? Math.round((monthlyExpenses / monthlyIncome) * 100) : 0}% of income
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-sm border border-orange-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-orange-300 font-medium text-sm sm:text-base">Monthly Savings</h3>
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
              </div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">₹{monthlySavings.toLocaleString()}</p>
              <p className="text-orange-400 text-xs sm:text-sm mt-1">
                {monthlyIncome > 0 ? Math.round((monthlySavings / monthlyIncome) * 100) : 0}% of income
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-sm border border-purple-500/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-purple-300 font-medium text-sm sm:text-base">Budget Remaining</h3>
                <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              </div>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">₹{remainingBudget.toLocaleString()}</p>
              <p className="text-purple-400 text-xs sm:text-sm mt-1">
                {totalBudget > 0 ? Math.round((remainingBudget / totalBudget) * 100) : 0}% available
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Total Expenses: ₹{totalExpensesFromTransactions.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Budget Categories */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Budget Categories</h3>
                <button
                  onClick={() => setShowAddCategory(true)}
                  className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {categoriesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                    <span className="ml-2 text-gray-400">Loading categories...</span>
                  </div>
                ) : !Array.isArray(categories) || categories.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">No budget categories yet. Add one to get started!</p>
                  </div>
                ) : (
                  categories.map((category) => (
                    <div key={category._id} className="p-4 bg-gray-800/50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{category.icon}</span>
                          <div>
                            <h4 className="text-white font-medium">{category.name}</h4>
                            <p className="text-gray-400 text-sm">
                              ₹{category.spent || 0} / ₹{category.budget || 0}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteCategory(category._id)}
                        className="p-1 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${
                          ((category.spent || 0) / (category.budget || 1)) * 100 >= 100 
                            ? 'bg-gradient-to-r from-red-500 to-red-600' 
                            : ((category.spent || 0) / (category.budget || 1)) * 100 >= 80
                            ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                            : 'bg-gradient-to-r from-green-500 to-green-600'
                        }`}
                        style={{ width: `${Math.min(((category.spent || 0) / (category.budget || 1)) * 100, 100)}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        {Math.round(((category.spent || 0) / (category.budget || 1)) * 100)}% used
                      </span>
                      <span className={(category.spent || 0) > (category.budget || 0) ? 'text-red-400' : 'text-green-400'}>
                        ₹{(category.budget || 0) - (category.spent || 0)} remaining
                      </span>
                    </div>
                  </div>
                  ))
                )}
              </div>

              {/* Add Category Modal */}
              {showAddCategory && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
                    <h3 className="text-xl font-bold text-white mb-4">Add New Category</h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Category name"
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                        className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Budget amount"
                        value={newCategory.budget}
                        onChange={(e) => setNewCategory({...newCategory, budget: e.target.value})}
                        className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Icon (emoji)"
                        value={newCategory.icon}
                        onChange={(e) => setNewCategory({...newCategory, icon: e.target.value})}
                        className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex space-x-3 mt-6">
                      <button
                        onClick={handleAddCategory}
                        className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Add Category
                      </button>
                      <button
                        onClick={() => setShowAddCategory(false)}
                        className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Recent Transactions */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
                <button
                  onClick={() => setShowAddTransaction(true)}
                  className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{transaction.description}</h4>
                        <p className="text-gray-400 text-sm flex items-center space-x-2">
                          <Calendar className="w-3 h-3" />
                          <span>{transaction.date}</span>
                          <span>•</span>
                          <span>{transaction.category}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                          {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                        </p>
                        <p className="text-gray-400 text-xs capitalize">{transaction.type}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Transaction Modal */}
              {showAddTransaction && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
                    <h3 className="text-xl font-bold text-white mb-4">Add New Transaction</h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Description"
                        value={newTransaction.description}
                        onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
                        className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Amount"
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
                        className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                      />
                      <select
                        value={newTransaction.category}
                        onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
                        className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                      >
                        <option value="">Select Category</option>
                        {Array.isArray(categories) && categories.map(cat => (
                          <option key={cat._id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                      <select
                        value={newTransaction.type}
                        onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value})}
                        className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
                      >
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                      </select>
                    </div>
                    <div className="flex space-x-3 mt-6">
                      <button
                        onClick={handleAddTransaction}
                        className="flex-1 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Add Transaction
                      </button>
                      <button
                        onClick={() => setShowAddTransaction(false)}
                        className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Spending Insights */}
          <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Spending Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h4 className="font-semibold text-white mb-2">Top Category</h4>
                <p className="text-2xl font-bold text-purple-400">
                  {categories.reduce((max, cat) => cat.spent > max.spent ? cat : max, categories[0])?.name || 'N/A'}
                </p>
                <p className="text-sm text-gray-400">
                  ${categories.reduce((max, cat) => cat.spent > max.spent ? cat : max, categories[0])?.spent || 0} spent
                </p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h4 className="font-semibold text-white mb-2">Daily Average</h4>
                <p className="text-2xl font-bold text-blue-400">₹{(totalSpent / 30).toFixed(2)}</p>
                <p className="text-sm text-gray-400">Based on monthly spending</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <h4 className="font-semibold text-white mb-2">Budget Health</h4>
                <p className={`text-2xl font-bold ${totalSpent <= totalBudget ? 'text-green-400' : 'text-red-400'}`}>
                  {totalSpent <= totalBudget ? 'Good' : 'Over Budget'}
                </p>
                <p className="text-sm text-gray-400">
                  {Math.round((totalSpent / totalBudget) * 100)}% of budget used
                </p>
              </div>
            </div>
          </div>

          {/* Financial Goals Section */}
          <div className="mt-8">
            <FinancialGoals />
          </div>
        </>
      )}
    </div>
  );
};

export default BudgetTracker;
