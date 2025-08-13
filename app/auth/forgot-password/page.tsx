"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(false); // Default to light theme
  const { forgotPassword, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    
    const success = await forgotPassword(email);
    
    if (success) {
      setIsSubmitted(true);
    } else {
      setError('Failed to send reset email. Please try again.');
    }
  };

  const handleResendEmail = () => {
    setIsSubmitted(false);
    setEmail('');
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  if (isSubmitted) {
    return (
      <div className={`h-screen transition-all duration-300 ${
        isDarkTheme 
          ? 'bg-black text-white' 
          : 'bg-gray-50 text-gray-900'
      } flex items-center justify-center p-4`}>
        {/* Background Pattern - Subtle grid like Anthropic */}
        <div className={`absolute inset-0 ${
          isDarkTheme 
            ? 'bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]' 
            : 'bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)]'
        } bg-[size:50px_50px]`}></div>
        
        {/* Subtle gradient overlay */}
        <div className={`absolute inset-0 ${
          isDarkTheme 
            ? 'bg-gradient-to-br from-orange-500/5 via-transparent to-blue-500/5' 
            : 'bg-gradient-to-br from-orange-500/10 via-transparent to-blue-500/10'
        }`}></div>

        {/* Success Content */}
        <div className="relative z-10 w-full max-w-sm text-center">
          <div className={`${
            isDarkTheme 
              ? 'bg-gray-900/50 backdrop-blur-sm border-gray-800' 
              : 'bg-white border-gray-200'
          } border rounded-xl p-6 shadow-xl`}>
            {/* Success Icon */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-500/20 mb-4">
              <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-xl font-bold text-gray-900 mb-3">Check your email</h1>
            <p className="text-sm text-gray-600 mb-4">
              We've sent a password reset link to <span className="font-medium text-gray-900">{email}</span>
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleResendEmail}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2.5 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Resend email
              </button>
              
              <Link
                href="/auth/login"
                className="block w-full text-center text-orange-500 hover:text-orange-600 font-medium transition-colors py-2"
              >
                Back to sign in
              </Link>
            </div>
            
            <div className={`mt-4 p-3 rounded-lg ${
              isDarkTheme ? 'bg-gray-800/50' : 'bg-gray-50'
            }`}>
              <p className="text-xs text-gray-500">
                Didn't receive the email? Check your spam folder or{' '}
                <button
                  onClick={handleResendEmail}
                  className="text-orange-500 hover:text-orange-600 underline"
                >
                  try a different email address
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen transition-all duration-300 ${
      isDarkTheme 
        ? 'bg-black text-white' 
        : 'bg-gray-50 text-gray-900'
    } flex items-center justify-center p-4`}>
      {/* Background Pattern - Subtle grid like Anthropic */}
      <div className={`absolute inset-0 ${
        isDarkTheme 
          ? 'bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]' 
          : 'bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)]'
      } bg-[size:50px_50px]`}></div>
      
      {/* Subtle gradient overlay */}
      <div className={`absolute inset-0 ${
        isDarkTheme 
          ? 'bg-gradient-to-br from-orange-500/5 via-transparent to-blue-500/5' 
          : 'bg-gradient-to-br from-orange-500/10 via-transparent to-blue-500/10'
      }`}></div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-sm">
        {/* Logo/Brand - Compact */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl mb-3">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${
            isDarkTheme ? 'text-white' : 'text-gray-900'
          }`}>Forgot password?</h1>
          <p className={`text-sm ${
            isDarkTheme ? 'text-gray-400' : 'text-gray-600'
          }`}>No worries, we'll send you reset instructions.</p>
        </div>

        {/* Forgot Password Form - Compact design */}
        <div className={`${
          isDarkTheme 
            ? 'bg-gray-900/50 backdrop-blur-sm border-gray-800' 
            : 'bg-white border-gray-200'
        } border rounded-xl p-6 shadow-xl`}>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-center text-sm">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                isDarkTheme ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email address
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-3 py-2.5 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 pr-10 ${
                    isDarkTheme 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-gray-50 border-gray-300 text-gray-900'
                  } ${error ? 'border-red-500' : ''}`}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className={`h-4 w-4 ${
                    isDarkTheme ? 'text-gray-500' : 'text-gray-400'
                  }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Submit Button - Matching dashboard orange theme */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2.5 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </div>
              ) : (
                'Reset password'
              )}
            </button>
          </form>

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link
              href="/auth/login"
              className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
            >
              ← Back to sign in
            </Link>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <div className="mt-4 text-center">
          <button
            onClick={toggleTheme}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
              isDarkTheme 
                ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
            title={isDarkTheme ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkTheme ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
