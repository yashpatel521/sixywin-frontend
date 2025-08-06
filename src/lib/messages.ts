// Navigation messages
export const NAV_MESSAGES = {
  HOME: "Home",
  LOGIN: "Login",
  LOGOUT: "Logout",
  DASHBOARD: "Dashboard",
  REGISTER: "Register",
  PROFILE: "Profile",
} as const;

// Auth messages
export const AUTH_MESSAGES = {
  LOGIN_SUCCESS: "Successfully logged in!",
  LOGIN_ERROR: "Invalid email or password",
  LOGOUT_SUCCESS: "Successfully logged out!",
  REGISTER_SUCCESS: "Account created successfully!",
  REGISTER_ERROR: "Failed to create account",
  UNAUTHORIZED: "You must be logged in to access this page",
} as const;

// Form messages
export const FORM_MESSAGES = {
  EMAIL_REQUIRED: "Email is required",
  PASSWORD_REQUIRED: "Password is required",
  USERNAME_REQUIRED: "Username is required",
  INVALID_EMAIL: "Please enter a valid email address",
  PASSWORD_MIN_LENGTH: "Password must be at least 6 characters",
} as const;

// Page messages
export const PAGE_MESSAGES = {
  HOME_TITLE: "Welcome to React App",
  HOME_SUBTITLE: "A modern React application",
  DASHBOARD_TITLE: "Dashboard",
  DASHBOARD_WELCOME: "Welcome back!",
  LOGIN_TITLE: "Login to your account",
  REGISTER_TITLE: "Create a new account",
} as const;

// API messages
export const API_MESSAGES = {
  NETWORK_ERROR: "Network error. Please try again.",
  SERVER_ERROR: "Server error. Please try again later.",
  TIMEOUT_ERROR: "Request timeout. Please try again.",
} as const;

// WebSocket messages
export const WEBSOCKET_MESSAGES = {
  CONNECTED: "Connected to server",
  DISCONNECTED: "Disconnected from server",
  CONNECTION_ERROR: "Failed to connect to server",
  RECONNECTING: "Reconnecting...",
  MAX_RECONNECT_ATTEMPTS: "Maximum reconnection attempts reached",
  INVALID_MESSAGE: "Received invalid message format",
  SEND_ERROR: "Failed to send message",
} as const;
