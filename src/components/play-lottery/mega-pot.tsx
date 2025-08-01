import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Gem, Layers } from "lucide-react";
import { useState, useEffect } from "react";
import { wsClient } from "@/websocket";
import { MegaPotType } from "@/types/interfaces";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function MegaPot() {
  const [data, setData] = useState<MegaPotType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        if (
          message.type === "megaPot_response" &&
          message.requestId === requestId
        ) {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          if (message.payload.success) {
            const megaPotData: MegaPotType = message.payload.data;
            setData(megaPotData);
            setError(null);
          } else {
            setError(message.payload.message || "Failed to fetch mega pot");
          }
          setIsLoading(false);
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
      <CardHeader className="p-4 space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-items-center gap-4 w-full">
          <div className="flex flex-col items-center justify-center text-center">
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <Layers className="h-6 w-6 text-primary" />
              Mega Pot
            </CardTitle>
          </div>

          <div className="flex justify-center items-center gap-2 text-4xl font-bold text-primary p-2 md:p-0 rounded-lg bg-primary/10 md:bg-transparent border-2 border-dashed border-primary/20 md:border-none shadow-[0_0_15px_rgba(255,223,0,0.5)] md:shadow-none drop-shadow-[0_2px_4px_hsl(var(--primary)/0.5)]">
            <Gem className="h-9 w-9" />
            {isLoading ? (
              <Skeleton className="h-10 w-24" />
            ) : error ? (
              <span className="text-red-500 text-lg">Error</span>
            ) : (
              <span>{amount.toLocaleString()}</span>
            )}
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            <CountdownTimer
              nextDrawDate={nextDrawDate || new Date()}
              label="Next Draw"
            />
          </div>
        </div>
        <CardDescription className="text-center text-muted-foreground pt-2">
          The ultimate jackpot that increases with every ticket! Match all 6
          numbers to claim the entire mega pot. Fresh mega pot every day at 10
          AM.
          {nextDrawDate && (
            <span className="block text-sm mt-1">
              Next draw: {nextDrawDate.toLocaleString()}
            </span>
          )}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
