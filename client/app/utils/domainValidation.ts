// Domain validation utilities
export interface DomainValidationResult {
  isValid: boolean;
  exists: boolean;
  error?: string;
  domain: string;
}

// Domain format validation
export const validateDomainFormat = (domain: string): boolean => {
  if (!domain || domain.trim().length === 0) {
    return false;
  }

  // Remove www. for validation
  const cleanDomain = domain.replace(/^www\./, '');
  
  // Basic domain regex pattern
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  
  return domainRegex.test(cleanDomain);
};

// Check if domain exists via DNS lookup
export const checkDomainExists = async (domain: string): Promise<boolean> => {
  try {
    // Remove www. for DNS check
    const cleanDomain = domain.replace(/^www\./, '');
    
    // Use a simple DNS check via fetch to a known endpoint
    // This is a lightweight way to check if the domain resolves
    const response = await fetch(`https://dns.google/resolve?name=${cleanDomain}&type=A`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    
    // Check if DNS resolution was successful
    return data.Status === 0 && data.Answer && data.Answer.length > 0;
  } catch (error) {
    console.error('Domain existence check failed:', error);
    return false;
  }
};

// Comprehensive domain validation
export const validateDomain = async (domain: string): Promise<DomainValidationResult> => {
  const cleanDomain = domain.trim();
  
  // Step 1: Format validation
  if (!validateDomainFormat(cleanDomain)) {
    return {
      isValid: false,
      exists: false,
      error: 'Invalid domain format. Please enter a valid domain (e.g., example.com)',
      domain: cleanDomain
    };
  }

  // Step 2: Existence validation
  const exists = await checkDomainExists(cleanDomain);
  
  if (!exists) {
    return {
      isValid: true,
      exists: false,
      error: 'Domain does not exist or is not accessible. Please check the domain name.',
      domain: cleanDomain
    };
  }

  return {
    isValid: true,
    exists: true,
    domain: cleanDomain
  };
};

// Real-time validation for input fields
export const validateDomainRealTime = (domain: string): { isValid: boolean; error?: string } => {
  if (!domain || domain.trim().length === 0) {
    return { isValid: false, error: 'Domain is required' };
  }

  // Clean the domain input first
  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  
  if (!validateDomainFormat(cleanDomain)) {
    return { isValid: false, error: 'Invalid domain format' };
  }

  return { isValid: true };
}; 