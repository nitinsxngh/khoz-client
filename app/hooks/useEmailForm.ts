'use client';

import { useState, useCallback, useEffect } from 'react';
import type { FormData, WebhookResponse, WebhookData, EmailWithVerification, EmailVerificationResult, EmailWithConfidence, DomainProcessingResult, MultiDomainProgress } from '../types';
import { SECURITY_CONFIG, validateInput, sanitizeInput } from '../config/security';
import { validateDomain, validateDomainRealTime, type DomainValidationResult } from '../utils/domainValidation';

interface UseEmailFormReturn {
  formData: FormData;
  emails: string[];
  emailsWithConfidence: EmailWithConfidence[];
  emailsWithVerification: EmailWithVerification[];
  isLoading: boolean;
  isVerifying: boolean;
  currentStep: number;
  domainError: string;
  domainValidation: DomainValidationResult | null;
  isDomainValidating: boolean;
  webhookResponse: any;
  showWebhookResponse: boolean;
  // New multi-domain properties
  multiDomainProgress: MultiDomainProgress | null;
  isMultiDomainProcessing: boolean;
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
  triggerDomainWebhook: () => Promise<void>;
  verifyEmails: (count?: number) => Promise<void>;
}

const useEmailForm = (): UseEmailFormReturn => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    nickName: '',
    middleName: '',
    domain: '',
    customName: '',
    domainFile: null,
    selectedCustomNames: ['info', 'contact', 'team', 'support', 'hello', 'admin', 'sales', 'help'],
    useNickName: false,
    useCustomNames: false,
    usePersonalInfo: false,
    useAdvancedEmails: false,
    mode: 'auto',
  });
  
  const [emails, setEmails] = useState<string[]>([]);
  const [emailsWithConfidence, setEmailsWithConfidence] = useState<EmailWithConfidence[]>([]);
  const [emailsWithVerification, setEmailsWithVerification] = useState<EmailWithVerification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [domainError, setDomainError] = useState('');
  const [domainValidation, setDomainValidation] = useState<DomainValidationResult | null>(null);
  const [isDomainValidating, setIsDomainValidating] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState<WebhookResponse | null>(null);
  const [showWebhookResponse, setShowWebhookResponse] = useState(false);
  
  // New multi-domain state
  const [multiDomainProgress, setMultiDomainProgress] = useState<MultiDomainProgress | null>(null);
  const [isMultiDomainProcessing, setIsMultiDomainProcessing] = useState(false);

  // Update emailsWithVerification when emails change
  useEffect(() => {
    if (emails.length > 0) {
      const emailsWithVerificationData = emails.map(email => ({
        email,
        isVerifying: false,
      }));
      setEmailsWithVerification(emailsWithVerificationData);
    }
  }, [emails]);

  const onDomainChange = useCallback(async (domain: string) => {
    // Clean the domain input first
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    const sanitizedDomain = sanitizeInput.domain(cleanDomain);
    
    setFormData(prev => ({ ...prev, domain: sanitizedDomain }));
    setDomainError('');
    setCurrentStep(1);
    setEmails([]);
    setDomainValidation(null);

    // Real-time format validation
    const realTimeValidation = validateDomainRealTime(sanitizedDomain);
    if (!realTimeValidation.isValid) {
      setDomainError(realTimeValidation.error || 'Invalid domain format');
      return;
    }

    // Full validation (format + existence) if domain is not empty
    if (sanitizedDomain.trim()) {
      setIsDomainValidating(true);
      try {
        const validation = await validateDomain(sanitizedDomain);
        setDomainValidation(validation);
        
        if (!validation.isValid || !validation.exists) {
          setDomainError(validation.error || 'Domain validation failed');
        } else {
          setDomainError('');
        }
      } catch (error) {
        console.error('Domain validation error:', error);
        setDomainError('Domain validation failed. Please try again.');
      } finally {
        setIsDomainValidating(false);
      }
    }
  }, []);

  const onFileChange = useCallback((file: File | null) => {
    if (file && !validateInput.file(file)) {
      setDomainError('Invalid file: must be .txt and less than 5MB.');
      setFormData(prev => ({ ...prev, domainFile: null }));
      return;
    }
    setFormData(prev => ({ ...prev, domainFile: file }));
    setDomainError('');
  }, []);

  const onModeChange = useCallback((mode: 'auto') => {
    if (!validateInput.mode(mode)) {
      console.error('Invalid mode value:', mode);
      return;
    }
    setFormData(prev => ({ ...prev, mode }));
    setWebhookResponse(null);
    setShowWebhookResponse(false);
    setCurrentStep(1);
    setEmails([]);
  }, []);

  const onFieldChange = useCallback((field: string, value: string | boolean) => {
    if (typeof value === 'string') {
      setFormData(prev => ({ ...prev, [field]: sanitizeInput.name(value) }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  }, []);

  const onCustomNameChange = useCallback((name: string) => {
    setFormData(prev => ({ ...prev, customName: sanitizeInput.name(name) }));
  }, []);

  const onAddCustomName = useCallback(() => {
    if (formData.customName.trim() && !formData.selectedCustomNames.includes(formData.customName.trim())) {
      setFormData(prev => ({
        ...prev,
        selectedCustomNames: [...prev.selectedCustomNames, sanitizeInput.customName(prev.customName)],
        customName: ''
      }));
    }
  }, [formData.customName, formData.selectedCustomNames]);

  const onRemoveCustomName = useCallback((nameToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCustomNames: prev.selectedCustomNames.filter(name => name !== nameToRemove)
    }));
  }, []);

  const onToggleCustomName = useCallback((name: string) => {
    setFormData(prev => {
      if (prev.selectedCustomNames.includes(name)) {
        return {
          ...prev,
          selectedCustomNames: prev.selectedCustomNames.filter(n => n !== name)
        };
      } else {
        return {
          ...prev,
          selectedCustomNames: [...prev.selectedCustomNames, name]
        };
      }
    });
  }, []);

  const onUseCustomNamesChange = useCallback((use: boolean) => {
    setFormData(prev => ({ ...prev, useCustomNames: use }));
  }, []);

  const onUseAdvancedEmailsChange = useCallback((use: boolean) => {
    setFormData(prev => ({ ...prev, useAdvancedEmails: use }));
  }, []);

  const validateForm = useCallback(() => {
    if (!formData.domain.trim() && !formData.domainFile) {
      setDomainError('Please provide a domain or upload a domain file');
      return false;
    }
    
    // Check if domain validation is complete and successful
    if (formData.domain.trim()) {
      if (isDomainValidating) {
        setDomainError('Please wait for domain validation to complete');
        return false;
      }
      
      if (!domainValidation || !domainValidation.isValid || !domainValidation.exists) {
        setDomainError(domainValidation?.error || 'Please enter a valid and existing domain');
        return false;
      }
    }
    
    // Auto mode: always valid if domain is valid (will trigger Perplexity if needed)
    setDomainError('');
    return true;
  }, [formData, webhookResponse, domainValidation, isDomainValidating]);

  const triggerDomainWebhook = useCallback(async () => {
    try {
      setCurrentStep(2);
      console.log('Triggering Perplexity API for domain:', formData.domain);
      
      const response = await fetch('http://localhost:3001/api/perplexity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain: formData.domain
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('Perplexity API response:', responseData);
      
      if (responseData.success && responseData.data) {
        // Format the response to match the expected webhook format
        const webhookResponse: WebhookResponse = {
          output: JSON.stringify(responseData.data, null, 2),
          domain: responseData.domain,
          timestamp: responseData.timestamp
        };
        
        setWebhookResponse(webhookResponse);
        setShowWebhookResponse(true);
        
        // Auto-submit after Perplexity API response
        setTimeout(async () => {
          setIsLoading(true);
          setCurrentStep(3);
          try {
            const formDataToSend = new FormData();
            
            formDataToSend.append('firstName', formData.firstName);
            formDataToSend.append('lastName', formData.lastName);
            formDataToSend.append('middleName', formData.middleName);
            formDataToSend.append('domain', formData.domain);
            formDataToSend.append('mode', formData.mode);
            formDataToSend.append('useNickName', formData.useNickName.toString());
            formDataToSend.append('useCustomNames', formData.useCustomNames.toString());
            formDataToSend.append('useAdvancedEmails', formData.useAdvancedEmails.toString());
            formDataToSend.append('usePersonalInfo', 'false');
            
            if (formData.useNickName) {
              formDataToSend.append('nickName', formData.nickName);
            }
            
            if (formData.useCustomNames) {
              formDataToSend.append('selectedCustomNames', JSON.stringify(formData.selectedCustomNames));
            }
            
            formDataToSend.append('webhookResponse', JSON.stringify(webhookResponse));
            
            if (formData.domainFile) {
              formDataToSend.append('domainFile', formData.domainFile);
            }
            
            const response = await fetch('http://localhost:3001/permute', {
              method: 'POST',
              body: formDataToSend,
            });
            
            const data = await response.json();
            
            // Handle new server response format (no session ID)
            if (data.success && data.emails) {
              if (Array.isArray(data.emails) && data.emails.length > 0 && typeof data.emails[0] === 'object' && 'email' in data.emails[0] && 'confidence' in data.emails[0]) {
                // Emails with confidence levels
                setEmailsWithConfidence(data.emails);
                setEmails(data.emails.map((item: EmailWithConfidence) => item.email));
              } else if (Array.isArray(data.emails)) {
                // Just email strings
                setEmails(data.emails);
                setEmailsWithConfidence([]);
              }
            } else if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && 'email' in data[0] && 'confidence' in data[0]) {
              // Old format with confidence levels
              setEmailsWithConfidence(data);
              setEmails(data.map((item: EmailWithConfidence) => item.email));
            } else if (Array.isArray(data)) {
              // Old format - just strings
              setEmails(data);
              setEmailsWithConfidence([]);
            }
            setCurrentStep(4);
          } catch (error) {
            console.error('Error in auto-submit:', error);
          } finally {
            setIsLoading(false);
          }
        }, 1000);
      } else {
        throw new Error('Invalid response from Perplexity API');
      }
    } catch (error) {
      console.error('Error calling Perplexity API:', error);
      setCurrentStep(1);
      setDomainError('Failed to fetch company data. Please try again.');
    }
  }, [formData]);

  const onSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }
    
    // Check if we have a file with multiple domains
    if (formData.domainFile) {
      await processMultipleDomains();
      return;
    }
    
    // For auto mode, trigger Perplexity API if no webhook response yet
    if (formData.mode === 'auto' && !webhookResponse) {
      await triggerDomainWebhook();
      return;
    }
    
    setIsLoading(true);
    setCurrentStep(3);
    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('middleName', formData.middleName);
      formDataToSend.append('domain', formData.domain);
      formDataToSend.append('mode', formData.mode);
      formDataToSend.append('useNickName', formData.useNickName.toString());
      formDataToSend.append('useCustomNames', formData.useCustomNames.toString());
      formDataToSend.append('useAdvancedEmails', formData.useAdvancedEmails.toString());
      formDataToSend.append('usePersonalInfo', 'false');
      
      if (formData.useNickName) {
        formDataToSend.append('nickName', formData.nickName);
      }
      
      if (formData.useCustomNames) {
        console.log('Sending custom names:', formData.selectedCustomNames);
        formDataToSend.append('selectedCustomNames', JSON.stringify(formData.selectedCustomNames));
      } else {
        console.log('Custom names not enabled');
      }
      
      if (webhookResponse) {
        formDataToSend.append('webhookResponse', JSON.stringify(webhookResponse));
      }
      
      if (formData.domainFile) {
        formDataToSend.append('domainFile', formData.domainFile);
      }
      
      console.log('🔍 Sending request to /permute endpoint with file:', !!formData.domainFile);
      const response = await fetch('http://localhost:3001/permute', {
        method: 'POST',
        body: formDataToSend,
      });
      
      console.log('🔍 Response status:', response.status, response.ok);
      const data = await response.json();
      console.log('🔍 Server response received:', data);
      console.log('🔍 Response structure analysis:', {
        hasSuccess: 'success' in data,
        successValue: data.success,
        hasEmails: 'emails' in data,
        hasGlobalEmails: 'globalEmails' in data,
        responseKeys: Object.keys(data),
        fullResponse: data
      });
      
      // Handle new server response format (no session ID)
      if (data.success && data.emails) {
        console.log('✅ Processing new format response');
        if (Array.isArray(data.emails) && data.emails.length > 0 && typeof data.emails[0] === 'object' && 'email' in data.emails[0] && 'confidence' in data.emails[0]) {
          console.log('✅ Emails with confidence levels detected');
          setEmailsWithConfidence(data.emails);
          setEmails(data.emails.map((item: EmailWithConfidence) => item.email));
        } else if (Array.isArray(data.emails)) {
          console.log('✅ Simple emails array detected');
          setEmails(data.emails);
          setEmailsWithConfidence([]);
        }
      } else if (data.globalEmails) {
        console.log('✅ Processing multi-domain format response');
        const globalEmails = data.globalEmails || [];
        const domainResults = data.domainResults || [];
        
        const allEmails: string[] = globalEmails.map((e: EmailWithConfidence) => e.email);
        const allEmailsWithConfidence: EmailWithConfidence[] = globalEmails;
        
        setEmails(allEmails);
        setEmailsWithConfidence(allEmailsWithConfidence);
        setMultiDomainProgress(prev => prev ? {
          ...prev,
          isProcessing: false,
          processedDomains: prev.totalDomains,
          results: domainResults
        } : null);
      } else if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && 'email' in data[0] && 'confidence' in data[0]) {
        // Old format with confidence levels
        setEmailsWithConfidence(data);
        setEmails(data.map((item: EmailWithConfidence) => item.email));
      } else if (Array.isArray(data)) {
        // Old format - just strings
        setEmails(data);
        setEmailsWithConfidence([]);
      }
      setCurrentStep(4);
    } catch (error) {
      console.error('Error generating emails:', error);
    } finally {
      setIsLoading(false);
    }
  }, [formData, webhookResponse, validateForm, triggerDomainWebhook]);

  // New function to process multiple domains
  const processMultipleDomains = useCallback(async () => {
    if (!formData.domainFile) return;
    
    setIsMultiDomainProcessing(true);
    setCurrentStep(3);
    
    try {
      // Read the file to get domain count
      const fileContent = await formData.domainFile.text();
      const domains = fileContent
        .split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('#') && line.includes('.'))
        .map(line => line.toLowerCase());
      
      const uniqueDomains = [...new Set(domains)];
      
      // Initialize multi-domain progress
      setMultiDomainProgress({
        totalDomains: uniqueDomains.length,
        processedDomains: 0,
        currentDomain: uniqueDomains[0] || '',
        currentDomainIndex: 0,
        isProcessing: true,
        results: []
      });
      
      const formDataToSend = new FormData();
      
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('middleName', formData.middleName);
      formDataToSend.append('domain', formData.domain);
      formDataToSend.append('mode', formData.mode);
      formDataToSend.append('useNickName', formData.useNickName.toString());
      formDataToSend.append('useCustomNames', formData.useCustomNames.toString());
      formDataToSend.append('useAdvancedEmails', formData.useAdvancedEmails.toString());
      formDataToSend.append('usePersonalInfo', 'false');
      
      if (formData.useNickName) {
        formDataToSend.append('nickName', formData.nickName);
      }
      
      if (formData.useCustomNames) {
        formDataToSend.append('selectedCustomNames', JSON.stringify(formData.selectedCustomNames));
      }
      
      formDataToSend.append('domainFile', formData.domainFile);
      
      const response = await fetch('http://localhost:3001/permute', {
        method: 'POST',
        body: formDataToSend,
      });
      
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0 && 'domain' in data[0]) {
        // Multi-domain results (old format - fallback)
        const allEmails: string[] = [];
        const allEmailsWithConfidence: EmailWithConfidence[] = [];
        
        data.forEach((domainResult: DomainProcessingResult) => {
          if (domainResult.emails && domainResult.emails.length > 0) {
            allEmails.push(...domainResult.emails.map(e => e.email));
            allEmailsWithConfidence.push(...domainResult.emails);
          }
        });
        
        setEmails(allEmails);
        setEmailsWithConfidence(allEmailsWithConfidence);
        setMultiDomainProgress(prev => prev ? {
          ...prev,
          isProcessing: false,
          processedDomains: prev.totalDomains,
          results: data
        } : null);
      } else if (data && typeof data === 'object' && 'globalEmails' in data) {
        // New multi-domain format with globally sorted emails
        const globalEmails = data.globalEmails || [];
        const domainResults = data.domainResults || [];
        
        const allEmails: string[] = globalEmails.map((e: EmailWithConfidence) => e.email);
        const allEmailsWithConfidence: EmailWithConfidence[] = globalEmails;
        
        setEmails(allEmails);
        setEmailsWithConfidence(allEmailsWithConfidence);
        setMultiDomainProgress(prev => prev ? {
          ...prev,
          isProcessing: false,
          processedDomains: prev.totalDomains,
          results: domainResults
        } : null);
      } else {
        // Fallback to single domain format
        if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && 'email' in data[0] && 'confidence' in data[0]) {
          setEmailsWithConfidence(data);
          setEmails(data.map((item: EmailWithConfidence) => item.email));
        } else {
          setEmails(data);
          setEmailsWithConfidence([]);
        }
      }
      
      setCurrentStep(4);
    } catch (error) {
      console.error('Error processing multiple domains:', error);
      setMultiDomainProgress(prev => prev ? {
        ...prev,
        isProcessing: false,
        results: prev.results.map(r => r.status === 'processing' ? { ...r, status: 'error', error: 'Processing failed' } : r)
      } : null);
    } finally {
      setIsMultiDomainProcessing(false);
    }
  }, [formData]);

  const verifyEmails = useCallback(async (count?: number) => {
    console.log('🚀 verifyEmails called with:', { count });
    console.log('🔍 Current state at verification start:');
    console.log('  - emails.length:', emails.length);
    console.log('  - emailsWithConfidence.length:', emailsWithConfidence.length);
    
    if (emails.length === 0 || emailsWithConfidence.length === 0) {
      console.log('❌ Early return - no emails to verify');
      return;
    }

    setIsVerifying(true);
    setCurrentStep(5);
    
    try {
      // Determine the effective domain for inputData
      let effectiveDomain = formData.domain;
      if (!effectiveDomain && formData.domainFile) {
        // For multi-domain processing, extract domain from first email
        const firstEmail = emails[0];
        if (firstEmail && firstEmail.includes('@')) {
          effectiveDomain = firstEmail.split('@')[1];
        }
      }
      
      // Get the emails to verify (limited by count)
      const emailsToVerify = emailsWithConfidence.slice(0, count || 10);
      
      console.log('🔍 Sending verification request');
      console.log('🔍 Request payload:', {
        emailsWithConfidence: emailsToVerify,
        maxEmails: count || 10,
        allGeneratedEmails: emailsWithConfidence, // Send all generated emails
        inputData: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          middleName: formData.middleName,
          nickName: formData.nickName,
          domain: effectiveDomain || '',
          useNickName: formData.useNickName,
          useCustomNames: formData.useCustomNames,
          usePersonalInfo: formData.usePersonalInfo,
          useAdvancedEmails: formData.useAdvancedEmails,
          selectedCustomNames: formData.selectedCustomNames,
          domainsFromFile: formData.domainFile ? [] : [effectiveDomain].filter(Boolean)
        }
      });
      
      // Use smart verification service
      const response = await fetch('http://localhost:3001/api/smart-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailsWithConfidence: emailsToVerify,
          maxEmails: count || 10,
          allGeneratedEmails: emailsWithConfidence, // Send all generated emails
          inputData: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            middleName: formData.middleName,
            nickName: formData.nickName,
            domain: effectiveDomain || '',
            useNickName: formData.useNickName,
            useCustomNames: formData.useCustomNames,
            usePersonalInfo: formData.usePersonalInfo,
            useAdvancedEmails: formData.useAdvancedEmails,
            selectedCustomNames: formData.selectedCustomNames,
            domainsFromFile: formData.domainFile ? [] : [effectiveDomain].filter(Boolean)
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Smart verification failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Smart verification results:', data);

      // Update verification results
      const updatedEmailsWithVerification = [...emailsWithVerification];
    
      data.results.forEach((result: EmailVerificationResult, index: number) => {
        if (index < updatedEmailsWithVerification.length) {
          updatedEmailsWithVerification[index].verification = result;
          updatedEmailsWithVerification[index].isVerifying = false;
        }
      });

      setEmailsWithVerification(updatedEmailsWithVerification);
      
      // Show usage statistics
      console.log('Verification usage stats:', data.usageStats);
      
      // Show success message if document was created
      if (data.createdDocument) {
        console.log('✅ EmailGeneration record created successfully:', data.createdDocument);
      }
      
    } catch (error) {
      console.error('Error in smart verification:', error);
      
      // Fallback to individual verification if smart verification fails
      const updatedEmailsWithVerification = [...emailsWithVerification];
      const emailsToVerify = count ? Math.min(count, emails.length) : emails.length;

      for (let i = 0; i < emailsToVerify; i++) {
        const email = emails[i];
        updatedEmailsWithVerification[i].isVerifying = true;
        setEmailsWithVerification([...updatedEmailsWithVerification]);

        try {
          const verificationResponse = await fetch(`http://localhost:8080/v1/${encodeURIComponent(email)}/verification`);
          const verificationData: EmailVerificationResult = await verificationResponse.json();
          
          console.log(`Fallback verification data for ${email}:`, verificationData);

          updatedEmailsWithVerification[i].verification = verificationData;
        } catch (fallbackError) {
          console.error(`Error in fallback verification for ${email}:`, fallbackError);
          updatedEmailsWithVerification[i].verificationError = `Failed to verify: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'}`;
        } finally {
          updatedEmailsWithVerification[i].isVerifying = false;
          setEmailsWithVerification([...updatedEmailsWithVerification]);
          await new Promise(resolve => setTimeout(resolve, 50)); 
        }
      }
    } finally {
      setIsVerifying(false);
      setCurrentStep(4); // Go back to results step after verification
    }
  }, [emails, emailsWithConfidence, emailsWithVerification, formData]);

  return {
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
    triggerDomainWebhook,
    verifyEmails,
  };
};

export default useEmailForm; 