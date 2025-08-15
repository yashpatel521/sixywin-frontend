import { cn } from "@/libs/utils";
import { Icons } from "../ui/icons";
import { useWebSocketStore } from "@/store/websocketStore";
import { AVIATOR_COUNTDOWN_TIMER } from "@/libs/constants";

export function GameDisplay() {
  const { aviatorDrawResult, aviatorCountdown } = useWebSocketStore();
  const getGameStateColor = () => {
    if (aviatorDrawResult?.status === "ongoing") return "text-green-400";
    if (aviatorDrawResult?.status === "finished") return "text-red-400";
    return "text-muted-foreground";
  };

  return (
    <div className="lg:col-span-3 flex flex-col items-center justify-center p-4 rounded-lg bg-secondary/30 relative overflow-hidden h-96">
      {aviatorDrawResult?.status === "finished" &&
      aviatorCountdown?.countdown < AVIATOR_COUNTDOWN_TIMER - 2 ? (
        <div className="text-center">
          <Icons.hourglass className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="font-headline text-2xl">Next round starts in...</h3>
          <p className="text-6xl font-bold text-primary">
            {aviatorCountdown?.countdown}
          </p>
        </div>
      ) : (
        <div className="relative flex items-center justify-center w-full h-full">
          <Icons.rocket
            className={cn(
              "absolute h-32 w-32 text-primary/30 transition-transform duration-300",
              aviatorDrawResult?.status === "ongoing" && "animate-aviator-fly"
            )}
          />
          <p
            className={cn(
              "relative text-6xl font-bold transition-colors duration-300 z-10",
              getGameStateColor()
            )}
            style={{
              textShadow: `0 0 15px ${
                getGameStateColor() === "text-green-400"
                  ? "hsl(var(--primary)/0.6)"
                  : "hsl(var(--destructive)/0.8)"
              }`,
            }}
          >
            {aviatorDrawResult?.crashMultiplier &&
              `${Number(aviatorDrawResult?.crashMultiplier).toFixed(2)} X`}
          </p>
        </div>
      )}
    </div>
  );
}
