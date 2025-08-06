import { useState, useEffect } from "react";
import { wsClient } from "@/websocket";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/lib/interfaces";

interface UseTicketSubmissionReturn {
  isSubmitting: boolean;
  submitTicket: (numbers: number[], bidAmount: number) => Promise<boolean>;
  showConfetti: boolean;
  setShowConfetti: (show: boolean) => void;
}

export function useTicketSubmission(): UseTicketSubmissionReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [user, setUser] = useLocalStorage<User | null>("user", null);
  const { toast } = useToast();

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
      const requestId = Math.random().toString(36).substring(7);

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
            sendTicketRequest(requestId, numbers, bidAmount);
          }
        }, 100);

        return false;
      }

      return await sendTicketRequest(requestId, numbers, bidAmount);
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

  const sendTicketRequest = (
    requestId: string,
    numbers: number[],
    bidAmount: number
  ): Promise<boolean> => {
    return new Promise((resolve) => {
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
          } else if (!message.requestId) {
            // This is a broadcast update - we don't need to handle this for ticket submission
            // but we should not interfere with it either
          }
        }
      };

      wsClient.on("createTicket_response", handleCreateTicketResponse);

      timeoutId = setTimeout(() => {
        toast({
          title: "Request Timeout",
          description: "The request took too long. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        resolve(false);
      }, 10000);

      // Note: We don't return a cleanup function here since this is a one-time operation
      // The cleanup will happen automatically when the promise resolves
    });
  };

  // Cleanup WebSocket listeners when component unmounts
  useEffect(() => {
    return () => {
      // Any cleanup if needed
    };
  }, []);

  return {
    isSubmitting,
    submitTicket,
    showConfetti,
    setShowConfetti,
  };
}
