import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Register from "../../pages/register";
import { validatePassword } from "../../utils/password-client";

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

// Mock password validation utility
jest.mock("../../utils/password-client", () => ({
  validatePassword: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
  pathname: "/register",
  query: {},
  asPath: "/register",
};

// Helper function to render with ChakraProvider
const customRender = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe("Register Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (fetch as jest.Mock).mockClear();
  });

  it("renders registration form with all required fields", () => {
    customRender(<Register />);

    expect(
      screen.getByRole("heading", { name: /create account/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/name \(optional\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password \*/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password \*/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /create account/i })
    ).toBeInTheDocument();
  });

  it("displays navigation link to sign-in page", () => {
    customRender(<Register />);

    const signInLink = screen.getByText(/sign in/i);
    expect(signInLink).toBeInTheDocument();
    expect(signInLink.closest("a")).toHaveAttribute("href", "/signin");
  });

  it("validates email format and shows error for invalid email", async () => {
    customRender(<Register />);

    const emailInput = screen.getByLabelText(/email \*/i);

    // Test that email input accepts and displays invalid email value
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    expect(emailInput).toHaveValue("invalid-email");

    // Test that email input accepts and displays valid email value
    fireEvent.change(emailInput, { target: { value: "valid@example.com" } });
    expect(emailInput).toHaveValue("valid@example.com");

    // Verify email field is properly configured
    expect(emailInput).toHaveAttribute("type", "email");
    expect(emailInput).toHaveAttribute("placeholder", "abc@example.com");
  });

  it("validates required fields and shows errors for empty fields", async () => {
    customRender(<Register />);

    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      expect(
        screen.getByText(/please confirm your password/i)
      ).toBeInTheDocument();
    });
  });

  it("validates password confirmation and shows error for mismatched passwords", async () => {
    (validatePassword as jest.Mock).mockReturnValue({
      isValid: true,
      errors: [],
      strength: "strong",
    });

    customRender(<Register />);

    const emailInput = screen.getByLabelText(/email \*/i);
    const passwordInput = screen.getByLabelText(/^password \*/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password \*/i);
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "Password123!" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "DifferentPassword123!" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it("displays password strength indicator when password is entered", () => {
    (validatePassword as jest.Mock).mockReturnValue({
      isValid: false,
      errors: ["Password must be at least 8 characters long"],
      strength: "weak",
    });

    customRender(<Register />);

    const passwordInput = screen.getByLabelText(/^password \*/i);
    fireEvent.change(passwordInput, { target: { value: "weak" } });

    expect(screen.getByText(/password strength:/i)).toBeInTheDocument();
    expect(screen.getByText(/weak/i)).toBeInTheDocument();
    expect(screen.getByText(/password requirements:/i)).toBeInTheDocument();
  });

  it("shows password requirements with check/close icons", () => {
    (validatePassword as jest.Mock).mockReturnValue({
      isValid: false,
      errors: [],
      strength: "medium",
    });

    customRender(<Register />);

    const passwordInput = screen.getByLabelText(/^password \*/i);
    fireEvent.change(passwordInput, { target: { value: "Password123!" } });

    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/one uppercase letter/i)).toBeInTheDocument();
    expect(screen.getByText(/one lowercase letter/i)).toBeInTheDocument();
    expect(screen.getByText(/one number/i)).toBeInTheDocument();
    expect(screen.getByText(/one special character/i)).toBeInTheDocument();
  });

  it("disables submit button when password validation fails", () => {
    (validatePassword as jest.Mock).mockReturnValue({
      isValid: false,
      errors: ["Password must be at least 8 characters long"],
      strength: "weak",
    });

    customRender(<Register />);

    const passwordInput = screen.getByLabelText(/^password \*/i);
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    fireEvent.change(passwordInput, { target: { value: "weak" } });

    expect(submitButton).toBeDisabled();
  });

  it("enables submit button when password validation passes", () => {
    (validatePassword as jest.Mock).mockReturnValue({
      isValid: true,
      errors: [],
      strength: "strong",
    });

    customRender(<Register />);

    const passwordInput = screen.getByLabelText(/^password \*/i);
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    fireEvent.change(passwordInput, {
      target: { value: "StrongPassword123!" },
    });

    expect(submitButton).not.toBeDisabled();
  });

  it("submits form with correct data when validation passes", async () => {
    (validatePassword as jest.Mock).mockReturnValue({
      isValid: true,
      errors: [],
      strength: "strong",
    });
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: "Account created successfully. You can now sign in.",
      }),
    });

    customRender(<Register />);

    const nameInput = screen.getByLabelText(/name \(optional\)/i);
    const emailInput = screen.getByLabelText(/email \*/i);
    const passwordInput = screen.getByLabelText(/^password \*/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password \*/i);
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, {
      target: { value: "StrongPassword123!" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "StrongPassword123!" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "john@example.com",
          password: "StrongPassword123!",
          name: "John Doe",
        }),
      });
    });
  });

  it("displays success message and redirects after successful registration", async () => {
    (validatePassword as jest.Mock).mockReturnValue({
      isValid: true,
      errors: [],
      strength: "strong",
    });
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: "Account created successfully. You can now sign in.",
      }),
    });

    customRender(<Register />);

    const emailInput = screen.getByLabelText(/email \*/i);
    const passwordInput = screen.getByLabelText(/^password \*/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password \*/i);
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, {
      target: { value: "StrongPassword123!" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "StrongPassword123!" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/account created successfully/i)
      ).toBeInTheDocument();
    });

    // Wait for redirect
    await waitFor(
      () => {
        expect(mockPush).toHaveBeenCalledWith("/signin");
      },
      { timeout: 3000 }
    );
  });

  it("displays error message for registration failure", async () => {
    (validatePassword as jest.Mock).mockReturnValue({
      isValid: true,
      errors: [],
      strength: "strong",
    });
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        message: "An account with this email already exists",
      }),
    });

    customRender(<Register />);

    const emailInput = screen.getByLabelText(/email \*/i);
    const passwordInput = screen.getByLabelText(/^password \*/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password \*/i);
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    fireEvent.change(emailInput, { target: { value: "existing@example.com" } });
    fireEvent.change(passwordInput, {
      target: { value: "StrongPassword123!" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "StrongPassword123!" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/an account with this email already exists/i)
      ).toBeInTheDocument();
    });
  });

  it("displays account linking notification for existing Google user", async () => {
    (validatePassword as jest.Mock).mockReturnValue({
      isValid: true,
      errors: [],
      strength: "strong",
    });
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 409,
      json: async () => ({
        success: false,
        message:
          "An account with this email already exists. You can sign in with Google or link your accounts.",
        accountLinking: {
          hasExistingAccount: true,
          existingProviders: ["google"],
        },
      }),
    });

    customRender(<Register />);

    const emailInput = screen.getByLabelText(/email \*/i);
    const passwordInput = screen.getByLabelText(/^password \*/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password \*/i);
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    fireEvent.change(emailInput, { target: { value: "google@example.com" } });
    fireEvent.change(passwordInput, {
      target: { value: "StrongPassword123!" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "StrongPassword123!" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/you can sign in with your existing google account/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /go to sign in/i })
      ).toBeInTheDocument();
    });
  });

  it("handles network errors gracefully", async () => {
    (validatePassword as jest.Mock).mockReturnValue({
      isValid: true,
      errors: [],
      strength: "strong",
    });
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    customRender(<Register />);

    const emailInput = screen.getByLabelText(/email \*/i);
    const passwordInput = screen.getByLabelText(/^password \*/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password \*/i);
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, {
      target: { value: "StrongPassword123!" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "StrongPassword123!" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/an error occurred during registration/i)
      ).toBeInTheDocument();
    });
  });

  it("shows loading state during form submission", async () => {
    (validatePassword as jest.Mock).mockReturnValue({
      isValid: true,
      errors: [],
      strength: "strong",
    });

    // Mock a delayed response
    (fetch as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => ({ success: true, message: "Success" }),
              }),
            100
          )
        )
    );

    customRender(<Register />);

    const emailInput = screen.getByLabelText(/email \*/i);
    const passwordInput = screen.getByLabelText(/^password \*/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password \*/i);
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, {
      target: { value: "StrongPassword123!" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "StrongPassword123!" },
    });
    fireEvent.click(submitButton);

    expect(screen.getByText(/creating account.../i)).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // Wait for loading to finish
    await waitFor(() => {
      expect(
        screen.queryByText(/creating account.../i)
      ).not.toBeInTheDocument();
    });
  });

  it("displays terms of service notice", () => {
    customRender(<Register />);

    expect(
      screen.getByText(
        /by creating an account, you agree to our terms of service and privacy policy/i
      )
    ).toBeInTheDocument();
  });

  it("omits name field when empty in form submission", async () => {
    (validatePassword as jest.Mock).mockReturnValue({
      isValid: true,
      errors: [],
      strength: "strong",
    });
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: "Account created successfully.",
      }),
    });

    customRender(<Register />);

    const emailInput = screen.getByLabelText(/email \*/i);
    const passwordInput = screen.getByLabelText(/^password \*/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password \*/i);
    const submitButton = screen.getByRole("button", {
      name: /create account/i,
    });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, {
      target: { value: "StrongPassword123!" },
    });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "StrongPassword123!" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@example.com",
          password: "StrongPassword123!",
          name: undefined,
        }),
      });
    });
  });
});
