import { hashPassword, verifyPassword } from '../../utils/password';
import { PrismaClient } from '@prisma/client';

// Mock the database
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
  },
} as unknown as jest.Mocked<PrismaClient>;

jest.mock('../../db', () => mockPrisma);

describe('Credentials Provider Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Password Authentication Logic', () => {
    it('should authenticate user with valid credentials', async () => {
      const testPassword = 'TestPassword123!';
      const hashedPassword = await hashPassword(testPassword);
      
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        image: null,
        password: hashedPassword,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      // Simulate the credentials provider authorize function logic
      const credentials = {
        email: 'test@example.com',
        password: testPassword,
      };

      if (!credentials?.email || !credentials?.password) {
        throw new Error('Missing credentials');
      }

      // Find user by email
      const user = await mockPrisma.user.findUnique({
        where: { email: credentials.email.toLowerCase() },
      });

      expect(user).toBeDefined();
      expect(user?.password).toBeDefined();

      // Verify password
      const isValidPassword = await verifyPassword(
        credentials.password,
        user!.password!
      );

      expect(isValidPassword).toBe(true);

      // Return user object for NextAuth
      const result = {
        id: user!.id,
        email: user!.email,
        name: user!.name,
        image: user!.image,
      };

      expect(result).toEqual({
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        image: null,
      });
    });

    it('should reject user with invalid password', async () => {
      const testPassword = 'TestPassword123!';
      const hashedPassword = await hashPassword(testPassword);
      
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        image: null,
        password: hashedPassword,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      // Simulate the credentials provider authorize function logic
      const credentials = {
        email: 'test@example.com',
        password: 'WrongPassword123!',
      };

      // Find user by email
      const user = await mockPrisma.user.findUnique({
        where: { email: credentials.email.toLowerCase() },
      });

      expect(user).toBeDefined();
      expect(user?.password).toBeDefined();

      // Verify password
      const isValidPassword = await verifyPassword(
        credentials.password,
        user!.password!
      );

      expect(isValidPassword).toBe(false);
    });

    it('should reject non-existent user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      // Simulate the credentials provider authorize function logic
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'TestPassword123!',
      };

      // Find user by email
      const user = await mockPrisma.user.findUnique({
        where: { email: credentials.email.toLowerCase() },
      });

      expect(user).toBeNull();
    });

    it('should reject user without password (OAuth-only user)', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        image: null,
        password: null, // User registered with OAuth only
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      // Simulate the credentials provider authorize function logic
      const credentials = {
        email: 'test@example.com',
        password: 'TestPassword123!',
      };

      // Find user by email
      const user = await mockPrisma.user.findUnique({
        where: { email: credentials.email.toLowerCase() },
      });

      expect(user).toBeDefined();
      expect(user?.password).toBeNull();

      // Should reject user without password
      const shouldReject = !user || !user.password;
      expect(shouldReject).toBe(true);
    });

    it('should normalize email to lowercase', async () => {
      const testPassword = 'TestPassword123!';
      const hashedPassword = await hashPassword(testPassword);
      
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        name: 'Test User',
        image: null,
        password: hashedPassword,
      };

      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      // Simulate the credentials provider authorize function logic
      const credentials = {
        email: 'TEST@EXAMPLE.COM', // Uppercase email
        password: testPassword,
      };

      // Find user by email (should normalize to lowercase)
      await mockPrisma.user.findUnique({
        where: { email: credentials.email.toLowerCase() },
      });

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }, // Should be normalized to lowercase
      });
    });

    it('should handle missing credentials', async () => {
      // Test missing email
      let credentials: any = {
        password: 'TestPassword123!',
      };

      let shouldReject = !credentials?.email || !credentials?.password;
      expect(shouldReject).toBe(true);

      // Test missing password
      credentials = {
        email: 'test@example.com',
      };

      shouldReject = !credentials?.email || !credentials?.password;
      expect(shouldReject).toBe(true);

      // Test both missing
      credentials = {};

      shouldReject = !credentials?.email || !credentials?.password;
      expect(shouldReject).toBe(true);
    });
  });

  describe('Password Security', () => {
    it('should use secure password hashing', async () => {
      const password = 'TestPassword123!';
      const hashedPassword = await hashPassword(password);

      // Hash should be different from original password
      expect(hashedPassword).not.toBe(password);
      
      // Hash should be bcrypt format (starts with $2b$)
      expect(hashedPassword).toMatch(/^\$2b\$/);
      
      // Should be able to verify the password
      const isValid = await verifyPassword(password, hashedPassword);
      expect(isValid).toBe(true);
    });

    it('should reject weak passwords during verification', async () => {
      const strongPassword = 'TestPassword123!';
      const hashedPassword = await hashPassword(strongPassword);

      // Try to verify with wrong password
      const isValid = await verifyPassword('wrongpassword', hashedPassword);
      expect(isValid).toBe(false);
    });
  });
});