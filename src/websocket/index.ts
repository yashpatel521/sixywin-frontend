/**
 * WebSocket Module - Clean Export Interface
 *
 * @version 3.0.0 - Refactored and Modularized
 * @date August 2, 2025
 */

import { WebSocketClient } from "./client";
import { LotteryWebSocketService, GameWebSocketService } from "./services";
import type { UseWebSocketReturn } from "./hooks";

// Create singleton client instance
const wsClient = new WebSocketClient();

// Create service instances
const lotteryService = new LotteryWebSocketService(wsClient);
const gameService = new GameWebSocketService(wsClient);

// Export the client instance for direct access if needed
export { wsClient };

// Export types
export type { WebSocketMessage, ConnectionStatus } from "./types";

// Main hook function - simplified and clean
export const useWebSocket = (): UseWebSocketReturn => {
  return {
    // Core WebSocket methods
    send: (message) => wsClient.send(message),
    on: (event, callback) => wsClient.on(event, callback),
    off: (event, callback) => wsClient.off(event, callback),

    // Connection management
    disconnect: () => wsClient.disconnect(),
    isConnected: () => wsClient.isConnected(),
    getConnectionStatus: () => wsClient.getConnectionStatus(),
    forceReconnect: () => wsClient.forceReconnect(),

    // Lottery operations
    submitTicket: (numbers, bid, userId) =>
      lotteryService.submitTicket(numbers, bid, userId),
    requestLeaderboard: () => lotteryService.requestLeaderboard(),
    requestMegaPot: () => lotteryService.requestMegaPot(),

    // Game operations
    sendGameAction: (action, data) => gameService.sendGameAction(action, data),
  };
};
