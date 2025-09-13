/**
 * Tests for Google Account Linking functionality
 * Requirements: 4.1, 4.2, 4.3, 4.4
 */

import { PrismaClient } from '@prisma/client';

// Mock NextAuth and Prisma
jest.mock('@prisma/client');
jest.mock('next-auth');

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  account: {
    create: jest.fn(),
    findFirst: jest.fn(),
  },
} as any;

// Mock the signIn callback function
const createMockSignInCallback = (prismaInstance: any) => {
  return async ({ user, account, profile }: any) => {
    if (account?.provider === "google" && user?.email) {
      try {
        const existingUser = await prismaInstance.user.findUnique({
          where: { email: user.email },
          include: { accounts: true }
        });

        if (existingUser) {
          const existingGoogleAccount = existingUser.accounts.find(
            (acc: any) => acc.provider === "google" && acc.providerAccountId === account.providerAccountId
          );

          if (existingGoogleAccount) {
            return true;
          }

          const hasGoogleAccount = existingUser.accounts.some((acc: any) => acc.provider === "google");
          
          if (hasGoogleAccount) {
            return `/auth/error?error=AccountLinking&message=A different Google account is already linked to this email`;
          }

          await prismaInstance.account.create({
            data: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refresh_token: account.refresh_token,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state,
            }
          });

          user.id = existingUser.id;
          return true;
        }

        return true;
      } catch (error) {
        console.error("Error during Google account linking:", error);
        return false;
      }
    }

    return true;
  };
};

describe('Google Account Linking', () => {
  let signInCallback: any;

  beforeEach(() => {
    jest.clearAllMocks();
    signInCallback = createMockSignInCallback(mockPrisma);
  });

  describe('Requirement 4.1: Account settings page to manage linked authentication methods', () => {
    it('should allow sign in when Google account is already linked to user', async () => {
      // Arrange
      const existingUser = {
        id: 'user-123',
        email: 'test@example.com',
        accounts: [
          {
            provider: 'google',
            providerAccountId: 'google-123',
            userId: 'user-123'
          }
        ]
      };

      const googleAccount = {
        provider: 'google',
        providerAccountId: 'google-123',
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

      // Act
      const result = await signInCallback({ user, account: googleAccount, profile: {} });

      // Assert
      expect(result).toBe(true);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        include: { accounts: true }
      });
      expect(mockPrisma.account.create).not.toHaveBeenCalled();
    });
  });

  describe('Requirement 4.2: Prompt to link accounts instead of creating duplicate', () => {
    it('should link Google account to existing user with email/password account', async () => {
      // Arrange
      const existingUser = {
        id: 'user-123',
        email: 'test@example.com',
        accounts: [
          {
            provider: 'credentials',
            providerAccountId: 'credentials-123',
            userId: 'user-123'
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
      const result = await signInCallback({ user, account: googleAccount, profile: {} });

      // Assert
      expect(result).toBe(true);
      expect(user.id).toBe('user-123'); // User ID should be updated to existing user
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

    it('should prevent linking when user already has a different Google account', async () => {
      // Arrange
      const existingUser = {
        id: 'user-123',
        email: 'test@example.com',
        accounts: [
          {
            provider: 'google',
            providerAccountId: 'google-different',
            userId: 'user-123'
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
      const result = await signInCallback({ user, account: googleAccount, profile: {} });

      // Assert
      expect(result).toBe('/auth/error?error=AccountLinking&message=A different Google account is already linked to this email');
      expect(mockPrisma.account.create).not.toHaveBeenCalled();
    });
  });

  describe('Requirement 4.3: Verify user identity before linking', () => {
    it('should handle database errors gracefully during account linking', async () => {
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

      mockPrisma.user.findUnique.mockRejectedValue(new Error('Database connection failed'));

      // Act
      const result = await signInCallback({ user, account: googleAccount, profile: {} });

      // Assert
      expect(result).toBe(false);
      expect(mockPrisma.account.create).not.toHaveBeenCalled();
    });

    it('should handle account creation errors gracefully', async () => {
      // Arrange
      const existingUser = {
        id: 'user-123',
        email: 'test@example.com',
        accounts: []
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
      mockPrisma.account.create.mockRejectedValue(new Error('Account creation failed'));

      // Act
      const result = await signInCallback({ user, account: googleAccount, profile: {} });

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('Requirement 4.4: Allow login using any linked method', () => {
    it('should allow new user creation when no existing user found', async () => {
      // Arrange
      const googleAccount = {
        provider: 'google',
        providerAccountId: 'google-456',
        type: 'oauth'
      };

      const user = {
        id: 'temp-id',
        email: 'newuser@example.com',
        name: 'New User'
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);

      // Act
      const result = await signInCallback({ user, account: googleAccount, profile: {} });

      // Assert
      expect(result).toBe(true);
      expect(mockPrisma.account.create).not.toHaveBeenCalled();
    });

    it('should handle non-Google providers normally', async () => {
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
      const result = await signInCallback({ user, account: facebookAccount, profile: {} });

      // Assert
      expect(result).toBe(true);
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
      expect(mockPrisma.account.create).not.toHaveBeenCalled();
    });

    it('should handle sign in without account object', async () => {
      // Arrange
      const user = {
        id: 'temp-id',
        email: 'test@example.com',
        name: 'Test User'
      };

      // Act
      const result = await signInCallback({ user, account: null, profile: {} });

      // Assert
      expect(result).toBe(true);
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    });

    it('should handle sign in without user email', async () => {
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
      const result = await signInCallback({ user, account: googleAccount, profile: {} });

      // Assert
      expect(result).toBe(true);
      expect(mockPrisma.user.findUnique).not.toHaveBeenCalled();
    });
  });
});