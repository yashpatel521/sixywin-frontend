import { useState, useEffect } from "react";
import { wsClient } from "@/websocket";
import { UserType } from "@/types/interfaces";

interface UseUserProfileReturn {
  userData: UserType | null;
  referredUsers: UserType[];
  isLoading: boolean;
  error: string | null;
  isUserNotFound: boolean;
  refetch: () => void;
}

export function useUserProfile(
  userId: string | undefined
): UseUserProfileReturn {
  const [userData, setUserData] = useState<UserType | null>(null);
  const [referredUsers, setReferredUsers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUserNotFound, setIsUserNotFound] = useState(false);

  const fetchUserProfile = () => {
    if (!userId) {
      setError("User ID is required to load profile.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsUserNotFound(false);

    let timeoutId: NodeJS.Timeout;
    let handleUserProfileResponse: (message: any) => void;

    const sendRequest = () => {
      // Send request manually with requestId
      const requestId = Math.random().toString(36).substring(7);
      const success = wsClient.send({
        type: "getUserProfile",
        payload: { id: userId }, // Backend expects 'id', not 'userId'
        requestId: requestId,
        timestamp: new Date().toISOString(),
      });

      if (!success) {
        setError(
          "Failed to send profile request. Please check your connection."
        );
        setIsLoading(false);
        return;
      }

      handleUserProfileResponse = (message: any) => {
        if (
          message.type === "getUserProfile_response" &&
          message.requestId === requestId
        ) {
          // Clear the timeout since we got a response
          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          if (message.payload.success) {
            setUserData(message?.payload?.data?.user);
            setReferredUsers(message?.payload?.data?.referredUsers || []);
          } else {
            if (message.payload.message?.includes("not found")) {
              setIsUserNotFound(true);
            } else {
              setError(
                message.payload.message || "Failed to fetch user profile"
              );
            }
          }
          setIsLoading(false);

          // Clean up listener after processing our response
          wsClient.off("getUserProfile_response", handleUserProfileResponse);
        }
      };

      wsClient.on("getUserProfile_response", handleUserProfileResponse);

      timeoutId = setTimeout(() => {
        setError("Request timeout. Please try again.");
        setIsLoading(false);
        wsClient.off("getUserProfile_response", handleUserProfileResponse);
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
      if (handleUserProfileResponse) {
        wsClient.off("getUserProfile_response", handleUserProfileResponse);
      }
    };
  };

  useEffect(() => {
    const cleanup = fetchUserProfile();
    return cleanup;
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
