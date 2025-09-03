import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/libs/utils";
import { useState, useEffect } from "react";
import { useWebSocketStore } from "@/store/websocketStore";
import { MAX_NUMBER_DOUBLE_TROUBLE } from "@/libs/constants";

export const BannerDoubleTrouble = () => {
  const { doubleTroubleHistory, sendMessage } = useWebSocketStore();
  // Fetch latest + history on load / when WS connects
  useEffect(() => {
    sendMessage("doubleTroubleStatus", {});
  }, [sendMessage]);
  // Resolve next draw time from store
  const resolvedNextDrawTime: Date | null = doubleTroubleHistory?.current
    ?.nextDrawTime
    ? new Date(doubleTroubleHistory.current.nextDrawTime)
    : null;
  const calculateSecondsLeft = () => {
    if (!resolvedNextDrawTime) return 0;
    const now = new Date();
    const diffMs = resolvedNextDrawTime.getTime() - now.getTime();
    return diffMs > 0 ? Math.floor(diffMs / 1000) : 0;
  };

  const [secondsLeft, setSecondsLeft] = useState(calculateSecondsLeft());

  useEffect(() => {
    setSecondsLeft(calculateSecondsLeft()); // reset when nextDrawTime changes

    const interval = setInterval(() => {
      setSecondsLeft(calculateSecondsLeft());
    }, 1000);

    return () => clearInterval(interval);
    // Depend on timestamp to avoid object identity issues
  }, [resolvedNextDrawTime?.getTime()]);

  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  const getColorClass = (num: number) => {
    if (num === MAX_NUMBER_DOUBLE_TROUBLE / 2)
      return "bg-yellow-400/70 text-black";
    if (num < MAX_NUMBER_DOUBLE_TROUBLE / 2)
      return "bg-[hsl(var(--destructive)/0.7)] text-white";
    if (num > MAX_NUMBER_DOUBLE_TROUBLE / 2)
      return "bg-[hsl(var(--success)/0.7)] text-white";
    return "glassmorphism text-white";
  };

  return (
    <>
      <Card className="w-full glassmorphism">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl flex items-center justify-center gap-2">
            <Icons.hourglass className="h-8 w-8 text-primary" />
            Double Trouble
          </CardTitle>
          <CardDescription>
            A new number is drawn every 30 seconds. Place your bets for the next
            round!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-around items-center p-4 rounded-lg bg-secondary/30 gap-8 md:gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className="text-sm text-muted-foreground">
                Next draw in...
              </div>
              <div className="flex items-center gap-2 text-6xl">
                <Icons.timer className="h-14 w-14 animate-pulse text-primary" />
                <span className="font-bold text-primary">{seconds}</span>
              </div>
            </div>
            <div className="text-center animate-in fade-in flex items-center gap-6">
              {/* Last Draw */}
              {doubleTroubleHistory?.current ? (
                <div className="flex flex-col items-center">
                  <p className="text-sm text-muted-foreground">Last Draw</p>
                  <div
                    className={cn(
                      "h-20 w-20 flex items-center justify-center rounded-full text-3xl font-bold shadow-md border border-white/20 backdrop-blur-sm",
                      getColorClass(
                        doubleTroubleHistory?.current?.winningNumbers
                      )
                    )}
                  >
                    {doubleTroubleHistory?.current?.winningNumbers}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <p className="text-sm text-muted-foreground">Waiting...</p>
                  <div className="h-20 w-20 flex items-center justify-center rounded-full text-3xl font-bold shadow-md border border-white/20 backdrop-blur-sm glassmorphism text-white">
                    ?
                  </div>
                </div>
              )}

              {/* Previous Draws */}
              {doubleTroubleHistory?.history &&
                doubleTroubleHistory?.history.length > 0 && (
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-muted-foreground">Previous</p>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {doubleTroubleHistory?.history.map((result, index) => (
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
          </div>
        </CardContent>
      </Card>
    </>
  );
};
