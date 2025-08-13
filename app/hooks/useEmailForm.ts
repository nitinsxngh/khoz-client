'use client';

import { useState, useCallback, useEffect } from 'react';
import type { FormData, WebhookResponse, WebhookData, EmailWithVerification, EmailVerificationResult, EmailWithConfidence, DomainProcessingResult, MultiDomainProgress } from '../types';
import { SECURITY_CONFIG, validateInput, sanitizeInput } from '../config/security';
import { validateDomain, validateDomainRealTime, type DomainValidationResult } from '../utils/domainValidation';
import { useAuth } from '../contexts/AuthContext';

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
  const { user, isAuthenticated } = useAuth();
  
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
  
  // Current discovery session
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

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
    setFormData(prev => ({ ...prev, customName: sanitizeInput.customName(name) }));
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
            // Handle both old format (string[]) and new format (EmailWithConfidence[])
            if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && 'email' in data[0] && 'confidence' in data[0]) {
              // New format with confidence levels
              setEmailsWithConfidence(data);
              setEmails(data.map((item: EmailWithConfidence) => item.email));
            } else {
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
    
    // Check authentication
    if (!isAuthenticated || !user) {
      console.error('User must be authenticated to use email discovery');
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
      // Start email discovery session
      const sessionResponse = await fetch('http://localhost:3001/api/email-discovery/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          domains: [formData.domain],
          formData: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            nickName: formData.nickName,
            middleName: formData.middleName,
            customName: formData.customName,
            useNickName: formData.useNickName,
            useCustomNames: formData.useCustomNames,
            usePersonalInfo: formData.useNickName, // Enable personal info if nickname is used
            useAdvancedEmails: formData.useAdvancedEmails,
            selectedCustomNames: formData.useCustomNames ? formData.selectedCustomNames : []
          },
          config: {
            maxEmailsPerDomain: 100,
            confidenceThreshold: 25,
            autoVerify: false,
            verificationLimit: 10
          }
        })
      });
      
      if (!sessionResponse.ok) {
        throw new Error(`Failed to start discovery session: ${sessionResponse.status}`);
      }
      
      const sessionData = await sessionResponse.json();
      const sessionId = sessionData.data.sessionId;
      setCurrentSessionId(sessionId);
      
      console.log('Discovery session started:', sessionData);
      
      // Process the domain
      const processResponse = await fetch(`http://localhost:3001/api/email-discovery/session/${sessionId}/domain/0/process`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (!processResponse.ok) {
        throw new Error(`Failed to process domain: ${processResponse.status}`);
      }
      
      const processData = await processResponse.json();
      console.log('Domain processed:', processData);
      
      // Get the discovered emails
      const emailsResponse = await fetch(`http://localhost:3001/api/email-discovery/session/${sessionId}/emails`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      
      if (!emailsResponse.ok) {
        throw new Error(`Failed to get session emails: ${emailsResponse.status}`);
      }
      
      const emailsData = await emailsResponse.json();
      const discoveredEmails = emailsData.data.emails;
      
      // Convert to the expected format
      const emailsWithConfidenceData: EmailWithConfidence[] = discoveredEmails.map((email: any) => ({
        email: email.email,
        confidence: email.confidence
      }));
      
      setEmailsWithConfidence(emailsWithConfidenceData);
      setEmails(emailsWithConfidenceData.map(item => item.email));
      setCurrentStep(4);
      
    } catch (error) {
      console.error('Error in email discovery:', error);
      // Fallback to old method if new backend fails
      await fallbackToOldMethod();
    } finally {
      setIsLoading(false);
    }
  }, [formData, webhookResponse, validateForm, triggerDomainWebhook, isAuthenticated, user]);

  // Fallback to old method if new backend fails
  const fallbackToOldMethod = async () => {
    try {
      console.log('Falling back to old method...');
      const formDataToSend = new FormData();
      
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('middleName', formData.middleName);
      formDataToSend.append('domain', formData.domain);
      formDataToSend.append('useNickName', formData.useNickName.toString());
      formDataToSend.append('useCustomNames', formData.useCustomNames.toString());
      formDataToSend.append('useAdvancedEmails', formData.useAdvancedEmails.toString());
      formDataToSend.append('usePersonalInfo', formData.useNickName.toString());
      
      if (formData.useNickName) {
        formDataToSend.append('nickName', formData.nickName);
      }
      
      if (formData.useCustomNames) {
        formDataToSend.append('selectedCustomNames', JSON.stringify(formData.selectedCustomNames));
      }
      
      if (webhookResponse) {
        formDataToSend.append('webhookResponse', JSON.stringify(webhookResponse));
      }
      
      const response = await fetch('http://localhost:3001/permute', {
        method: 'POST',
        body: formDataToSend,
      });
      
      const data = await response.json();
      
      if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && 'email' in data[0] && 'confidence' in data[0]) {
        setEmailsWithConfidence(data);
        setEmails(data.map((item: EmailWithConfidence) => item.email));
      } else {
        setEmails(data);
        setEmailsWithConfidence([]);
      }
      setCurrentStep(4);
    } catch (fallbackError) {
      console.error('Fallback method also failed:', fallbackError);
    }
  };

  // New function to process multiple domains
  const processMultipleDomains = useCallback(async () => {
    if (!formData.domainFile) return;
    
    // Check authentication
    if (!isAuthenticated || !user) {
      console.error('User must be authenticated to use email discovery');
      return;
    }
    
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
      
      // Start multi-domain discovery session
      const sessionResponse = await fetch('http://localhost:3001/api/email-discovery/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          domains: uniqueDomains,
          formData: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            nickName: formData.nickName,
            middleName: formData.middleName,
            customName: formData.customName,
            useNickName: formData.useNickName,
            useCustomNames: formData.useCustomNames,
            usePersonalInfo: formData.useNickName,
            useAdvancedEmails: formData.useAdvancedEmails,
            selectedCustomNames: formData.useCustomNames ? formData.selectedCustomNames : []
          },
          config: {
            maxEmailsPerDomain: 100,
            confidenceThreshold: 25,
            autoVerify: false,
            verificationLimit: 10
          }
        })
      });
      
      if (!sessionResponse.ok) {
        throw new Error(`Failed to start multi-domain discovery session: ${sessionResponse.status}`);
      }
      
      const sessionData = await sessionResponse.json();
      const sessionId = sessionData.data.sessionId;
      setCurrentSessionId(sessionId);
      
      console.log('Multi-domain discovery session started:', sessionData);
      
      // Process each domain sequentially
      const allEmails: string[] = [];
      const allEmailsWithConfidence: EmailWithConfidence[] = [];
      const domainResults: DomainProcessingResult[] = [];
      
      for (let i = 0; i < uniqueDomains.length; i++) {
        const domain = uniqueDomains[i];
        
        // Update progress
        setMultiDomainProgress(prev => prev ? {
          ...prev,
          currentDomain: domain,
          currentDomainIndex: i
        } : null);
        
        try {
          // Process domain
          const processResponse = await fetch(`http://localhost:3001/api/email-discovery/session/${sessionId}/domain/${i}/process`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          });
          
          if (!processResponse.ok) {
            throw new Error(`Failed to process domain ${domain}: ${processResponse.status}`);
          }
          
          const processData = await processResponse.json();
          console.log(`Domain ${domain} processed:`, processData);
          
          // Get emails for this domain
          const emailsResponse = await fetch(`http://localhost:3001/api/email-discovery/session/${sessionId}/emails?domain=${domain}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          });
          
          if (!emailsResponse.ok) {
            throw new Error(`Failed to get emails for domain ${domain}: ${emailsResponse.status}`);
          }
          
          const emailsData = await emailsResponse.json();
          const domainEmails = emailsData.data.emails;
          
          // Add to results
          domainResults.push({
            domain,
            emails: domainEmails.map((email: any) => ({
              email: email.email,
              confidence: email.confidence
            })),
            webhookResponse: null,
            status: 'completed',
            timestamp: new Date().toISOString()
          });
          
          // Add emails to collections
          domainEmails.forEach((email: any) => {
            allEmails.push(email.email);
            allEmailsWithConfidence.push({
              email: email.email,
              confidence: email.confidence
            });
          });
          
          // Update progress
          setMultiDomainProgress(prev => prev ? {
            ...prev,
            processedDomains: i + 1,
            results: domainResults
          } : null);
          
        } catch (domainError) {
          console.error(`Error processing domain ${domain}:`, domainError);
          
          domainResults.push({
            domain,
            emails: [],
            webhookResponse: null,
            status: 'error',
            error: domainError instanceof Error ? domainError.message : 'Unknown error',
            timestamp: new Date().toISOString()
          });
          
          // Update progress with error
          setMultiDomainProgress(prev => prev ? {
            ...prev,
            processedDomains: i + 1,
            results: domainResults
          } : null);
        }
      }
      
      // Set final results
      setEmails(allEmails);
      setEmailsWithConfidence(allEmailsWithConfidence);
      setMultiDomainProgress(prev => prev ? {
        ...prev,
        isProcessing: false,
        processedDomains: prev.totalDomains,
        results: domainResults
      } : null);
      
      setCurrentStep(4);
      
    } catch (error) {
      console.error('Error processing multiple domains:', error);
      setMultiDomainProgress(prev => prev ? {
        ...prev,
        isProcessing: false,
        results: prev.results.map(r => r.status === 'processing' ? { ...r, status: 'error', error: 'Processing failed' } : r)
      } : null);
      
      // Fallback to old method
      await fallbackMultiDomainMethod();
    } finally {
      setIsMultiDomainProcessing(false);
    }
  }, [formData, isAuthenticated, user]);

  // Fallback method for multi-domain processing
  const fallbackMultiDomainMethod = async () => {
    try {
      console.log('Falling back to old multi-domain method...');
      
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
    if (emails.length === 0 || emailsWithConfidence.length === 0) return;

    // Check authentication
    if (!isAuthenticated || !user) {
      console.error('User must be authenticated to use email verification');
      return;
    }

    setIsVerifying(true);
    setCurrentStep(5);
    
    try {
      // Get email IDs from the current session
      if (!currentSessionId) {
        throw new Error('No active discovery session for verification');
      }

      // Get session emails to get their IDs
      const emailsResponse = await fetch(`http://localhost:3001/api/email-discovery/session/${currentSessionId}/emails`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!emailsResponse.ok) {
        throw new Error(`Failed to get session emails: ${emailsResponse.status}`);
      }

      const emailsData = await emailsResponse.json();
      const sessionEmails = emailsData.data.emails;
      
      // Filter emails to verify based on count
      const emailsToVerify = count ? Math.min(count, emails.length) : emails.length;
      const emailsToVerifyList = emails.slice(0, emailsToVerify);
      
      // Find corresponding email IDs from session
      const emailIdsToVerify = sessionEmails
        .filter((sessionEmail: any) => emailsToVerifyList.includes(sessionEmail.email))
        .map((sessionEmail: any) => sessionEmail._id);

      if (emailIdsToVerify.length === 0) {
        throw new Error('No email IDs found for verification');
      }

      // Use bulk verification service
      const response = await fetch('http://localhost:3001/api/email-verification/bulk-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          emailIds: emailIdsToVerify,
          method: 'free' // Use free verification method
        }),
      });

      if (!response.ok) {
        throw new Error(`Bulk verification failed: ${response.status}`);
      }

      const data = await response.json();
      console.log('Bulk verification results:', data);

      // Update verification results
      const updatedEmailsWithVerification = [...emailsWithVerification];
      
      // Map verification results back to emails
      data.data.results.forEach((result: any) => {
        const emailIndex = updatedEmailsWithVerification.findIndex(e => e.email === result.email);
        if (emailIndex !== -1) {
          updatedEmailsWithVerification[emailIndex].verification = result.verification;
          updatedEmailsWithVerification[emailIndex].isVerifying = false;
        }
      });

      setEmailsWithVerification(updatedEmailsWithVerification);
      
      console.log('Verification completed successfully');
      
    } catch (error) {
      console.error('Error in bulk verification:', error);
      
      // Fallback to individual verification if bulk verification fails
      await fallbackVerification(count);
    } finally {
      setIsVerifying(false);
      setCurrentStep(4); // Go back to results step after verification
    }
  }, [emails, emailsWithConfidence, emailsWithVerification, isAuthenticated, user, currentSessionId]);

  // Fallback verification method
  const fallbackVerification = async (count?: number) => {
    try {
      console.log('Using fallback verification method...');
      
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
    } catch (error) {
      console.error('Fallback verification also failed:', error);
    }
  };

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