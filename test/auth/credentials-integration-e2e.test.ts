/**
 * End-to-end integration test for credentials provider
 */

import { hashPassword } from '../../utils/password';
import { PrismaClient } from '@prisma/client';

// Mock the database
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  account: {
    create: jest.fn(),
  },
} as unknown as jest.Mocked<PrismaClient>;

jest.mock('../../db', () => mockPrisma);

describe('Credentials Provider End-to-End Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Credentials Authentication', () => {
    it('should allow credentials login for users with passwords', async () => {
      const testPassword = 'TestPassword123!';
      const hashedPassword = await hashPassword(testPassword);
      
      // User with password
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        image: null,
        password: hashedPassword,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      // Simulate credentials provider authorize function
      const credentials = {
        email: 'test@example.com',
        password: testPassword,
      };

      // Import the auth configuration
      const { authOptions } = require('../../pages/api/auth/[...nextauth]');
      const credentialsProvider = authOptions.providers.find(
        (provider: any) => provider.id === 'credentials'
      );

      // Test the authorize function
      const result = await credentialsProvider.options.authorize(credentials);

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        image: null,
      });
    });

    it('should handle signIn callback for credentials provider', async () => {
      const { authOptions } = require('../../pages/api/auth/[...nextauth]');
      
      // Test credentials provider in signIn callback
      const signInResult = await authOptions.callbacks.signIn({
        user: {
          id: 'user-123',
          email: 'test@example.com',
          name: 'Test User',
        },
        account: {
          provider: 'credentials',
          type: 'credentials',
        },
      });

      expect(signInResult).toBe(true);
    });
  });

  describe('Security Integration', () => {
    it('should reject credentials login for OAuth-only users', async () => {
      // User registered via Google OAuth only (no password)
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        image: null,
        password: null, // No password set
        accounts: [
          {
            provider: 'google',
            providerAccountId: 'google-123',
            type: 'oauth',
          },
        ],
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const { authOptions } = require('../../pages/api/auth/[...nextauth]');
      const credentialsProvider = authOptions.providers.find(
        (provider: any) => provider.id === 'credentials'
      );

      const credentials = {
        email: 'test@example.com',
        password: 'any-password',
      };

      const result = await credentialsProvider.options.authorize(credentials);

      // Should return null for OAuth-only users
      expect(result).toBeNull();
    });

    it('should normalize email case in credentials authentication', async () => {
      const testPassword = 'TestPassword123!';
      const hashedPassword = await hashPassword(testPassword);
      
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com', // Stored in lowercase
        name: 'Test User',
        image: null,
        password: hashedPassword,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      const { authOptions } = require('../../pages/api/auth/[...nextauth]');
      const credentialsProvider = authOptions.providers.find(
        (provider: any) => provider.id === 'credentials'
      );

      const credentials = {
        email: 'TEST@EXAMPLE.COM', // Uppercase input
        password: testPassword,
      };

      await credentialsProvider.options.authorize(credentials);

      // Should query with normalized lowercase email
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });
  });
});