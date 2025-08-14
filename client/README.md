# Khozai - Email Discovery & Verification Platform

A modern web application for discovering and verifying email addresses using AI-powered tools.

## Features

### Core Functionality
- **AI Email Discovery**: Automatically discover email addresses from domains
- **Email Verification**: Verify email addresses for validity and deliverability
- **Multi-Domain Processing**: Handle multiple domains simultaneously
- **Advanced Email Generation**: Create custom email patterns and variations
- **Webhook Integration**: Real-time notifications and data processing

### Authentication System
- **User Registration**: Create new accounts with email verification
- **Secure Login**: Email and password authentication
- **Password Reset**: Forgot password functionality with email recovery
- **Social Login**: Google and Facebook authentication options
- **User Profiles**: Manage account settings and preferences
- **Session Management**: Secure token-based authentication

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4 with custom glassmorphism effects
- **Authentication**: Custom React Context with localStorage persistence
- **State Management**: React Hooks and Context API
- **Routing**: Next.js App Router with dynamic routing

## Project Structure

```
client/
├── app/
│   ├── auth/                    # Authentication pages
│   │   ├── login/              # Sign in page
│   │   ├── register/           # Sign up page
│   │   ├── forgot-password/    # Password reset page
│   │   └── layout.tsx          # Auth layout wrapper
│   ├── components/              # Reusable components
│   │   ├── Header.tsx          # Main navigation header
│   │   ├── UserProfile.tsx     # User profile dropdown
│   │   ├── ProtectedRoute.tsx  # Route protection component
│   │   └── ...                 # Other components
│   ├── contexts/                # React contexts
│   │   └── AuthContext.tsx     # Authentication state management
│   ├── hooks/                   # Custom React hooks
│   ├── types/                   # TypeScript type definitions
│   ├── utils/                   # Utility functions
│   ├── globals.css              # Global styles and Tailwind config
│   ├── layout.tsx               # Root layout with AuthProvider
│   └── page.tsx                 # Main application page
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## Authentication Flow

### 1. User Registration
- Users fill out registration form with personal information
- Form validation ensures data integrity
- Account creation with secure password handling
- Redirect to login with success message

### 2. User Login
- Email and password authentication
- Remember me functionality
- Social login options (Google, Facebook)
- Redirect to main application after successful login

### 3. Password Recovery
- Email-based password reset
- Secure token generation and validation
- User-friendly success/error messaging

### 4. Session Management
- JWT token storage in localStorage
- Automatic authentication state checking
- Protected route handling
- Secure logout functionality

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Khozai/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality

## Authentication Pages

### Login Page (`/auth/login`)
- Clean, modern design with glassmorphism effects
- Email and password input fields
- Password visibility toggle
- Remember me checkbox
- Forgot password link
- Social login options
- Link to registration page

### Registration Page (`/auth/register`)
- Comprehensive user registration form
- First name, last name, email, phone fields
- Password and confirmation fields
- Terms and conditions agreement
- Form validation with error messaging
- Social registration options
- Link to login page

### Forgot Password Page (`/auth/forgot-password`)
- Simple email input form
- Password reset email functionality
- Success state with resend options
- Back to login navigation

## Design System

### Visual Elements
- **Color Scheme**: Dark theme with purple/blue gradients
- **Typography**: Inter font family for modern readability
- **Glassmorphism**: Translucent backgrounds with backdrop blur
- **Animations**: Smooth transitions and hover effects
- **Icons**: Heroicons for consistent iconography

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Adaptive component sizing
- Touch-friendly interactions

### Accessibility
- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- Focus management
- Color contrast compliance

## Security Features

### Authentication Security
- Secure password handling
- JWT token management
- Protected route implementation
- Session timeout handling
- CSRF protection considerations

### Data Protection
- Input validation and sanitization
- XSS prevention
- Secure storage practices
- HTTPS enforcement

## Future Enhancements

### Planned Features
- **Two-Factor Authentication**: SMS or app-based 2FA
- **Email Verification**: Account activation via email
- **OAuth Integration**: Additional social login providers
- **Role-Based Access**: User permissions and roles
- **Audit Logging**: User activity tracking
- **API Rate Limiting**: Request throttling and protection

### Technical Improvements
- **Server-Side Rendering**: Improved SEO and performance
- **Progressive Web App**: Offline functionality and app-like experience
- **Internationalization**: Multi-language support
- **Advanced Analytics**: User behavior tracking
- **Performance Optimization**: Code splitting and lazy loading

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation and FAQ

---

**Built with ❤️ using Next.js, React, and Tailwind CSS**
