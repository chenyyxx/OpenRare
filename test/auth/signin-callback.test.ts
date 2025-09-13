/**
 * Test NextAuth signIn callback integration
 * This test verifies that the signIn callback properly handles
 * both credentials and Google authentication
 */

// Mock the auth helpers
const mockHasGoogleAccountLinked = jest.fn();
const mockIsGoogleAccountAlreadyLinked = jest.fn();
const mockGenerateAccountLinkingErrorUrl = jest.fn();

jest.mock('../../utils/auth-helpers', () => ({
  hasGoogleAccountLinked: mockHasGoogleAccountLinked,
  isGoogleAccountAlreadyLinked: mockIsGoogleAccountAlreadyLinked,
  generateAccountLinkingErrorUrl: mockGenerateAccountLinkingErrorUrl,
}));

// Mock the database
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  account: {
    create: jest.fn(),
  },
};

jest.mock('../../db', () => mockPrisma);

describe('NextAuth SignIn Callback Integration', () => {
  let authOptions: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Set up environment
    process.env.GOOGLE_ID = 'test-google-id';
    process.env.GOOGLE_SECRET = 'test-google-secret';
    process.env.SECRET = 'test-secret';

    // Import after mocks are set up
    authOptions = require('../../pages/api/auth/[...nextauth]').authOptions;
  });

  describe('Credentials Provider SignIn', () => {
    it('should allow credentials authentication', async () => {
      const signInCallback = authOptions.callbacks.signIn;

      const result = await signInCallback({
        user: { id: '1', email: 'test@example.com' },
        account: { provider: 'credentials', type: 'credentials' },
        profile: {},
      });

      expect(result).toBe(true);
    });
  });

  describe('Google Provider SignIn with Account Linking', () => {
    it('should allow Google sign in for new user', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      const signInCallback = authOptions.callbacks.signIn;

      const result = await signInCallback({
        user: { id: '1', email: 'newuser@example.com' },
        account: { 
          provider: 'google', 
          type: 'oauth',
          providerAccountId: 'google-123'
        },
        profile: {},
      });

      expect(result).toBe(true);
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'newuser@example.com' },
        include: { accounts: true },
      });
    });

    it('should link Google account to existing user', async () => {
      const existingUser = {
        id: 'existing-user-123',
        email: 'existing@example.com',
        accounts: [],
      };

      mockPrisma.user.findUnique.mockResolvedValue(existingUser);
      mockIsGoogleAccountAlreadyLinked.mockReturnValue(false);
      mockHasGoogleAccountLinked.mockReturnValue(false);
      mockPrisma.account.create.mockResolvedValue({});

      const signInCallback = authOptions.callbacks.signIn;

      const account = {
        provider: 'google',
        type: 'oauth',
        providerAccountId: 'google-123',
        refresh_token: 'refresh-token',
        access_token: 'access-token',
        expires_at: 1234567890,
        token_type: 'Bearer',
        scope: 'email profile',
        id_token: 'id-token',
        session_state: 'session-state',
      };

      const user = { id: '1', email: 'existing@example.com' };

      const result = await signInCallback({
        user,
        account,
        profile: {},
      });

      expect(result).toBe(true);
      expect(mockPrisma.account.create).toHaveBeenCalledWith({
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
        },
      });
      expect(user.id).toBe(existingUser.id);
    });

    it('should allow sign in if Google account already linked', async () => {
      const existingUser = {
        id: 'existing-user-123',
        email: 'existing@example.com',
        accounts: [{ provider: 'google', providerAccountId: 'google-123' }],
      };

      mockPrisma.user.findUnique.mockResolvedValue(existingUser);
      mockIsGoogleAccountAlreadyLinked.mockReturnValue(true);

      const signInCallback = authOptions.callbacks.signIn;

      const result = await signInCallback({
        user: { id: '1', email: 'existing@example.com' },
        account: { 
          provider: 'google', 
          type: 'oauth',
          providerAccountId: 'google-123'
        },
        profile: {},
      });

      expect(result).toBe(true);
      expect(mockPrisma.account.create).not.toHaveBeenCalled();
    });

    it('should prevent linking different Google account', async () => {
      const existingUser = {
        id: 'existing-user-123',
        email: 'existing@example.com',
        accounts: [{ provider: 'google', providerAccountId: 'google-456' }],
      };

      mockPrisma.user.findUnique.mockResolvedValue(existingUser);
      mockIsGoogleAccountAlreadyLinked.mockReturnValue(false);
      mockHasGoogleAccountLinked.mockReturnValue(true);
      mockGenerateAccountLinkingErrorUrl.mockReturnValue('/auth/error?error=AccountLinking');

      const signInCallback = authOptions.callbacks.signIn;

      const result = await signInCallback({
        user: { id: '1', email: 'existing@example.com' },
        account: { 
          provider: 'google', 
          type: 'oauth',
          providerAccountId: 'google-123'
        },
        profile: {},
      });

      expect(result).toBe('/auth/error?error=AccountLinking');
      expect(mockGenerateAccountLinkingErrorUrl).toHaveBeenCalledWith(
        'A different Google account is already linked to this email'
      );
    });

    it('should handle database errors during account linking', async () => {
      mockPrisma.user.findUnique.mockRejectedValue(new Error('Database error'));

      const signInCallback = authOptions.callbacks.signIn;

      const result = await signInCallback({
        user: { id: '1', email: 'test@example.com' },
        account: { 
          provider: 'google', 
          type: 'oauth',
          providerAccountId: 'google-123'
        },
        profile: {},
      });

      expect(result).toBe(false);
    });
  });

  describe('Redirect Callback', () => {
    it('should redirect to base URL', async () => {
      const redirectCallback = authOptions.callbacks.redirect;

      const result = await redirectCallback({
        url: 'http://localhost:3000/some-path',
        baseUrl: 'http://localhost:3000',
      });

      expect(result).toBe('http://localhost:3000');
    });
  });
});