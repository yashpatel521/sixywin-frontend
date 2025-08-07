import { useState, useEffect, useRef } from "react";
import { wsClient } from "@/websocket";
import { MESSAGE_TYPES } from "@/websocket/constants";
import { tokenStorage } from "@/lib/localStorage";
import { useToast } from "@/hooks/use-toast";
import type { User, UseUserProfileReturn } from "@/lib/interfaces";

export function useUserProfile(
  userId: string | undefined
): UseUserProfileReturn {
  const [userData, setUserData] = useState<User | null>(null);
  const [referredUsers, setReferredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUserNotFound, setIsUserNotFound] = useState(false);
  const { toast } = useToast();

  // Refs to prevent stale closures
  const isLoadingRef = useRef(isLoading);

  // Keep refs in sync with state
  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  const fetchUserProfile = () => {
    if (!userId) {
      setError("User ID is required to load profile.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsUserNotFound(false);

    // Wait for WebSocket connection if not connected
    if (!wsClient.isConnected()) {
      setError("Connecting to server...");

      let connectionRetryCount = 0;
      const maxRetries = 3;

      const attemptFetch = () => {
        if (wsClient.isConnected()) {
          authenticateAndFetch();
          return;
        }

        if (connectionRetryCount >= maxRetries) {
          setError(
            "Unable to connect to server. Please check your internet connection and try again."
          );
          setIsLoading(false);
          toast({
            variant: "destructive",
            title: "Connection Error",
            description: "Please check your connection and try again.",
          });
          return;
        }

        connectionRetryCount++;

        // Try to force reconnect
        wsClient.forceReconnect();

        setTimeout(() => {
          attemptFetch();
        }, 2000 * connectionRetryCount); // Exponential backoff
      };

      attemptFetch();
      return;
    }

    authenticateAndFetch();
  };

  const authenticateAndFetch = () => {
    const token = tokenStorage.getToken();
    if (!token) {
      sendUserProfileRequest();
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
          sendUserProfileRequest();
        } else {
          // Authentication failed, remove invalid token
          tokenStorage.removeToken();
          setError("Session expired. Please log in again.");
          setIsLoading(false);
          toast({
            variant: "destructive",
            title: "Session Expired",
            description: "Please log in again to view profile.",
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
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Please log in again to view profile.",
        });
      }
    };

    wsClient.on("authenticate_response", handleAuthResponse);
    wsClient.on("error", handleAuthResponse);

    // Set timeout for auth request
    const authTimeoutId = setTimeout(() => {
      wsClient.off("authenticate_response", handleAuthResponse);
      wsClient.off("error", handleAuthResponse);
      // Check current loading state using ref instead of stale closure
      if (isLoadingRef.current) {
        setError("Authentication timeout. Please try again.");
        setIsLoading(false);
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

  const sendUserProfileRequest = () => {
    const requestId = Math.random().toString(36).substring(7);
    let handleUserProfileResponse: (message: any) => void;
    let timeoutId: NodeJS.Timeout;

    const success = wsClient.send({
      type: MESSAGE_TYPES.GET_USER_PROFILE,
      payload: { id: userId }, // Backend expects 'id', not 'userId'
      requestId: requestId,
      timestamp: new Date().toISOString(),
    });

    if (!success) {
      setError("Failed to send profile request. Please check your connection.");
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description:
          "Failed to send profile request. Please check your connection.",
      });
      return;
    }

    handleUserProfileResponse = (message: any) => {
      // Handle error responses from WebSocket server
      if (message.type === "error" && message.requestId === requestId) {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        // Handle authentication errors (fallback case)
        if (message.code === "AUTH_REQUIRED") {
          setError("Session expired. Please log in again.");
          toast({
            variant: "destructive",
            title: "Session Expired",
            description: "Please log in again to view profile.",
          });
        } else {
          setError(message.message || "Failed to fetch user profile");
          toast({
            variant: "destructive",
            title: "Profile Error",
            description: message.message || "Failed to fetch user profile",
          });
        }

        setIsLoading(false);
        wsClient.off("getUserProfile_response", handleUserProfileResponse);
        wsClient.off("error", handleUserProfileResponse);
        return;
      }

      if (
        message.type === "getUserProfile_response" &&
        message.requestId === requestId
      ) {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        if (message.payload?.success) {
          setUserData(message?.payload?.data?.user);
          setReferredUsers(message?.payload?.data?.referredUsers || []);
          setError(null);
          setIsUserNotFound(false);
        } else {
          if (message.payload?.message?.includes("not found")) {
            setIsUserNotFound(true);
            setError(null);
          } else {
            setError(
              message.payload?.message || "Failed to fetch user profile"
            );
            toast({
              variant: "destructive",
              title: "Profile Error",
              description:
                message.payload?.message || "Failed to fetch user profile",
            });
          }
        }
        setIsLoading(false);

        // Clean up listener after processing our response
        wsClient.off("getUserProfile_response", handleUserProfileResponse);
        wsClient.off("error", handleUserProfileResponse);
      }
    };

    wsClient.on("getUserProfile_response", handleUserProfileResponse);
    wsClient.on("error", handleUserProfileResponse);

    timeoutId = setTimeout(() => {
      setError("Request timeout. Please try again.");
      // Use ref to check current loading state instead of stale closure
      if (isLoadingRef.current) {
        setIsLoading(false);
      }
      wsClient.off("getUserProfile_response", handleUserProfileResponse);
      wsClient.off("error", handleUserProfileResponse);

      toast({
        variant: "destructive",
        title: "Request Timeout",
        description: "Profile request timed out. Please try again.",
      });
    }, 15000); // 15 second timeout
  };

  useEffect(() => {
    fetchUserProfile();
  }, [userId]);

  return {
    userData,
    referredUsers,
    isLoading,
    error,
    isUserNotFound,
    refetch: fetchUserProfile,
  };
}
