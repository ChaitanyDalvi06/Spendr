import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Plus, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { format, differenceInMonths, parseISO } from 'date-fns';

const FinancialGoals = () => {
  const [goals, setGoals] = useState([]);
  const [goalsLoading, setGoalsLoading] = useState(true);

  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
    monthlyContribution: '',
    priority: 'medium',
    category: ''
  });

  // Fetch goals from backend
  const fetchGoals = async () => {
    try {
      setGoalsLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/goals', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }

      const result = await response.json();
      const goals = result.success ? result.data : [];
      setGoals(Array.isArray(goals) ? goals : []);
    } catch (error) {
      console.error('Error fetching goals:', error);
      setGoals([]);
    } finally {
      setGoalsLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const calculateMonthsToGoal = (goal) => {
    const remaining = (goal.targetAmount || 0) - (goal.currentAmount || 0);
    if ((goal.monthlyContribution || 0) <= 0) return Infinity;
    return Math.ceil(remaining / goal.monthlyContribution);
  };

  const calculateSuggestedContribution = (goal) => {
    const remaining = (goal.targetAmount || 0) - (goal.currentAmount || 0);
    const monthsLeft = differenceInMonths(parseISO(goal.deadline), new Date());
    if (monthsLeft <= 0) return remaining;
    return Math.ceil(remaining / monthsLeft);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-red-600';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'low': return 'from-green-500 to-green-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const addGoal = async (name, targetAmount, deadline, monthlyContribution, priority, category) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/goals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          targetAmount: parseFloat(targetAmount),
          deadline,
          monthlyContribution: parseFloat(monthlyContribution) || 0,
          priority,
          category
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create goal');
      }

      const result = await response.json();
      const newGoal = result.success ? result.data : null;
      if (newGoal) {
        setGoals(prev => [...prev, newGoal]);
      }
      return true;
    } catch (error) {
      console.error('Error adding goal:', error);
      return false;
    }
  };

  const addToGoal = async (goalId, amount) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/goals/${goalId}/add`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: parseFloat(amount)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add to goal');
      }

      const result = await response.json();
      const updatedGoal = result.success ? result.data : null;
      if (updatedGoal) {
        setGoals(prev => 
          prev.map(goal => goal._id === goalId ? updatedGoal : goal)
        );
      }
      return true;
    } catch (error) {
      console.error('Error adding to goal:', error);
      return false;
    }
  };

  const deleteGoal = async (goalId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/api/goals/${goalId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete goal');
      }

      setGoals(prev => prev.filter(goal => goal._id !== goalId));
      return true;
    } catch (error) {
      console.error('Error deleting goal:', error);
      return false;
    }
  };

  const handleAddGoal = async () => {
    if (newGoal.name && newGoal.targetAmount && newGoal.deadline) {
      const success = await addGoal(
        newGoal.name,
        newGoal.targetAmount,
        newGoal.deadline,
        newGoal.monthlyContribution,
        newGoal.priority,
        newGoal.category
      );
      
      if (success) {
        setNewGoal({
          name: '',
          targetAmount: '',
          deadline: '',
          monthlyContribution: '',
          priority: 'medium',
          category: ''
        });
        setShowAddGoal(false);
      }
    }
  };

  // Calculate totals with safe array access
  const totalGoals = Array.isArray(goals) ? goals.length : 0;
  const totalTarget = Array.isArray(goals) ? goals.reduce((sum, goal) => sum + (goal.targetAmount || 0), 0) : 0;
  const totalSaved = Array.isArray(goals) ? goals.reduce((sum, goal) => sum + (goal.currentAmount || 0), 0) : 0;
  const completedGoals = Array.isArray(goals) ? goals.filter(goal => (goal.currentAmount || 0) >= (goal.targetAmount || 0)).length : 0;

  return (
    <div className="space-y-6">
      {/* Loading State */}
      {goalsLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
          <span className="ml-2 text-gray-400">Loading goals...</span>
        </div>
      )}

      {!goalsLoading && (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">Financial Goals</h2>
              <p className="text-gray-400 mt-1">Track your savings progress and reach your targets</p>
            </div>
            <button
              onClick={() => setShowAddGoal(true)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Goal</span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h3 className="text-purple-300 font-medium text-sm">Total Goals</h3>
              <p className="text-2xl font-bold text-white">{totalGoals}</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h3 className="text-blue-300 font-medium text-sm">Total Target</h3>
              <p className="text-2xl font-bold text-white">${totalTarget.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h3 className="text-green-300 font-medium text-sm">Total Saved</h3>
              <p className="text-2xl font-bold text-white">${totalSaved.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h3 className="text-yellow-300 font-medium text-sm">Completed</h3>
              <p className="text-2xl font-bold text-white">{completedGoals}</p>
            </div>
          </div>

          {/* Goals Grid */}
          <div className="grid gap-6">
            {!Array.isArray(goals) || goals.length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No financial goals yet. Create your first goal to get started!</p>
              </div>
            ) : (
              goals.map((goal) => {
                const progress = ((goal.currentAmount || 0) / (goal.targetAmount || 1)) * 100;
                const remaining = (goal.targetAmount || 0) - (goal.currentAmount || 0);
                const monthsToGoal = calculateMonthsToGoal(goal);
                const suggestedContribution = calculateSuggestedContribution(goal);
                const isOverdue = new Date(goal.deadline) < new Date();
                const priorityColor = getPriorityColor(goal.priority);

                return (
                  <div key={goal._id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-start space-x-4">
                        {goal.image && (
                          <img 
                            src={goal.image} 
                            alt={goal.name} 
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <h3 className="text-xl font-bold text-white">{goal.name}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${priorityColor} text-white`}>
                              {goal.priority?.toUpperCase() || 'MEDIUM'}
                            </span>
                            <span className="text-gray-400 text-sm">{goal.category}</span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteGoal(goal._id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-400">${(goal.currentAmount || 0).toLocaleString()} saved</span>
                          <span className="text-gray-400">${(goal.targetAmount || 0).toLocaleString()} goal</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3">
                          <div 
                            className={`bg-gradient-to-r ${priorityColor} h-3 rounded-full transition-all duration-300`}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-sm mt-2">
                          <span className="text-green-400">{progress.toFixed(0)}% complete</span>
                          <span className="text-gray-400">${remaining.toLocaleString()} remaining</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="bg-gray-900/50 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            <span className="text-gray-400">Deadline</span>
                          </div>
                          <p className="text-white font-medium">
                            {format(parseISO(goal.deadline), 'MMM dd, yyyy')}
                          </p>
                          {isOverdue && (
                            <p className="text-red-400 text-xs mt-1">Overdue</p>
                          )}
                        </div>

                        <div className="bg-gray-900/50 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <Clock className="w-4 h-4 text-yellow-400" />
                            <span className="text-gray-400">Time to Goal</span>
                          </div>
                          <p className="text-white font-medium">
                            {monthsToGoal === Infinity ? 'Never' : `${monthsToGoal} months`}
                          </p>
                          <p className="text-gray-400 text-xs">At ${(goal.monthlyContribution || 0)}/month</p>
                        </div>

                        <div className="bg-gray-900/50 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <span className="text-gray-400">AI Suggestion</span>
                          </div>
                          <p className="text-white text-xs">
                            Increase monthly savings to ${suggestedContribution} to reach your goal on time.
                          </p>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => addToGoal(goal._id, 25)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                        >
                          +₹25
                        </button>
                        <button
                          onClick={() => addToGoal(goal._id, 50)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                        >
                          +₹50
                        </button>
                        <button
                          onClick={() => addToGoal(goal._id, 100)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                        >
                          +₹100
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* Add Goal Modal */}
      {showAddGoal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Add New Goal</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Goal name"
                value={newGoal.name}
                onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Target amount ($)"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              />
              <input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Monthly contribution ($)"
                value={newGoal.monthlyContribution}
                onChange={(e) => setNewGoal({...newGoal, monthlyContribution: e.target.value})}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              />
              <select
                value={newGoal.priority}
                onChange={(e) => setNewGoal({...newGoal, priority: e.target.value})}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <input
                type="text"
                placeholder="Category"
                value={newGoal.category}
                onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleAddGoal}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Add Goal
                </button>
                <button
                  onClick={() => setShowAddGoal(false)}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialGoals;
