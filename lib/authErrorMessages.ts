export function mapAuthErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? (error.message || "") : typeof error === "string" ? error : "";
  const message = raw.toLowerCase();

  if (!message) return "Something went wrong. Please try again.";

  // Login/authentication
  if (message.includes("invalid login") || message.includes("invalid email or password") || message.includes("invalid credentials")) {
    return "That email or password doesn’t look right. Please try again.";
  }
  if (message.includes("email not confirmed") || message.includes("email not confirmed")) {
    return "Please confirm your email to continue. Check your inbox (and spam).";
  }
  if (message.includes("too many requests") || message.includes("rate limit")) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  if (message.includes("user not authenticated") || message.includes("not authenticated")) {
    return "You need to be logged in to do that.";
  }

  // Registration
  if (message.includes("user already registered") || message.includes("already registered") || message.includes("duplicate key value") || message.includes("email already exists")) {
    return "An account with this email already exists. Try logging in instead.";
  }
  if (message.includes("password must be at least") || message.includes("password must contain")) {
    return "Your password doesn’t meet the requirements. Use 8+ chars with upper, lower, number, and symbol.";
  }

  // Profile/DB
  if (message.includes("failed to create profile") || message.includes("failed to update profile")) {
    return "We couldn’t save your profile right now. Please try again.";
  }
  if (message.includes("failed to save therapist details") || message.includes("failed to complete therapist profile")) {
    return "We couldn’t save your therapist details. Please try again.";
  }

  // Network/unknown
  if (message.includes("network") || message.includes("fetch") || message.includes("timeout")) {
    return "Network issue. Check your connection and try again.";
  }

  // Default fallback with minimal leakage
  return raw || "Something went wrong. Please try again.";
}


