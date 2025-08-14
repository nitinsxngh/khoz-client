"use client";

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import EmailForm from './components/EmailForm';
import EmailResults from './components/EmailResults';
import MultiDomainProgress from './components/MultiDomainProgress';
import useEmailForm from './hooks/useEmailForm';
import ProtectedRoute from './components/ProtectedRoute';

export default function Home() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  
  const {
    formData,
    emails,
    emailsWithConfidence,
    emailsWithVerification,
    isLoading,
    isVerifying,
    currentStep,
    domainError,
    domainValidation,
    isDomainValidating,
    webhookResponse,
    // New multi-domain properties
    multiDomainProgress,
    isMultiDomainProcessing,
    onDomainChange,
    onFileChange,
    onModeChange,
    onFieldChange,
    onCustomNameChange,
    onAddCustomName,
    onRemoveCustomName,
    onToggleCustomName,
    onUseCustomNamesChange,
    onUseAdvancedEmailsChange,
    onSubmit,
    verifyEmails,
  } = useEmailForm();

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  // Debug logging for EmailResults props
  useEffect(() => {
    console.log('🔍 Page - EmailResults props:', {
      emailsLength: emails.length,
      emailsWithConfidenceLength: emailsWithConfidence.length
    });
  }, [emails.length, emailsWithConfidence.length]);

  return (
    <ProtectedRoute>
      <div className={`min-h-screen font-sans transition-all duration-300 ${
        isDarkTheme 
          ? 'bg-black text-white' 
          : 'bg-gray-50 text-gray-900'
      }`}>
        {/* Header */}
        <Header 
          currentStep={currentStep} 
          isDarkTheme={isDarkTheme} 
          onToggleTheme={toggleTheme}
          domain={formData.domain}
          onDomainChange={onDomainChange}
        />

        {/* Main Content */}
        <div className="px-6 py-8 pt-24">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Panel - Form (1/3 width) - Sticky */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 w-full">
                <EmailForm
                  formData={formData}
                  domainError={domainError}
                  domainValidation={domainValidation}
                  isDomainValidating={isDomainValidating}
                  webhookResponse={webhookResponse}
                  isLoading={isLoading}
                  isDarkTheme={isDarkTheme}
                  onDomainChange={onDomainChange}
                  onFileChange={onFileChange}
                  onModeChange={onModeChange}
                  onFieldChange={onFieldChange}
                  onCustomNameChange={onCustomNameChange}
                  onAddCustomName={onAddCustomName}
                  onRemoveCustomName={onRemoveCustomName}
                  onToggleCustomName={onToggleCustomName}
                  onUseCustomNamesChange={onUseCustomNamesChange}
                  onUseAdvancedEmailsChange={onUseAdvancedEmailsChange}
                  onSubmit={onSubmit}
                />
              </div>
            </div>

            {/* Right Panel - Results (2/3 width) - No Scroll */}
            <div className="lg:col-span-2">
              {/* Show multi-domain progress when processing multiple domains */}
              {isMultiDomainProcessing && multiDomainProgress ? (
                <MultiDomainProgress 
                  progress={multiDomainProgress}
                  isDarkTheme={isDarkTheme}
                />
              ) : (
              <EmailResults 
                emails={emails} 
                emailsWithConfidence={emailsWithConfidence}
                emailsWithVerification={emailsWithVerification}
                isVerifying={isVerifying}
                isDarkTheme={isDarkTheme}
                currentStep={currentStep}
                onVerifyEmails={verifyEmails}
                multiDomainProgress={multiDomainProgress}
              />
            )}
          </div>
        </div>
      </div>


      </div>
    </ProtectedRoute>
  );
}
