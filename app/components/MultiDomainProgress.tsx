'use client';

import React from 'react';
import type { MultiDomainProgress, DomainProcessingResult } from '../types';

interface MultiDomainProgressProps {
  progress: MultiDomainProgress;
  isDarkTheme: boolean;
}

const MultiDomainProgress: React.FC<MultiDomainProgressProps> = ({ progress, isDarkTheme }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return isDarkTheme ? 'text-green-400' : 'text-green-600';
      case 'processing':
        return isDarkTheme ? 'text-blue-400' : 'text-blue-600';
      case 'error':
        return isDarkTheme ? 'text-red-400' : 'text-red-600';
      default:
        return isDarkTheme ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'processing':
        return (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        );
      case 'error':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className={`border rounded-xl p-6 transition-all duration-300 ${
      isDarkTheme 
        ? 'bg-gray-900 border-gray-800' 
        : 'bg-white border-gray-200 shadow-lg'
    }`}>
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          isDarkTheme 
            ? 'bg-gradient-to-br from-orange-500 to-orange-600' 
            : 'bg-gradient-to-br from-blue-600 to-blue-700'
        }`}>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <div>
          <h2 className={`text-lg font-semibold ${
            isDarkTheme ? 'text-white' : 'text-gray-900'
          }`}>Multi-Domain Processing</h2>
          <p className={`text-xs ${
            isDarkTheme ? 'text-gray-400' : 'text-gray-500'
          }`}>Processing {progress.totalDomains} domains sequentially</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-medium ${
            isDarkTheme ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Progress: {progress.processedDomains} / {progress.totalDomains} domains
          </span>
          <span className={`text-sm ${
            isDarkTheme ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {Math.round((progress.processedDomains / progress.totalDomains) * 100)}%
          </span>
        </div>
        <div className={`w-full bg-gray-200 rounded-full h-2 ${
          isDarkTheme ? 'bg-gray-700' : 'bg-gray-200'
        }`}>
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${
              isDarkTheme 
                ? 'bg-gradient-to-r from-orange-500 to-orange-600' 
                : 'bg-gradient-to-r from-blue-600 to-blue-700'
            }`}
            style={{ width: `${(progress.processedDomains / progress.totalDomains) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Current Domain Status */}
      {progress.isProcessing && progress.currentDomain && (
        <div className={`mb-6 p-4 rounded-lg border ${
          isDarkTheme 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
            <div>
              <p className={`text-sm font-medium ${
                isDarkTheme ? 'text-blue-400' : 'text-blue-700'
              }`}>
                Currently processing: {progress.currentDomain}
              </p>
              <p className={`text-xs ${
                isDarkTheme ? 'text-blue-300' : 'text-blue-600'
              }`}>
                Domain {progress.currentDomainIndex + 1} of {progress.totalDomains}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Domain Results */}
      <div className="space-y-3">
        <h3 className={`text-sm font-medium ${
          isDarkTheme ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Domain Results
        </h3>
        {progress.results.map((result, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border transition-all duration-300 ${
              isDarkTheme 
                ? 'bg-gray-800/50 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className={`flex items-center space-x-2 ${getStatusColor(result.status)}`}>
                  {getStatusIcon(result.status)}
                  <span className="text-sm font-medium">{result.domain}</span>
                </div>
                
                {result.status === 'completed' && result.emails && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isDarkTheme 
                      ? 'bg-green-900/20 text-green-400' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {result.emails.length} emails
                  </span>
                )}
                
                {result.status === 'error' && result.error && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    isDarkTheme 
                      ? 'bg-red-900/20 text-red-400' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {result.error}
                  </span>
                )}
              </div>
              
              <div className={`text-xs ${
                isDarkTheme ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {new Date(result.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      {!progress.isProcessing && progress.processedDomains > 0 && (
        <div className={`mt-6 p-4 rounded-lg border ${
          isDarkTheme 
            ? 'bg-gray-800/50 border-gray-700' 
            : 'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className={`text-sm font-medium ${
                isDarkTheme ? 'text-green-400' : 'text-green-700'
              }`}>
                Processing Complete!
              </p>
              <p className={`text-xs ${
                isDarkTheme ? 'text-green-300' : 'text-green-600'
              }`}>
                Successfully processed {progress.processedDomains} domains
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiDomainProgress;
