import { useEffect, useCallback } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useWebSocketStore } from "../store/websocketStore";
import type { WebSocketMessage } from "../libs/interfaces";
import { generateHmacSignature } from "../utils/hmac";
import { v4 as uuidv4 } from "uuid"; // For generating unique request IDs
import { WS_URL } from "@/libs/constants";

export const useCentralWebSocket = () => {
  const { setConnected, setLastMessage, addMessage, messageHandlers, token } =
    useWebSocketStore();

  const { sendMessage, lastMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log("WebSocket connection opened.");
      setConnected(true);

      // Auto-authenticate after reconnect/refresh
      if (token) {
        sendSignedMessage("auth", { token });
      }
    },
    onClose: () => {
      console.log("WebSocket connection closed.");
      setConnected(false);
    },
    onMessage: (event) => {
      // console.log("Received message:", JSON.parse(event.data));
      setLastMessage(event.data);
      addMessage(event.data);

      try {
        const parsedMessage: WebSocketMessage = JSON.parse(event.data);
        if (parsedMessage.type && messageHandlers.has(parsedMessage.type)) {
          messageHandlers.get(parsedMessage.type)?.(parsedMessage.payload);
        }
      } catch (error) {
        console.error(
          "Failed to parse WebSocket message or dispatch to handler:",
          error
        );
      }
    },
    shouldReconnect: () => true, // Always reconnect
    reconnectInterval: 3000, // Reconnect every 3 seconds
  });

  const sendSignedMessage = useCallback(
    (type: string, payload: unknown) => {
      const requestId = uuidv4();
      const timestamp = new Date().toISOString(); // Add 5 minutes buffer

      const dataToSign = requestId + timestamp + JSON.stringify(payload);
      const signature = generateHmacSignature(dataToSign);

      const finalMessage = {
        type,
        payload,
        requestId,
        timestamp,
        ...(token && { token }), // Include token if it exists
        signature,
      };

      const finalMessageString = JSON.stringify(finalMessage);
      sendMessage(finalMessageString);
    },
    [sendMessage, token]
  );

  // Update the store's sendMessage function only when connection state changes
  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      useWebSocketStore.setState({ sendMessage: sendSignedMessage });
    }
  }, [readyState, sendSignedMessage]);

  // Update connection status in store
  useEffect(() => {
    setConnected(readyState === ReadyState.OPEN);
  }, [readyState, setConnected]);

  return {
    readyState,
    sendMessage: sendSignedMessage, // Use the new signed message sender
    lastMessage: lastMessage?.data || null, // Return the data part of the message event
  };
};
