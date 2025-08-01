import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import {
  DashboardPage,
  BudgetPage,
  GamePage,
  TradingPage,
  GoalsPage,
  AIAdvisorPage,
  ProfilePage,
  AuthPage
} from './pages';
import StorePage from './pages/StorePage';

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showPersonalInfoForm, setShowPersonalInfoForm] = useState(false);
  const [newSignupUser, setNewSignupUser] = useState(null);

  // Utility function to ensure numeric values
  const cleanUserObject = (userObj) => {
    if (!userObj) return null;
    return {
      ...userObj,
      xp: parseInt(userObj.xp) || 0,
      coins: parseInt(userObj.coins) || 0,
      level: parseInt(userObj.level) || 1,
      totalSaved: parseInt(userObj.totalSaved) || 0,
    };
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('financequest_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(cleanUserObject(parsedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      const cleanedUser = cleanUserObject(user);
      localStorage.setItem('financequest_user', JSON.stringify(cleanedUser));
    }
  }, [user]);

  const handleLogin = (email, password, name, isNewSignup = false) => {
    // Generate unique ID based on email
    const userId = btoa(email).replace(/[^a-zA-Z0-9]/g, '').slice(0, 16);
    
    const newUser = {
      id: userId,
      name: name || 'Demo User',
      email,
      level: 1,
      xp: 500,
      coins: 500,
      totalSaved: 0,
      joinDate: new Date().toISOString().split('T')[0],
      streak: 0,
    };
    
    if (isNewSignup) {
      toast.success('🎉 Welcome to Spendr! Account created successfully!', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#10B981',
          color: 'white',
          fontWeight: 'bold',
        },
      });
      setNewSignupUser(newUser);
      setShowPersonalInfoForm(true);
    } else {
      toast.success(`👋 Welcome , ${name || 'User'}!`, {
        duration: 3000,
        position: 'top-center',
        style: {
          background: '#3B82F6',
          color: 'white',
          fontWeight: 'bold',
        },
      });
      setUser(newUser);
      navigate('/dashboard');
    }
  };

  const handlePersonalInfoComplete = (personalInfo) => {
    if (newSignupUser) {
      setUser(newSignupUser);
      setNewSignupUser(null);
    }
    setShowPersonalInfoForm(false);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('financequest_user');
    navigate('/auth');
  };

  const handleCompleteScenario = (scenario, choice) => {
    if (user && scenario && choice) {
      // Calculate XP and coins based on scenario and choice quality
      let xpReward = parseInt(choice.impact?.xp) || parseInt(scenario.xpReward) || 100;
      let coinReward = parseInt(scenario.coinReward) || 50;
      
      // Bonus for good choices (low risk choices get bonus)
      if (choice.impact?.risk === 'low') {
        coinReward = Math.floor(coinReward * 1.5); // 50% bonus coins for good choices
      } else if (choice.impact?.risk === 'high') {
        coinReward = Math.floor(coinReward * 0.7); // Reduced coins for risky choices
      }
      
      const currentXP = parseInt(user.xp) || 0;
      const currentCoins = parseInt(user.coins) || 0;
      
      const newXP = currentXP + xpReward;
      const newLevel = Math.floor(newXP / 1000) + 1;
      const newCoins = currentCoins + coinReward;
      
      setUser({
        ...user,
        xp: newXP,
        level: newLevel,
        coins: newCoins,
      });
    }
  };

  const handleEarnCoins = (amount) => {
    if (user) {
      setUser({
        ...user,
        coins: user.coins + amount,
      });
    }
  };

  const handlePurchase = (item, price) => {
    if (user && user.coins >= price) {
      const newCoins = user.coins - price;
      setUser({
        ...user,
        coins: newCoins,
      });
      
      // You could add a purchased items array here if needed
      alert(`Successfully purchased ${item.name}! You now have ${newCoins} coins remaining.`);
    }
  };

  // Show personal info form for new signups
  if (showPersonalInfoForm) {
    return (
      <ProfilePage
        user={newSignupUser}
        onComplete={handlePersonalInfoComplete}
      />
    );
  }

  // Show auth page if no user
  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster />
      <Navbar user={user} onLogout={handleLogout} />
      
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route 
            path="/dashboard" 
            element={<DashboardPage user={user} />} 
          />
          <Route 
            path="/game" 
            element={<GamePage onCompleteScenario={handleCompleteScenario} user={user} />} 
          />
          <Route 
            path="/trading" 
            element={<TradingPage onEarnCoins={handleEarnCoins} />} 
          />
          <Route 
            path="/budget" 
            element={<BudgetPage onNavigateToProfile={() => navigate('/profile')} />} 
          />
          <Route 
            path="/goals" 
            element={<GoalsPage />} 
          />
          <Route 
            path="/ai-advisor" 
            element={<AIAdvisorPage />} 
          />
          <Route 
            path="/store" 
            element={<StorePage user={user} onPurchase={handlePurchase} />} 
          />
          <Route 
            path="/profile" 
            element={
              <ProfilePage
                user={user}
                onComplete={() => navigate('/dashboard')}
              />
            } 
          />
          <Route path="/auth" element={<AuthPage onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
