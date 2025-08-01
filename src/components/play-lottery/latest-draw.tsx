import { useState, useEffect } from "react";
import { Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { wsClient } from "@/websocket";
import { Separator } from "@radix-ui/react-separator";

interface LatestDrawData {
  winningNumbers: number[];
  drawDate: string;
  totalWinners: number;
  totalPrize: number;
}

export const LatestDrawNumbers = () => {
  const [latestDraw, setLatestDraw] = useState<LatestDrawData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let handleLatestDrawResponse: (message: any) => void;

    const fetchLatestDraw = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const requestId = Math.random().toString(36).substring(7);

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
              sendLatestDrawRequest(requestId);
            }
          }, 100);

          return;
        }

        sendLatestDrawRequest(requestId);
      } catch (err) {
        setError("Failed to connect to server");
        setIsLoading(false);
      }
    };

    const sendLatestDrawRequest = (requestId: string) => {
      wsClient.send({
        type: "latestDraw",
        requestId,
        payload: {},
        timestamp: new Date().toISOString(),
      });

      handleLatestDrawResponse = (message: any) => {
        if (
          message.type === "latest_draw_response" &&
          message.requestId === requestId
        ) {
          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          if (message.payload.success) {
            setLatestDraw(message.payload.data);
          } else {
            setError(message.payload.message || "Failed to fetch latest draw");
          }
          setIsLoading(false);
        }
      };

      wsClient.on("latest_draw_response", handleLatestDrawResponse);

      timeoutId = setTimeout(() => {
        setError("Request timeout. Please try again.");
        setIsLoading(false);
      }, 10000);
    };

    fetchLatestDraw();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (handleLatestDrawResponse) {
        wsClient.off("latest_draw_response", handleLatestDrawResponse);
      }
    };
  }, []);

  const fallbackNumbers = [5, 12, 23, 31, 42, 49];
  const winningNumbers = latestDraw?.winningNumbers || fallbackNumbers;

  return (
    <div className="flex-1 text-center">
      <div className="text-sm font-semibold text-muted-foreground flex items-center justify-center gap-2">
        <Award className="h-4 w-4" />
        Latest Winning Numbers
      </div>

      {error && (
        <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-xs">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center gap-2 mt-2">
          {fallbackNumbers.map((_, i) => (
            <Skeleton key={i} className="h-8 w-8 rounded-full" />
          ))}
        </div>
      ) : (
        <div className="flex justify-center gap-2 mt-2">
          {winningNumbers.map((num, i) => (
            <div
              key={i}
              className="h-8 w-8 flex items-center justify-center font-bold text-sm rounded-full bg-secondary text-secondary-foreground shadow-inner"
            >
              {num}
            </div>
          ))}
        </div>
      )}

      {latestDraw && (
        <div className="mt-2 text-xs text-muted-foreground flex flex-row gap-2">
          <div>
            Draw Date: {new Date(latestDraw.drawDate).toLocaleDateString()}
          </div>
          <Separator orientation="vertical" />
          <div>Total Winners: {latestDraw.totalWinners}</div>
        </div>
      )}
    </div>
  );
};
