import { useState, useEffect, useRef } from "react";
import { wsClient } from "@/websocket";
import { MESSAGE_TYPES } from "@/websocket/constants";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";
import { tokenStorage } from "@/lib/localStorage";
import type { User, UseTicketSubmissionReturn } from "@/lib/interfaces";

export function useTicketSubmission(): UseTicketSubmissionReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [user, setUser] = useLocalStorage<User | null>("user", null);
  const { toast } = useToast();

  // Refs to prevent stale closures
  const isSubmittingRef = useRef(isSubmitting);

  // Keep refs in sync with state
  useEffect(() => {
    isSubmittingRef.current = isSubmitting;
  }, [isSubmitting]);

  const submitTicket = async (
    numbers: number[],
    bidAmount: number
  ): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "Please log in to submit a ticket.",
        variant: "destructive",
      });
      return false;
    }

    // Check if user has enough coins
    const totalFunds = (user.coins || 0) + (user.winningAmount || 0);
    if (totalFunds < bidAmount) {
      toast({
        title: "Insufficient Funds",
        description: `You need ${bidAmount.toLocaleString()} coins but only have ${totalFunds.toLocaleString()}.`,
        variant: "destructive",
      });
      return false;
    }

    setIsSubmitting(true);

    try {
      // Wait for WebSocket connection if not connected
      if (!wsClient.isConnected()) {
        toast({
          title: "Connection Error",
          description: "Connecting to server...",
          variant: "destructive",
        });

        const connectionTimeout = setTimeout(() => {
          toast({
            title: "Connection Failed",
            description: "Please refresh the page and try again.",
            variant: "destructive",
          });
          setIsSubmitting(false);
        }, 5000);

        const connectionCheckInterval = setInterval(() => {
          if (wsClient.isConnected()) {
            clearTimeout(connectionTimeout);
            clearInterval(connectionCheckInterval);
            authenticateAndRequest(numbers, bidAmount);
          }
        }, 100);

        return false;
      }

      return await authenticateAndRequest(numbers, bidAmount);
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "❌ Submission Failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const authenticateAndRequest = async (
    numbers: number[],
    bidAmount: number
  ): Promise<boolean> => {
    const token = tokenStorage.getToken();

    if (!token) {
      setIsSubmitting(false);
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please log in to submit a ticket.",
      });
      return false;
    }

    return new Promise((resolve) => {
      const authRequestId = Math.random().toString(36).substring(7);
      let handleAuthResponse: (message: any) => void;
      let authTimeoutId: NodeJS.Timeout;

      // First authenticate
      const authSuccess = wsClient.send({
        type: MESSAGE_TYPES.AUTHENTICATE,
        payload: { token },
        requestId: authRequestId,
        timestamp: new Date().toISOString(),
      });

      if (!authSuccess) {
        setIsSubmitting(false);
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Failed to authenticate. Please check your connection.",
        });
        resolve(false);
        return;
      }

      handleAuthResponse = (authMessage: any) => {
        if (
          authMessage.type === "authenticate_response" &&
          authMessage.requestId === authRequestId
        ) {
          wsClient.off("authenticate_response", handleAuthResponse);
          wsClient.off("error", handleAuthResponse);

          if (authTimeoutId) {
            clearTimeout(authTimeoutId);
          }

          if (authMessage.payload?.success) {
            // Authentication successful, now make the ticket request
            sendTicketRequest(numbers, bidAmount).then(resolve);
          } else {
            // Authentication failed, remove invalid token
            tokenStorage.removeToken();
            setIsSubmitting(false);
            toast({
              variant: "destructive",
              title: "Session Expired",
              description: "Please log in again to submit a ticket.",
            });
            resolve(false);
          }
        } else if (
          authMessage.type === "error" &&
          authMessage.requestId === authRequestId
        ) {
          wsClient.off("authenticate_response", handleAuthResponse);
          wsClient.off("error", handleAuthResponse);

          if (authTimeoutId) {
            clearTimeout(authTimeoutId);
          }

          // Authentication failed, remove invalid token
          tokenStorage.removeToken();
          setIsSubmitting(false);
          toast({
            variant: "destructive",
            title: "Session Expired",
            description: "Please log in again to submit a ticket.",
          });
          resolve(false);
        }
      };

      wsClient.on("authenticate_response", handleAuthResponse);
      wsClient.on("error", handleAuthResponse);

      authTimeoutId = setTimeout(() => {
        wsClient.off("authenticate_response", handleAuthResponse);
        wsClient.off("error", handleAuthResponse);

        setIsSubmitting(false);
        toast({
          variant: "destructive",
          title: "Authentication Timeout",
          description: "Authentication timed out. Please try again.",
        });
        resolve(false);
      }, 10000); // 10 second timeout for auth
    });
  };

  const sendTicketRequest = (
    numbers: number[],
    bidAmount: number
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      const requestId = Math.random().toString(36).substring(7);
      let handleCreateTicketResponse: (message: any) => void;
      let timeoutId: NodeJS.Timeout;

      // Send only one request - use the standard format
      const success = wsClient.send({
        type: "createTicket",
        requestId,
        payload: {
          numbers: numbers,
          bid: bidAmount,
          userId: user?.id,
        },
        timestamp: new Date().toISOString(),
      });

      if (!success) {
        setIsSubmitting(false);
        toast({
          title: "❌ Submission Failed",
          description:
            "Failed to submit ticket. Please check your connection and try again.",
          variant: "destructive",
        });
        resolve(false);
        return;
      }

      handleCreateTicketResponse = (message: any) => {
        if (message.type === "createTicket_response") {
          // Handle both regular responses (with requestId) and broadcast updates (without requestId)
          if (message.requestId && message.requestId === requestId) {
            // This is a response to our request
            if (timeoutId) {
              clearTimeout(timeoutId);
            }

            if (message.payload.success) {
              const ticketData = message.payload.data;

              // Update user data directly from response
              if (ticketData.user) {
                setUser(ticketData.user);

                // Dispatch custom event to notify other components
                window.dispatchEvent(
                  new CustomEvent("userDataChanged", {
                    detail: ticketData.user,
                  })
                );
              }

              // Dispatch event to refresh ticket history
              window.dispatchEvent(
                new CustomEvent("ticketSubmitted", {
                  detail: {
                    ticketData,
                    userNumbers: numbers,
                    bidAmount,
                  },
                })
              );

              // Show confetti if user won
              if (ticketData.coinsWon > 0) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 5000);
              }

              toast({
                title: "🎫 Ticket Submitted!",
                description: `Your ticket with numbers [${numbers.join(
                  ", "
                )}] and bid of ${bidAmount.toLocaleString()} coins has been submitted successfully!`,
                className:
                  "bg-green-500/20 backdrop-blur-md border-green-500/30 text-green-100 shadow-lg shadow-green-500/25",
              });

              setIsSubmitting(false);
              resolve(true);
            } else {
              toast({
                title: "❌ Submission Failed",
                description:
                  message.payload.message || "Failed to submit ticket.",
                variant: "destructive",
              });
              setIsSubmitting(false);
              resolve(false);
            }

            // Clean up listeners after processing our response
            wsClient.off("createTicket_response", handleCreateTicketResponse);
          } else if (!message.requestId) {
            // This is a broadcast update - we don't need to handle this for ticket submission
            // but we should not interfere with it either
          }
        }
      };

      wsClient.on("createTicket_response", handleCreateTicketResponse);

      timeoutId = setTimeout(() => {
        wsClient.off("createTicket_response", handleCreateTicketResponse);

        toast({
          title: "Request Timeout",
          description: "The request took too long. Please try again.",
          variant: "destructive",
        });
        // Use ref to check current submitting state instead of stale closure
        if (isSubmittingRef.current) {
          setIsSubmitting(false);
        }
        resolve(false);
      }, 15000); // 15 second timeout for ticket submission
    });
  };

  // Cleanup WebSocket listeners when component unmounts
  useEffect(() => {
    return () => {
      // No cleanup needed for this hook
    };
  }, []);

  return {
    isSubmitting,
    isLoading: isSubmitting, // Map isSubmitting to isLoading for BaseHookReturn
    error: null, // This hook doesn't maintain persistent error state
    submitTicket,
    showConfetti,
    setShowConfetti,
  };
}
