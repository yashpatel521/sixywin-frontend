/**
 * WebSocket Constants
 */

export const WEBSOCKET_CONFIG = {
  DEFAULT_URL: import.meta.env.VITE_WS_URL || "ws://localhost:5000",
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

  // Lottery
  SUBMIT_TICKET: "createTicket",
  GET_LEADERBOARD: "leaderboard",
  GET_MEGA_POT: "megaPot",

  // Game
  GAME_ACTION: "game_action",
} as const;
