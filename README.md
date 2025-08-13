# KHOZ Email Discovery - Frontend

A modern, secure, and maintainable React/Next.js application for AI-powered email discovery with component-based architecture.

## 🏗️ Architecture Overview

The application follows a modular, component-based architecture with proper separation of concerns:

```
client/app/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Application header with step indicator
│   ├── ProgressSteps.tsx # Progress indicator component
│   ├── DomainInput.tsx # Domain input with file upload
│   ├── ModeToggle.tsx  # Removed - manual mode no longer supported
│   ├── PersonalInfoForm.tsx # Removed - manual mode no longer supported
│   ├── CustomNamesForm.tsx # Custom names management
│   ├── WebhookNotification.tsx # AI data notification
│   ├── SubmitButton.tsx # Dynamic submit button
│   ├── EmailResults.tsx # Email results display
│   └── EmailForm.tsx   # Main form container
├── hooks/              # Custom React hooks
│   └── useEmailForm.ts # Form logic and state management
├── config/             # Configuration files
│   └── security.ts     # Security rules and validation
├── types/              # TypeScript type definitions
│   └── index.ts        # Application types
└── page.tsx           # Main application page
```

## 🔒 Security Features

### Input Validation & Sanitization
- **Domain Validation**: RFC 1035 compliant domain validation
- **Name Sanitization**: Removes potentially dangerous characters
- **File Validation**: Type and size restrictions (5MB max, .txt only)
- **XSS Prevention**: Input sanitization and output encoding

### Rate Limiting
- **Webhook Calls**: 10 calls per minute
- **Form Submissions**: 20 submissions per minute
- **Client-side Protection**: Prevents rapid-fire requests

### API Security
- **Security Headers**: XSS protection, content type options
- **CORS Configuration**: Proper cross-origin request handling
- **Input Length Limits**: Prevents buffer overflow attacks

## 🧩 Component Structure

### Core Components

#### `Header.tsx`
- Displays application title and current step status
- Dynamic status updates based on workflow progress

#### `ProgressSteps.tsx`
- Visual progress indicator with 4 steps
- Step status: pending, active, completed
- Responsive design with proper accessibility

#### `DomainInput.tsx`
- Domain text input with validation
- File upload with security checks
- Real-time error feedback





#### `CustomNamesForm.tsx`
- Custom name addition/removal
- Quick-add predefined names
- Input validation and sanitization

#### `EmailResults.tsx`
- Email list display with copy functionality
- Email format validation
- Responsive grid layout

### Custom Hook: `useEmailForm.ts`

Centralized form logic with:
- State management for all form fields
- Validation logic
- API integration
- Error handling
- Progress tracking

## 🛡️ Security Configuration

### `security.ts`
Contains all security-related configurations:

```typescript
export const SECURITY_CONFIG = {
  INPUT_LIMITS: {
    DOMAIN_MAX_LENGTH: 253,
    NAME_MAX_LENGTH: 50,
    CUSTOM_NAME_MAX_LENGTH: 20,
    FILE_MAX_SIZE: 5 * 1024 * 1024,
  },
  ALLOWED_FILE_TYPES: ['text/plain'],
  RATE_LIMITS: {
    WEBHOOK_CALLS_PER_MINUTE: 10,
    FORM_SUBMISSIONS_PER_MINUTE: 20,
  },
  // ... more configurations
};
```

### Validation Functions
- `validateInput.domain()`: Domain format validation
- `validateInput.name()`: Name character validation
- `validateInput.email()`: Email format validation
- `validateInput.file()`: File type and size validation

### Sanitization Functions
- `sanitizeInput.domain()`: Domain character filtering
- `sanitizeInput.name()`: Name XSS prevention
- `sanitizeInput.customName()`: Custom name formatting

## 🎯 Key Features

### 1. Component Reusability
- Modular components with clear interfaces
- Props-based communication
- Consistent styling and behavior

### 2. Type Safety
- Comprehensive TypeScript interfaces
- Strict type checking
- IntelliSense support

### 3. Security First
- Input validation at multiple levels
- XSS prevention
- Rate limiting
- File upload security

### 4. User Experience
- Real-time validation feedback
- Progress indication
- Responsive design
- Accessibility features

### 5. Maintainability
- Clear separation of concerns
- Consistent code patterns
- Comprehensive documentation
- Easy testing structure

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
cd client
npm install
```

### Development
```bash
npm run dev
```

### Building
```bash
npm run build
```

## 🧪 Testing

The component-based architecture makes testing straightforward:

```typescript
// Example test for DomainInput component
import { render, screen } from '@testing-library/react';
import DomainInput from './components/DomainInput';

test('validates domain input', () => {
  render(<DomainInput domain="" onDomainChange={jest.fn()} />);
  // Test implementation
});
```

## 📝 Code Standards

### Component Guidelines
1. **Single Responsibility**: Each component has one clear purpose
2. **Props Interface**: All components have typed props
3. **Error Handling**: Proper error boundaries and validation
4. **Accessibility**: ARIA labels and keyboard navigation
5. **Performance**: Memoization where appropriate

### Security Guidelines
1. **Input Validation**: Always validate user input
2. **Output Encoding**: Prevent XSS attacks
3. **Rate Limiting**: Prevent abuse
4. **File Validation**: Check file types and sizes
5. **Error Messages**: Don't expose sensitive information

## 🔧 Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WEBHOOK_URL=https://sangam.xendrax.in/webhook/...
```

### Security Settings
Modify `config/security.ts` to adjust:
- Input length limits
- File size restrictions
- Rate limiting rules
- Validation patterns

## 📚 API Integration

### Webhook Integration
- Secure webhook calls with rate limiting
- Error handling and retry logic
- Response validation

### Backend Communication
- FormData-based file uploads
- JSON payload validation
- Error response handling

## 🎨 Styling

The application uses Tailwind CSS with:
- Consistent design system
- Responsive breakpoints
- Dark theme support
- Custom scrollbars
- Smooth animations

## 🔄 State Management

State is managed through:
- React hooks for local state
- Custom hooks for complex logic
- Props for component communication
- Context for global state (if needed)

## 🚨 Error Handling

Comprehensive error handling includes:
- Network error recovery
- Validation error display
- User-friendly error messages
- Error boundary implementation

## 📈 Performance

Performance optimizations:
- Component memoization
- Lazy loading where appropriate
- Efficient re-renders
- Optimized bundle size

## 🔐 Security Checklist

- [x] Input validation and sanitization
- [x] XSS prevention
- [x] CSRF protection
- [x] Rate limiting
- [x] File upload security
- [x] Secure headers
- [x] Error message sanitization
- [x] Type safety
- [x] Access control

## 🤝 Contributing

1. Follow the component-based architecture
2. Add proper TypeScript types
3. Include security validation
4. Write tests for new components
5. Update documentation

## 📄 License

This project is licensed under the MIT License.
