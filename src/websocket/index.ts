import { WebSocketMessage } from "../types/interfaces";
import { WEBSOCKET_MESSAGES } from "../constants/messages";

// WebSocket Configuration
const WS_BASE_URL = import.meta.env.VITE_WS_URL || "ws://localhost:5000";

class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, ((message: WebSocketMessage) => void)[]> =
    new Map();

  constructor() {
    this.connect();
  }

  private connect(): void {
    try {
      this.ws = new WebSocket(WS_BASE_URL);

      this.ws.onopen = () => {
        console.log(WEBSOCKET_MESSAGES.CONNECTED);
        this.reconnectAttempts = 0;
        this.emit("connection", {
          type: "connected",
          payload: null,
          timestamp: new Date().toISOString(),
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          this.emit(message.type, message);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      this.ws.onclose = () => {
        console.log(WEBSOCKET_MESSAGES.DISCONNECTED);
        this.emit("disconnection", {
          type: "disconnected",
          payload: null,
          timestamp: new Date().toISOString(),
        });
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error(WEBSOCKET_MESSAGES.CONNECTION_ERROR, error);
        this.emit("error", {
          type: "error",
          payload: error,
          timestamp: new Date().toISOString(),
        });
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      this.handleReconnect();
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `${WEBSOCKET_MESSAGES.RECONNECTING} (Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`
      );

      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error("Max reconnection attempts reached");
    }
  }

  public send(message: WebSocketMessage): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected");
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

  private emit(event: string, message: WebSocketMessage): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(message));
    }
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  // Convenience methods for common message types
  public sendChat(message: string): void {
    this.send({
      type: "chat",
      payload: { message },
      timestamp: new Date().toISOString(),
    });
  }

  public sendGameAction(action: string, data: any): void {
    this.send({
      type: "game_action",
      payload: { action, data },
      timestamp: new Date().toISOString(),
    });
  }

  public joinRoom(roomId: string): void {
    this.send({
      type: "join_room",
      payload: { roomId },
      timestamp: new Date().toISOString(),
    });
  }

  public leaveRoom(roomId: string): void {
    this.send({
      type: "leave_room",
      payload: { roomId },
      timestamp: new Date().toISOString(),
    });
  }
}

// Export singleton instance
export const wsClient = new WebSocketClient();

// Export convenience functions
export const useWebSocket = () => {
  return {
    send: (message: WebSocketMessage) => wsClient.send(message),
    on: (event: string, callback: (message: WebSocketMessage) => void) =>
      wsClient.on(event, callback),
    off: (event: string, callback: (message: WebSocketMessage) => void) =>
      wsClient.off(event, callback),
    disconnect: () => wsClient.disconnect(),
    isConnected: () => wsClient.isConnected(),
    sendChat: (message: string) => wsClient.sendChat(message),
    sendGameAction: (action: string, data: any) =>
      wsClient.sendGameAction(action, data),
    joinRoom: (roomId: string) => wsClient.joinRoom(roomId),
    leaveRoom: (roomId: string) => wsClient.leaveRoom(roomId),
  };
};
