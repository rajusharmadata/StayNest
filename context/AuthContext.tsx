// ============================================
// FILE: context/AuthContext.tsx (IMPROVED VERSION)
// ============================================
import {
  getCurrentUser as getCurrentUserApi,
  login as loginApi,
  logout as logoutApi,
  refreshToken as refreshTokenApi,
  registerApi,
} from "@/api/auth";
import { AuthContextType, User } from "@/type/user";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Alert } from "react-native";
// Types

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Storage keys
const TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "userData";

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Decode JWT token
  const decodeToken = (
    token: string
  ): { user?: User; exp?: number; id?: string } | null => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return {
        user: payload.user,
        exp: payload.exp,
        id: payload.id,
      };
    } catch (error) {
      console.error("Token decode error:", error);
      return null;
    }
  };

  // Check if token is expired
  const isTokenExpired = (token: string): boolean => {
    const decoded = decodeToken(token);
    if (!decoded?.exp) return true;

    const now = Date.now() / 1000;
    // Consider token expired 5 minutes before actual expiry
    return decoded.exp - 300 < now;
  };

  // Clear all auth data
  const clearAuthData = async () => {
    try {
      await Promise.all([
        SecureStore.deleteItemAsync(TOKEN_KEY),
        SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
        SecureStore.deleteItemAsync(USER_KEY),
      ]);

      if (isMounted.current) {
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
  };

  // Save auth data
  const saveAuthData = async (
    accessToken: string,
    refreshToken?: string,
    userData?: User
  ) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, accessToken);

      if (refreshToken) {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
      }

      if (userData) {
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));
      }

      if (isMounted.current) {
        setToken(accessToken);
        setIsAuthenticated(true);
        if (userData) {
          setUser(userData);
        }
      }
    } catch (error) {
      console.error("Error saving auth data:", error);
      throw new Error("Failed to save authentication data");
    }
  };

  // Fetch current user from API
  const fetchCurrentUser = async (accessToken: string) => {
    try {
      const userData = await getCurrentUserApi(accessToken);

      if (userData) {
        await SecureStore.setItemAsync(USER_KEY, JSON.stringify(userData));

        if (isMounted.current) {
          setUser(userData);
        }
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
    }
  };

  // Validate and set token
  const validateAndSetToken = async (accessToken: string) => {
    try {
      // Check if token is expired
      if (isTokenExpired(accessToken)) {
        await clearAuthData();
        return false;
      }

      // Decode token to get user data
      const decoded = decodeToken(accessToken);

      setToken(accessToken);
      setIsAuthenticated(true);

      // Try to get user from storage first
      const storedUser = await SecureStore.getItemAsync(USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else if (decoded?.user) {
        setUser(decoded.user);
      } else if (decoded?.id) {
        // Fetch user data from API
        await fetchCurrentUser(accessToken);
      }

      return true;
    } catch (error) {
      console.error("Token validation error:", error);
      await clearAuthData();
      return false;
    }
  };

  const refreshToken = useCallback(async () => {
    try {
      const refreshTokenValue =
        await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

      if (!refreshTokenValue) {
        throw new Error("No refresh token available");
      }

      const response = await refreshTokenApi(refreshTokenValue);

      if (response.success && response.data?.accessToken) {
        await saveAuthData(
          response.data.accessToken,
          response.data.refreshToken
        );
      }
    } catch (error) {
      console.error("Refresh token failed:", error);
    }
  }, []);

  // Bootstrap: Check for existing token on app start
  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const accessToken = await SecureStore.getItemAsync(TOKEN_KEY);

        if (accessToken) {
          // Check if token is expired
          if (isTokenExpired(accessToken)) {
            // Try to refresh token
            await refreshToken();
          } else {
            await validateAndSetToken(accessToken);
          }
        }
      } catch (error) {
        console.error("Auth bootstrap error:", error);
        await clearAuthData();
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    bootstrapAsync();
  }, []);

  // Login
  const login = async (email: string, password: string) => {
    if (authLoading) return;

    setAuthLoading(true);

    try {
      const response = await loginApi(email, password);

      if (!response.success || !response.data) {
        throw new Error(response.error || "Login failed");
      }

      const { accessToken, refreshToken, user: userData } = response.data;
      console.log(response.data);

      if (!accessToken) {
        throw new Error("No access token received");
      }

      await saveAuthData(accessToken, refreshToken, userData);

      // Navigate to main app
      router.replace("/(tabs)/home");
    } catch (error: any) {
      console.error("Login error:", error);

      Alert.alert(
        "Login Failed",
        error.message || "Unable to login. Please check your credentials."
      );

      throw error;
    } finally {
      if (isMounted.current) {
        setAuthLoading(false);
      }
    }
  };

  // Register
  const register = async (name: string, email: string, password: string) => {
    if (authLoading) return;

    setAuthLoading(true);

    try {
      const response = await registerApi(name, email, password);
      console.log("register is callled");

      if (!response.success || !response.data) {
        throw new Error(response.error || "Registration failed");
      }

      const { accessToken, refreshToken, user: userData } = response.data;

      if (!accessToken) {
        throw new Error("Registration failed: No access token received");
      }

      await saveAuthData(accessToken, refreshToken, userData);

      // Navigate to main app
      router.replace("/(auth)/login");
    } catch (error: any) {
      console.error("Registration error:", error);

      Alert.alert(
        "Registration Failed",
        error.message || "Unable to create account. Please try again."
      );

      throw error;
    } finally {
      if (isMounted.current) {
        setAuthLoading(false);
      }
    }
  };

  // Logout
  const logout = async () => {
    if (authLoading) return;

    setAuthLoading(true);

    try {
      // Get token before clearing
      const accessToken = await SecureStore.getItemAsync(TOKEN_KEY);

      // Call logout API if token exists
      if (accessToken) {
        try {
          await logoutApi(accessToken);
        } catch (error) {
          console.warn("Logout API failed (may be offline):", error);
          // Continue with local logout anyway
        }
      }

      // Clear all local data
      await clearAuthData();

      // Show success message
      Alert.alert("Logged Out", "You have been successfully logged out.");

      // Navigate to login screen
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout error:", error);

      // Even if something fails, clear local data
      await clearAuthData();
      router.replace("/(auth)/login");
    } finally {
      if (isMounted.current) {
        setAuthLoading(false);
      }
    }
  };

  // Update user data
  const updateUser = useCallback((userData: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;

      const updatedUser = { ...prevUser, ...userData };

      // Save to storage
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(updatedUser));

      return updatedUser;
    });
  }, []);

  const value = {
    isAuthenticated,
    user,
    loading,
    authLoading,
    token,
    login,
    register,
    logout,
    refreshToken,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
