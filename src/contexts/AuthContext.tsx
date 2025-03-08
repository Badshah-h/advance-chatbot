import React, { createContext, useContext, useState, useEffect } from "react";
import {
  saveUser,
  saveAuthToken,
  loadUser,
  loadAuthToken,
  clearAuth,
  generateMockToken,
} from "../utils/authStorage";

type User = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar_url?: string;
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  error: string | null;
};

interface AuthContextType extends AuthState {
  login: (
    identifier: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  register: (
    name: string,
    email: string,
    phone: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  logout: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

// Mock user for development
const MOCK_USER: User = {
  id: "user-123",
  email: "user@example.com",
  name: "Test User",
  phone: "+971 50 123 4567",
  avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=user123",
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true, // Start with loading true to check localStorage
    error: null,
  });

  // Check for existing auth on mount
  useEffect(() => {
    const storedUser = loadUser();
    const storedToken = loadAuthToken();

    if (storedUser && storedToken) {
      setAuthState({
        user: storedUser,
        isLoading: false,
        error: null,
      });
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (identifier: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, check if it's our mock user or create a new one
      let user: User;

      if (identifier === "user@example.com" && password === "password123") {
        user = MOCK_USER;
      } else {
        // Create a user based on the identifier (email or phone)
        const isEmail = identifier.includes("@");
        user = {
          id: `user-${Date.now()}`,
          email: isEmail ? identifier : `user${Date.now()}@example.com`,
          name: isEmail ? identifier.split("@")[0] : "New User",
          phone: !isEmail ? identifier : undefined,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
        };
      }

      // Generate a mock token
      const token = generateMockToken();

      // Save to localStorage
      saveUser(user);
      saveAuthToken(token);

      setAuthState({
        user,
        isLoading: false,
        error: null,
      });
      return { error: null };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      setAuthState({
        user: null,
        isLoading: false,
        error: errorMessage,
      });
      return { error: errorMessage };
    }
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string,
  ) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create a new user based on registration info
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        name,
        phone,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s+/g, "")}`,
      };

      // Generate a mock token
      const token = generateMockToken();

      // Save to localStorage
      saveUser(newUser);
      saveAuthToken(token);

      setAuthState({
        user: newUser,
        isLoading: false,
        error: null,
      });
      return { error: null };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      setAuthState({
        user: null,
        isLoading: false,
        error: errorMessage,
      });
      return { error: errorMessage };
    }
  };

  const logout = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Clear localStorage
      clearAuth();

      setAuthState({
        user: null,
        isLoading: false,
        error: null,
      });
      return { error: null };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Logout failed";
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { error: errorMessage };
    }
  };

  const resetPassword = async (email: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return { error: null };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Password reset failed";

      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return { error: errorMessage };
    }
  };

  const value = {
    ...authState,
    login,
    register,
    logout,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
