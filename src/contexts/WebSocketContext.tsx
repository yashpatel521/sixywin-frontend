import React, { createContext } from "react";
import type { ReactNode } from "react";
import { useCentralWebSocket } from "../hooks/useWebSocket";
import { ReadyState } from "react-use-websocket";

interface WebSocketContextType {
  readyState: ReadyState;
  sendMessage: (type: string, payload: unknown) => void;
  lastMessage: string | null;
}

export const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { readyState, sendMessage, lastMessage } = useCentralWebSocket();

  return (
    <WebSocketContext.Provider value={{ readyState, sendMessage, lastMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};
