import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { wsClient } from "../websocket";
import { WebSocketMessage } from "../types/interfaces";

interface WebSocketContextType {
  isConnected: boolean;
  connectionStatus: string;
  sendMessage: (message: WebSocketMessage) => boolean;
  messages: WebSocketMessage[];
  clearMessages: () => void;
  forceReconnect: () => void;
  // Enhanced convenience methods
  submitTicket: (numbers: number[], bid: number, userId?: string) => boolean;
  requestLeaderboard: () => boolean;
  requestMegaPot: () => boolean;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);

  useEffect(() => {
    const handleConnection = () => {
      setIsConnected(true);
      setConnectionStatus("connected");
      console.log("WebSocket connected");
    };

    const handleDisconnection = () => {
      setIsConnected(false);
      setConnectionStatus("disconnected");
      console.log("WebSocket disconnected");
    };

    const handleMessage = (message: WebSocketMessage) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleError = (message: WebSocketMessage) => {
      console.error("WebSocket error:", message.payload);
      setConnectionStatus("error");
    };

    const handleMaxReconnectAttempts = () => {
      setConnectionStatus("failed");
      console.error("Max reconnection attempts reached");
    };

    // Set up event listeners
    wsClient.on("connection", handleConnection);
    wsClient.on("disconnection", handleDisconnection);
    wsClient.on("message", handleMessage);
    wsClient.on("error", handleError);
    wsClient.on("parse_error", handleError);
    wsClient.on("send_error", handleError);
    wsClient.on("connection_error", handleError);
    wsClient.on("max_reconnect_attempts", handleMaxReconnectAttempts);

    // Set initial connection state
    setIsConnected(wsClient.isConnected());
    setConnectionStatus(wsClient.getConnectionStatus());

    return () => {
      // Clean up event listeners
      wsClient.off("connection", handleConnection);
      wsClient.off("disconnection", handleDisconnection);
      wsClient.off("message", handleMessage);
      wsClient.off("error", handleError);
      wsClient.off("parse_error", handleError);
      wsClient.off("send_error", handleError);
      wsClient.off("connection_error", handleError);
      wsClient.off("max_reconnect_attempts", handleMaxReconnectAttempts);
    };
  }, []);

  const sendMessage = (message: WebSocketMessage): boolean => {
    return wsClient.send(message);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const forceReconnect = () => {
    wsClient.forceReconnect();
  };

  // Enhanced convenience methods
  const submitTicket = (
    numbers: number[],
    bid: number,
    userId?: string
  ): boolean => {
    return wsClient.submitTicket(numbers, bid, userId);
  };

  const requestLeaderboard = (): boolean => {
    return wsClient.requestLeaderboard();
  };

  const requestMegaPot = (): boolean => {
    return wsClient.requestMegaPot();
  };

  const value: WebSocketContextType = {
    isConnected,
    connectionStatus,
    sendMessage,
    messages,
    clearMessages,
    forceReconnect,
    submitTicket,
    requestLeaderboard,
    requestMegaPot,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
