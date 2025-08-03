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
      // Use the convenience method
      const success = wsClient.requestLeaderboard();

      if (!success) {
        setError(
          "Failed to request leaderboard. Please check your connection."
        );
        setIsLoading(false);
        return;
      }

      handleLeaderboardResponse = (message: any) => {
        if (message.type === "leaderboard_response") {
          // Handle both regular responses (with requestId) and broadcast updates (without requestId)
          if (message.requestId && message.requestId === requestId) {
            // This is a response to our request
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

      wsClient.on("leaderboard_response", handleLeaderboardResponse);

      timeoutId = setTimeout(() => {
        setError("Request timeout. Please try again.");
        setIsLoading(false);
      }, 10000);
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
        wsClient.off("leaderboard_response", handleLeaderboardResponse);
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
