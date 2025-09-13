import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../db';
import { hashPassword, validatePassword } from '../../../utils/password';
import { hasGoogleAccountLinked } from '../../../utils/auth-helpers';

interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  accountLinking?: {
    hasExistingAccount: boolean;
    existingProviders: string[];
  };
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Rate limiting storage (in production, use Redis or database)
const rateLimitStore = new Map<string, { attempts: number; lastAttempt: number }>();

// Export for testing
export { rateLimitStore };
const MAX_ATTEMPTS = 3;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record) {
    return false;
  }
  
  // Reset if window has passed
  if (now - record.lastAttempt > RATE_LIMIT_WINDOW) {
    rateLimitStore.delete(ip);
    return false;
  }
  
  return record.attempts >= MAX_ATTEMPTS;
}

function recordAttempt(ip: string): void {
  const now = Date.now();
  const record = rateLimitStore.get(ip);
  
  if (!record || now - record.lastAttempt > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(ip, { attempts: 1, lastAttempt: now });
  } else {
    record.attempts++;
    record.lastAttempt = now;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegisterResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  try {
    // Get client IP for rate limiting
    const clientIP = req.headers['x-forwarded-for'] as string || 
                    req.headers['x-real-ip'] as string || 
                    req.connection?.remoteAddress || 
                    req.socket?.remoteAddress ||
                    'unknown';

    // Check rate limiting
    if (isRateLimited(clientIP)) {
      return res.status(429).json({
        success: false,
        message: 'Too many registration attempts. Please try again later.'
      });
    }

    const { email, password, name }: RegisterRequest = req.body;

    // Validate required fields
    if (!email || !password) {
      recordAttempt(clientIP);
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      recordAttempt(clientIP);
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      recordAttempt(clientIP);
      return res.status(400).json({
        success: false,
        message: `Password validation failed: ${passwordValidation.errors.join(', ')}`
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { accounts: true }
    });

    if (existingUser) {
      // Check if user has Google account linked
      if (hasGoogleAccountLinked(existingUser)) {
        // User exists with Google account - suggest account linking
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists. You can sign in with Google or link your accounts.',
          accountLinking: {
            hasExistingAccount: true,
            existingProviders: existingUser.accounts.map(account => account.provider)
          }
        });
      } else {
        // User exists with email/password already
        recordAttempt(clientIP);
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists'
        });
      }
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        name: name || null,
        password: hashedPassword,
        backGroundImage: "https://firebasestorage.googleapis.com/v0/b/rare-disease-forum.appspot.com/o/bgImage.avif?alt=media&token=ff4b06d7-b69c-487a-bc46-0c97ead4ca1c"
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully. You can now sign in.'
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

