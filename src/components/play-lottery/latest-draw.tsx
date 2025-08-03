import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "../shared/icons";
import { useLatestDraw } from "@/hooks/use-latest-draw";

export const LatestDrawNumbers = () => {
  // Use the new WebSocket hook for cleaner logic
  const { latestDraw, isLoading, error, countdown } = useLatestDraw();

  const winningNumbers = latestDraw?.winningNumbers;

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
            <Icons.award className="h-4 w-4" />
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
            <div className="flex justify-center gap-2 flex-wrap transition-all duration-300">
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
