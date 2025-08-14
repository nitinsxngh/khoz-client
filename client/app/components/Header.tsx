'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';
import UserProfile from './UserProfile';

interface HeaderProps {
  currentStep: number;
  isDarkTheme: boolean;
  onToggleTheme: () => void;
  domain: string;
  onDomainChange: (domain: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentStep, isDarkTheme, onToggleTheme, domain, onDomainChange }) => {
  const { isAuthenticated } = useAuth();

  const getStepStatus = (): string => {
    switch (currentStep) {
      case 1:
        return 'AI Email Discovery';
      case 2:
        return 'AI Discovery Processing...';
      case 3:
                  return 'Exploring Email Addresses...';
      case 4:
        return 'Results Ready';
      case 5:
        return 'Verifying Emails...';
      default:
        return 'AI Email Discovery';
    }
  };

  const extractDomain = (input: string): string => {
    // Remove leading/trailing whitespace
    let cleaned = input.trim();
    
    // Handle various URL formats
    if (cleaned.includes('://')) {
      // Extract domain from URLs like https://www.example.com or http://example.com
      try {
        const url = new URL(cleaned.startsWith('http') ? cleaned : `https://${cleaned}`);
        return url.hostname.replace(/^www\./, '');
      } catch {
        // If URL parsing fails, try to extract manually
        const match = cleaned.match(/(?:https?:\/\/)?(?:www\.)?([^\/\s]+)/);
        return match ? match[1].replace(/^www\./, '') : cleaned.replace(/^www\./, '');
      }
    } else if (cleaned.includes('/')) {
      // Handle cases like www.example.com/path
      const domainPart = cleaned.split('/')[0];
      return domainPart.replace(/^www\./, '');
    } else {
      // Direct domain input - just remove www. if present
      return cleaned.replace(/^www\./, '');
    }
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const extractedDomain = extractDomain(value);
    onDomainChange(extractedDomain);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isDarkTheme 
        ? 'border-gray-800/50 bg-black/80 backdrop-blur-xl' 
        : 'border-gray-200/50 bg-white/80 backdrop-blur-xl'
    } border-b p-4`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg ${
              isDarkTheme 
                ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white' 
                : 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
            }`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h1 className={`text-2xl font-bold ${
              isDarkTheme ? 'text-white' : 'text-gray-900'
            }`}>
              KHOZ
            </h1>
            
          </div>
          
          {/* Domain Input */}
          <div className="flex items-center space-x-3">
            <svg className={`w-4 h-4 ${
              isDarkTheme ? 'text-gray-300' : 'text-gray-700'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <input
              type="text"
              value={domain}
              onChange={handleDomainChange}
              className={`w-48 border rounded-xl px-3 py-2 text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                isDarkTheme 
                  ? 'bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:ring-orange-500 focus:border-orange-500/50' 
                  : 'bg-gray-50/50 border-gray-300/50 text-gray-900 placeholder-gray-500 focus:ring-blue-600 focus:border-blue-600/50'
              } backdrop-blur-sm`}
              placeholder="Enter domain or URL (e.g., example.com, https://www.example.com)"
              maxLength={253}
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          <span className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-300 ${
            isDarkTheme 
              ? 'text-gray-300 bg-gray-800/50 border border-gray-700/50' 
              : 'text-gray-600 bg-gray-100/50 border border-gray-200/50'
          } backdrop-blur-sm`}>
            {getStepStatus()}
          </span>
          
          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg ${
              isDarkTheme 
                ? 'bg-gray-800/50 hover:bg-gray-700/50 text-white border border-gray-700/50' 
                : 'bg-gray-100/50 hover:bg-gray-200/50 text-gray-600 border border-gray-200/50'
            } backdrop-blur-sm`}
            title={isDarkTheme ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkTheme ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          
          {/* Authentication Section */}
          {isAuthenticated ? (
            <UserProfile />
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                href="/auth/login"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isDarkTheme
                    ? 'text-gray-300 hover:text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Sign in
              </Link>
              <Link
                href="/auth/register"
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 shadow-lg ${
                  isDarkTheme
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700'
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800'
                }`}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 