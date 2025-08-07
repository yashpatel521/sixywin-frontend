import { useState, useEffect, useCallback, useRef } from "react";
import { wsClient } from "@/websocket";
import { MESSAGE_TYPES } from "@/websocket/constants";
import { tokenStorage } from "@/lib/localStorage";
import type { LeaderboardUser, UseLeaderboardReturn } from "@/lib/interfaces";

export function useLeaderboard(): UseLeaderboardReturn {
  const [players, setPlayers] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectionRetryCount = useRef(0);
  const maxConnectionRetries = 5;
  const isLoadingRef = useRef(isLoading);
  const playersRef = useRef(players);

  // Keep refs in sync with state
  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    playersRef.current = players;
  }, [players]);

  const fetchLeaderboard = useCallback(() => {
    setIsLoading(true);
    setError(null);

    // Clear any existing retry timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    const attemptRequest = () => {
      if (wsClient.isConnected()) {
        connectionRetryCount.current = 0; // Reset retry count on successful connection

        // Check if we have a token and should authenticate first
        const token = tokenStorage.getToken();
        if (token) {
          // First try to authenticate, then make the request
          authenticateAndRequest();
        } else {
          // No token, just make the request (will likely fail with AUTH_REQUIRED)
          sendLeaderboardRequest();
        }
      } else {
        // WebSocket not connected, try to establish connection and retry
        if (connectionRetryCount.current < maxConnectionRetries) {
          connectionRetryCount.current++;
          console.log(
            `WebSocket not connected. Retry attempt ${connectionRetryCount.current}/${maxConnectionRetries}`
          );

          // Try to force reconnect
          wsClient.forceReconnect();

          retryTimeoutRef.current = setTimeout(() => {
            attemptRequest();
          }, 2000 * connectionRetryCount.current); // Exponential backoff
        } else {
          setError(
            "Unable to connect to server. Please check your internet connection and try again."
          );
          setIsLoading(false);
          connectionRetryCount.current = 0; // Reset for next attempt
        }
      }
    };

    attemptRequest();
  }, [maxConnectionRetries]);

  const authenticateAndRequest = () => {
    const token = tokenStorage.getToken();
    if (!token) {
      sendLeaderboardRequest();
      return;
    }

    const authRequestId = Math.random().toString(36).substring(7);

    // Send authenticate message first
    const authSuccess = wsClient.send({
      type: MESSAGE_TYPES.AUTHENTICATE,
      payload: { token },
      requestId: authRequestId,
      timestamp: new Date().toISOString(),
    });

    if (!authSuccess) {
      setError("Failed to authenticate. Please check your connection.");
      setIsLoading(false);
      return;
    }

    // Listen for authenticate response
    const handleAuthResponse = (authMessage: any) => {
      if (
        authMessage.type === "authenticate_response" &&
        authMessage.requestId === authRequestId
      ) {
        wsClient.off("authenticate_response", handleAuthResponse);
        wsClient.off("error", handleAuthResponse);

        if (authMessage.payload?.success) {
          // Authentication successful, now make the original request
          sendLeaderboardRequest();
        } else {
          // Authentication failed, remove invalid token
          tokenStorage.removeToken();
          setError("Session expired. Please log in again.");
          setIsLoading(false);
        }
      } else if (
        authMessage.type === "error" &&
        authMessage.requestId === authRequestId
      ) {
        wsClient.off("authenticate_response", handleAuthResponse);
        wsClient.off("error", handleAuthResponse);

        // Authentication failed, remove invalid token
        tokenStorage.removeToken();
        setError("Session expired. Please log in again.");
        setIsLoading(false);
      }
    };

    wsClient.on("authenticate_response", handleAuthResponse);
    wsClient.on("error", handleAuthResponse);

    // Set timeout for auth request - use ref to avoid stale closure
    const authTimeoutId = setTimeout(() => {
      wsClient.off("authenticate_response", handleAuthResponse);
      wsClient.off("error", handleAuthResponse);
      // Check current loading state using ref instead of stale closure
      if (isLoadingRef.current) {
        setError("Authentication timeout. Please try again.");
        setIsLoading(false);
      }
    }, 10000);

    // Store timeout ID for cleanup if needed
    return authTimeoutId;
  };

  const sendLeaderboardRequest = () => {
    const requestId = Math.random().toString(36).substring(7);
    let handleLeaderboardResponse: (message: any) => void;
    let timeoutId: NodeJS.Timeout;

    // Send request directly
    const success = wsClient.send({
      type: MESSAGE_TYPES.GET_LEADERBOARD,
      payload: {},
      requestId: requestId,
      timestamp: new Date().toISOString(),
    });

    if (!success) {
      setError("Failed to request leaderboard. Please check your connection.");
      setIsLoading(false);
      return;
    }

    handleLeaderboardResponse = (message: any) => {
      // Handle error responses from WebSocket server
      if (message.type === "error" && message.requestId === requestId) {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        // Handle authentication errors (fallback case)
        if (message.code === "AUTH_REQUIRED") {
          // This shouldn't happen often since we authenticate proactively
          setError(
            "Authentication required. Please refresh the page or log in again."
          );
        } else if (message.code === "TOKEN_INVALID") {
          // Remove invalid token
          tokenStorage.removeToken();
          setError("Session expired. Please log in again.");
        } else {
          setError(message.message || "Failed to fetch leaderboard");
        }

        setIsLoading(false);
        wsClient.off("getLeaderboard_response", handleLeaderboardResponse);
        wsClient.off("error", handleLeaderboardResponse);
        return;
      }

      if (message.type === "getLeaderboard_response") {
        // Handle both regular responses (with requestId) and broadcast updates (without requestId)
        if (message.requestId === requestId) {
          // This is a response to our specific request
          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          if (message.payload?.success) {
            setPlayers(message.payload.data);
            setError(null);
          } else {
            setError(message.payload?.message || "Failed to fetch leaderboard");
          }
          setIsLoading(false);

          // Clean up listener after processing our response
          wsClient.off("getLeaderboard_response", handleLeaderboardResponse);
          wsClient.off("error", handleLeaderboardResponse);
        } else if (!message.requestId) {
          // This is a broadcast update - update data silently
          if (message.payload?.success) {
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
    wsClient.on("error", handleLeaderboardResponse);

    timeoutId = setTimeout(() => {
      setError("Request timeout. Please try again.");
      // Use ref to check current loading state instead of stale closure
      if (isLoadingRef.current) {
        setIsLoading(false);
      }
      wsClient.off("getLeaderboard_response", handleLeaderboardResponse);
      wsClient.off("error", handleLeaderboardResponse);
    }, 15000); // 15 second timeout

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (handleLeaderboardResponse) {
        wsClient.off("getLeaderboard_response", handleLeaderboardResponse);
        wsClient.off("error", handleLeaderboardResponse);
      }
    };
  };

  // Connection listener effect
  useEffect(() => {
    const handleConnection = () => {
      // Use refs to avoid stale closure
      if (isLoadingRef.current && playersRef.current.length === 0) {
        console.log("WebSocket connected, retrying leaderboard request...");
        fetchLeaderboard();
      }
    };

    wsClient.on("connected", handleConnection);

    return () => {
      wsClient.off("connected", handleConnection);
    };
  }, [fetchLeaderboard]);

  // Initial fetch and cleanup
  useEffect(() => {
    // Initial fetch
    fetchLeaderboard();

    return () => {
      // Cleanup retry timeout
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [fetchLeaderboard]);

  const refetchLeaderboard = useCallback(() => {
    // Reset retry count for manual refetch
    connectionRetryCount.current = 0;
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  return {
    players,
    isLoading,
    error,
    isUpdating,
    refetch: refetchLeaderboard,
  };
}
