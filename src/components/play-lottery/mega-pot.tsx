import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/ui/icons";
import { useWebSocketStore } from "@/store/websocketStore";
import { useEffect } from "react";

export function MegaPot() {
  // Use the new WebSocket hook for cleaner logic
  const { sendMessage, megaPot } = useWebSocketStore(); // Get user from Zustand store

  useEffect(() => {
    sendMessage("megaPot", {});
  }, [sendMessage]);
  return (
    <Card className="glassmorphism animation-all hover:shadow-2xl">
      <CardHeader className="p-4 space-y-2">
        <div className="flex flex-col md:flex-row items-center justify-around gap-4">
          <div className="flex flex-col items-center text-center">
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <Icons.layers className="h-6 w-6 text-primary" />
              Current Mega Pot
            </CardTitle>
            <div className="flex justify-center items-center gap-2 text-4xl font-bold text-primary mt-2 p-2 rounded-lg bg-primary/10 border-2 border-dashed border-primary/20 shadow-[0_0_15px_rgba(255,223,0,0.5)] drop-shadow-[0_2px_4px_hsl(var(--primary)/0.5)]">
              <Icons.gem className="h-9 w-9" />
              <span>{megaPot?.amount.toLocaleString() || "0"}</span>
            </div>
          </div>

          <Separator orientation="vertical" className="h-12 hidden md:block" />

          <div className="flex-1 text-center hidden md:block">
            <div className="text-sm font-semibold text-yellow-400 flex items-center justify-center gap-2">
              <Icons.ticket className="h-4 w-4 " />
              Tickets Submitted (Last 24h)
            </div>
            <div className="text-2xl font-bold mt-2 text-yellow-400 ">
              {megaPot?.todayBids?.toLocaleString() || "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              The total number of tickets submitted by players in the last 24
              hours.
            </p>
          </div>

          <Separator orientation="vertical" className="h-12 hidden md:block" />

          <div className="flex-1 text-center hidden md:block">
            <div className="text-sm font-semibold text-yellow-400 flex items-center justify-center gap-2">
              <Icons.gem className="h-4 w-4 " />
              Total Winnings (Last 24h)
            </div>
            <div className="text-2xl font-bold mt-2 text-yellow-400">
              {megaPot?.todayWinnings?.toLocaleString() || "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              The total number of coins won by players from all games in the
              last 24 hours.
            </p>
          </div>

          <Separator orientation="vertical" className="h-12 hidden md:block" />

          <CountdownTimer
            nextDrawDate={megaPot?.nextDrawDate || new Date()}
            label="Pot reset in"
          />
        </div>
      </CardHeader>
    </Card>
  );
}
