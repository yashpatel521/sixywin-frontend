import { useState, useEffect } from "react";
import { Award, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { wsClient } from "@/websocket";
import { differenceInSeconds } from "date-fns";

interface LatestDrawData {
  winningNumbers: number[];
  drawDate: string;
  totalWinners: number;
  totalPrize: number;
  nextDrawTime: string | Date;
}

export const LatestDrawNumbers = () => {
  const [latestDraw, setLatestDraw] = useState<LatestDrawData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [countdown, setCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let handleLatestDrawResponse: (message: any) => void;
    let countdownInterval: NodeJS.Timeout;

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
        if (message.type === "latestDraw_response") {
          // Handle both regular responses (with requestId) and broadcast updates (without requestId)
          if (message.requestId && message.requestId === requestId) {
            // This is a response to our request
            if (timeoutId) {
              clearTimeout(timeoutId);
            }

            if (message.payload.success) {
              setLatestDraw(message.payload.data);
              startCountdown(message.payload.data.nextDrawTime);
            } else {
              setError(
                message.payload.message || "Failed to fetch latest draw"
              );
            }
            setIsLoading(false);
          } else if (!message.requestId) {
            // This is a broadcast update
            if (message.payload.success) {
              setLatestDraw(message.payload.data);
              startCountdown(message.payload.data.nextDrawTime);
              setIsLoading(false);

              // Show brief updating animation
              setIsUpdating(true);
              setTimeout(() => setIsUpdating(false), 1000);
            }
          }
        }
      };

      wsClient.on("latestDraw_response", handleLatestDrawResponse);

      timeoutId = setTimeout(() => {
        setError("Request timeout. Please try again.");
        setIsLoading(false);
      }, 10000);
    };

    const startCountdown = (nextDrawTime: string | Date) => {
      const updateCountdown = () => {
        const now = new Date();

        // Handle different formats of nextDrawTime
        let nextDraw: Date;
        if (nextDrawTime instanceof Date) {
          nextDraw = nextDrawTime;
        } else if (typeof nextDrawTime === "string") {
          nextDraw = new Date(nextDrawTime);
        } else {
          // Fallback: calculate next hour from current time
          nextDraw = new Date();
          nextDraw.setHours(nextDraw.getHours() + 1);
          nextDraw.setMinutes(0, 0, 0);
        }

        // Validate the date
        if (isNaN(nextDraw.getTime())) {
          // Invalid date, use fallback
          nextDraw = new Date();
          nextDraw.setHours(nextDraw.getHours() + 1);
          nextDraw.setMinutes(0, 0, 0);
        }

        const totalSeconds = Math.max(0, differenceInSeconds(nextDraw, now));

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        setCountdown({ hours, minutes, seconds });
      };

      updateCountdown();
      countdownInterval = setInterval(updateCountdown, 1000);
    };

    fetchLatestDraw();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (handleLatestDrawResponse) {
        wsClient.off("latestDraw_response", handleLatestDrawResponse);
      }
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, []);

  const winningNumbers = latestDraw?.winningNumbers;

  return (
    <div className="relative p-4">
      {/* Responsive Layout - Stack on mobile, side by side on larger screens */}
      <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-center justify-center">
        {/* Next Draw Countdown */}
        <div className="text-center w-full md:w-auto">
          <div className="text-sm font-semibold text-muted-foreground flex items-center justify-center gap-2 mb-3">
            <Clock className="h-4 w-4" />
            Next Draw In
          </div>

          {isLoading ? (
            <div className="flex justify-center gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-10 rounded-full" />
              ))}
            </div>
          ) : (
            <div className="flex justify-center gap-2">
              <div className="h-10 w-10 flex items-center justify-center font-bold text-lg rounded-full bg-secondary text-secondary-foreground shadow-inner">
                {countdown.hours.toString().padStart(2, "0")}
              </div>
              <span className="text-yellow-500 font-bold text-lg">:</span>
              <div className="h-10 w-10 flex items-center justify-center font-bold text-lg rounded-full bg-secondary text-secondary-foreground shadow-inner">
                {countdown.minutes.toString().padStart(2, "0")}
              </div>
              <span className="text-yellow-500 font-bold text-lg">:</span>
              <div className="h-10 w-10 flex items-center justify-center font-bold text-lg rounded-full bg-secondary text-secondary-foreground shadow-inner">
                {countdown.seconds.toString().padStart(2, "0")}
              </div>
            </div>
          )}
        </div>

        {/* Latest Winning Numbers */}
        <div className="text-center w-full md:w-auto relative">
          <div className="text-sm font-semibold text-muted-foreground flex items-center justify-center gap-2 mb-3">
            <Award className="h-4 w-4" />
            Latest Winning Numbers
          </div>

          {error && (
            <div className="mt-2 p-2 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-xs">{error}</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center gap-2 flex-wrap">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-full" />
              ))}
            </div>
          ) : (
            <div
              className={`flex justify-center gap-2 flex-wrap transition-all duration-300 ${
                isUpdating ? "scale-105" : ""
              }`}
            >
              {winningNumbers?.map((num, i) => (
                <div
                  key={i}
                  className="h-8 w-8 flex items-center justify-center font-bold text-sm rounded-full bg-secondary text-secondary-foreground shadow-inner"
                >
                  {num}
                </div>
              ))}
            </div>
          )}

          {isUpdating && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          )}

          {/* {latestDraw && (
            <div className="mt-3 text-xs text-muted-foreground flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
              <div>
                Draw Date: {new Date(latestDraw.drawDate).toLocaleDateString()}
              </div>
              <div>Total Winners: {latestDraw.totalWinners}</div>
            </div>
          )} */}
        </div>
      </div>

      {/* Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-600 to-transparent opacity-50"></div>
    </div>
  );
};
