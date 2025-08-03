/**
 * WebSocket Module - Clean Export Interface
 *
 * @version 1.3.0 - Production-ready with lazy initialization
 * @date August 3, 2025
 */

import { WebSocketClient } from "./client";
import { LotteryWebSocketService, GameWebSocketService } from "./services";
import type { UseWebSocketReturn } from "./hooks";

// Create singleton client instance - but don't connect immediately
let clientInstance: WebSocketClient | null = null;
let lotteryServiceInstance: LotteryWebSocketService | null = null;
let gameServiceInstance: GameWebSocketService | null = null;

// Lazy initialization function
const initializeWebSocket = () => {
  if (!clientInstance) {
    try {
      clientInstance = new WebSocketClient();
      lotteryServiceInstance = new LotteryWebSocketService(clientInstance);
      gameServiceInstance = new GameWebSocketService(clientInstance);

      // Start connection after everything is initialized
      setTimeout(() => {
        if (clientInstance) {
          clientInstance.forceReconnect();
        }
      }, 100);
    } catch (error) {
      console.warn("Failed to initialize WebSocket:", error);
    }
  }
  return {
    wsClient: clientInstance,
    lotteryService: lotteryServiceInstance,
    gameService: gameServiceInstance,
  };
};

// Export function to get initialized client
export const getWebSocketClient = () => {
  const { wsClient } = initializeWebSocket();
  return wsClient;
};

// Export the client instance - initialize on first access
export const wsClient = new Proxy({} as WebSocketClient, {
  get(_target, prop) {
    const client = getWebSocketClient();
    if (client && prop in client) {
      const value = (client as any)[prop];
      return typeof value === "function" ? value.bind(client) : value;
    }
    return undefined;
  },
});

// Export types
export type { WebSocketMessage, ConnectionStatus } from "./types";

// Main hook function - simplified and clean
export const useWebSocket = (): UseWebSocketReturn => {
  const { wsClient, lotteryService, gameService } = initializeWebSocket();

  return {
    // Core WebSocket methods
    send: (message) => wsClient?.send(message) || false,
    on: (event, callback) => wsClient?.on(event, callback),
    off: (event, callback) => wsClient?.off(event, callback),

    // Connection management
    disconnect: () => wsClient?.disconnect(),
    isConnected: () => wsClient?.isConnected() || false,
    getConnectionStatus: () =>
      wsClient?.getConnectionStatus() || "disconnected",
    forceReconnect: () => wsClient?.forceReconnect(),

    // Lottery operations
    submitTicket: (numbers, bid, userId) =>
      lotteryService?.submitTicket(numbers, bid, userId) || false,
    requestLeaderboard: () => lotteryService?.requestLeaderboard() || false,
    requestMegaPot: () => lotteryService?.requestMegaPot() || false,

    // Game operations
    sendGameAction: (action, data) =>
      gameService?.sendGameAction(action, data) || false,
  };
};

// Export services for advanced usage - lazy initialized
export const lotteryService = new Proxy({} as LotteryWebSocketService, {
  get(_target, prop) {
    const { lotteryService: service } = initializeWebSocket();
    if (service && prop in service) {
      const value = (service as any)[prop];
      return typeof value === "function" ? value.bind(service) : value;
    }
    return undefined;
  },
});

export const gameService = new Proxy({} as GameWebSocketService, {
  get(_target, prop) {
    const { gameService: service } = initializeWebSocket();
    if (service && prop in service) {
      const value = (service as any)[prop];
      return typeof value === "function" ? value.bind(service) : value;
    }
    return undefined;
  },
});
