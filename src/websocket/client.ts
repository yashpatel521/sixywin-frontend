/**
 * WebSocket Client Core Implementation
 */

import { WEBSOCKET_MESSAGES } from "../lib/messages";
import { MessageValidator } from "./validators";
import { WEBSOCKET_CONFIG, WEBSOCKET_EVENTS, MESSAGE_TYPES } from "./constants";
import type {
  WebSocketMessage,
  ConnectionStatus,
  WebSocketConfig,
} from "./types";

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts: number;
  private readonly reconnectDelay: number;
  private readonly url: string;
  private listeners: Map<string, ((message: WebSocketMessage) => void)[]> =
    new Map();
  private connectionStatus: ConnectionStatus = "disconnected";

  constructor(config?: Partial<WebSocketConfig>) {
    this.url = config?.url || WEBSOCKET_CONFIG.DEFAULT_URL;
    this.maxReconnectAttempts =
      config?.maxReconnectAttempts || WEBSOCKET_CONFIG.MAX_RECONNECT_ATTEMPTS;
    this.reconnectDelay =
      config?.reconnectDelay || WEBSOCKET_CONFIG.RECONNECT_DELAY;

    // Log the WebSocket URL being used (helpful for debugging)
    console.log(`WebSocket configured for: ${this.url}`);

    // DO NOT connect immediately in constructor
    // This prevents initialization issues in production builds
    // Connection will be initiated when needed
  }

  // Connection Management
  private connect(): void {
    if (this.ws?.readyState === WebSocket.CONNECTING) {
      return;
    }

    try {
      this.connectionStatus = "connecting";

      // Additional safety check for WebSocket availability
      if (typeof WebSocket === "undefined") {
        console.warn("WebSocket not available in this environment");
        this.connectionStatus = "disconnected";
        return;
      }

      this.ws = new WebSocket(this.url);
      this.setupEventHandlers();
    } catch (error) {
      console.warn("WebSocket connection failed:", error);
      this.connectionStatus = "disconnected";

      // Don't immediately retry in case of connection issues
      // Let the application start normally
      setTimeout(() => {
        if (this.connectionStatus === "disconnected") {
          this.handleReconnect();
        }
      }, this.reconnectDelay);
    }
  }

  private setupEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log(WEBSOCKET_MESSAGES.CONNECTED);
      this.connectionStatus = "connected";
      this.reconnectAttempts = 0;
      this.emit(WEBSOCKET_EVENTS.CONNECTION, {
        type: MESSAGE_TYPES.CONNECTED,
        payload: { status: "connected" },
        timestamp: new Date().toISOString(),
      });
    };

    this.ws.onmessage = (event) => {
      this.handleMessage(event);
    };

    this.ws.onclose = (event) => {
      console.log(WEBSOCKET_MESSAGES.DISCONNECTED);
      this.connectionStatus = "disconnected";
      this.emit(WEBSOCKET_EVENTS.DISCONNECTION, {
        type: MESSAGE_TYPES.DISCONNECTED,
        payload: { code: event.code, reason: event.reason },
        timestamp: new Date().toISOString(),
      });
      this.handleReconnect();
    };

    this.ws.onerror = (error) => {
      console.error(WEBSOCKET_MESSAGES.CONNECTION_ERROR, error);
      this.connectionStatus = "error";
      this.emit(WEBSOCKET_EVENTS.ERROR, {
        type: WEBSOCKET_EVENTS.CONNECTION_ERROR,
        payload: { error: "WebSocket connection error" },
        timestamp: new Date().toISOString(),
      });
    };
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const rawData = JSON.parse(event.data);
      const validatedMessage = MessageValidator.validate(rawData);

      if (validatedMessage) {
        this.emit(validatedMessage.type, validatedMessage);
        this.emit(WEBSOCKET_EVENTS.MESSAGE, validatedMessage);
      } else {
        console.error("Received invalid message format:", event.data);
      }
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error);
      this.emit(WEBSOCKET_EVENTS.PARSE_ERROR, {
        type: WEBSOCKET_EVENTS.PARSE_ERROR,
        payload: {
          error: error instanceof Error ? error.message : "Unknown parse error",
          rawData: event.data,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `${WEBSOCKET_MESSAGES.RECONNECTING} Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`
      );

      setTimeout(() => {
        if (this.connectionStatus !== "connected") {
          this.connect();
        }
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error(
        "Max reconnection attempts reached. WebSocket connection failed."
      );
      this.emit(WEBSOCKET_EVENTS.MAX_RECONNECT_ATTEMPTS, {
        type: WEBSOCKET_EVENTS.MAX_RECONNECT_ATTEMPTS,
        payload: { attempts: this.maxReconnectAttempts },
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Event Management
  private emit(event: string, message: WebSocketMessage): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => {
        try {
          callback(message);
        } catch (error) {
          console.error(
            `Error in WebSocket event handler for '${event}':`,
            error
          );
        }
      });
    }
  }

  // Public API
  public send(message: WebSocketMessage): boolean {
    if (!this.isConnected()) {
      console.error(
        "WebSocket is not connected. Cannot send message:",
        message.type
      );
      return false;
    }

    if (!MessageValidator.validateOutgoing(message)) {
      return false;
    }

    try {
      if (!message.timestamp) {
        message.timestamp = new Date().toISOString();
      }

      this.ws!.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error("Failed to send WebSocket message:", error);
      this.emit(WEBSOCKET_EVENTS.SEND_ERROR, {
        type: WEBSOCKET_EVENTS.SEND_ERROR,
        payload: {
          error: error instanceof Error ? error.message : "Unknown send error",
          originalMessage: message,
        },
        timestamp: new Date().toISOString(),
      });
      return false;
    }
  }

  public on(
    event: string,
    callback: (message: WebSocketMessage) => void
  ): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  public off(
    event: string,
    callback: (message: WebSocketMessage) => void
  ): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, "Client disconnect");
      this.ws = null;
      this.connectionStatus = "disconnected";
    }
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  public getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  public forceReconnect(): void {
    this.disconnect();
    this.reconnectAttempts = 0;
    setTimeout(() => this.connect(), 100);
  }

  // Convenience methods for backward compatibility
  public submitTicket(
    numbers: number[],
    bid: number,
    userId?: string
  ): boolean {
    if (!MessageValidator.validateTicket(numbers, bid)) {
      return false;
    }

    return this.send({
      type: MESSAGE_TYPES.SUBMIT_TICKET,
      payload: { numbers, bid, userId },
      timestamp: new Date().toISOString(),
    });
  }

  public requestLeaderboard(): boolean {
    return this.send({
      type: MESSAGE_TYPES.GET_LEADERBOARD,
      payload: {},
      timestamp: new Date().toISOString(),
    });
  }

  public requestMegaPot(): boolean {
    return this.send({
      type: MESSAGE_TYPES.GET_MEGA_POT,
      payload: {},
      timestamp: new Date().toISOString(),
    });
  }

  public requestLatestDraw(): boolean {
    return this.send({
      type: MESSAGE_TYPES.GET_LATEST_DRAW,
      payload: {},
      timestamp: new Date().toISOString(),
    });
  }

  public requestUserProfile(userId: string): boolean {
    if (!userId || typeof userId !== "string") {
      return false;
    }

    return this.send({
      type: MESSAGE_TYPES.GET_USER_PROFILE,
      payload: { id: userId },
      timestamp: new Date().toISOString(),
    });
  }

  public sendGameAction(action: string, data: any): boolean {
    if (!MessageValidator.validateGameAction(action)) {
      return false;
    }

    return this.send({
      type: MESSAGE_TYPES.GAME_ACTION,
      payload: { action: action.trim(), data },
      timestamp: new Date().toISOString(),
    });
  }
}
