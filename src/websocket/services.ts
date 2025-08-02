/**
 * WebSocket Convenience Methods
 * Specialized methods for lottery platform functionality
 */

import { WebSocketClient } from "./client";
import { MessageValidator } from "./validators";
import { MESSAGE_TYPES } from "./constants";

export class LotteryWebSocketService {
  constructor(private client: WebSocketClient) {}

  /**
   * Submit a lottery ticket
   */
  submitTicket(numbers: number[], bid: number): boolean {
    if (!MessageValidator.validateTicket(numbers, bid)) {
      return false;
    }

    return this.client.send({
      type: MESSAGE_TYPES.SUBMIT_TICKET,
      payload: { numbers, bid },
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Request current leaderboard
   */
  requestLeaderboard(): boolean {
    return this.client.send({
      type: MESSAGE_TYPES.GET_LEADERBOARD,
      payload: {},
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Request mega pot information
   */
  requestMegaPot(): boolean {
    return this.client.send({
      type: MESSAGE_TYPES.GET_MEGA_POT,
      payload: {},
      timestamp: new Date().toISOString(),
    });
  }
}

export class GameWebSocketService {
  constructor(private client: WebSocketClient) {}

  /**
   * Send game action
   */
  sendGameAction(action: string, data: any): boolean {
    if (!MessageValidator.validateGameAction(action)) {
      return false;
    }

    return this.client.send({
      type: MESSAGE_TYPES.GAME_ACTION,
      payload: { action: action.trim(), data },
      timestamp: new Date().toISOString(),
    });
  }
}
