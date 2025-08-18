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

  const getColorClass = (num: number) => {
    if (num === 15) return "bg-yellow-400/70 text-black";
    if (num < 15) return "bg-[hsl(var(--destructive)/0.7)] text-white";
    if (num > 15) return "bg-[hsl(var(--success)/0.7)] text-white";
    return "glassmorphism text-white";
  };

  return (
    <div className="text-center animate-in fade-in flex items-center gap-6">
      {/* Last Draw */}
      <div className="flex flex-col items-center">
        <p className="text-sm text-muted-foreground">Last Draw</p>
        <div
          className={cn(
            "h-20 w-20 flex items-center justify-center rounded-full text-3xl font-bold shadow-md border border-white/20 backdrop-blur-sm",
            getColorClass(lastDraw.winningNumbers)
          )}
        >
          {lastDraw.winningNumbers}
        </div>
      </div>

      {/* Previous Draws */}
      {previousDraws.length > 0 && (
        <div className="flex flex-col items-center">
          <p className="text-sm text-muted-foreground">Previous</p>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {previousDraws.map((result, index) => (
              <div
                key={index}
                className={cn(
                  "h-8 w-8 flex items-center justify-center rounded-full text-xs font-semibold shadow-sm border border-white/10 backdrop-blur-sm",
                  getColorClass(result.winningNumbers)
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
