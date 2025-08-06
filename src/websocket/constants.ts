/**
 * WebSocket Constants
 */

// Environment-based WebSocket URL configuration
const getWebSocketURL = (): string => {
  // Check if we're in production mode
  const isProduction =
    import.meta.env.MODE === "production" || import.meta.env.PROD;

  // Use environment variable if available, otherwise fallback to defaults
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL;
  }

  // Default URLs based on environment
  return isProduction
    ? "wss://your-production-server.com" // Replace with your production WebSocket URL
    : "ws://localhost:5000";
};

export const WEBSOCKET_CONFIG = {
  DEFAULT_URL: getWebSocketURL(),
  MAX_RECONNECT_ATTEMPTS: 5,
  RECONNECT_DELAY: 1000,
} as const;

export const WEBSOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECTION: "disconnection",
  MESSAGE: "message",
  ERROR: "error",
  PARSE_ERROR: "parse_error",
  SEND_ERROR: "send_error",
  CONNECTION_ERROR: "connection_error",
  MAX_RECONNECT_ATTEMPTS: "max_reconnect_attempts",
} as const;

export const MESSAGE_TYPES = {
  // Connection
  CONNECTED: "connected",
  DISCONNECTED: "disconnected",

  // User Actions
  LOGIN: "login",
  REGISTER: "register",
  AUTHENTICATE: "authenticate", // Token-based authentication
  GET_USER_PROFILE: "getUserProfile",
  SPIN_WHEEL: "spinWheel",

  // Lottery
  SUBMIT_TICKET: "createTicket",
  GET_TICKETS: "getTickets",
  GET_LEADERBOARD: "getLeaderboard",
  GET_MEGA_POT: "getMegaPot",
  GET_LATEST_DRAW: "getLatestDraw",

  // Game
  GAME_ACTION: "game_action",
} as const;
