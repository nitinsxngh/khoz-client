'use client';

import React from 'react';
import type { EmailWithVerification, EmailVerificationResult, EmailWithConfidence } from '../types';

interface EmailResultsProps {
  emails: string[];
  emailsWithConfidence: EmailWithConfidence[];
  emailsWithVerification: EmailWithVerification[];
  isVerifying: boolean;
  isDarkTheme: boolean;
  currentStep: number;
  onVerifyEmails: (count?: number) => Promise<void>;
  // New prop for multi-domain results
  multiDomainProgress?: any;
}

const EmailResults: React.FC<EmailResultsProps> = ({
  emails, emailsWithConfidence, emailsWithVerification, isVerifying, isDarkTheme, currentStep, onVerifyEmails, multiDomainProgress
}) => {
  const [verifyCount, setVerifyCount] = React.useState<number>(10);

  // Extract domain from email for display
  const getDomainFromEmail = (email: string): string => {
    const domain = email.split('@')[1];
    return domain || '';
  };

  // Check if this is a multi-domain result
  const isMultiDomain = multiDomainProgress && multiDomainProgress.results && multiDomainProgress.results.length > 1;

  const handleCopyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      console.log('Email copied to clipboard:', email);
    } catch (error) {
      console.error('Failed to copy email:', error);
    }
  };

  const handleCopyAllEmails = async () => {
    try {
      await navigator.clipboard.writeText(emails.join(', '));
    } catch (error) {
      console.error('Failed to copy emails:', error);
    }
  };

  const handleVerifyEmails = () => {
    onVerifyEmails(verifyCount);
  };

  const getConfidenceLevel = (email: string): { level: string; color: string; bgColor: string } => {
    const emailWithConfidence = emailsWithConfidence.find(e => e.email === email);
    const confidence = emailWithConfidence?.confidence || 0;
    
    if (confidence >= 75) {
      return { 
        level: 'High', 
        color: isDarkTheme ? 'text-green-400' : 'text-green-600',
        bgColor: isDarkTheme ? 'bg-green-900/20' : 'bg-green-100'
      };
    } else if (confidence >= 50) {
      return { 
        level: 'Medium', 
        color: isDarkTheme ? 'text-yellow-400' : 'text-yellow-600',
        bgColor: isDarkTheme ? 'bg-yellow-900/20' : 'bg-yellow-100'
      };
    } else if (confidence >= 25) {
      return { 
        level: 'Low', 
        color: isDarkTheme ? 'text-orange-400' : 'text-orange-600',
        bgColor: isDarkTheme ? 'bg-orange-900/20' : 'bg-orange-100'
      };
    } else {
      return { 
        level: 'Very Low', 
        color: isDarkTheme ? 'text-red-400' : 'text-red-600',
        bgColor: isDarkTheme ? 'bg-red-900/20' : 'bg-red-100'
      };
    }
  };

  const sanitizeEmail = (email: string): string => {
    return email.replace(/[<>]/g, '');
  };

  return (
    <div className={`border rounded-xl p-6 transition-all duration-300 ${
      isDarkTheme 
        ? 'bg-gray-900 border-gray-800' 
        : 'bg-white border-gray-200 shadow-lg'
    }`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            isDarkTheme 
              ? 'bg-gradient-to-br from-orange-500 to-orange-600' 
              : 'bg-gradient-to-br from-blue-600 to-blue-700'
          }`}>
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className={`text-lg font-semibold ${
              isDarkTheme ? 'text-white' : 'text-gray-900'
            }`}>Email Addresses</h2>
            <p className={`text-xs ${
              isDarkTheme ? 'text-gray-400' : 'text-gray-500'
            }`}>Professional email addresses explored from company data</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {emails.length > 0 && (
              <div className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-300 ${
                isDarkTheme 
                  ? 'text-gray-300 bg-gray-800' 
                  : 'text-gray-600 bg-gray-100'
              }`}>
                {emails.length} {emails.length === 1 ? 'address' : 'addresses'} explored
              </div>
            )}
            {emailsWithVerification.some(e => e.verification) && (
              <div className={`text-xs px-3 py-1.5 rounded-lg ${
                emailsWithVerification.some(e => e.verification && e.verification.smtp.deliverable)
                  ? isDarkTheme ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                  : isDarkTheme ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
              }`}>
                {emailsWithVerification.filter(e => e.verification && e.verification.smtp.deliverable).length} deliverable
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {emails.length > 0 && (
              <button
                onClick={handleCopyAllEmails}
                className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-300 ${
                  isDarkTheme 
                    ? 'bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white' 
                    : 'bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                }`}
                title="Copy all emails to clipboard"
              >
                <div className="flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy All</span>
                </div>
              </button>
            )}
            {emails.length > 0 && !isVerifying && !emailsWithVerification.some(e => e.verification) && (
              <div className="flex items-center space-x-2">
                <select
                  value={verifyCount}
                  onChange={(e) => setVerifyCount(Number(e.target.value))}
                  className={`text-xs px-2 py-1.5 rounded-lg transition-all duration-300 ${
                    isDarkTheme 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-gray-100 border-gray-300 text-gray-700'
                  } border focus:outline-none focus:ring-2 focus:ring-offset-0 ${
                    isDarkTheme ? 'focus:ring-orange-500' : 'focus:ring-blue-600'
                  }`}
                >
                  <option value={5}>First 5</option>
                  <option value={10}>First 10</option>
                  <option value={20}>First 20</option>
                  <option value={50}>First 50</option>
                  <option value={100}>First 100</option>
                  <option value={emails.length}>All ({emails.length})</option>
                </select>
                <button
                  onClick={handleVerifyEmails}
                  className={`text-xs px-3 py-1.5 rounded-lg transition-all duration-300 ${
                    isDarkTheme 
                      ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>Verify {verifyCount > emails.length ? emails.length : verifyCount}</span>
                  </div>
                </button>
              </div>
            )}
            {isVerifying && (
              <div className={`flex items-center space-x-2 text-xs px-3 py-1.5 rounded-lg ${
                isDarkTheme ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700'
              }`}>
                <div className={`w-3 h-3 border-2 rounded-full animate-spin ${
                  isDarkTheme ? 'border-orange-500/30 border-t-orange-500' : 'border-orange-400/30 border-t-orange-600'
                }`}></div>
                <span>Verifying...</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Email List */}
      {emails.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-4 ${
            isDarkTheme ? 'bg-gray-800' : 'bg-gray-100'
          }`}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className={`text-sm font-medium ${
            isDarkTheme ? 'text-gray-300' : 'text-gray-600'
          }`}>No email addresses explored yet</p>
          <p className={`text-xs mt-1 ${
            isDarkTheme ? 'text-gray-500' : 'text-gray-400'
          }`}>Enter a domain and click explore to discover professional email addresses</p>
        </div>
      ) : (
        <div>
          {/* Confidence Legend */}
          <div className="mb-4 p-3 rounded-lg border border-dashed">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                Confidence Levels
              </span>
              <span className={`text-xs ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>
                Emails ranked by likelihood of being correct
              </span>
            </div>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className={isDarkTheme ? 'text-gray-300' : 'text-gray-600'}>High (95-75%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className={isDarkTheme ? 'text-gray-300' : 'text-gray-600'}>Medium (70-50%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className={isDarkTheme ? 'text-gray-300' : 'text-gray-600'}>Low (45-25%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className={isDarkTheme ? 'text-gray-300' : 'text-gray-600'}>Very Low (20-5%)</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {emails.map((email, index) => {
              const emailWithVerification = emailsWithVerification[index];
              const confidence = getConfidenceLevel(email);
              
              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border transition-all duration-300 ${
                    isDarkTheme 
                      ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800' 
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      {/* Confidence Indicator */}
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${confidence.bgColor} ${confidence.color}`}>
                        {confidence.level}
                      </div>
                      
                      {/* Email */}
                      <div className="flex flex-col min-w-0">
                        <span className={`font-mono text-sm ${isDarkTheme ? 'text-gray-200' : 'text-gray-800'} truncate`}>
                          {sanitizeEmail(email)}
                        </span>
                        {isMultiDomain && (
                          <span className={`text-xs ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'} truncate`}>
                            {getDomainFromEmail(email)}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {/* Copy Button */}
                      <button
                        onClick={() => handleCopyEmail(email)}
                        className={`p-1.5 rounded-lg transition-all duration-300 ${
                          isDarkTheme 
                            ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                        }`}
                        title="Copy email"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      
                      {/* Verification Status */}
                      {emailWithVerification?.isVerifying && (
                        <div className="flex items-center space-x-1">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
                          <span className="text-xs text-gray-500">Verifying...</span>
                        </div>
                      )}
                      
                      {emailWithVerification?.verification && (
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                          emailWithVerification.verification.smtp?.deliverable
                            ? (isDarkTheme ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-700')
                            : (isDarkTheme ? 'bg-red-900/20 text-red-400' : 'bg-red-100 text-red-700')
                        }`}>
                          <div className={`w-2 h-2 rounded-full ${
                            emailWithVerification.verification.smtp?.deliverable
                              ? (isDarkTheme ? 'bg-green-400' : 'bg-green-600')
                              : (isDarkTheme ? 'bg-red-400' : 'bg-red-600')
                          }`}></div>
                          <span>
                            {emailWithVerification.verification.smtp?.deliverable ? 'Valid' : 'Invalid'}
                          </span>
                        </div>
                      )}
                      
                      {emailWithVerification?.verificationError && (
                        <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-red-900/20 text-red-400">
                          <span>⚠️</span>
                          <span>Error</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailResults;