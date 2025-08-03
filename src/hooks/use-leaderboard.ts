import { useState, useEffect } from "react";
import { wsClient } from "@/websocket";

interface LeaderboardPlayer {
  id: number;
  username: string;
  avatar: string;
  coins: number;
  totalWon: number;
  todayBid: string;
  todayTicketBuy: string;
}

interface UseLeaderboardReturn {
  players: LeaderboardPlayer[];
  isLoading: boolean;
  error: string | null;
  isUpdating: boolean;
  refetch: () => void;
}

export function useLeaderboard(): UseLeaderboardReturn {
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchLeaderboard = () => {
    setIsLoading(true);
    setError(null);

    const requestId = Math.random().toString(36).substring(7);
    let timeoutId: NodeJS.Timeout;
    let handleLeaderboardResponse: (message: any) => void;

    const sendRequest = () => {
      // Send request manually with requestId instead of using convenience method
      const success = wsClient.send({
        type: "getLeaderboard",
        payload: {},
        requestId: requestId,
        timestamp: new Date().toISOString(),
      });

      if (!success) {
        setError(
          "Failed to request leaderboard. Please check your connection."
        );
        setIsLoading(false);
        return;
      }

      handleLeaderboardResponse = (message: any) => {
        if (message.type === "getLeaderboard_response") {
          // Handle both regular responses (with requestId) and broadcast updates (without requestId)
          if (message.requestId === requestId) {
            // This is a response to our specific request
            if (timeoutId) {
              clearTimeout(timeoutId);
            }

            if (message.payload.success) {
              setPlayers(message.payload.data);
              setError(null);
            } else {
              setError(
                message.payload.message || "Failed to fetch leaderboard"
              );
            }
            setIsLoading(false);

            // Clean up listener after processing our response
            wsClient.off("getLeaderboard_response", handleLeaderboardResponse);
          } else if (!message.requestId) {
            // This is a broadcast update
            if (message.payload.success) {
              setPlayers(message.payload.data);
              setError(null);
              setIsLoading(false);
              setIsUpdating(true);
              setTimeout(() => setIsUpdating(false), 1000);
            }
          }
        }
      };

      wsClient.on("getLeaderboard_response", handleLeaderboardResponse);

      timeoutId = setTimeout(() => {
        setError("Request timeout. Please try again.");
        setIsLoading(false);
        wsClient.off("getLeaderboard_response", handleLeaderboardResponse);
      }, 15000); // 15 second timeout
    };

    // Wait for WebSocket connection if not connected
    if (!wsClient.isConnected()) {
      setError("Connecting to server...");

      const connectionTimeout = setTimeout(() => {
        setError("Connection failed. Please refresh the page.");
        setIsLoading(false);
      }, 5000);

      const connectionCheckInterval = setInterval(() => {
        if (wsClient.isConnected()) {
          clearTimeout(connectionTimeout);
          clearInterval(connectionCheckInterval);
          setError(null);
          sendRequest();
        }
      }, 100);
    } else {
      sendRequest();
    }

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (handleLeaderboardResponse) {
        wsClient.off("getLeaderboard_response", handleLeaderboardResponse);
      }
    };
  };

  useEffect(() => {
    const cleanup = fetchLeaderboard();
    return cleanup;
  }, []);

  return {
    players,
    isLoading,
    error,
    isUpdating,
    refetch: fetchLeaderboard,
  };
}
