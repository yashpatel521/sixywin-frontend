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
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsUserNotFound(false);

    let timeoutId: NodeJS.Timeout;
    let handleUserProfileResponse: (message: any) => void;

    const sendRequest = () => {
      // Use the convenience method
      const success = wsClient.requestUserProfile(userId);

      if (!success) {
        setError(
          "Failed to send profile request. Please check your connection."
        );
        setIsLoading(false);
        return;
      }

      handleUserProfileResponse = (message: any) => {
        if (message.type === "userProfile_response") {
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
        }
      };

      wsClient.on("userProfile_response", handleUserProfileResponse);

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
      if (handleUserProfileResponse) {
        wsClient.off("userProfile_response", handleUserProfileResponse);
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
