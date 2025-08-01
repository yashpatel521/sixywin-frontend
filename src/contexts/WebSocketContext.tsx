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
  sendMessage: (message: WebSocketMessage) => void;
  messages: WebSocketMessage[];
  clearMessages: () => void;
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
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);

  useEffect(() => {
    const handleConnection = () => {
      setIsConnected(true);
      console.log("WebSocket connected");
    };

    const handleDisconnection = () => {
      setIsConnected(false);
      console.log("WebSocket disconnected");
    };

    const handleMessage = (message: WebSocketMessage) => {
      setMessages((prev) => [...prev, message]);
    };

    wsClient.on("connection", handleConnection);
    wsClient.on("disconnection", handleDisconnection);
    wsClient.on("message", handleMessage);

    setIsConnected(wsClient.isConnected());

    return () => {
      wsClient.off("connection", handleConnection);
      wsClient.off("disconnection", handleDisconnection);
      wsClient.off("message", handleMessage);
    };
  }, []);

  const sendMessage = (message: WebSocketMessage) => {
    wsClient.send(message);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const value: WebSocketContextType = {
    isConnected,
    sendMessage,
    messages,
    clearMessages,
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
