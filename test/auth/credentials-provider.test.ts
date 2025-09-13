/**
 * Test the credentials provider configuration in NextAuth
 */

import { authOptions } from '../../pages/api/auth/[...nextauth]';

describe('Credentials Provider Configuration', () => {
  beforeEach(() => {
    // Set up environment variables
    process.env.GOOGLE_ID = 'test-google-id';
    process.env.GOOGLE_SECRET = 'test-google-secret';
    process.env.SECRET = 'test-secret';
  });

  it('should have credentials provider configured', () => {
    expect(authOptions.providers).toBeDefined();
    
    // Find the credentials provider
    const credentialsProvider = authOptions.providers.find(
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
    const credentialsProvider = authOptions.providers.find(
      (provider: any) => provider.id === 'credentials'
    );
    
    expect(credentialsProvider.options.credentials).toBeDefined();
    expect(credentialsProvider.options.credentials.email).toBeDefined();
    expect(credentialsProvider.options.credentials.password).toBeDefined();
    expect(credentialsProvider.options.credentials.email.label).toBe('Email');
    expect(credentialsProvider.options.credentials.email.type).toBe('email');
    expect(credentialsProvider.options.credentials.password.label).toBe('Password');
    expect(credentialsProvider.options.credentials.password.type).toBe('password');
  });

  it('should have signIn callback that handles credentials provider', () => {
    expect(authOptions.callbacks).toBeDefined();
    expect(authOptions.callbacks.signIn).toBeDefined();
    expect(typeof authOptions.callbacks.signIn).toBe('function');
  });

  it('should integrate with existing Google authentication', () => {
    // Should have both Google and credentials providers
    const googleProvider = authOptions.providers.find(
      (provider: any) => provider.id === 'google'
    );
    const credentialsProvider = authOptions.providers.find(
      (provider: any) => provider.id === 'credentials'
    );
    
    expect(googleProvider).toBeDefined();
    expect(credentialsProvider).toBeDefined();
    expect(authOptions.providers.length).toBeGreaterThanOrEqual(2);
  });
});