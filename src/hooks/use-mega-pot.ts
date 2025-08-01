"use client";

import { useState, useEffect } from "react";
import { wsClient } from "@/websocket";

export const useMegaPot = () => {
  const [pot, setPot] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMegaPot = () => {
      if (!wsClient.isConnected()) {
        // Wait for connection
        const connectionTimeout = setTimeout(() => {
          setError("Connection timeout");
          setIsLoading(false);
        }, 5000);

        const connectionCheckInterval = setInterval(() => {
          if (wsClient.isConnected()) {
            clearTimeout(connectionTimeout);
            clearInterval(connectionCheckInterval);
            sendMegaPotRequest();
          }
        }, 100);

        return;
      }

      sendMegaPotRequest();
    };

    const sendMegaPotRequest = () => {
      const requestId = Math.random().toString(36).substring(7);
      let handleMegaPotResponse: (message: any) => void;
      let timeoutId: NodeJS.Timeout;

      wsClient.send({
        type: "megaPot",
        requestId,
        payload: {},
        timestamp: new Date().toISOString(),
      });

      handleMegaPotResponse = (message: any) => {
        if (
          message.type === "megaPot_response" &&
          message.requestId === requestId
        ) {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          if (message.payload.success) {
            setPot(message.payload.data.pot || 0);
            setError(null);
          } else {
            setError(message.payload.message || "Failed to fetch mega pot");
          }
          setIsLoading(false);
        }
      };

      wsClient.on("megaPot_response", handleMegaPotResponse);

      timeoutId = setTimeout(() => {
        setError("Request timeout");
        setIsLoading(false);
      }, 10000);

      // Cleanup function
      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (handleMegaPotResponse) {
          wsClient.off("megaPot_response", handleMegaPotResponse);
        }
      };
    };

    fetchMegaPot();
  }, []);

  return { pot, isLoading, error };
};
