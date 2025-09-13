/**
 * Password-related type definitions
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

export interface PasswordRequirements {
  readonly minLength: number;
  readonly requireUppercase: boolean;
  readonly requireLowercase: boolean;
  readonly requireNumbers: boolean;
  readonly requireSymbols: boolean;
}

export type PasswordStrength = 'weak' | 'medium' | 'strong';