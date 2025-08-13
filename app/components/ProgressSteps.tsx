'use client';

import React from 'react';

interface ProgressStepsProps {
  currentStep: number;
  isDarkTheme: boolean;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep, isDarkTheme }) => {
  return (
    <div className="px-6 mb-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          {[
            { step: 1, title: 'INPUT DATA' },
            { step: 2, title: 'AI PROCESSING' },
            { step: 3, title: 'GENERATE EMAILS' },
            { step: 4, title: 'RESULTS' },
            { step: 5, title: 'VERIFY EMAILS' }
          ].map((item, index) => {
            let status = 'pending';
            if (currentStep > item.step) {
              status = 'completed';
            } else if (currentStep === item.step) {
              status = 'active';
            }
            
            return (
              <div key={item.step} className="flex items-center">
                <div className={`flex items-center space-x-3 ${index > 0 ? 'ml-8' : ''}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                    status === 'active'
                      ? isDarkTheme 
                        ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white' 
                        : 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                      : status === 'completed'
                      ? isDarkTheme 
                        ? 'bg-gray-600 text-white' 
                        : 'bg-gray-400 text-white'
                      : isDarkTheme 
                        ? 'bg-gray-800 text-gray-400' 
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {status === 'completed' ? '✓' : item.step}
                  </div>
                  <span className={`text-xs font-medium transition-all duration-300 ${
                    status === 'active' 
                      ? isDarkTheme ? 'text-white' : 'text-gray-900'
                      : status === 'completed' 
                      ? isDarkTheme ? 'text-gray-400' : 'text-gray-500'
                      : isDarkTheme ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {item.title}
                  </span>
                </div>
                {index < 4 && (
                  <div className={`w-16 h-px ml-4 transition-all duration-300 ${
                    status === 'completed'
                      ? isDarkTheme ? 'bg-gray-600' : 'bg-gray-400'
                      : isDarkTheme ? 'bg-gray-800' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressSteps; 