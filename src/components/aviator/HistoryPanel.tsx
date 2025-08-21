import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "../ui/card";
import { Icons } from "../ui/icons";
import { useEffect } from "react";
import { useApiRequest } from "@/libs/apiRequest";
import { useWebSocketStore } from "@/store/websocketStore";

export function HistoryDisplay() {
  const {
    setUserHistoryAviatorBets,
    userHistoryAviatorBets: userHistory,
    aviatorDrawHistory: globalDataHistory,
    setAviatorDrawHistory,
  } = useWebSocketStore();
  // User's own history
  const { data: userData, request: requestUserHistory } = useApiRequest({
    url: "/aviator/userHistory",
    method: "GET",
    isToken: true,
  });

  // Global / all users history
  const { data: globalData, request: requestGlobalHistory } = useApiRequest({
    url: "/aviator/globalHistory", // Change to your new API endpoint
    method: "GET",
    isToken: true, // If token not required
  });

  useEffect(() => {
    requestUserHistory();
    requestGlobalHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userData) {
      setUserHistoryAviatorBets(userData);
    }
    if (globalData) {
      setAviatorDrawHistory(globalData);
    }
  }, [userData, globalData]);

  return (
    <>
      <Card className="glassmorphism">
        <CardContent className="p-4 space-y-4">
          {/* Global History */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Icons.history className="h-5 w-5" />
              <h3 className="font-semibold">Recent Crashes (Global)</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {globalDataHistory.length === 0 ? (
                <div className="text-gray-500">No Global History</div>
              ) : (
                globalDataHistory.map((entry) => (
                  <Badge
                    key={entry.id}
                    className="bg-yellow-500/20 text-yellow-300"
                  >
                    {entry.crashMultiplier}x
                  </Badge>
                ))
              )}
            </div>
          </div>
          {/* User Bids */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Icons.gem className="h-5 w-5" />
              <h3 className="font-semibold">Your Bids</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {userHistory.length === 0 ? (
                <div className="text-gray-500">No Bets Found</div>
              ) : (
                userHistory.map((bet) => (
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
                      <span>
                        {bet.outcome == "loss" ? bet.amount : bet.amountWon}
                      </span>
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
