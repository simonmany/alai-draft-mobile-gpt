import { AuthError, AuthApiError } from "@supabase/supabase-js";

export const getAuthErrorMessage = (error: AuthError): string => {
  if (error instanceof AuthApiError) {
    switch (error.status) {
      case 422:
        if (error.message.includes("already registered")) {
          return "This email is already registered. Please sign in instead.";
        }
        return "Invalid input. Please check your information and try again.";
      case 400:
        return "Invalid credentials. Please check your email and password.";
      case 401:
        return "Invalid credentials or email not verified.";
      default:
        return error.message;
    }
  }
  return error.message;
};