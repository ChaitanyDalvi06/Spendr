import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Target, 
  Wallet, 
  Trophy, 
  Star, 
  DollarSign,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react';

const Dashboard = ({ user }) => {
  const navigate = useNavigate();

  // Quick Actions handlers
  const handleStartTrading = () => {
    navigate('/trading');
  };

  const handleCheckBudget = () => {
    navigate('/budget');
  };

  const handleSetGoals = () => {
    navigate('/budget');
    // Scroll to bottom after navigation to show the Financial Goals section
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  const handlePlayGame = () => {
    navigate('/game');
  };

  // Handle case where user is null or undefined
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Dashboard...</h2>
            <p className="text-gray-600">Please wait while we load your information.</p>
          </div>
        </div>
      </div>
    );
  }

  // Ensure numeric values for stats with new user defaults
  const xpValue = typeof user.xp === 'number' ? user.xp : 500;
  const coinsValue = typeof user.coins === 'number' ? user.coins : 500;
  const savedValue = typeof user.monthlySavings === 'number' ? user.monthlySavings : (typeof user.totalSaved === 'number' ? user.totalSaved : 0);
  const levelValue = typeof user.level === 'number' ? user.level : 1;

  const stats = [
    {
      title: 'Level',
      value: levelValue,
      icon: Star,
      color: 'from-purple-500 to-purple-600',
      change: 'Starting level'
    },
    {
      title: 'Total XP',
      value: xpValue.toLocaleString(),
      icon: Trophy,
      color: 'from-yellow-500 to-yellow-600',
      change: '+500 joining XP'
    },
    {
      title: 'Coins Earned',
      value: coinsValue.toLocaleString(),
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      change: '+500 joining coins'
    },
    {
      title: 'Total Saved',
      value: `₹${savedValue.toLocaleString()}`,
      icon: Wallet,
      color: 'from-blue-500 to-blue-600',
      change: 'Monthly savings'
    }
  ];

  const recentActivities = [
    { action: 'Completed "First Job Paycheck" scenario', xp: 100, time: '2 hours ago' },
    { action: 'Reached savings goal for new laptop', xp: 250, time: '1 day ago' },
    { action: 'Made profitable paper trade (+₹50)', xp: 75, time: '2 days ago' },
    { action: 'Unlocked "Budget Master" achievement', xp: 200, time: '3 days ago' },
  ];

  const learningProgress = [
    { skill: 'Budget Management', progress: 85, color: 'from-green-400 to-green-600' },
    { skill: 'Investment Basics', progress: 60, color: 'from-blue-400 to-blue-600' },
    { skill: 'Savings Strategies', progress: 75, color: 'from-purple-400 to-purple-600' },
    { skill: 'Risk Assessment', progress: 40, color: 'from-orange-400 to-orange-600' },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Welcome Section */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Welcome   {user.name}! 👋
        </h1>
        <p className="text-sm sm:text-base text-gray-400">
          Ready to continue your financial journey?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl sm:rounded-2xl p-3 sm:p-6">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h3 className="text-xs sm:text-sm text-gray-300 font-medium truncate">{stat.title}</h3>
              <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
            </div>
            <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-xs sm:text-sm text-green-400 truncate">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-white">Recent Activity</h3>
            <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
          </div>
          
          <div className="space-y-3 sm:space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-800/50 rounded-lg sm:rounded-xl">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base text-white font-medium leading-tight">{activity.action}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-1 sm:mt-2">
                    <span className="text-xs sm:text-sm text-gray-400">{activity.time}</span>
                    <span className="text-xs sm:text-sm text-green-400 font-medium mt-1 sm:mt-0">+{activity.xp} XP</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Progress */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-white">Learning Progress</h3>
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
          </div>

          <div className="space-y-4 sm:space-y-6">
            {learningProgress.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm sm:text-base text-white font-medium truncate pr-2">{item.skill}</span>
                  <span className="text-xs sm:text-sm text-gray-400 flex-shrink-0">{item.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`bg-gradient-to-r ${item.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-sm border border-purple-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <button 
            onClick={handleStartTrading}
            className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg sm:rounded-xl transition-colors cursor-pointer"
          >
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            <span className="text-xs sm:text-sm text-white font-medium text-center">Start Trading</span>
          </button>
          <button 
            onClick={handleCheckBudget}
            className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-green-600/20 hover:bg-green-600/30 rounded-lg sm:rounded-xl transition-colors cursor-pointer"
          >
            <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            <span className="text-xs sm:text-sm text-white font-medium text-center">Check Budget</span>
          </button>
          <button 
            onClick={handleSetGoals}
            className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg sm:rounded-xl transition-colors cursor-pointer"
          >
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            <span className="text-xs sm:text-sm text-white font-medium text-center">Set Goals</span>
          </button>
          <button 
            onClick={handlePlayGame}
            className="flex flex-col items-center space-y-2 p-3 sm:p-4 bg-yellow-600/20 hover:bg-yellow-600/30 rounded-lg sm:rounded-xl transition-colors cursor-pointer"
          >
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
            <span className="text-xs sm:text-sm text-white font-medium text-center">Play Game</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
