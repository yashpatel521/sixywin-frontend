import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { wsClient } from "@/websocket";
import { MegaPotType } from "@/types/interfaces";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "../shared/icons";

export function MegaPot() {
  const [data, setData] = useState<MegaPotType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // WebSocket logic for fetching mega pot data
  useEffect(() => {
    const fetchMegaPot = () => {
      if (wsClient.isConnected()) {
        sendMegaPotRequest();
      } else {
        setTimeout(() => {
          if (wsClient.isConnected()) {
            sendMegaPotRequest();
          } else {
            setError("WebSocket connection failed");
            setIsLoading(false);
          }
        }, 2000);
      }
    };

    const sendMegaPotRequest = () => {
      const requestId = Math.random().toString(36).substring(7);
      let handleMegaPotResponse: (message: any) => void;
      let timeoutId: NodeJS.Timeout;

      wsClient.send({
        type: "megaPot",
        requestId,
        payload: {},
        timestamp: new Date().toISOString(),
      });

      handleMegaPotResponse = (message: any) => {
        if (message.type === "megaPot_response") {
          // Handle both regular responses (with requestId) and broadcast updates (without requestId)
          if (message.requestId && message.requestId === requestId) {
            // This is a response to our request
            if (timeoutId) {
              clearTimeout(timeoutId);
            }

            if (message.payload.success) {
              const megaPotData: MegaPotType = message.payload.data;
              setData(megaPotData);
              setError(null);
              setIsLoading(false);
            } else {
              setError(message.payload.message || "Failed to fetch mega pot");
            }
            setIsLoading(false);
          } else if (!message.requestId) {
            // This is a broadcast update
            if (message.payload.success) {
              const megaPotData: MegaPotType = message.payload.data;
              setData(megaPotData);
              setError(null);
              setIsLoading(false);
              setIsUpdating(true);
              setTimeout(() => setIsUpdating(false), 1000);
            }
          }
        }
      };

      wsClient.on("megaPot_response", handleMegaPotResponse);

      timeoutId = setTimeout(() => {
        setError("Request timeout");
        setIsLoading(false);
      }, 10000);

      // Cleanup function
      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (handleMegaPotResponse) {
          wsClient.off("megaPot_response", handleMegaPotResponse);
        }
      };
    };

    fetchMegaPot();
  }, []);

  // Extract values from data
  const amount = data?.amount || 0;
  const nextDrawDate = data?.nextDrawDate ? new Date(data.nextDrawDate) : null;

  return (
    <Card className="glassmorphism animation-all hover:shadow-2xl">
      <CardHeader className="p-4 md:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-items-center gap-4 md:gap-6 w-full">
          <div className="flex flex-col items-center justify-center text-center">
            <CardTitle className="font-headline text-xl md:text-2xl flex items-center gap-2">
              <Icons.layers className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              Mega Pot
            </CardTitle>
          </div>

          <div
            className={`flex justify-center items-center gap-2 text-2xl md:text-4xl font-bold text-primary p-3 md:p-4 rounded-lg bg-primary/10 border-2 border-dashed border-primary/20 shadow-[0_0_15px_rgba(255,223,0,0.5)] drop-shadow-[0_2px_4px_hsl(var(--primary)/0.5)] transition-all duration-300 ${
              isUpdating ? "scale-105 bg-primary/20" : ""
            }`}
          >
            <Icons.gem className="h-6 w-6 md:h-9 md:w-9" />
            {isLoading ? (
              <Skeleton className="h-8 w-20 md:h-10 md:w-24" />
            ) : error ? (
              <span className="text-red-500 text-base md:text-lg">Error</span>
            ) : (
              <span className="text-sm md:text-base">
                {amount.toLocaleString()}
              </span>
            )}
            {isUpdating && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            )}
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            <CountdownTimer
              nextDrawDate={nextDrawDate || new Date()}
              label="Next Draw"
            />
          </div>
        </div>
        <CardDescription className="text-center text-muted-foreground pt-2 text-sm md:text-base">
          The ultimate jackpot that increases with every ticket! Match all 6
          numbers to claim the entire mega pot. Fresh mega pot every day at 10
          AM.
          {nextDrawDate && (
            <span className="block text-xs md:text-sm mt-2">
              Next draw: {nextDrawDate.toLocaleString()}
            </span>
          )}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
