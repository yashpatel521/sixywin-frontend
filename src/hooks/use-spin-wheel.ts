import { useState, useCallback, useEffect, useRef } from "react";
import { wsClient } from "@/websocket";
import { MESSAGE_TYPES } from "@/websocket/constants";
import { tokenStorage } from "@/lib/localStorage";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";
import type { User, UseSpinWheelReturn } from "@/lib/interfaces";

export function useSpinWheel(): UseSpinWheelReturn {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useLocalStorage<User | null>("user", null);
  const { toast } = useToast();

  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectionRetryCount = useRef(0);
  const maxConnectionRetries = 3; // Shorter retry for spin wheel
  const isSpinningRef = useRef(isSpinning);

  // Keep refs in sync with state
  useEffect(() => {
    isSpinningRef.current = isSpinning;
  }, [isSpinning]);

  // Check if user has already spun today
  const hasSpunToday = user?.isSpinned || false;

  const spin = useCallback(
    (prizeValue: number) => {
      if (hasSpunToday) {
        toast({
          variant: "destructive",
          title: "Already Spun!",
          description:
            "You can spin the wheel once per day. Come back tomorrow!",
        });
        return;
      }

      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please log in to spin the wheel.",
        });
        return;
      }

      setIsSpinning(true);
      setError(null);

      // Clear any existing retry timeout
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }

      const attemptSpin = () => {
        if (wsClient.isConnected()) {
          connectionRetryCount.current = 0; // Reset retry count on successful connection

          // Check if we have a token and should authenticate first
          const token = tokenStorage.getToken();
          if (token) {
            // First try to authenticate, then make the request
            authenticateAndSpin(prizeValue);
          } else {
            // No token, just make the request (will likely fail with AUTH_REQUIRED)
            sendSpinRequest(prizeValue);
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
              attemptSpin();
            }, 2000 * connectionRetryCount.current); // Exponential backoff
          } else {
            setError(
              "Unable to connect to server. Please check your internet connection and try again."
            );
            setIsSpinning(false);
            connectionRetryCount.current = 0; // Reset for next attempt
            toast({
              variant: "destructive",
              title: "Connection Error",
              description: "Please check your connection and try again.",
            });
          }
        }
      };

      attemptSpin();
    },
    [user, hasSpunToday, toast, maxConnectionRetries]
  );

  const authenticateAndSpin = (prizeValue: number) => {
    const token = tokenStorage.getToken();
    if (!token) {
      sendSpinRequest(prizeValue);
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
      setIsSpinning(false);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "Failed to authenticate. Please check your connection.",
      });
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
          sendSpinRequest(prizeValue);
        } else {
          // Authentication failed, remove invalid token
          tokenStorage.removeToken();
          setError("Session expired. Please log in again.");
          setIsSpinning(false);
          toast({
            variant: "destructive",
            title: "Session Expired",
            description: "Please log in again to spin the wheel.",
          });
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
        setIsSpinning(false);
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Please log in again to spin the wheel.",
        });
      }
    };

    wsClient.on("authenticate_response", handleAuthResponse);
    wsClient.on("error", handleAuthResponse);

    // Set timeout for auth request - use ref to avoid stale closure
    const authTimeoutId = setTimeout(() => {
      wsClient.off("authenticate_response", handleAuthResponse);
      wsClient.off("error", handleAuthResponse);
      // Check current spinning state using ref instead of stale closure
      if (isSpinningRef.current) {
        setError("Authentication timeout. Please try again.");
        setIsSpinning(false);
        toast({
          variant: "destructive",
          title: "Authentication Timeout",
          description: "Please try again.",
        });
      }
    }, 10000);

    // Store timeout ID for cleanup if needed
    return authTimeoutId;
  };

  const sendSpinRequest = (prizeValue: number) => {
    if (!user) {
      setIsSpinning(false);
      return;
    }

    const requestId = Math.random().toString(36).substring(7);
    let handleSpinWheelResponse: (message: any) => void;
    let timeoutId: NodeJS.Timeout;

    const success = wsClient.send({
      type: MESSAGE_TYPES.SPIN_WHEEL,
      payload: {
        userId: user.id,
        amount: prizeValue,
      },
      requestId,
      timestamp: new Date().toISOString(),
    });

    if (!success) {
      setIsSpinning(false);
      setError("Failed to send spin request. Please check your connection.");
      toast({
        variant: "destructive",
        title: "Connection Error",
        description:
          "Failed to send spin request. Please check your connection.",
      });
      return;
    }

    handleSpinWheelResponse = (message: any) => {
      // Handle error responses from WebSocket server
      if (message.type === "error" && message.requestId === requestId) {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        // Handle authentication errors (fallback case)
        if (message.code === "AUTH_REQUIRED") {
          setError(
            "Authentication required. Please refresh the page or log in again."
          );
          toast({
            variant: "destructive",
            title: "Authentication Required",
            description: "Please refresh the page or log in again.",
          });
        } else if (message.code === "TOKEN_INVALID") {
          // Remove invalid token
          tokenStorage.removeToken();
          setError("Session expired. Please log in again.");
          toast({
            variant: "destructive",
            title: "Session Expired",
            description: "Please log in again.",
          });
        } else {
          setError(message.message || "Failed to process spin");
          toast({
            variant: "destructive",
            title: "Spin Failed",
            description: message.message || "Failed to process spin",
          });
        }

        setIsSpinning(false);
        wsClient.off("spinWheel_response", handleSpinWheelResponse);
        wsClient.off("error", handleSpinWheelResponse);
        return;
      }

      if (
        message.type === "spinWheel_response" &&
        message.requestId === requestId
      ) {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        if (message.payload?.success) {
          const updatedUser = message.payload.data;

          // Update user data directly
          setUser(updatedUser);
          setError(null);

          // Dispatch custom event to notify other components
          window.dispatchEvent(
            new CustomEvent("userDataChanged", {
              detail: updatedUser,
            })
          );

          if (prizeValue > 0) {
            toast({
              title: "You Won!",
              description: `Congratulations! You won ${prizeValue.toLocaleString()} coins.`,
            });
          } else {
            toast({
              variant: "destructive",
              title: "Lose!",
              description: "Try again tomorrow!",
            });
          }
        } else {
          // Spin failed, show error
          setError(message.payload?.message || "Failed to process spin");
          toast({
            variant: "destructive",
            title: "Spin Failed",
            description: message.payload?.message || "Failed to process spin",
          });
        }

        setIsSpinning(false);
        // Clean up listener after processing our response
        wsClient.off("spinWheel_response", handleSpinWheelResponse);
        wsClient.off("error", handleSpinWheelResponse);
      }
    };

    wsClient.on("spinWheel_response", handleSpinWheelResponse);
    wsClient.on("error", handleSpinWheelResponse);

    timeoutId = setTimeout(() => {
      setError("Request timeout. Please try again.");
      // Use ref to check current spinning state instead of stale closure
      if (isSpinningRef.current) {
        setIsSpinning(false);
      }
      wsClient.off("spinWheel_response", handleSpinWheelResponse);
      wsClient.off("error", handleSpinWheelResponse);
      toast({
        variant: "destructive",
        title: "Request Timeout",
        description: "Request timed out. Please try again.",
      });
    }, 15000); // 15 second timeout
  };

  // Connection listener effect
  useEffect(() => {
    const handleConnection = () => {
      // Reset connection retry count when connected
      if (connectionRetryCount.current > 0) {
        console.log("WebSocket reconnected for spin wheel");
        connectionRetryCount.current = 0;
      }
    };

    wsClient.on("connected", handleConnection);

    return () => {
      wsClient.off("connected", handleConnection);
      // Cleanup retry timeout
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  return {
    isSpinning,
    isLoading: isSpinning, // Map isSpinning to isLoading for BaseHookReturn
    rotation,
    user,
    hasSpunToday,
    error,
    spin,
    setRotation,
  };
}
