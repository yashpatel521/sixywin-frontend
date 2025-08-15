import { Icons } from "@/components/ui/icons";
import { useWebSocketStore } from "@/store/websocketStore";
import { useEffect } from "react";
import { CountdownTimer } from "../shared/countdown-timer";

export const LatestDrawNumbers = () => {
  // Use the new WebSocket hook for cleaner logic
  const { sendMessage, latestDraw } = useWebSocketStore(); // Get tickets from Zustand store

  useEffect(() => {
    sendMessage("latestDraw", {});
  }, [sendMessage]);

  return (
    <div className="relative p-4">
      {/* Responsive Layout - Stack on mobile, side by side on larger screens */}
      <div className="flex flex-col sm:flex-row gap-6 md:gap-8 items-center justify-center">
        {/* Next Draw Countdown */}
        <div className="text-center w-full md:w-auto">
          <div className="text-sm font-semibold text-muted-foreground flex items-center justify-center gap-2 mb-3">
            <Icons.clock className="h-4 w-4" />
            Next Draw In
          </div>
          {latestDraw && (
            <CountdownTimer nextDrawDate={latestDraw.nextDrawTime} />
          )}
        </div>

        {/* Latest Winning Numbers */}
        <div className="text-center w-full md:w-auto relative">
          <div className="text-sm font-semibold text-muted-foreground flex items-center justify-center gap-2 mb-3">
            <Icons.award className="h-4 w-4" />
            Latest Winning Numbers
          </div>

          {latestDraw && (
            <div className="flex justify-center gap-2 flex-wrap transition-all duration-300">
              {latestDraw.winningNumbers.map((num, i) => (
                <div
                  key={i}
                  className="h-8 w-8 flex items-center justify-center font-bold text-sm rounded-full bg-secondary text-secondary-foreground shadow-inner"
                >
                  {num}
                </div>
              ))}
            </div>
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
