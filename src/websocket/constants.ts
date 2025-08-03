/**
 * WebSocket Constants
 */

export const WEBSOCKET_CONFIG = {
  DEFAULT_URL: "ws://localhost:5000", // Use static URL for now to avoid build issues
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
  GET_USER_PROFILE: "getUserProfile",
  SPIN_WHEEL: "spinWheel",

  // Lottery
  SUBMIT_TICKET: "createTicket",
  GET_LEADERBOARD: "getLeaderboard",
  GET_MEGA_POT: "getMegaPot",
  GET_LATEST_DRAW: "getLatestDraw",

  // Game
  GAME_ACTION: "game_action",
} as const;
