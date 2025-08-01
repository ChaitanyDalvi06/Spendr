import React from 'react';
import { Target, ArrowRight } from 'lucide-react';

const GoalsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-purple-900 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 text-center">
          <Target className="w-16 h-16 text-purple-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-4">Financial Goals</h1>
          <p className="text-gray-400 text-lg mb-8">
            Your financial goals have been integrated into the Budget page for a better overview of your finances.
          </p>
          <div className="flex items-center justify-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors cursor-pointer">
            <span className="text-lg font-medium">Go to Budget Page</span>
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsPage;
