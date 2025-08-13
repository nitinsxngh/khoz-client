'use client';

import React from 'react';
import { DomainValidationResult } from '../utils/domainValidation';

interface SubmitButtonProps {
  isLoading: boolean;
  mode: 'auto';
  webhookResponse: any;
  useCustomNames: boolean;
  domainValidation: DomainValidationResult | null;
  isDomainValidating: boolean;
  isDarkTheme: boolean;
  onSubmit: () => void;
  // New prop for multi-domain
  hasDomainFile?: boolean;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  isLoading, 
  mode, 
  webhookResponse, 
  useCustomNames,
  domainValidation, 
  isDomainValidating, 
  isDarkTheme, 
  onSubmit,
  hasDomainFile = false
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const isButtonDisabled = (): boolean => {
    // Disable if loading
    if (isLoading) return true;
    
    // If we have a domain file, we can proceed without domain validation
    if (hasDomainFile) return false;
    
    // Disable if domain is being validated
    if (isDomainValidating) return true;
    
    // Disable if domain validation failed or domain doesn't exist
    if (!domainValidation || !domainValidation.isValid || !domainValidation.exists) return true;
    
    return false;
  };

  const getButtonText = (): string => {
    if (isLoading) {
      return hasDomainFile ? 'Processing Domains...' : 'Generating...';
    }
    
    if (isDomainValidating && !hasDomainFile) {
      return 'Validating Domain...';
    }
    
    if (hasDomainFile) {
      return 'Process Multiple Domains';
    }
    
    if (!domainValidation || !domainValidation.isValid || !domainValidation.exists) {
      return 'Domain Required';
    }
    
    if (mode === 'auto' && !webhookResponse) {
      return 'Start Discovery';
    }
    
    return 'Explore Emails';
  };

  return (
    <div className="space-y-2">
      <button
        type="submit"
        disabled={isButtonDisabled()}
        onClick={handleClick}
        className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-0 text-sm ${
          isButtonDisabled()
            ? isDarkTheme 
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : isDarkTheme 
              ? 'bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white focus:ring-orange-500 focus:ring-offset-black' 
              : 'bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:from-blue-800 text-white focus:ring-blue-600 focus:ring-offset-white'
        }`}
      >
        {isLoading || isDomainValidating ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>{getButtonText()}</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            {hasDomainFile ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            ) : !domainValidation || !domainValidation.isValid || !domainValidation.exists ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
            <span>{getButtonText()}</span>
          </div>
        )}
      </button>
      
      <p className={`text-sm text-center ${
        isDarkTheme ? 'text-gray-400' : 'text-gray-500'
      }`}>
        {hasDomainFile 
          ? 'Click to process all domains in the uploaded file sequentially'
          : isDomainValidating 
          ? 'Validating domain existence...'
          : !domainValidation || !domainValidation.isValid || !domainValidation.exists
          ? 'Please enter a valid domain to continue'
          : mode === 'auto' && !webhookResponse
          ? 'Click to start AI discovery and explore professional email addresses'
          : 'Click to explore professional email addresses from company data'
        }
      </p>
    </div>
  );
};

export default SubmitButton; 