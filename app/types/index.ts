// Type definitions for the application

export interface FormData {
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

// New types for multi-domain processing
export interface DomainProcessingResult {
  domain: string;
  emails: EmailWithConfidence[];
  webhookResponse: WebhookResponse | null;
  status: 'pending' | 'processing' | 'completed' | 'error';
  error?: string;
  timestamp: string;
}

export interface MultiDomainProgress {
  totalDomains: number;
  processedDomains: number;
  currentDomain: string;
  currentDomainIndex: number;
  isProcessing: boolean;
  results: DomainProcessingResult[];
}

export interface EmailVerificationResult {
  email: string;
  reachable: 'unknown' | 'yes' | 'no';
  syntax: {
    username: string;
    domain: string;
    valid: boolean;
  };
  smtp: {
    host_exists: boolean;
    full_inbox: boolean;
    catch_all: boolean;
    deliverable: boolean;
    disabled: boolean;
  };
  gravatar: string | null;
  suggestion: string;
  disposable: boolean;
  role_account: boolean;
  free: boolean;
  has_mx_records: boolean;
  verificationMethod?: 'free' | 'neverbounce' | 'error';
  cost?: number;
  neverbounceResult?: any;
}

export interface EmailWithConfidence {
  email: string;
  confidence: number;
}

export interface EmailWithVerification {
  email: string;
  confidence?: number;
  verification?: EmailVerificationResult;
  isVerifying: boolean;
  verificationError?: string;
}

export interface WebhookResponse {
  output?: string;
  error?: string;
  details?: any;
  [key: string]: any;
}

export interface WebhookData {
  domain: string;
  hasDomainFile: boolean;
  timestamp: string;
  message: string;
}

export interface ApiResponse {
  success: boolean;
  data?: string[];
  error?: string;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface Step {
  step: number;
  title: string;
  status: 'pending' | 'active' | 'completed';
}

export interface ComponentProps {
  // Common props for components
  className?: string;
  children?: React.ReactNode;
}

export interface FormComponentProps extends ComponentProps {
  // Props for form components
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
}

export interface InputProps extends FormComponentProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

export interface FileInputProps extends FormComponentProps {
  file: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
  maxSize?: number;
}

export interface ButtonProps extends ComponentProps {
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export interface CheckboxProps extends FormComponentProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

export interface SelectProps extends FormComponentProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}

export interface ModalProps extends ComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export interface ToastProps extends ComponentProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

export interface LoadingProps extends ComponentProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error }>;
}

// Event types
export interface FormEvent {
  preventDefault: () => void;
  target: {
    name: string;
    value: string | boolean;
    type: string;
    checked?: boolean;
  };
}

export interface ChangeEvent {
  target: {
    name: string;
    value: string | boolean;
    type: string;
    checked?: boolean;
    files?: FileList | null;
  };
}

export interface KeyboardEvent {
  key: string;
  preventDefault: () => void;
  target: {
    value: string;
  };
}

export interface MouseEvent {
  preventDefault: () => void;
  target: HTMLElement;
}

// API types
export interface ApiRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: any;
  headers?: Record<string, string>;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

// Utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type Nullable<T> = T | null;

export type AsyncFunction<T = any> = (...args: any[]) => Promise<T>;

export type EventHandler<T = any> = (event: T) => void;

// Component prop types
export type ComponentType<P = {}> = React.ComponentType<P>;

export type ReactNode = React.ReactNode;

export type ReactElement = React.ReactElement;

// Hook types
export type UseState<T> = [T, React.Dispatch<React.SetStateAction<T>>];

export type UseEffect = React.EffectCallback;

export type UseCallback<T extends (...args: any[]) => any> = T;

export type UseMemo<T> = T;

export type UseRef<T> = React.MutableRefObject<T> | React.RefObject<T>;

// Form validation types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message?: string;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export interface ValidationErrors {
  [key: string]: string[];
}

// Security types
export interface SecurityConfig {
  inputLimits: {
    domainMaxLength: number;
    nameMaxLength: number;
    customNameMaxLength: number;
    fileMaxSize: number;
  };
  allowedFileTypes: string[];
  rateLimits: {
    webhookCallsPerMinute: number;
    formSubmissionsPerMinute: number;
  };
}

export interface RateLimitInfo {
  key: string;
  limit: number;
  windowMs: number;
  current: number;
  remaining: number;
  resetTime: number;
} 