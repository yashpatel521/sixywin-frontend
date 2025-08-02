/**
 * React Hooks for WebSocket
 */

import type { WebSocketMessage } from "./types";

export interface UseWebSocketReturn {
  // Core methods
  send: (message: WebSocketMessage) => boolean;
  on: (event: string, callback: (message: WebSocketMessage) => void) => void;
  off: (event: string, callback: (message: WebSocketMessage) => void) => void;

  // Connection management
  disconnect: () => void;
  isConnected: () => boolean;
  getConnectionStatus: () => string;
  forceReconnect: () => void;

  // Lottery-specific methods
  submitTicket: (numbers: number[], bid: number) => boolean;
  requestLeaderboard: () => boolean;
  requestMegaPot: () => boolean;

  // Game methods
  sendGameAction: (action: string, data: any) => boolean;
}
