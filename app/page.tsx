"use client";

import React, { useState } from 'react';
import Header from './components/Header';
import ProgressSteps from './components/ProgressSteps';
import EmailForm from './components/EmailForm';
import EmailResults from './components/EmailResults';
import MultiDomainProgress from './components/MultiDomainProgress';
import useEmailForm from './hooks/useEmailForm';

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
    showWebhookResponse,
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

  return (
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

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDarkTheme ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDarkTheme ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'};
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDarkTheme ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'};
        }
      `}</style>
    </div>
  );
}
