import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "../ui/card";
import { Icons } from "../ui/icons";
import { useWebSocketStore } from "@/store/websocketStore";
import { useEffect, useState } from "react";
import { AviatorDrawResult } from "@/libs/interfaces";

export function HistoryDisplay() {
  const { aviatorDrawResult, userHistoryAviatorBets } = useWebSocketStore();

  useEffect(() => {
    if (aviatorDrawResult?.status == "finished") {
      setHistory((prev) => [...prev, aviatorDrawResult]);
    }
    //slice to 5
    setHistory((prev) => prev.slice(0, 5));
  }, [aviatorDrawResult]);

  const [history, setHistory] = useState<AviatorDrawResult[]>([]);

  return (
    <>
      <Card className="glassmorphism">
        <CardContent className="p-4 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Icons.history className="h-5 w-5" />
              <h3 className="font-semibold">Recent Crashes</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {history.length === 0 ? (
                <div className="text-gray-500">
                  Previous Crashes will appear here
                </div>
              ) : (
                history.map((entry) => (
                  <Badge
                    key={entry.id}
                    className="bg-yellow-500/20 text-yellow-300"
                  >
                    {entry?.crashMultiplier}x
                  </Badge>
                ))
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Icons.gem className="h-5 w-5" />
              <h3 className="font-semibold">Your Bids</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {userHistoryAviatorBets.length == 0 ? (
                <div className="text-gray-500">No Bets Found</div>
              ) : (
                userHistoryAviatorBets.map((bet) => (
                  <Badge
                    key={bet.id}
                    className={
                      bet.outcome === "win"
                        ? "bg-green-500/80"
                        : bet.outcome === "loss"
                        ? "bg-red-500/80"
                        : "bg-gray-500/80"
                    }
                  >
                    {bet.outcome === "win" ? (
                      <Icons.trendingUp className="h-4 w-4" />
                    ) : bet.outcome === "loss" ? (
                      <Icons.trendingDown className="h-4 w-4" />
                    ) : (
                      <Icons.hourglass className="h-4 w-4 animate-spin" />
                    )}
                    <span>{bet?.cashOutMultiplier}x</span>
                    <div className="flex items-center gap-1 font-semibold text-xs bg-black/20 text-white rounded-full px-2 py-0.5">
                      <Icons.gem className="h-3 w-3" />
                      <span>{bet.amountWon}</span>
                    </div>
                  </Badge>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
