import { cn } from "@/libs/utils";
import { DoubleTroubleDrawResult } from "@/libs/interfaces";

export function LastDrawHistory({
  drawHistory,
}: {
  drawHistory: DoubleTroubleDrawResult[];
}) {
  if (!drawHistory.length) return null;

  const lastDraw = drawHistory[0];
  const previousDraws = drawHistory.slice(1, 10);

  return (
    <div className="text-center animate-in fade-in flex items-center gap-4">
      <div className="flex flex-col items-center">
        <p className="text-sm text-muted-foreground">Last Draw</p>
        <div
          className={cn(
            "h-20 w-20 flex items-center justify-center rounded-full text-3xl font-bold",
            lastDraw.winningNumbers === 15
              ? "bg-yellow-400 text-black"
              : lastDraw.winningNumbers < 15
              ? "bg-red-500/80 text-white"
              : lastDraw.winningNumbers > 15
              ? "bg-green-500/80 text-white"
              : "bg-blue-500/80 text-white"
          )}
        >
          {lastDraw.winningNumbers}
        </div>
      </div>
      {previousDraws.length > 0 && (
        <div className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground">Previous</p>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {previousDraws.map((result, index) => (
              <div
                key={index}
                className={cn(
                  "h-8 w-8 flex items-center justify-center rounded-full text-xs font-semibold",
                  result.winningNumbers === 15
                    ? "bg-yellow-400 text-black"
                    : result.winningNumbers < 15
                    ? "bg-red-500/80 text-white"
                    : result.winningNumbers > 15
                    ? "bg-green-500/80 text-white"
                    : "bg-blue-500/80 text-white"
                )}
              >
                {result.winningNumbers}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
