import * as bcrypt from "bcrypt";
import { validatePassword } from "./password-client";

/**
 * Server-side password utility functions (Node.js only)
 */

// Configuration constants
const SALT_ROUNDS = 12; // Minimum 12 rounds as per security requirements

/**
 * Hash a plain text password using bcrypt
 * @param password - Plain text password to hash
 * @returns Promise<string> - Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password || typeof password !== "string") {
    throw new Error("Password must be a non-empty string");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    throw new Error("Failed to hash password");
  }
}

/**
 * Verify a plain text password against a hashed password
 * @param password - Plain text password to verify
 * @param hashedPassword - Hashed password to compare against
 * @returns Promise<boolean> - True if password matches, false otherwise
 */
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  if (!password || !hashedPassword) {
    return false;
  }

  try {
    const isValid = await bcrypt.compare(password, hashedPassword);
    return isValid;
  } catch (error) {
    return false;
  }
}

// Re-export client-side validation function for server-side use
export { validatePassword };
