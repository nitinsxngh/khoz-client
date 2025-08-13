'use client';

import React from 'react';
import DomainInput from './DomainInput';

import CustomNamesForm from './CustomNamesForm';
import WebhookNotification from './WebhookNotification';
import SubmitButton from './SubmitButton';

interface FormData {
  firstName: string;
  lastName: string;
  nickName: string;
  middleName: string;
  domain: string;
  customName: string;
  domainFile: File | null;
  selectedCustomNames: string[];
  useNickName: boolean;
  useCustomNames: boolean;
  usePersonalInfo: boolean;
  useAdvancedEmails: boolean;
  mode: 'auto';
}

import { DomainValidationResult } from '../utils/domainValidation';

interface EmailFormProps {
  formData: FormData;
  domainError: string;
  domainValidation: DomainValidationResult | null;
  isDomainValidating: boolean;
  webhookResponse: any;
  isLoading: boolean;
  isDarkTheme: boolean;
  onDomainChange: (domain: string) => void;
  onFileChange: (file: File | null) => void;
  onModeChange: (mode: 'auto') => void;
  onFieldChange: (field: string, value: string | boolean) => void;
  onCustomNameChange: (name: string) => void;
  onAddCustomName: () => void;
  onRemoveCustomName: (name: string) => void;
  onToggleCustomName: (name: string) => void;
  onUseCustomNamesChange: (use: boolean) => void;
  onUseAdvancedEmailsChange: (use: boolean) => void;
  onSubmit: () => void;
}

const EmailForm: React.FC<EmailFormProps> = ({
  formData,
  domainError,
  domainValidation,
  isDomainValidating,
  webhookResponse,
  isLoading,
  isDarkTheme,
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
  onSubmit
}) => {
  return (
    <div className={`border rounded-xl p-6 transition-all duration-300 ${
      isDarkTheme 
        ? 'bg-gray-900 border-gray-800' 
        : 'bg-white border-gray-200 shadow-lg'
    }`}>
      {/* Header with Icon */}
      <div className="flex items-center space-x-3 mb-6">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          isDarkTheme 
            ? 'bg-gradient-to-br from-orange-500 to-orange-600' 
            : 'bg-gradient-to-br from-blue-600 to-blue-700'
        }`}>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div>
          <h2 className={`text-lg font-semibold ${
            isDarkTheme ? 'text-white' : 'text-gray-900'
          }`}>Discovery Settings</h2>
          <p className={`text-xs ${
            isDarkTheme ? 'text-gray-400' : 'text-gray-500'
          }`}>Configure your email address exploration settings</p>
        </div>
      </div>
      
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-5">
        {/* Domain Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              isDarkTheme ? 'bg-orange-500' : 'bg-blue-600'
            }`}></div>
            <h3 className={`text-sm font-medium ${
              isDarkTheme ? 'text-gray-300' : 'text-gray-700'
            }`}>Company Domain</h3>
          </div>
          <DomainInput
            domain={formData.domain}
            domainFile={formData.domainFile}
            domainError={domainError}
            domainValidation={domainValidation}
            isDomainValidating={isDomainValidating}
            isDarkTheme={isDarkTheme}
            onDomainChange={onDomainChange}
            onFileChange={onFileChange}
          />
          
          {/* Multi-domain file indicator */}
          {formData.domainFile && (
            <div className={`p-3 rounded-lg border ${
              isDarkTheme 
                ? 'bg-blue-900/20 border-blue-700 text-blue-300' 
                : 'bg-blue-50 border-blue-200 text-blue-700'
            }`}>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="text-sm">
                  <p className="font-medium">Multi-domain file uploaded</p>
                  <p className="text-xs opacity-80">
                    {formData.domainFile.name} - Will process all domains sequentially
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        

        
        {/* Email Generation Settings */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              isDarkTheme ? 'bg-orange-500' : 'bg-blue-600'
            }`}></div>
            <h3 className={`text-sm font-medium ${
              isDarkTheme ? 'text-gray-300' : 'text-gray-700'
            }`}>Email Exploration Settings</h3>
          </div>
          <CustomNamesForm
            customName={formData.customName}
            selectedCustomNames={formData.selectedCustomNames}
            useCustomNames={formData.useCustomNames}
            useAdvancedEmails={formData.useAdvancedEmails}
            isDarkTheme={isDarkTheme}
            onCustomNameChange={onCustomNameChange}
            onAddCustomName={onAddCustomName}
            onRemoveCustomName={onRemoveCustomName}
            onToggleCustomName={onToggleCustomName}
            onUseCustomNamesChange={onUseCustomNamesChange}
            onUseAdvancedEmailsChange={onUseAdvancedEmailsChange}
          />
        </div>
        
        {/* AI Status */}
        <WebhookNotification
          webhookResponse={webhookResponse}
          mode={formData.mode}
          isDarkTheme={isDarkTheme}
        />
        
        {/* Submit Button */}
        <div className="pt-2">
          <SubmitButton
            isLoading={isLoading}
            mode={formData.mode}
            webhookResponse={webhookResponse}
            useCustomNames={formData.useCustomNames}
            domainValidation={domainValidation}
            isDomainValidating={isDomainValidating}
            isDarkTheme={isDarkTheme}
            onSubmit={onSubmit}
            hasDomainFile={!!formData.domainFile}
          />
        </div>
      </form>
    </div>
  );
};

export default EmailForm; 