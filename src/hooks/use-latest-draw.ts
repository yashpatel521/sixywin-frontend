import { useState, useEffect, useCallback, useRef } from "react";
import { wsClient } from "@/websocket";
import { MESSAGE_TYPES } from "@/websocket/constants";
import { differenceInSeconds } from "date-fns";
import { tokenStorage } from "@/lib/localStorage";
import type {
  LatestDrawData,
  CountdownState,
  UseLatestDrawReturn,
} from "@/lib/interfaces";

export function useLatestDraw(): UseLatestDrawReturn {
  const [latestDraw, setLatestDraw] = useState<LatestDrawData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<CountdownState>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const countdownCleanupRef = useRef<(() => void) | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectionRetryCount = useRef(0);
  const maxConnectionRetries = 5;
  const isLoadingRef = useRef(isLoading);
  const latestDrawRef = useRef(latestDraw);

  // Keep refs in sync with state
  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    latestDrawRef.current = latestDraw;
  }, [latestDraw]);

  const startCountdown = useCallback((nextDrawTime: string | Date) => {
    const updateCountdown = () => {
      const now = new Date();

      // Handle different formats of nextDrawTime
      let nextDraw: Date;
      if (nextDrawTime instanceof Date) {
        nextDraw = nextDrawTime;
      } else if (typeof nextDrawTime === "string") {
        nextDraw = new Date(nextDrawTime);
      } else {
        // Fallback: calculate next hour from current time
        nextDraw = new Date();
        nextDraw.setHours(nextDraw.getHours() + 1);
        nextDraw.setMinutes(0, 0, 0);
      }

      // Validate the date
      if (isNaN(nextDraw.getTime())) {
        // Invalid date, use fallback
        nextDraw = new Date();
        nextDraw.setHours(nextDraw.getHours() + 1);
        nextDraw.setMinutes(0, 0, 0);
      }

      const totalSeconds = Math.max(0, differenceInSeconds(nextDraw, now));

      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setCountdown({ hours, minutes, seconds });
    };

    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

    // Return cleanup function
    return () => clearInterval(countdownInterval);
  }, []);

  const fetchLatestDraw = useCallback(() => {
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
          sendLatestDrawRequest();
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
  }, [maxConnectionRetries]); // Add maxConnectionRetries as dependency

  const authenticateAndRequest = () => {
    const token = tokenStorage.getToken();
    if (!token) {
      sendLatestDrawRequest();
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
          sendLatestDrawRequest();
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
  const sendLatestDrawRequest = () => {
    const requestId = Math.random().toString(36).substring(7);
    let handleLatestDrawResponse: (message: any) => void;
    let timeoutId: NodeJS.Timeout;

    // Send request directly - no authentication required
    const success = wsClient.send({
      type: MESSAGE_TYPES.GET_LATEST_DRAW,
      payload: {},
      requestId: requestId,
      timestamp: new Date().toISOString(),
    });

    if (!success) {
      setError("Failed to request latest draw. Please check your connection.");
      setIsLoading(false);
      return;
    }

    handleLatestDrawResponse = (message: any) => {
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
          setError(message.message || "Failed to fetch latest draw");
        }

        setIsLoading(false);
        wsClient.off("getLatestDraw_response", handleLatestDrawResponse);
        wsClient.off("error", handleLatestDrawResponse);
        return;
      }

      if (message.type === "getLatestDraw_response") {
        // Handle both regular responses (with requestId) and broadcast updates (without requestId)
        if (message.requestId === requestId) {
          // This is a response to our specific request
          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          if (message.payload?.success) {
            const drawData = message.payload.data;

            // Transform server data to match our interface
            const transformedData: LatestDrawData = {
              winningNumbers: drawData.winningNumbers || [],
              drawDate: drawData.drawDate,
              totalWinners: drawData.totalWinners || 0,
              totalPrize: drawData.totalPrize || 0,
              nextDrawTime: drawData.nextDrawTime,
            };

            setLatestDraw(transformedData);

            // Clean up previous countdown
            if (countdownCleanupRef.current) {
              countdownCleanupRef.current();
            }

            // Start new countdown
            const cleanup = startCountdown(transformedData.nextDrawTime);
            countdownCleanupRef.current = cleanup;

            setError(null);
          } else {
            setError(message.payload?.message || "Failed to fetch latest draw");
          }
          setIsLoading(false);

          // Clean up listener after processing our response
          wsClient.off("getLatestDraw_response", handleLatestDrawResponse);
          wsClient.off("error", handleLatestDrawResponse);
        } else if (!message.requestId) {
          // This is a broadcast update - update data silently
          if (message.payload?.success) {
            const drawData = message.payload.data;

            const transformedData: LatestDrawData = {
              winningNumbers: drawData.winningNumbers || [],
              drawDate: drawData.drawDate,
              totalWinners: drawData.totalWinners || 0,
              totalPrize: drawData.totalPrize || 0,
              nextDrawTime: drawData.nextDrawTime,
            };

            setLatestDraw(transformedData);

            // Clean up previous countdown
            if (countdownCleanupRef.current) {
              countdownCleanupRef.current();
            }

            // Start new countdown
            const cleanup = startCountdown(transformedData.nextDrawTime);
            countdownCleanupRef.current = cleanup;

            setError(null);
            setIsLoading(false);
          }
        }
      }
    };

    wsClient.on("getLatestDraw_response", handleLatestDrawResponse);
    wsClient.on("error", handleLatestDrawResponse);

    timeoutId = setTimeout(() => {
      setError("Request timeout. Please try again.");
      // Use ref to check current loading state instead of stale closure
      if (isLoadingRef.current) {
        setIsLoading(false);
      }
      wsClient.off("getLatestDraw_response", handleLatestDrawResponse);
      wsClient.off("error", handleLatestDrawResponse);
    }, 15000); // 15 second timeout

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (handleLatestDrawResponse) {
        wsClient.off("getLatestDraw_response", handleLatestDrawResponse);
        wsClient.off("error", handleLatestDrawResponse);
      }
    };
  };

  // Connection listener effect
  useEffect(() => {
    const handleConnection = () => {
      // Use refs to avoid stale closure
      if (isLoadingRef.current && !latestDrawRef.current) {
        console.log("WebSocket connected, retrying latest draw request...");
        fetchLatestDraw();
      }
    };

    wsClient.on("connected", handleConnection);

    return () => {
      wsClient.off("connected", handleConnection);
    };
  }, [fetchLatestDraw]);

  // Initial fetch and periodic refresh
  useEffect(() => {
    // Initial fetch
    fetchLatestDraw();

    // Set up periodic refresh every minute
    const refreshInterval = setInterval(() => {
      if (wsClient.isConnected()) {
        fetchLatestDraw();
      }
    }, 60000);

    return () => {
      clearInterval(refreshInterval);

      // Cleanup retry timeout
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }

      // Cleanup countdown when component unmounts
      if (countdownCleanupRef.current) {
        countdownCleanupRef.current();
      }
    };
  }, [fetchLatestDraw]); // Keep fetchLatestDraw dependency for initial setup

  const refetchLatestDraw = useCallback(() => {
    // Reset retry count for manual refetch
    connectionRetryCount.current = 0;
    fetchLatestDraw();
  }, [fetchLatestDraw]);

  return {
    latestDraw,
    data: latestDraw, // Required by BaseHookWithDataReturn
    isLoading,
    error,
    countdown,
    refetch: refetchLatestDraw,
  };
}
