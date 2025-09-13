# Design Document

## Overview

This design expands the OpenRare platform's authentication system from Google-only OAuth to support multiple authentication methods: email/password registration, Facebook OAuth, and account linking capabilities. The solution leverages the existing NextAuth.js infrastructure with Prisma adapter and PostgreSQL database, ensuring seamless integration with the current system.

The design maintains backward compatibility with existing Google authentication while adding new providers and credential-based authentication. It implements secure password handling, email verification, and account linking functionality to provide users with flexible authentication options.

## Architecture

### Current Architecture
- **NextAuth.js v4.24.11** with Prisma adapter
- **PostgreSQL database** via AWS RDS
- **Existing models**: User, Account, Session, VerificationToken
- **Single provider**: Google OAuth only

### Enhanced Architecture
- **Extended NextAuth configuration** with multiple providers
- **Credentials provider** for email/password authentication
- **Facebook OAuth provider** integration
- **Email verification system** using NextAuth's built-in verification
- **Account linking logic** to prevent duplicate accounts
- **Enhanced security measures** including rate limiting and password hashing

## Components and Interfaces

### 1. Authentication Providers

#### Email/Password Provider (Credentials)
```typescript
CredentialsProvider({
  id: "credentials",
  name: "Email and Password",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" }
  },
  async authorize(credentials) {
    // Validate credentials and return user object
  }
})
```

#### Facebook OAuth Provider
```typescript
FacebookProvider({
  clientId: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  authorization: {
    params: {
      scope: "email"
    }
  }
})
```

### 2. Database Schema Extensions

The existing Prisma schema already supports multiple authentication methods through the Account model. No schema changes are required as the current structure handles:
- Multiple accounts per user (Account model with provider field)
- Email verification (VerificationToken model)
- Session management (Session model)

### 3. API Endpoints

#### Registration API (`/api/auth/register`)
```typescript
// POST /api/auth/register
interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  requiresVerification?: boolean;
}
```

#### Password Reset API (`/api/auth/reset-password`)
```typescript
// POST /api/auth/reset-password
interface ResetPasswordRequest {
  email: string;
}

// POST /api/auth/reset-password/confirm
interface ResetPasswordConfirmRequest {
  token: string;
  password: string;
}
```

#### Account Linking API (`/api/auth/link-account`)
```typescript
// POST /api/auth/link-account
interface LinkAccountRequest {
  provider: string;
  providerAccountId: string;
}
```

### 4. UI Components

#### Enhanced Sign-in Page
- Email/password form fields
- Facebook login button
- Google login button (existing)
- "Forgot Password" link
- "Create Account" link

#### Registration Page
- Email/password registration form
- Password strength indicator
- Terms of service acceptance
- Email verification notice

#### Password Reset Flow
- Email input form
- Reset confirmation page
- New password form

## Data Models

### User Model (No changes required)
The existing User model already supports multiple authentication methods:
```prisma
model User {
  id              String       @id @default(cuid())
  name            String?
  email           String       @unique
  emailVerified   DateTime?
  image           String?
  // ... other fields
  accounts        Account[]    // Supports multiple auth providers
  sessions        Session[]
}
```

### Account Model (No changes required)
Existing model handles multiple providers:
```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String  // "google", "facebook", "credentials"
  providerAccountId String
  // ... other OAuth fields
}
```

### Password Storage
For credentials provider, passwords will be hashed using bcrypt and stored in a new field or handled through NextAuth's built-in mechanisms.

## Error Handling

### Authentication Errors
- **Invalid credentials**: Generic error message to prevent user enumeration
- **Unverified email**: Specific message with resend verification option
- **Account already exists**: Prompt for account linking or sign-in
- **Rate limiting**: Temporary lockout with clear messaging

### Registration Errors
- **Email already in use**: Clear error with sign-in option
- **Weak password**: Real-time validation with requirements
- **Invalid email format**: Client-side and server-side validation
- **Network errors**: Retry mechanisms with user feedback

### OAuth Errors
- **Authorization denied**: Redirect to sign-in with explanation
- **Provider unavailable**: Fallback to other authentication methods
- **Token refresh failures**: Automatic re-authentication flow

## Testing Strategy

### Unit Tests
- **Password hashing and validation**: Test bcrypt implementation
- **Email validation**: Test format and domain validation
- **Rate limiting logic**: Test lockout and reset mechanisms
- **Account linking logic**: Test duplicate prevention and merging

### Integration Tests
- **Registration flow**: End-to-end user registration with email verification
- **Login flows**: Test all three authentication methods
- **Password reset flow**: Complete reset process testing
- **Account linking**: Test linking Facebook/Google to existing accounts

### Security Tests
- **Brute force protection**: Test rate limiting effectiveness
- **SQL injection**: Test input sanitization
- **Session security**: Test session timeout and invalidation
- **Password strength**: Test enforcement of password requirements

### User Experience Tests
- **Cross-browser compatibility**: Test on major browsers
- **Mobile responsiveness**: Test authentication flows on mobile devices
- **Error message clarity**: Test user understanding of error states
- **Loading states**: Test user feedback during authentication processes

## Security Considerations

### Password Security
- **Bcrypt hashing**: Minimum 12 rounds for password hashing
- **Password requirements**: Minimum 8 characters, mixed case, numbers, symbols
- **Password reset tokens**: Time-limited, single-use tokens
- **Secure token generation**: Cryptographically secure random tokens

### Rate Limiting
- **Login attempts**: Maximum 5 attempts per email per 15 minutes
- **Registration attempts**: Maximum 3 attempts per IP per hour
- **Password reset**: Maximum 3 requests per email per hour
- **Account linking**: Maximum 5 attempts per session

### Session Management
- **Secure cookies**: HttpOnly, Secure, SameSite attributes
- **Session timeout**: 24-hour idle timeout, 7-day absolute timeout
- **Token rotation**: Refresh tokens rotated on each use
- **Logout cleanup**: Complete session and token invalidation

### Data Protection
- **Email verification**: Required for account activation
- **PII handling**: Minimal data collection, secure storage
- **Audit logging**: Authentication events logged for security monitoring
- **GDPR compliance**: User data deletion and export capabilities