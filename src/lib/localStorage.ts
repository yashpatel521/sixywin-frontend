import type { User } from "@/lib/interfaces";
import { updateLocalStorage } from "@/hooks/useLocalStorage";

// LocalStorage keys
const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  REMEMBER_EMAIL: "rememberEmail",
  REMEMBER_PASSWORD: "rememberPassword",
} as const;

// Custom event for user data changes
const USER_DATA_CHANGED_EVENT = "userDataChanged";

// User data storage
export const userStorage = {
  // Store user data
  setUser: (user: User): void => {
    try {
      // remove password field from user object and add token
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      updateLocalStorage(STORAGE_KEYS.USER, userWithoutPassword);
      // Dispatch custom event to notify components
      window.dispatchEvent(
        new CustomEvent(USER_DATA_CHANGED_EVENT, { detail: user })
      );
    } catch (error) {
      console.error("Failed to store user data:", error);
    }
  },

  // Get user data
  getUser: (): User | null => {
    try {
      const userData = localStorage.getItem(STORAGE_KEYS.USER);
      if (!userData) return null;

      const user = JSON.parse(userData);
      // Convert date strings back to Date objects
      if (user.createdAt) user.createdAt = new Date(user.createdAt);
      if (user.updatedAt) user.updatedAt = new Date(user.updatedAt);

      return user;
    } catch (error) {
      console.error("Failed to retrieve user data:", error);
      return null;
    }
  },

  // Remove user data
  removeUser: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
      console.error("Failed to remove user data:", error);
    }
  },

  // Update specific user fields
  updateUser: (updates: Partial<User>): void => {
    try {
      const currentUser = userStorage.getUser();
      if (currentUser) {
        const updatedUser = { ...currentUser, ...updates };
        userStorage.setUser(updatedUser);
      }
    } catch (error) {
      console.error("Failed to update user data:", error);
    }
  },
};

// Token storage
export const tokenStorage = {
  // Store token
  setToken: (token: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } catch (error) {
      console.error("Failed to store token:", error);
    }
  },

  // Get token
  getToken: (): string | null => {
    try {
      return localStorage.getItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error("Failed to retrieve token:", error);
      return null;
    }
  },

  // Remove token
  removeToken: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error("Failed to remove token:", error);
    }
  },
};

// Remember me storage
export const rememberMeStorage = {
  // Store remember me data
  setRememberData: (email: string, password: string): void => {
    try {
      localStorage.setItem(STORAGE_KEYS.REMEMBER_EMAIL, email);
      localStorage.setItem(STORAGE_KEYS.REMEMBER_PASSWORD, password);
    } catch (error) {
      console.error("Failed to store remember me data:", error);
    }
  },

  // Get remember me data
  getRememberData: (): { email: string; password: string } | null => {
    try {
      const email = localStorage.getItem(STORAGE_KEYS.REMEMBER_EMAIL);
      const password = localStorage.getItem(STORAGE_KEYS.REMEMBER_PASSWORD);

      if (email && password) {
        return { email, password };
      }
      return null;
    } catch (error) {
      console.error("Failed to retrieve remember me data:", error);
      return null;
    }
  },

  // Remove remember me data
  removeRememberData: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_EMAIL);
      localStorage.removeItem(STORAGE_KEYS.REMEMBER_PASSWORD);
    } catch (error) {
      console.error("Failed to remove remember me data:", error);
    }
  },
};

// Clear all authentication data
export const clearAuthData = (): void => {
  userStorage.removeUser();
  tokenStorage.removeToken();
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!(tokenStorage.getToken() && userStorage.getUser());
};
