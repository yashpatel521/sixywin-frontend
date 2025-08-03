import { useState, useEffect, useCallback, useRef } from "react";
import { wsClient } from "@/websocket";
import { differenceInSeconds } from "date-fns";

interface LatestDrawData {
  winningNumbers: number[];
  drawDate: string;
  totalWinners: number;
  totalPrize: number;
  nextDrawTime: string | Date;
}

interface CountdownState {
  hours: number;
  minutes: number;
  seconds: number;
}

interface UseLatestDrawReturn {
  latestDraw: LatestDrawData | null;
  isLoading: boolean;
  error: string | null;
  countdown: CountdownState;
  refetch: () => void;
}

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

    if (wsClient.isConnected()) {
      sendLatestDrawRequest();
    } else {
      setTimeout(() => {
        if (wsClient.isConnected()) {
          sendLatestDrawRequest();
        } else {
          setError("WebSocket connection failed");
          setIsLoading(false);
        }
      }, 2000);
    }
  }, []);

  const sendLatestDrawRequest = () => {
    const requestId = Math.random().toString(36).substring(7);
    let handleLatestDrawResponse: (message: any) => void;
    let timeoutId: NodeJS.Timeout;

    // Use the convenience method
    const success = wsClient.requestLatestDraw();

    if (!success) {
      setError("Failed to request latest draw. Please check your connection.");
      setIsLoading(false);
      return;
    }

    handleLatestDrawResponse = (message: any) => {
      if (message.type === "getLatestDraw_response") {
        // Handle both regular responses (with requestId) and broadcast updates (without requestId)
        if (message.requestId && message.requestId === requestId) {
          // This is a response to our request
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

    timeoutId = setTimeout(() => {
      setError("Request timeout");
      setIsLoading(false);
    }, 10000);

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (handleLatestDrawResponse) {
        wsClient.off("getLatestDraw_response", handleLatestDrawResponse);
      }
    };
  };

  // Initial fetch and periodic refresh
  useEffect(() => {
    fetchLatestDraw();

    // Set up periodic refresh every minute
    const refreshInterval = setInterval(() => {
      if (wsClient.isConnected()) {
        fetchLatestDraw();
      }
    }, 60000);

    return () => {
      clearInterval(refreshInterval);
      // Cleanup countdown when component unmounts
      if (countdownCleanupRef.current) {
        countdownCleanupRef.current();
      }
    };
  }, [fetchLatestDraw]);

  return {
    latestDraw,
    isLoading,
    error,
    countdown,
    refetch: fetchLatestDraw,
  };
}
