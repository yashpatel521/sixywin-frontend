import { useState, useEffect } from "react";
import { wsClient } from "@/websocket";
import { MegaPotType } from "@/types/interfaces";

interface UseMegaPotReturn {
  data: MegaPotType | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useMegaPot(): UseMegaPotReturn {
  const [data, setData] = useState<MegaPotType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMegaPot = () => {
    setIsLoading(true);
    setError(null);

    if (wsClient.isConnected()) {
      sendMegaPotRequest();
    } else {
      setTimeout(() => {
        if (wsClient.isConnected()) {
          sendMegaPotRequest();
        } else {
          setError("WebSocket connection failed");
          setIsLoading(false);
        }
      }, 2000);
    }
  };

  const sendMegaPotRequest = () => {
    const requestId = Math.random().toString(36).substring(7);
    let handleMegaPotResponse: (message: any) => void;
    let timeoutId: NodeJS.Timeout;

    // Send request manually with requestId instead of using convenience method
    const success = wsClient.send({
      type: "getMegaPot",
      payload: {},
      requestId: requestId,
      timestamp: new Date().toISOString(),
    });

    if (!success) {
      setError(
        "Failed to request mega pot data. Please check your connection."
      );
      setIsLoading(false);
      return;
    }

    handleMegaPotResponse = (message: any) => {
      if (message.type === "getMegaPot_response") {
        // Handle both regular responses (with requestId) and broadcast updates (without requestId)
        if (message.requestId === requestId) {
          // This is a response to our specific request
          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          if (message.payload.success) {
            const megaPotData: MegaPotType = message.payload.data;
            setData(megaPotData);
            setError(null);
          } else {
            setError(message.payload.message || "Failed to fetch mega pot");
          }
          setIsLoading(false);

          // Clean up listener after processing our response
          wsClient.off("getMegaPot_response", handleMegaPotResponse);
        } else if (!message.requestId) {
          // This is a broadcast update - update data silently
          if (message.payload.success) {
            const megaPotData: MegaPotType = message.payload.data;
            setData(megaPotData);
            setError(null);
            setIsLoading(false);
          }
        }
      }
    };

    wsClient.on("getMegaPot_response", handleMegaPotResponse);

    timeoutId = setTimeout(() => {
      setError("Request timeout. Please try again.");
      setIsLoading(false);
      wsClient.off("getMegaPot_response", handleMegaPotResponse);
    }, 15000); // 15 second timeout

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (handleMegaPotResponse) {
        wsClient.off("getMegaPot_response", handleMegaPotResponse);
      }
    };
  };

  // Initial fetch and cleanup
  useEffect(() => {
    fetchMegaPot();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchMegaPot,
  };
}
