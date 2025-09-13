import {
  hashPassword,
  verifyPassword,
  validatePassword,
} from "../../utils/password";
import {
  generateSecurePassword,
  PASSWORD_REQUIREMENTS,
} from "../../utils/password-client";

describe("Password Utilities", () => {
  describe("hashPassword", () => {
    it("should hash a valid password", async () => {
      const password = "TestPassword123!";
      const hashedPassword = await hashPassword(password);

      expect(hashedPassword).toBeDefined();
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(50); // bcrypt hashes are typically 60 characters
    });

    it("should generate different hashes for the same password", async () => {
      const password = "TestPassword123!";
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2); // Salt should make them different
    });

    it("should throw error for empty password", async () => {
      await expect(hashPassword("")).rejects.toThrow(
        "Password must be a non-empty string"
      );
    });

    it("should throw error for null password", async () => {
      await expect(hashPassword(null as any)).rejects.toThrow(
        "Password must be a non-empty string"
      );
    });

    it("should throw error for non-string password", async () => {
      await expect(hashPassword(123 as any)).rejects.toThrow(
        "Password must be a non-empty string"
      );
    });
  });

  describe("verifyPassword", () => {
    it("should verify correct password", async () => {
      const password = "TestPassword123!";
      const hashedPassword = await hashPassword(password);

      const isValid = await verifyPassword(password, hashedPassword);
      expect(isValid).toBe(true);
    });

    it("should reject incorrect password", async () => {
      const password = "TestPassword123!";
      const wrongPassword = "WrongPassword123!";
      const hashedPassword = await hashPassword(password);

      const isValid = await verifyPassword(wrongPassword, hashedPassword);
      expect(isValid).toBe(false);
    });

    it("should return false for empty password", async () => {
      const hashedPassword = await hashPassword("TestPassword123!");

      const isValid = await verifyPassword("", hashedPassword);
      expect(isValid).toBe(false);
    });

    it("should return false for empty hash", async () => {
      const isValid = await verifyPassword("TestPassword123!", "");
      expect(isValid).toBe(false);
    });

    it("should return false for invalid hash format", async () => {
      const isValid = await verifyPassword("TestPassword123!", "invalid-hash");
      expect(isValid).toBe(false);
    });
  });

  describe("validatePassword", () => {
    it("should validate a strong password", () => {
      const password = "StrongPassword123!";
      const result = validatePassword(password);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.strength).toBe("strong"); // 18 chars meets strong criteria
    });

    it("should validate a medium strength password", () => {
      const password = "Medium1!"; // 8 chars, meets requirements but not long enough for strong
      const result = validatePassword(password);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.strength).toBe("medium");
    });

    it("should validate a very strong password", () => {
      const password = "VeryStrongPassword123!@#";
      const result = validatePassword(password);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.strength).toBe("strong");
    });

    it("should reject password that is too short", () => {
      const password = "Short1!";
      const result = validatePassword(password);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`
      );
      expect(result.strength).toBe("weak");
    });

    it("should reject password without uppercase letters", () => {
      const password = "lowercase123!";
      const result = validatePassword(password);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain at least one uppercase letter"
      );
      expect(result.strength).toBe("weak");
    });

    it("should reject password without lowercase letters", () => {
      const password = "UPPERCASE123!";
      const result = validatePassword(password);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain at least one lowercase letter"
      );
      expect(result.strength).toBe("weak");
    });

    it("should reject password without numbers", () => {
      const password = "NoNumbers!";
      const result = validatePassword(password);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain at least one number"
      );
      expect(result.strength).toBe("weak");
    });

    it("should reject password without special characters", () => {
      const password = "NoSpecialChars123";
      const result = validatePassword(password);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Password must contain at least one special character"
      );
      expect(result.strength).toBe("weak");
    });

    it("should return multiple errors for invalid password", () => {
      const password = "weak";
      const result = validatePassword(password);

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
      expect(result.strength).toBe("weak");
    });

    it("should handle empty password", () => {
      const result = validatePassword("");

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Password is required");
      expect(result.strength).toBe("weak");
    });

    it("should handle null password", () => {
      const result = validatePassword(null as any);

      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Password is required");
      expect(result.strength).toBe("weak");
    });
  });

  describe("generateSecurePassword", () => {
    it("should generate password with default length", () => {
      const password = generateSecurePassword();

      expect(password).toBeDefined();
      expect(password.length).toBe(16);
    });

    it("should generate password with custom length", () => {
      const customLength = 20;
      const password = generateSecurePassword(customLength);

      expect(password.length).toBe(customLength);
    });

    it("should generate password that meets all requirements", () => {
      const password = generateSecurePassword();
      const validation = validatePassword(password);

      expect(validation.isValid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    });

    it("should generate different passwords each time", () => {
      const password1 = generateSecurePassword();
      const password2 = generateSecurePassword();

      expect(password1).not.toBe(password2);
    });

    it("should contain at least one character from each required category", () => {
      const password = generateSecurePassword();

      expect(/[A-Z]/.test(password)).toBe(true); // Uppercase
      expect(/[a-z]/.test(password)).toBe(true); // Lowercase
      expect(/\d/.test(password)).toBe(true); // Numbers
      expect(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)).toBe(true); // Symbols
    });
  });

  describe("Integration tests", () => {
    it("should hash and verify a generated password", async () => {
      const password = generateSecurePassword();
      const hashedPassword = await hashPassword(password);
      const isValid = await verifyPassword(password, hashedPassword);

      expect(isValid).toBe(true);
    });

    it("should validate and hash a strong password", async () => {
      const password = "MyStrongPassword123!";
      const validation = validatePassword(password);

      expect(validation.isValid).toBe(true);

      const hashedPassword = await hashPassword(password);
      const isValid = await verifyPassword(password, hashedPassword);

      expect(isValid).toBe(true);
    });
  });
});
