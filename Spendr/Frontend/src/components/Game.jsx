import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Star, 
  IndianRupee, 
  Lock, 
  CheckCircle, 
  Clock,
  Trophy,
  Target,
  AlertCircle,
  Award,
  Users,
  TrendingUp,
  Flame
} from 'lucide-react';

const Game = ({ onCompleteScenario, user }) => {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [currentChoice, setCurrentChoice] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [userAge, setUserAge] = useState(null);
  const [completedScenarios, setCompletedScenarios] = useState(new Set());
  const [leaderboard, setLeaderboard] = useState([
    { id: 1, name: "Alex Chen", score: 2450, age: 16, streak: 12 },
    { id: 2, name: "Maria Garcia", score: 2380, age: 14, streak: 8 },
    { id: 3, name: "Sam Johnson", score: 2290, age: 12, streak: 15 },
    { id: 4, name: "Emily Davis", score: 2150, age: 15, streak: 5 },
    { id: 5, name: "You", score: user?.xp || 0, age: userAge || 16, streak: user?.streak || 0 }
  ]);

  // Get user age from personal info
  useEffect(() => {
    const fetchUserAge = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found, using default age');
          setUserAge(16);
          return;
        }

        const response = await fetch('http://localhost:3001/api/personal-info', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data && result.data.dateOfBirth) {
            const birthDate = new Date(result.data.dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }
            console.log('Fetched user age:', age);
            setUserAge(age);
          } else {
            console.log('No personal info found, using default age');
            setUserAge(16);
          }
        } else {
          console.log('Failed to fetch personal info, using default age');
          setUserAge(16);
        }
      } catch (error) {
        console.log('Error fetching user age:', error);
        setUserAge(16); // Default age
      }
    };
    
    // Add a small delay to prevent immediate loading state
    const timer = setTimeout(fetchUserAge, 100);
    return () => clearTimeout(timer);
  }, []);

  // Update leaderboard when userAge changes
  useEffect(() => {
    setLeaderboard([
      { id: 1, name: "Alex Chen", score: 2450, age: 16, streak: 12 },
      { id: 2, name: "Maria Garcia", score: 2380, age: 14, streak: 8 },
      { id: 3, name: "Sam Johnson", score: 2290, age: 12, streak: 15 },
      { id: 4, name: "Emily Davis", score: 2150, age: 15, streak: 5 },
      { id: 5, name: "You", score: user?.xp || 0, age: userAge || 16, streak: user?.streak || 0 }
    ]);
  }, [userAge, user]);

  // Load completed scenarios from localStorage (user-specific)
  useEffect(() => {
    if (user?.id || user?._id) {
      const userId = user.id || user._id;
      const savedCompleted = localStorage.getItem(`completed_scenarios_${userId}`);
      if (savedCompleted) {
        setCompletedScenarios(new Set(JSON.parse(savedCompleted)));
      } else {
        // Reset for new user
        setCompletedScenarios(new Set());
      }
    }
  }, [user]);

  // Save completed scenarios to localStorage (user-specific)
  useEffect(() => {
    if (user?.id || user?._id) {
      const userId = user.id || user._id;
      if (completedScenarios.size > 0) {
        localStorage.setItem(`completed_scenarios_${userId}`, JSON.stringify([...completedScenarios]));
      }
    }
  }, [completedScenarios, user]);

  // Age-based scenario system
  const getAgeGroup = (age) => {
    if (age <= 10) return 'kids';
    if (age <= 15) return 'teens';
    if (age <= 20) return 'youngAdults';
    return 'adults';
  };

  const ageBasedScenarios = {
    kids: [
      {
        id: 'k1',
        title: '🎪 Carnival Money',
        description: 'You have ₹10 to spend at the school carnival. There are games, snacks, and prizes. How will you spend your money?',
        difficulty: 'easy',
        xpReward: 50,
        coinReward: 25,
        category: 'Spending Choices',
        choices: [
          {
            id: 'k1a',
            text: 'Spend all ₹10 on candy and snacks',
            consequence: 'You had yummy treats but no money left for games or prizes. Next time, try to save some for other fun activities!',
            impact: { money: -10, xp: 25, risk: 'medium' }
          },
          {
            id: 'k1b',
            text: 'Spend ₹5 on games, ₹3 on snacks, save ₹2',
            consequence: 'Great planning! You had fun, enjoyed snacks, and still have money left. You are learning to balance spending and saving!',
            impact: { money: 2, xp: 50, risk: 'low' }
          },
          {
            id: 'k1c',
            text: 'Save all ₹10 for later',
            consequence: 'You saved your money, which is good! But sometimes it is okay to spend a little on fun experiences with friends.',
            impact: { money: 10, xp: 35, risk: 'low' }
          }
        ]
      },
      {
        id: 'k2',
        title: '🎮 Video Game Choice',
        description: 'You saved ₹20 from your allowance. There is a new video game for ₹15, but your friend needs to borrow ₹5. What do you do?',
        difficulty: 'easy',
        xpReward: 60,
        coinReward: 30,
        category: 'Sharing & Priorities',
        choices: [
          {
            id: 'k2a',
            text: 'Buy the game and do not lend money',
            consequence: 'You got the game but your friend felt sad. Remember, helping friends can be more valuable than things.',
            impact: { money: 5, xp: 30, risk: 'medium' }
          },
          {
            id: 'k2b',
            text: 'Lend ₹5 to friend and wait to buy the game',
            consequence: 'You are a great friend! Your friend was really grateful, and you can still buy the game next week.',
            impact: { money: 15, xp: 60, risk: 'low' }
          },
          {
            id: 'k2c',
            text: 'Buy the game and lend the remaining ₹5',
            consequence: 'You helped your friend and got what you wanted! Just make sure your friend pays you back.',
            impact: { money: 0, xp: 50, risk: 'medium' }
          }
        ]
      }
    ],
    teens: [
      {
        id: 't1',
        title: '📱 Phone Upgrade Dilemma',
        description: 'Your phone still works fine, but all your friends have the latest model that costs ₹800. You have ₹500 saved from your part-time job.',
        difficulty: 'medium',
        xpReward: 100,
        coinReward: 50,
        category: 'Peer Pressure & Wants vs Needs',
        choices: [
          {
            id: 't1a',
            text: 'Use all savings + ask parents for the rest',
            consequence: 'You got the phone but depleted your savings and created family tension. Your old phone worked fine - this was expensive peer pressure.',
            impact: { money: -800, xp: 40, risk: 'high' }
          },
          {
            id: 't1b',
            text: 'Keep current phone and save money for college',
            consequence: 'Excellent decision! You resisted peer pressure and prioritized your future. Your friends will understand, and you will thank yourself later.',
            impact: { money: 500, xp: 100, risk: 'low' }
          },
          {
            id: 't1c',
            text: 'Wait 6 months for price drop and save more',
            consequence: 'Smart strategy! Phone prices drop quickly, and you will have more money saved. Patience in purchases often pays off.',
            impact: { money: 300, xp: 85, risk: 'low' }
          }
        ]
      },
      {
        id: 't2',
        title: '🎓 Prom Expenses',
        description: 'Prom is coming up! Total costs (dress/tux, ticket, dinner, limo) would be ₹400. You have ₹250 saved and work part-time.',
        difficulty: 'medium',
        xpReward: 120,
        coinReward: 60,
        category: 'Event Planning & Budgeting',
        choices: [
          {
            id: 't2a',
            text: 'Put the extra ₹150 on a credit card',
            consequence: 'You went to prom but started your adult life with debt. High-interest debt for one night was not worth it.',
            impact: { money: -400, xp: 50, risk: 'high' }
          },
          {
            id: 't2b',
            text: 'Find creative ways to reduce costs',
            consequence: 'Brilliant! You rented a tux, shared a limo, and had a potluck dinner. You enjoyed prom without breaking your budget.',
            impact: { money: 50, xp: 120, risk: 'low' }
          },
          {
            id: 't2c',
            text: 'Skip prom and save the money',
            consequence: 'You saved money but missed a memorable experience. Sometimes spending on meaningful experiences is worth it.',
            impact: { money: 250, xp: 70, risk: 'low' }
          }
        ]
      }
    ],
    youngAdults: [
      {
        id: 'ya1',
        title: '🏠 First Apartment Decision',
        description: 'You are moving out! You found a nice apartment for ₹1,200/month (60% of income) and a basic one for ₹800/month (40% of income). Your income is ₹2,000/month.',
        difficulty: 'hard',
        xpReward: 200,
        coinReward: 100,
        category: 'Housing & Income Ratios',
        choices: [
          {
            id: 'ya1a',
            text: 'Choose the expensive apartment - YOLO!',
            consequence: 'You love your place but have no money for emergencies, food, or fun. You are living paycheck to paycheck and stressed.',
            impact: { money: -1200, xp: 75, risk: 'high' }
          },
          {
            id: 'ya1b',
            text: 'Choose the basic apartment and save the difference',
            consequence: 'Excellent choice! You have ₹400 extra monthly for savings, emergencies, and enjoying life. Smart financial foundation!',
            impact: { money: 400, xp: 200, risk: 'low' }
          },
          {
            id: 'ya1c',
            text: 'Live with roommates to split costs',
            consequence: 'Great compromise! You get a nicer place for less money and learn valuable life skills. Shared living can be fun!',
            impact: { money: 600, xp: 175, risk: 'low' }
          }
        ]
      },
      {
        id: 'ya2',
        title: '💼 Job Offer Comparison',
        description: 'You have two job offers: Company A: ₹50k salary + great benefits. Company B: ₹60k salary + poor benefits. Which do you choose?',
        difficulty: 'hard',
        xpReward: 250,
        coinReward: 125,
        category: 'Career & Total Compensation',
        choices: [
          {
            id: 'ya2a',
            text: 'Take Company B for higher salary',
            consequence: 'The higher salary was nice, but poor health insurance cost you ₹8,000 when you got sick. Total compensation matters more than salary.',
            impact: { money: 2000, xp: 100, risk: 'high' }
          },
          {
            id: 'ya2b',
            text: 'Take Company A for better benefits',
            consequence: 'Wise choice! Great health insurance, retirement matching, and paid time off made your total compensation higher. You chose well!',
            impact: { money: 5000, xp: 250, risk: 'low' }
          },
          {
            id: 'ya2c',
            text: 'Negotiate with both companies',
            consequence: 'Excellent strategy! You got Company A to match the salary while keeping great benefits. Negotiation skills pay off!',
            impact: { money: 10000, xp: 300, risk: 'low' }
          }
        ]
      }
    ]
  };

  // Get appropriate scenarios based on user age
  const getAvailableScenarios = () => {
    if (!userAge) return [];
    const ageGroup = getAgeGroup(userAge);
    return ageBasedScenarios[ageGroup] || [];
  };

  const handleScenarioSelect = (scenario) => {
    setSelectedScenario(scenario);
    setCurrentChoice(null);
    setShowResult(false);
  };

  const handleChoiceSelect = (choice) => {
    setCurrentChoice(choice);
    setShowResult(true);
    
    // Mark scenario as completed
    if (selectedScenario) {
      setCompletedScenarios(prev => new Set([...prev, selectedScenario.id]));
    }
    
    if (onCompleteScenario) {
      onCompleteScenario(selectedScenario, choice);
    }
  };

  const resetScenario = () => {
    setSelectedScenario(null);
    setCurrentChoice(null);
    setShowResult(false);
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400 border border-green-400/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30';
      case 'hard': return 'bg-red-500/20 text-red-400 border border-red-400/30';
      default: return 'bg-gray-500/20 text-gray-400 border border-gray-400/30';
    }
  };

  const getAgeGroupName = (age) => {
    const group = getAgeGroup(age);
    switch (group) {
      case 'kids': return 'Kids (5-10)';
      case 'teens': return 'Teens (11-15)';
      case 'youngAdults': return 'Young Adults (16-20)';
      case 'adults': return 'Adults (21+)';
      default: return 'General';
    }
  };

  if (!userAge) {
    return (
      <div className="min-h-screen bg-black p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <Clock className="w-16 h-16 mx-auto text-indigo-400 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Loading Your Game...</h2>
            <p className="text-gray-400">We're setting up age-appropriate scenarios for you!</p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedScenario) {
    return (
      <div className="min-h-screen bg-black p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={resetScenario}
                className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
              >
                ← Back to Scenarios
              </button>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(selectedScenario.difficulty)}`}>
                {selectedScenario.difficulty.charAt(0).toUpperCase() + selectedScenario.difficulty.slice(1)}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-2">{selectedScenario.title}</h2>
            <p className="text-gray-300 mb-6">{selectedScenario.description}</p>

            <div className="flex items-center gap-4 mb-6 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                <span>{selectedScenario.xpReward} XP</span>
              </div>
              <div className="flex items-center gap-1">
                <IndianRupee className="w-4 h-4" />
                <span>{selectedScenario.coinReward} Coins</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                <span>{selectedScenario.category}</span>
              </div>
            </div>

            {!showResult ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">What would you do?</h3>
                {selectedScenario.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoiceSelect(choice)}
                    className="w-full text-left p-4 border border-gray-700 bg-black rounded-lg hover:bg-gray-900 hover:border-indigo-500 transition-colors"
                  >
                    <span className="font-medium text-white">{choice.text}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Result</h3>
                  <div className="bg-gray-800 rounded-lg p-4 mb-4">
                    <p className="text-gray-200">{currentChoice.consequence}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-black border border-gray-700 rounded-lg">
                      <IndianRupee className="w-6 h-6 mx-auto mb-2 text-green-400" />
                      <div className="text-lg font-bold text-white">
                        {currentChoice.impact.money > 0 ? '+' : ''}₹{currentChoice.impact.money}
                      </div>
                      <div className="text-sm text-gray-400">Money Impact</div>
                    </div>
                    <div className="text-center p-4 bg-black border border-gray-700 rounded-lg">
                      <Star className="w-6 h-6 mx-auto mb-2 text-indigo-400" />
                      <div className="text-lg font-bold text-white">+{currentChoice.impact.xp}</div>
                      <div className="text-sm text-gray-400">XP Earned</div>
                    </div>
                    <div className="text-center p-4 bg-black border border-gray-700 rounded-lg">
                      <AlertCircle className={`w-6 h-6 mx-auto mb-2 ${getRiskColor(currentChoice.impact.risk)}`} />
                      <div className={`text-lg font-bold ${getRiskColor(currentChoice.impact.risk)}`}>
                        {currentChoice.impact.risk.charAt(0).toUpperCase() + currentChoice.impact.risk.slice(1)}
                      </div>
                      <div className="text-sm text-gray-400">Risk Level</div>
                    </div>
                  </div>

                  <button
                    onClick={resetScenario}
                    className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    Try Another Scenario
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Financial Adventure Game
          </h1>
          <p className="text-gray-400 text-lg">
            Learn smart money habits through real-life scenarios designed for your age group
          </p>
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-bold text-white">Leaderboard</h2>
          </div>
          <div className="space-y-2">
            {leaderboard
              .sort((a, b) => b.score - a.score)
              .slice(0, 5)
              .map((player, index) => (
                <div 
                  key={player.id} 
                  className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                    player.name === 'You' ? 'bg-indigo-900/50 border border-indigo-500/50' : 'bg-black border border-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30' :
                      index === 1 ? 'bg-gray-500/20 text-gray-300 border border-gray-400/30' :
                      index === 2 ? 'bg-orange-500/20 text-orange-400 border border-orange-400/30' :
                      'bg-gray-600/20 text-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-white">{player.name}</div>
                      <div className="text-sm text-gray-400">Age {player.age}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Flame className="w-4 h-4 text-orange-400" />
                      <span className="text-sm font-medium text-orange-400">{player.streak}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="font-bold text-white">{player.score}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {getAvailableScenarios().map((scenario) => {
            const isCompleted = completedScenarios.has(scenario.id);
            return (
              <div 
                key={scenario.id} 
                className={`rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-gray-800/50 border border-gray-700 opacity-75' 
                    : 'bg-gray-900 border border-gray-800 hover:shadow-xl hover:border-gray-700'
                }`}
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium ${getDifficultyColor(scenario.difficulty)}`}>
                        {scenario.difficulty.charAt(0).toUpperCase() + scenario.difficulty.slice(1)}
                      </span>
                      {isCompleted && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Star className="w-4 h-4" />
                      <span>{scenario.xpReward}</span>
                    </div>
                  </div>

                  <h3 className={`text-xl font-bold mb-4 ${isCompleted ? 'text-gray-400' : 'text-white'}`}>
                    {scenario.title}
                  </h3>
                  <p className="text-gray-400 mb-6 line-clamp-3 leading-relaxed">{scenario.description}</p>

                  <div className="space-y-4">
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-4 h-4" />
                        <span>{scenario.coinReward}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        <span className="truncate">{scenario.category}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => !isCompleted && handleScenarioSelect(scenario)}
                      disabled={isCompleted}
                      className={`w-full px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg font-medium ${
                        isCompleted
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Completed
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Play
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {getAvailableScenarios().length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl p-8">
              <AlertCircle className="w-16 h-16 mx-auto text-gray-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No scenarios available</h3>
              <p className="text-gray-400">
                Complete your personal information to get age-appropriate financial scenarios!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;
