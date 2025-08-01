import React from 'react';
import BudgetTracker from '../components/BudgetTracker';

const BudgetPage = ({ onNavigateToProfile }) => {
  return <BudgetTracker onNavigateToProfile={onNavigateToProfile} />;
};

export default BudgetPage;
