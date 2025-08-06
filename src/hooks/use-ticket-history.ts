import { useState, useEffect, useCallback, useRef } from "react";
import { wsClient } from "@/websocket";
import { MESSAGE_TYPES } from "@/websocket/constants";
import { tokenStorage } from "@/lib/localStorage";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type {
  User,
  GameTicket,
  UseTicketHistoryReturn,
} from "@/lib/interfaces";

export const useTicketHistory = (
  targetUserId?: number
): UseTicketHistoryReturn => {
  const [tickets, setTickets] = useState<GameTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user] = useLocalStorage<User | null>("user", null);

  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectionRetryCount = useRef(0);
  const maxConnectionRetries = 5;
  const isLoadingRef = useRef(isLoading);
  const ticketsRef = useRef(tickets);

  // Keep refs in sync with state
  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    ticketsRef.current = tickets;
  }, [tickets]);

  // Determine which user ID to use
  const effectiveUserId = targetUserId || user?.id;

  // Convert server ticket format to frontend format (now using unified GameTicket)
  const convertServerTicket = (serverTicket: GameTicket): GameTicket => {
    // If it's already in the correct format, return as-is
    if (typeof serverTicket.id === "string" && serverTicket.date) {
      return serverTicket;
    }

    const winningNumbers =
      serverTicket.drawResult?.winningNumbers ||
      serverTicket.matchedNumbers ||
      [];

    const converted: GameTicket = {
      id: serverTicket.id.toString(),
      date:
        typeof serverTicket.createdAt === "string"
          ? serverTicket.createdAt
          : serverTicket.createdAt.toISOString(),
      numbers: serverTicket.numbers,
      userNumbers: serverTicket.numbers, // Legacy support
      winningNumbers: winningNumbers, // Legacy support
      matches: serverTicket.matchedNumbers?.length || 0, // Legacy support
      createdAt: serverTicket.createdAt,
      coinsWon: serverTicket.coinsWon,
      bid: serverTicket.bid,
      result: serverTicket.result,
      drawId: serverTicket.drawResult?.id,
      drawDate: serverTicket.drawResult?.drawDate,
      matchedNumbers: serverTicket.matchedNumbers,
      drawResult: serverTicket.drawResult,
    };

    return converted;
  };

  const fetchTickets = useCallback(() => {
    if (!effectiveUserId) {
      setTickets([]);
      setIsLoading(false);
      return;
    }

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
          sendTicketHistoryRequest();
        }
      } else {
        // WebSocket not connected, try to establish connection and retry
        if (connectionRetryCount.current < maxConnectionRetries) {
          connectionRetryCount.current++;

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
  }, [effectiveUserId, maxConnectionRetries]);

  const authenticateAndRequest = () => {
    const token = tokenStorage.getToken();
    if (!token) {
      sendTicketHistoryRequest();
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
          sendTicketHistoryRequest();
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

  const sendTicketHistoryRequest = () => {
    const requestId = Math.random().toString(36).substring(7);
    let handleTicketHistoryResponse: (message: any) => void;
    let timeoutId: NodeJS.Timeout;

    // Send request directly
    const success = wsClient.send({
      type: MESSAGE_TYPES.GET_TICKETS,
      payload: { getTicketUserId: effectiveUserId },
      requestId: requestId,
      timestamp: new Date().toISOString(),
    });

    if (!success) {
      setError(
        "Failed to request ticket history. Please check your connection."
      );
      setIsLoading(false);
      return;
    }

    handleTicketHistoryResponse = (message: any) => {
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
          setError(message.message || "Failed to fetch ticket history");
        }

        setIsLoading(false);
        wsClient.off("getTickets_response", handleTicketHistoryResponse);
        wsClient.off("error", handleTicketHistoryResponse);
        return;
      }

      if (
        message.type === "getTickets_response" &&
        message.requestId === requestId
      ) {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        const serverTickets = message.payload;

        if (Array.isArray(serverTickets)) {
          const convertedTickets = serverTickets.map(convertServerTicket);
          setTickets(convertedTickets);
          setError(null);
        } else {
          setTickets([]);
          setError("Invalid response format");
        }
        setIsLoading(false);

        // Clean up listener after processing our response
        wsClient.off("getTickets_response", handleTicketHistoryResponse);
        wsClient.off("error", handleTicketHistoryResponse);
      }
    };

    wsClient.on("getTickets_response", handleTicketHistoryResponse);
    wsClient.on("error", handleTicketHistoryResponse);

    timeoutId = setTimeout(() => {
      setError("Request timeout. Please try again.");
      // Use ref to check current loading state instead of stale closure
      if (isLoadingRef.current) {
        setIsLoading(false);
      }
      wsClient.off("getTickets_response", handleTicketHistoryResponse);
      wsClient.off("error", handleTicketHistoryResponse);
    }, 15000); // 15 second timeout

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (handleTicketHistoryResponse) {
        wsClient.off("getTickets_response", handleTicketHistoryResponse);
        wsClient.off("error", handleTicketHistoryResponse);
      }
    };
  };

  // Connection listener effect
  useEffect(() => {
    const handleConnection = () => {
      // Use refs to avoid stale closure
      if (isLoadingRef.current && ticketsRef.current.length === 0) {
        fetchTickets();
      }
    };

    wsClient.on("connected", handleConnection);

    return () => {
      wsClient.off("connected", handleConnection);
    };
  }, [fetchTickets]);

  // Initial fetch and cleanup
  useEffect(() => {
    if (effectiveUserId) {
      // Add a small delay to ensure WebSocket is connected on initial load
      setTimeout(() => {
        fetchTickets();
      }, 100);
    } else {
      setTickets([]);
      setIsLoading(false);
    }

    return () => {
      // Cleanup retry timeout
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [effectiveUserId, fetchTickets]);

  // Event listeners for real-time updates
  useEffect(() => {
    const handleUserDataChanged = () => {
      setTimeout(() => {
        if (effectiveUserId) {
          fetchTickets();
        }
      }, 100);
    };

    const handleTicketSubmitted = () => {
      setTimeout(() => {
        if (effectiveUserId) {
          fetchTickets();
        }
      }, 500);
    };

    window.addEventListener("userDataChanged", handleUserDataChanged);
    window.addEventListener("ticketSubmitted", handleTicketSubmitted);

    return () => {
      window.removeEventListener("userDataChanged", handleUserDataChanged);
      window.removeEventListener("ticketSubmitted", handleTicketSubmitted);
    };
  }, [effectiveUserId, fetchTickets]);

  const refreshTickets = useCallback(() => {
    // Reset retry count for manual refetch
    connectionRetryCount.current = 0;
    fetchTickets();
  }, [fetchTickets]);

  return {
    history: tickets,
    isLoading,
    error,
    refreshTickets,
  };
};
