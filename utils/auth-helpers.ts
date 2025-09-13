/**
 * Authentication helper utilities for account linking
 */

import { Account, User } from '@prisma/client';

export interface UserWithAccounts extends User {
  accounts: Account[];
}

/**
 * Check if a user already has a Google account linked
 */
export function hasGoogleAccountLinked(user: UserWithAccounts): boolean {
  return user.accounts.some(account => account.provider === 'google');
}

/**
 * Check if a specific Google account is already linked to the user
 */
export function isGoogleAccountAlreadyLinked(
  user: UserWithAccounts, 
  providerAccountId: string
): boolean {
  return user.accounts.some(
    account => account.provider === 'google' && account.providerAccountId === providerAccountId
  );
}

/**
 * Check if user has any authentication method linked
 */
export function hasAnyAuthMethodLinked(user: UserWithAccounts): boolean {
  return user.accounts.length > 0;
}

/**
 * Get all linked authentication providers for a user
 */
export function getLinkedProviders(user: UserWithAccounts): string[] {
  return user.accounts.map(account => account.provider);
}

/**
 * Check if user can safely unlink an authentication method
 * (ensures at least one method remains)
 */
export function canUnlinkAuthMethod(user: UserWithAccounts, providerToUnlink: string): boolean {
  const otherProviders = user.accounts.filter(account => account.provider !== providerToUnlink);
  return otherProviders.length > 0;
}

/**
 * Generate account linking error URL
 */
export function generateAccountLinkingErrorUrl(message: string): string {
  return `/auth/error?error=AccountLinking&message=${encodeURIComponent(message)}`;
}