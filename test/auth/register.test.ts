import { createMocks } from "node-mocks-http";
import handler, { rateLimitStore } from "../../pages/api/auth/register";
import prisma from "../../db";
import { hashPassword } from "../../utils/password";

// Mock the database
jest.mock("../../db", () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));

// Mock password utilities
jest.mock("../../utils/password", () => ({
  hashPassword: jest.fn(),
  validatePassword: jest.fn(),
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;
const mockHashPassword = hashPassword as jest.MockedFunction<
  typeof hashPassword
>;
const mockValidatePassword = require("../../utils/password")
  .validatePassword as jest.MockedFunction<any>;

describe("/api/auth/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear rate limiting store between tests
    rateLimitStore.clear();
    // Default mock implementations
    mockValidatePassword.mockReturnValue({
      isValid: true,
      errors: [],
      strength: "strong",
    });
    mockHashPassword.mockResolvedValue("hashed_password_123");
  });

  describe("HTTP Method Validation", () => {
    it("should return 405 for non-POST requests", async () => {
      const { req, res } = createMocks({
        method: "GET",
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(405);
      expect(JSON.parse(res._getData())).toEqual({
        success: false,
        message: "Method not allowed",
      });
    });
  });

  describe("Input Validation", () => {
    it("should return 400 when email is missing", async () => {
      const { req, res } = createMocks({
        method: "POST",
        body: {
          password: "ValidPass123!",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        success: false,
        message: "Email and password are required",
      });
    });

    it("should return 400 when password is missing", async () => {
      const { req, res } = createMocks({
        method: "POST",
        body: {
          email: "test@example.com",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        success: false,
        message: "Email and password are required",
      });
    });

    it("should return 400 for invalid email format", async () => {
      const { req, res } = createMocks({
        method: "POST",
        body: {
          email: "invalid-email",
          password: "ValidPass123!",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        success: false,
        message: "Invalid email format",
      });
    });

    it("should return 400 for weak password", async () => {
      mockValidatePassword.mockReturnValue({
        isValid: false,
        errors: [
          "Password must be at least 8 characters long",
          "Password must contain at least one uppercase letter",
        ],
        strength: "weak",
      });

      const { req, res } = createMocks({
        method: "POST",
        body: {
          email: "test@example.com",
          password: "weak",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toEqual({
        success: false,
        message:
          "Password validation failed: Password must be at least 8 characters long, Password must contain at least one uppercase letter",
      });
    });
  });

  describe("Duplicate Email Handling", () => {
    it("should return 409 when user already exists with email/password", async () => {
      const existingUser = {
        id: "user123",
        email: "test@example.com",
        password: "hashed_password",
        accounts: [],
      };

      mockPrisma.user.findUnique.mockResolvedValue(existingUser);


      const { req, res } = createMocks({
        method: "POST",
        body: {
          email: "test@example.com",
          password: "ValidPass123!",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(409);
      expect(JSON.parse(res._getData())).toEqual({
        success: false,
        message: "An account with this email already exists",
      });
    });


  });

  describe("Successful Registration", () => {
    it("should create new user successfully", async () => {
      const newUser = {
        id: "newuser123",
        email: "newuser@example.com",
        password: "hashed_password_123",
        name: "New User",
        backGroundImage:
          "https://firebasestorage.googleapis.com/v0/b/rare-disease-forum.appspot.com/o/bgImage.avif?alt=media&token=ff4b06d7-b69c-487a-bc46-0c97ead4ca1c",
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(newUser);

      const { req, res } = createMocks({
        method: "POST",
        body: {
          email: "newuser@example.com",
          password: "ValidPass123!",
          name: "New User",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(201);
      expect(JSON.parse(res._getData())).toEqual({
        success: true,
        message: "Account created successfully. You can now sign in.",
      });

      // Verify database calls
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "newuser@example.com" },
        include: { accounts: true },
      });

      expect(mockHashPassword).toHaveBeenCalledWith("ValidPass123!");

      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          email: "newuser@example.com",
          password: "hashed_password_123",
          name: "New User",
          backGroundImage:
            "https://firebasestorage.googleapis.com/v0/b/rare-disease-forum.appspot.com/o/bgImage.avif?alt=media&token=ff4b06d7-b69c-487a-bc46-0c97ead4ca1c",
        },
      });
    });

    it("should handle registration without name", async () => {
      const newUser = {
        id: "newuser123",
        email: "newuser@example.com",
        password: "hashed_password_123",
        name: null,
        backGroundImage:
          "https://firebasestorage.googleapis.com/v0/b/rare-disease-forum.appspot.com/o/bgImage.avif?alt=media&token=ff4b06d7-b69c-487a-bc46-0c97ead4ca1c",
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(newUser);

      const { req, res } = createMocks({
        method: "POST",
        body: {
          email: "newuser@example.com",
          password: "ValidPass123!",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(201);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          email: "newuser@example.com",
          password: "hashed_password_123",
          name: null,
          backGroundImage:
            "https://firebasestorage.googleapis.com/v0/b/rare-disease-forum.appspot.com/o/bgImage.avif?alt=media&token=ff4b06d7-b69c-487a-bc46-0c97ead4ca1c",
        },
      });
    });

    it("should normalize email to lowercase", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: "newuser123",
        email: "newuser@example.com",
        password: "hashed_password_123",
        name: null,
        backGroundImage:
          "https://firebasestorage.googleapis.com/v0/b/rare-disease-forum.appspot.com/o/bgImage.avif?alt=media&token=ff4b06d7-b69c-487a-bc46-0c97ead4ca1c",
      });

      const { req, res } = createMocks({
        method: "POST",
        body: {
          email: "NewUser@EXAMPLE.COM",
          password: "ValidPass123!",
        },
      });

      await handler(req, res);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "newuser@example.com" },
        include: { accounts: true },
      });

      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          email: "newuser@example.com",
        }),
      });
    });
  });

  describe("Rate Limiting", () => {
    it("should implement rate limiting after multiple failed attempts", async () => {
      // Make multiple failed attempts
      for (let i = 0; i < 3; i++) {
        const { req, res } = createMocks({
          method: "POST",
          body: {
            email: "invalid-email",
            password: "ValidPass123!",
          },
          headers: {
            "x-forwarded-for": "192.168.1.1",
          },
        });

        await handler(req, res);
        expect(res._getStatusCode()).toBe(400);
      }

      // Fourth attempt should be rate limited
      const { req, res } = createMocks({
        method: "POST",
        body: {
          email: "test@example.com",
          password: "ValidPass123!",
        },
        headers: {
          "x-forwarded-for": "192.168.1.1",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(429);
      expect(JSON.parse(res._getData())).toEqual({
        success: false,
        message: "Too many registration attempts. Please try again later.",
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle database errors gracefully", async () => {
      mockPrisma.user.findUnique.mockRejectedValue(
        new Error("Database connection failed")
      );

      const { req, res } = createMocks({
        method: "POST",
        body: {
          email: "test@example.com",
          password: "ValidPass123!",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(500);
      expect(JSON.parse(res._getData())).toEqual({
        success: false,
        message: "Internal server error",
      });
    });

    it("should handle password hashing errors", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockHashPassword.mockRejectedValue(new Error("Hashing failed"));

      const { req, res } = createMocks({
        method: "POST",
        body: {
          email: "test@example.com",
          password: "ValidPass123!",
        },
      });

      await handler(req, res);

      expect(res._getStatusCode()).toBe(500);
      expect(JSON.parse(res._getData())).toEqual({
        success: false,
        message: "Internal server error",
      });
    });
  });
});
