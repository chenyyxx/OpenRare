import bcrypt from 'bcrypt';
import type { PasswordValidationResult, PasswordRequirements } from '../types/password';

/**
 * Password utility functions for secure password handling
 */

// Configuration constants
const SALT_ROUNDS = 12; // Minimum 12 rounds as per security requirements

// Password validation requirements
export const PASSWORD_REQUIREMENTS: PasswordRequirements = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSymbols: true,
} as const;

/**
 * Hash a plain text password using bcrypt
 * @param password - Plain text password to hash
 * @returns Promise<string> - Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    throw new Error('Failed to hash password');
  }
}

/**
 * Verify a plain text password against a hashed password
 * @param password - Plain text password to verify
 * @param hashedPassword - Hashed password to compare against
 * @returns Promise<boolean> - True if password matches, false otherwise
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  if (!password || !hashedPassword) {
    return false;
  }
  
  try {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
  } catch (error) {
    return false;
  }
}

/**
 * Validate password strength and requirements
 * @param password - Password to validate
 * @returns PasswordValidationResult - Validation result with errors and strength
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      errors: ['Password is required'],
      strength: 'weak'
    };
  }
  
  // Check minimum length
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`);
  }
  
  // Check for uppercase letters
  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  // Check for lowercase letters
  if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  // Check for numbers
  if (PASSWORD_REQUIREMENTS.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  // Check for symbols
  if (PASSWORD_REQUIREMENTS.requireSymbols && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  // Determine password strength
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  
  if (errors.length === 0) {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    const isLongEnough = password.length >= 12;
    
    const criteriaCount = [hasUppercase, hasLowercase, hasNumbers, hasSymbols, isLongEnough].filter(Boolean).length;
    
    if (criteriaCount >= 5) {
      strength = 'strong';
    } else if (criteriaCount >= 4) {
      strength = 'medium';
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    strength
  };
}

/**
 * Generate a secure random password
 * @param length - Length of the password to generate (default: 16)
 * @returns string - Generated password
 */
export function generateSecurePassword(length: number = 16): string {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = uppercase + lowercase + numbers + symbols;
  
  let password = '';
  
  // Ensure at least one character from each required category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password to avoid predictable patterns
  return password.split('').sort(() => Math.random() - 0.5).join('');
}