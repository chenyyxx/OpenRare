/**
 * Integration tests for Google Account Linking
 * Tests the complete flow of account linking with real NextAuth configuration
 */

// Mock the prisma import first
jest.mock('../../db', () => ({
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  account: {
    create: jest.fn(),
  },
}));

import { authOptions } from '../../pages/api/auth/[...nextauth]';
import prisma from '../../db';

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('Account Linking Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('NextAuth Configuration', () => {
    it('should have Google provider configured', () => {
      expect(authOptions.providers).toBeDefined();
      expect(authOptions.providers.length).toBeGreaterThan(0);
      
      const googleProvider = authOptions.providers.find(
        (provider: any) => provider.id === 'google'
      );
      expect(googleProvider).toBeDefined();
    });

    it('should have signIn callback configured', () => {
      expect(authOptions.callbacks).toBeDefined();
      expect(authOptions.callbacks?.signIn).toBeDefined();
      expect(typeof authOptions.callbacks?.signIn).toBe('function');
    });

    it('should have error page configured', () => {
      expect(authOptions.pages).toBeDefined();
      expect(authOptions.pages?.error).toBe('/auth/error');
    });
  });

  describe('Account Linking Flow', () => {
    it('should successfully link Google account to existing user', async () => {
      // Arrange
      const existingUser = {
        id: 'user-123',
        email: 'test@example.com',
        accounts: [
          {
            provider: 'credentials',
            providerAccountId: 'cred-123',
          }
        ]
      };

      const googleAccount = {
        provider: 'google',
        providerAccountId: 'google-456',
        type: 'oauth',
        access_token: 'access-token',
        refresh_token: 'refresh-token',
        expires_at: 1234567890,
        token_type: 'Bearer',
        scope: 'openid email profile',
        id_token: 'id-token',
        session_state: 'session-state'
      };

      const user = {
        id: 'temp-id',
        email: 'test@example.com',
        name: 'Test User'
      };

      mockPrisma.user.findUnique.mockResolvedValue(existingUser);
      mockPrisma.account.create.mockResolvedValue({});

      // Act
      const signInCallback = authOptions.callbacks?.signIn;
      const result = await signInCallback?.({ 
        user, 
        account: googleAccount, 
        profile: {},
        email: { verificationRequest: false },
        credentials: undefined
      });

      // Assert
      expect(result).toBe(true);
      expect(user.id).toBe('user-123');
      expect(mockPrisma.account.create).toHaveBeenCalledWith({
        data: {
          userId: 'user-123',
          type: 'oauth',
          provider: 'google',
          providerAccountId: 'google-456',
          refresh_token: 'refresh-token',
          access_token: 'access-token',
          expires_at: 1234567890,
          token_type: 'Bearer',
          scope: 'openid email profile',
          id_token: 'id-token',
          session_state: 'session-state',
        }
      });
    });

    it('should prevent duplicate Google account linking', async () => {
      // Arrange
      const existingUser = {
        id: 'user-123',
        email: 'test@example.com',
        accounts: [
          {
            provider: 'google',
            providerAccountId: 'google-different',
          }
        ]
      };

      const googleAccount = {
        provider: 'google',
        providerAccountId: 'google-456',
        type: 'oauth'
      };

      const user = {
        id: 'temp-id',
        email: 'test@example.com',
        name: 'Test User'
      };

      mockPrisma.user.findUnique.mockResolvedValue(existingUser);

      // Act
      const signInCallback = authOptions.callbacks?.signIn;
      const result = await signInCallback?.({ 
        user, 
        account: googleAccount, 
        profile: {},
        email: { verificationRequest: false },
        credentials: undefined
      });

      // Assert
      expect(result).toBe('/auth/error?error=AccountLinking&message=A%20different%20Google%20account%20is%20already%20linked%20to%20this%20email');
      expect(mockPrisma.account.create).not.toHaveBeenCalled();
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const googleAccount = {
        provider: 'google',
        providerAccountId: 'google-456',
        type: 'oauth'
      };

      const user = {
        id: 'temp-id',
        email: 'test@example.com',
        name: 'Test User'
      };

      mockPrisma.user.findUnique.mockRejectedValue(new Error('Database error'));

      // Act
      const signInCallback = authOptions.callbacks?.signIn;
      const result = await signInCallback?.({ 
        user, 
        account: googleAccount, 
        profile: {},
        email: { verificationRequest: false },
        credentials: undefined
      });

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle missing user email', async () => {
      // Arrange
      const googleAccount = {
        provider: 'google',
        providerAccountId: 'google-456',
        type: 'oauth'
      };

      const user = {
        id: 'temp-id',
        name: 'Test User'
        // No email
      };

      // Act
      const signInCallback = authOptions.callbacks?.signIn;
      const result = await signInCallback?.({ 
        user, 
        account: googleAccount, 
        profile: {},
        email: { verificationRequest: false },
        credentials: undefined
      });

      // Assert
      expect(result).toBe(true);
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    });

    it('should handle non-Google providers', async () => {
      // Arrange
      const facebookAccount = {
        provider: 'facebook',
        providerAccountId: 'facebook-456',
        type: 'oauth'
      };

      const user = {
        id: 'temp-id',
        email: 'test@example.com',
        name: 'Test User'
      };

      // Act
      const signInCallback = authOptions.callbacks?.signIn;
      const result = await signInCallback?.({ 
        user, 
        account: facebookAccount, 
        profile: {},
        email: { verificationRequest: false },
        credentials: undefined
      });

      // Assert
      expect(result).toBe(true);
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    });
  });
});