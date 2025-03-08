/**
 * Utility for handling authentication state in localStorage
 */

type User = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar_url?: string;
};

// Storage keys
const AUTH_USER_KEY = "al-yalayis-auth-user";
const AUTH_TOKEN_KEY = "al-yalayis-auth-token";

// Save user to localStorage
export function saveUser(user: User): void {
  try {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user to localStorage:", error);
  }
}

// Load user from localStorage
export function loadUser(): User | null {
  try {
    const userJson = localStorage.getItem(AUTH_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error("Error loading user from localStorage:", error);
    return null;
  }
}

// Save auth token to localStorage
export function saveAuthToken(token: string): void {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch (error) {
    console.error("Error saving auth token to localStorage:", error);
  }
}

// Load auth token from localStorage
export function loadAuthToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error("Error loading auth token from localStorage:", error);
    return null;
  }
}

// Clear auth data from localStorage
export function clearAuth(): void {
  try {
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (error) {
    console.error("Error clearing auth data from localStorage:", error);
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!loadAuthToken() && !!loadUser();
}

// Generate a mock auth token
export function generateMockToken(): string {
  const randomBytes = new Uint8Array(16);
  window.crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
