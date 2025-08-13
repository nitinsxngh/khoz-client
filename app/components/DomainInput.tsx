'use client';

import React from 'react';

import { DomainValidationResult } from '../utils/domainValidation';

interface DomainInputProps {
  domain: string;
  domainFile: File | null;
  domainError: string;
  domainValidation: DomainValidationResult | null;
  isDomainValidating: boolean;
  isDarkTheme: boolean;
  onDomainChange: (domain: string) => void;
  onFileChange: (file: File | null) => void;
}

const DomainInput: React.FC<DomainInputProps> = ({
  domain,
  domainFile,
  domainError,
  domainValidation,
  isDomainValidating,
  isDarkTheme,
  onDomainChange,
  onFileChange
}) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB limit
      const allowedTypes = ['text/plain'];
      
      if (file.size > maxSize) {
        alert('File size must be less than 5MB');
        return;
      }
      
      if (!allowedTypes.includes(file.type)) {
        alert('Only .txt files are allowed');
        return;
      }
    }
    onFileChange(file);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <svg className={`w-4 h-4 ${
            isDarkTheme ? 'text-gray-300' : 'text-gray-700'
          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
          </svg>
          <label className={`block text-sm font-medium ${
            isDarkTheme ? 'text-gray-300' : 'text-gray-700'
          }`}>Domain</label>
        </div>
        <span className={`text-xs ${
          isDarkTheme ? 'text-gray-500' : 'text-gray-400'
        }`}>Required</span>
      </div>
      
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={domain}
              onChange={handleDomainChange}
              className={`w-full border rounded-lg px-4 py-2.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-0 text-sm ${
                isDarkTheme 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-orange-500' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-600'
              } ${
                domainError ? 'border-red-500' : ''
              }`}
              placeholder="Enter domain or URL (e.g., example.com, https://www.example.com)"
              maxLength={253}
            />
            {domain && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isDomainValidating ? (
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                ) : domainValidation ? (
                  <div className={`w-2 h-2 rounded-full ${
                    domainValidation.isValid && domainValidation.exists ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                ) : (
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                )}
              </div>
            )}
          </div>
          <div className="relative group">
            <input
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              className="hidden"
              id="domainFileInput"
            />
            <label
              htmlFor="domainFileInput"
              className={`flex items-center justify-center w-10 h-10 rounded-lg cursor-pointer transition-all duration-300 ${
                isDarkTheme 
                  ? 'bg-gray-800 border border-gray-700 hover:bg-gray-750 text-gray-400 hover:text-white' 
                  : 'bg-gray-100 border border-gray-300 hover:bg-gray-200 text-gray-500 hover:text-gray-700'
              }`}
              title="Upload domains from file"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </label>
            <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 ${
              isDarkTheme 
                ? 'bg-gray-900 text-white' 
                : 'bg-gray-800 text-white'
            }`}>
              Upload .txt file
              <div className={`absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent ${
                isDarkTheme ? 'border-t-gray-900' : 'border-t-gray-800'
              }`}></div>
            </div>
          </div>
        </div>
        
        {domainError && (
          <p className="text-red-400 text-xs flex items-center space-x-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{domainError}</span>
          </p>
        )}
        
        {domain && !domainError && domainValidation && (
          <p className={`text-xs flex items-center space-x-1 ${
            domainValidation.isValid && domainValidation.exists 
              ? 'text-green-500' 
              : 'text-yellow-500'
          }`}>
            {domainValidation.isValid && domainValidation.exists ? (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Domain validated and exists</span>
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>{domainValidation.error || 'Domain validation failed'}</span>
              </>
            )}
          </p>
        )}
        
        {domain && isDomainValidating && (
          <p className="text-blue-500 text-xs flex items-center space-x-1">
            <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Validating domain...</span>
          </p>
        )}
        
        {domainFile && (
          <div className={`flex items-center gap-2 text-xs ${
            isDarkTheme ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>File uploaded: {domainFile.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainInput; 