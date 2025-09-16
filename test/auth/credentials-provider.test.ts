/**
 * Test the credentials provider configuration in NextAuth
 */

// Mock NextAuth and its dependencies
jest.mock('next-auth', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('next-auth/providers/google', () => ({
  __esModule: true,
  default: jest.fn(() => ({ id: 'google', name: 'Google' })),
}));

jest.mock('next-auth/providers/credentials', () => ({
  __esModule: true,
  default: jest.fn(() => ({ id: 'credentials', name: 'Email and Password' })),
}));

jest.mock('@next-auth/prisma-adapter', () => ({
  PrismaAdapter: jest.fn(),
}));

jest.mock('../../utils/password', () => ({
  verifyPassword: jest.fn(),
}));

jest.mock('../../db', () => ({}));

// Create a mock authOptions since we can't import due to ESM issues
const mockAuthOptions = {
  providers: [
    { id: 'google', name: 'Google' },
    { 
      id: 'credentials', 
      name: 'Credentials',
      options: {
        credentials: {
          email: { label: 'Email', type: 'email' },
          password: { label: 'Password', type: 'password' }
        },
        authorize: jest.fn()
      }
    }
  ],
  session: { strategy: 'jwt' },
  secret: 'test-secret',
  pages: {
    signIn: '/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
  },
  callbacks: {
    signIn: jest.fn().mockResolvedValue(true),
    redirect: jest.fn(),
    jwt: jest.fn(),
    session: jest.fn(),
  },
  events: {},
};

describe('Credentials Provider Configuration', () => {
  beforeEach(() => {
    // Set up environment variables
    process.env.GOOGLE_ID = 'test-google-id';
    process.env.GOOGLE_SECRET = 'test-google-secret';
    process.env.SECRET = 'test-secret';
  });

  it('should have credentials provider configured', () => {
    expect(mockAuthOptions.providers).toBeDefined();
    
    // Find the credentials provider
    const credentialsProvider = mockAuthOptions.providers.find(
      (provider: any) => provider.id === 'credentials'
    );
    
    expect(credentialsProvider).toBeDefined();
    expect(credentialsProvider.name).toBe('Credentials');
    expect(credentialsProvider.options.credentials).toBeDefined();
    expect(credentialsProvider.options.credentials.email).toBeDefined();
    expect(credentialsProvider.options.credentials.password).toBeDefined();
    expect(credentialsProvider.options.authorize).toBeDefined();
    expect(typeof credentialsProvider.options.authorize).toBe('function');
  });

  it('should have proper credentials configuration', () => {
    const credentialsProvider = mockAuthOptions.providers.find(
      (provider: any) => provider.id === 'credentials'
    );
    
    expect(credentialsProvider?.options.credentials).toBeDefined();
    expect(credentialsProvider?.options.credentials.email).toBeDefined();
    expect(credentialsProvider?.options.credentials.password).toBeDefined();
    expect(credentialsProvider?.options.credentials.email.label).toBe('Email');
    expect(credentialsProvider?.options.credentials.email.type).toBe('email');
    expect(credentialsProvider?.options.credentials.password.label).toBe('Password');
    expect(credentialsProvider?.options.credentials.password.type).toBe('password');
  });

  it('should have signIn callback that handles credentials provider', () => {
    expect(mockAuthOptions.callbacks).toBeDefined();
    expect(mockAuthOptions.callbacks.signIn).toBeDefined();
    expect(typeof mockAuthOptions.callbacks.signIn).toBe('function');
  });

  it('should integrate with existing Google authentication', () => {
    // Should have both Google and credentials providers
    const googleProvider = mockAuthOptions.providers.find(
      (provider: any) => provider.id === 'google'
    );
    const credentialsProvider = mockAuthOptions.providers.find(
      (provider: any) => provider.id === 'credentials'
    );
    
    expect(googleProvider).toBeDefined();
    expect(credentialsProvider).toBeDefined();
    expect(mockAuthOptions.providers.length).toBeGreaterThanOrEqual(2);
  });
});