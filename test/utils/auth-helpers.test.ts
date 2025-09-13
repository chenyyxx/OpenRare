/**
 * Tests for authentication helper utilities
 */

import {
  hasGoogleAccountLinked,
  isGoogleAccountAlreadyLinked,
  hasAnyAuthMethodLinked,
  getLinkedProviders,
  canUnlinkAuthMethod,
  generateAccountLinkingErrorUrl,
  UserWithAccounts
} from '../../utils/auth-helpers';

describe('Auth Helper Utilities', () => {
  const mockUser: UserWithAccounts = {
    id: 'user-123',
    name: 'Test User',
    email: 'test@example.com',
    image: null,
    backGroundImage: null,
    description: null,
    accounts: []
  };

  describe('hasGoogleAccountLinked', () => {
    it('should return true when user has Google account linked', () => {
      const userWithGoogle: UserWithAccounts = {
        ...mockUser,
        accounts: [
          {
            id: 'acc-1',
            userId: 'user-123',
            type: 'oauth',
            provider: 'google',
            providerAccountId: 'google-123',
            refresh_token: null,
            access_token: null,
            expires_at: null,
            token_type: null,
            scope: null,
            id_token: null,
            session_state: null,
          }
        ]
      };

      expect(hasGoogleAccountLinked(userWithGoogle)).toBe(true);
    });

    it('should return false when user has no Google account linked', () => {
      const userWithoutGoogle: UserWithAccounts = {
        ...mockUser,
        accounts: [
          {
            id: 'acc-1',
            userId: 'user-123',
            type: 'credentials',
            provider: 'credentials',
            providerAccountId: 'cred-123',
            refresh_token: null,
            access_token: null,
            expires_at: null,
            token_type: null,
            scope: null,
            id_token: null,
            session_state: null,
          }
        ]
      };

      expect(hasGoogleAccountLinked(userWithoutGoogle)).toBe(false);
    });

    it('should return false when user has no accounts', () => {
      expect(hasGoogleAccountLinked(mockUser)).toBe(false);
    });
  });

  describe('isGoogleAccountAlreadyLinked', () => {
    it('should return true when specific Google account is linked', () => {
      const userWithGoogle: UserWithAccounts = {
        ...mockUser,
        accounts: [
          {
            id: 'acc-1',
            userId: 'user-123',
            type: 'oauth',
            provider: 'google',
            providerAccountId: 'google-123',
            refresh_token: null,
            access_token: null,
            expires_at: null,
            token_type: null,
            scope: null,
            id_token: null,
            session_state: null,
          }
        ]
      };

      expect(isGoogleAccountAlreadyLinked(userWithGoogle, 'google-123')).toBe(true);
    });

    it('should return false when different Google account is linked', () => {
      const userWithGoogle: UserWithAccounts = {
        ...mockUser,
        accounts: [
          {
            id: 'acc-1',
            userId: 'user-123',
            type: 'oauth',
            provider: 'google',
            providerAccountId: 'google-different',
            refresh_token: null,
            access_token: null,
            expires_at: null,
            token_type: null,
            scope: null,
            id_token: null,
            session_state: null,
          }
        ]
      };

      expect(isGoogleAccountAlreadyLinked(userWithGoogle, 'google-123')).toBe(false);
    });
  });

  describe('hasAnyAuthMethodLinked', () => {
    it('should return true when user has any account linked', () => {
      const userWithAccount: UserWithAccounts = {
        ...mockUser,
        accounts: [
          {
            id: 'acc-1',
            userId: 'user-123',
            type: 'credentials',
            provider: 'credentials',
            providerAccountId: 'cred-123',
            refresh_token: null,
            access_token: null,
            expires_at: null,
            token_type: null,
            scope: null,
            id_token: null,
            session_state: null,
          }
        ]
      };

      expect(hasAnyAuthMethodLinked(userWithAccount)).toBe(true);
    });

    it('should return false when user has no accounts', () => {
      expect(hasAnyAuthMethodLinked(mockUser)).toBe(false);
    });
  });

  describe('getLinkedProviders', () => {
    it('should return array of linked provider names', () => {
      const userWithMultipleAccounts: UserWithAccounts = {
        ...mockUser,
        accounts: [
          {
            id: 'acc-1',
            userId: 'user-123',
            type: 'oauth',
            provider: 'google',
            providerAccountId: 'google-123',
            refresh_token: null,
            access_token: null,
            expires_at: null,
            token_type: null,
            scope: null,
            id_token: null,
            session_state: null,
          },
          {
            id: 'acc-2',
            userId: 'user-123',
            type: 'credentials',
            provider: 'credentials',
            providerAccountId: 'cred-123',
            refresh_token: null,
            access_token: null,
            expires_at: null,
            token_type: null,
            scope: null,
            id_token: null,
            session_state: null,
          }
        ]
      };

      const providers = getLinkedProviders(userWithMultipleAccounts);
      expect(providers).toEqual(['google', 'credentials']);
    });

    it('should return empty array when user has no accounts', () => {
      expect(getLinkedProviders(mockUser)).toEqual([]);
    });
  });

  describe('canUnlinkAuthMethod', () => {
    it('should return true when user has multiple auth methods', () => {
      const userWithMultipleAccounts: UserWithAccounts = {
        ...mockUser,
        accounts: [
          {
            id: 'acc-1',
            userId: 'user-123',
            type: 'oauth',
            provider: 'google',
            providerAccountId: 'google-123',
            refresh_token: null,
            access_token: null,
            expires_at: null,
            token_type: null,
            scope: null,
            id_token: null,
            session_state: null,
          },
          {
            id: 'acc-2',
            userId: 'user-123',
            type: 'credentials',
            provider: 'credentials',
            providerAccountId: 'cred-123',
            refresh_token: null,
            access_token: null,
            expires_at: null,
            token_type: null,
            scope: null,
            id_token: null,
            session_state: null,
          }
        ]
      };

      expect(canUnlinkAuthMethod(userWithMultipleAccounts, 'google')).toBe(true);
    });

    it('should return false when user has only one auth method', () => {
      const userWithSingleAccount: UserWithAccounts = {
        ...mockUser,
        accounts: [
          {
            id: 'acc-1',
            userId: 'user-123',
            type: 'oauth',
            provider: 'google',
            providerAccountId: 'google-123',
            refresh_token: null,
            access_token: null,
            expires_at: null,
            token_type: null,
            scope: null,
            id_token: null,
            session_state: null,
          }
        ]
      };

      expect(canUnlinkAuthMethod(userWithSingleAccount, 'google')).toBe(false);
    });
  });

  describe('generateAccountLinkingErrorUrl', () => {
    it('should generate proper error URL with encoded message', () => {
      const message = 'A different Google account is already linked to this email';
      const expectedUrl = `/auth/error?error=AccountLinking&message=${encodeURIComponent(message)}`;
      
      expect(generateAccountLinkingErrorUrl(message)).toBe(expectedUrl);
    });

    it('should handle special characters in message', () => {
      const message = 'Error with special chars: & = ?';
      const expectedUrl = `/auth/error?error=AccountLinking&message=${encodeURIComponent(message)}`;
      
      expect(generateAccountLinkingErrorUrl(message)).toBe(expectedUrl);
    });
  });
});