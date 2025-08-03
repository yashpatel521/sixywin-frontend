import { useState, useCallback } from "react";
import { wsClient } from "@/websocket";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/lib/interfaces";

interface UseSpinWheelReturn {
  isSpinning: boolean;
  rotation: number;
  user: User | null;
  hasSpunToday: boolean;
  spin: (prizeValue: number) => void;
  setRotation: (rotation: number) => void;
}

export function useSpinWheel(): UseSpinWheelReturn {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [user, setUser] = useLocalStorage<User | null>("user", null);
  const { toast } = useToast();

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

      if (!wsClient.isConnected()) {
        toast({
          variant: "destructive",
          title: "Connection Error",
          description: "Please check your connection and try again.",
        });
        return;
      }

      setIsSpinning(true);

      // Send WebSocket message to backend
      const requestId = Math.random().toString(36).substring(7);
      let handleSpinWheelResponse: (message: any) => void;
      let timeoutId: NodeJS.Timeout;

      const success = wsClient.send({
        type: "spinWheel",
        payload: {
          userId: user.id,
          amount: prizeValue,
        },
        requestId,
        timestamp: new Date().toISOString(),
      });

      if (!success) {
        setIsSpinning(false);
        toast({
          variant: "destructive",
          title: "Connection Error",
          description:
            "Failed to send spin request. Please check your connection.",
        });
        return;
      }

      handleSpinWheelResponse = (message: any) => {
        if (
          message.type === "spinWheel_response" &&
          message.requestId === requestId
        ) {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          if (message.payload.success) {
            const updatedUser = message.payload.data;

            // Update user data directly
            setUser(updatedUser);

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
            toast({
              variant: "destructive",
              title: "Spin Failed",
              description: message.payload.message || "Failed to process spin",
            });
          }

          setIsSpinning(false);
          // Clean up listener after processing our response
          wsClient.off("spinWheel_response", handleSpinWheelResponse);
        }
      };

      wsClient.on("spinWheel_response", handleSpinWheelResponse);

      timeoutId = setTimeout(() => {
        setIsSpinning(false);
        wsClient.off("spinWheel_response", handleSpinWheelResponse);
        toast({
          variant: "destructive",
          title: "Request Timeout",
          description: "Request timed out. Please try again.",
        });
      }, 15000); // 15 second timeout
    },
    [user, hasSpunToday, toast, setUser]
  );

  return {
    isSpinning,
    rotation,
    user,
    hasSpunToday,
    spin,
    setRotation,
  };
}
