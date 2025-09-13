# Implementation Plan

- [x] 1. Implement account linking for Google authentication

  - Add account linking detection when Google email matches existing user
  - Create account linking logic in NextAuth callbacks
  - Handle Google account linking to existing user profiles
  - Write tests for Google account linking scenarios
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 2. Set up password hashing utilities and validation






  - Create password hashing utility functions using bcrypt
  - Implement password validation with strength requirements
  - Add password field to user model or separate credentials table
  - Write unit tests for password utilities
  - _Requirements: 5.1_

- [ ] 3. Implement password reset functionality for existing users

  - Create password reset request API endpoint
  - Implement password reset token generation and validation
  - Create password reset confirmation API endpoint
  - Add email sending for password reset links
  - Allow existing Google users to set passwords for account recovery
  - Write tests for password reset flow
  - _Requirements: 2.5, 2.6, 4.5_

- [ ] 4. Create user registration API endpoint

  - Implement `/api/auth/register` endpoint for email/password registration
  - Add email format validation and duplicate email checking
  - Integrate password hashing for new user accounts
  - Handle account linking when email matches existing Google user
  - Write tests for registration endpoint
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 4.2_

- [ ] 5. Configure NextAuth credentials provider

  - Add CredentialsProvider to NextAuth configuration
  - Implement user authentication logic for email/password
  - Add password verification against hashed passwords
  - Integrate with existing Google authentication and account linking
  - Test credentials provider authentication
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 6. Update sign-in page UI with enhanced features

  - Add email/password form fields to existing sign-in page
  - Add "Forgot Password" link and functionality
  - Add "Create Account" link for new email registrations
  - Update form handling for multiple authentication methods
  - Write component tests for updated sign-in form
  - _Requirements: 2.1, 2.5_

- [ ] 7. Create registration page UI

  - Build registration form component with email/password fields
  - Add password strength indicator and validation feedback
  - Implement form submission and error handling
  - Add account linking notification when email matches existing Google user
  - Add navigation links to sign-in page
  - Write component tests for registration form
  - _Requirements: 1.1, 1.3, 1.4, 4.2_

- [ ] 8. Implement password reset UI flow

  - Create password reset request page
  - Build password reset confirmation page
  - Allow existing Google users to set passwords through reset flow
  - Implement proper navigation and user feedback
  - Write component tests for password reset flow
  - _Requirements: 2.5, 2.6_

- [ ] 9. Create account management interface

  - Build account settings page for managing linked authentication methods
  - Add interface to link/unlink authentication providers (Google, Email)
  - Show current authentication methods and allow password setting for Google users
  - Implement user identity verification for account changes
  - Write component tests for account management
  - _Requirements: 4.1, 4.5_

- [ ] 10. Add comprehensive error handling

  - Implement proper error messages for all authentication scenarios
  - Add user-friendly error pages for authentication failures
  - Create error recovery flows and user guidance
  - Add loading states and user feedback during authentication
  - Write tests for error handling scenarios
  - _Requirements: 2.3, 2.4, 4.3_

- [ ] 11. Integrate and test complete authentication system
  - Test Google authentication with account linking
  - Verify all authentication methods work together seamlessly
  - Test account linking works across providers (Google, Email)
  - Perform end-to-end testing of complete user flows including password reset
  - Write integration tests for multi-provider authentication with account linking
  - _Requirements: 1.1-1.5, 2.1-2.6, 4.1-4.5_
