/**
 * WebSocket Types and Interfaces
 */

import { WebSocketMessage } from "@/lib/interfaces";

export interface ValidatedMessage {
  type: string;
  payload: any;
  timestamp: string;
  requestId?: string;
}

export type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export interface WebSocketConfig {
  url: string;
  maxReconnectAttempts: number;
  reconnectDelay: number;
}

export interface WebSocketEventHandlers {
  onConnection?: () => void;
  onDisconnection?: (event: CloseEvent) => void;
  onError?: (error: Event) => void;
  onMessage?: (message: WebSocketMessage) => void;
}

export type { WebSocketMessage };
