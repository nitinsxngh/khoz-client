// Security configuration and validation rules

export const SECURITY_CONFIG = {
  // Input validation rules
  INPUT_LIMITS: {
    DOMAIN_MAX_LENGTH: 253, // RFC 1035 domain length limit
    NAME_MAX_LENGTH: 50,
    CUSTOM_NAME_MAX_LENGTH: 20,
    FILE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
  },
  
  // Allowed file types
  ALLOWED_FILE_TYPES: ['text/plain'],
  
  // Allowed characters for different input types
  ALLOWED_CHARS: {
    DOMAIN: /^[a-zA-Z0-9.-]+$/,
    NAME: /^[a-zA-Z\s'-]+$/,
    CUSTOM_NAME: /^[a-zA-Z0-9-]+$/,
  },
  
  // Rate limiting
  RATE_LIMITS: {
    WEBHOOK_CALLS_PER_MINUTE: 10,
    FORM_SUBMISSIONS_PER_MINUTE: 20,
  },
  
  // API endpoints
  API_ENDPOINTS: {
    WEBHOOK_URL: 'https://sangam.xendrax.in/webhook/ab057f8f-7141-4a5e-8790-d759e45ac809',
    BACKEND_URL: 'http://localhost:3001/permute',
  },
  
  // Validation patterns
  PATTERNS: {
    EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    DOMAIN: /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  },
};

// Input sanitization functions
export const sanitizeInput = {
  domain: (value: string): string => {
    return value.replace(/[^a-zA-Z0-9.-]/g, '').substring(0, SECURITY_CONFIG.INPUT_LIMITS.DOMAIN_MAX_LENGTH);
  },
  
  name: (value: string): string => {
    return value.replace(/[<>]/g, '').substring(0, SECURITY_CONFIG.INPUT_LIMITS.NAME_MAX_LENGTH);
  },
  
  customName: (value: string): string => {
    return value.replace(/[^a-zA-Z0-9-]/g, '').substring(0, SECURITY_CONFIG.INPUT_LIMITS.CUSTOM_NAME_MAX_LENGTH).toLowerCase();
  },
  
  title: (value: string): string => {
    return value.replace(/[^a-zA-Z0-9\s-]/g, '');
  },
};

// Validation functions
export const validateInput = {
  domain: (value: string): boolean => {
    return SECURITY_CONFIG.PATTERNS.DOMAIN.test(value) && value.length <= SECURITY_CONFIG.INPUT_LIMITS.DOMAIN_MAX_LENGTH;
  },
  
  name: (value: string): boolean => {
    return value.length <= SECURITY_CONFIG.INPUT_LIMITS.NAME_MAX_LENGTH && !/[<>]/.test(value);
  },
  
  email: (value: string): boolean => {
    return SECURITY_CONFIG.PATTERNS.EMAIL.test(value);
  },
  
  file: (file: File): boolean => {
    return file.size <= SECURITY_CONFIG.INPUT_LIMITS.FILE_MAX_SIZE && 
           SECURITY_CONFIG.ALLOWED_FILE_TYPES.includes(file.type);
  },
  
  mode: (value: string): value is 'auto' => {
    return value === 'auto';
  },
};

// Security headers for API calls
export const getSecurityHeaders = () => ({
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
});

// Error messages
export const ERROR_MESSAGES = {
  INVALID_DOMAIN: 'Please enter a valid domain name',
  INVALID_NAME: 'Please enter a valid name (letters, spaces, hyphens, and apostrophes only)',
  INVALID_EMAIL: 'Please enter a valid email address',
  FILE_TOO_LARGE: 'File size must be less than 5MB',
  INVALID_FILE_TYPE: 'Only .txt files are allowed',
  INVALID_MODE: 'Invalid mode selected',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please wait a moment and try again.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
};

// Rate limiting utility
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  isAllowed(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    
    if (!this.requests.has(key)) {
      this.requests.set(key, [now]);
      return true;
    }
    
    const requests = this.requests.get(key)!;
    const recentRequests = requests.filter(time => time > windowStart);
    
    if (recentRequests.length >= limit) {
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    return true;
  }
  
  clear(): void {
    this.requests.clear();
  }
}

// Export rate limiter instance
export const rateLimiter = new RateLimiter(); 