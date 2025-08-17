import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "../ui/card";
import { Icons } from "../ui/icons";
import { useEffect, useState } from "react";
import { useWebSocketStore } from "@/store/websocketStore";

export function Controls() {
  const { sendMessage, aviatorDrawResult, user, setUserHistoryAviatorBets } =
    useWebSocketStore();

  const quickBidOptions = [10, 20, 50, 100];
  const [bidAmount, setBidAmount] = useState([10]);
  const [hasActiveBet, setHasActiveBet] = useState(false);

  // Reset when round ends
  useEffect(() => {
    if (aviatorDrawResult?.status === "finished") {
      setHasActiveBet(false);
    }
  }, [aviatorDrawResult?.status]);

  const handlePlaceBet = () => {
    // ✅ Only allow placing bet before plane starts
    if (hasActiveBet || aviatorDrawResult?.status !== "finished") return;

    setHasActiveBet(true);
    sendMessage("createAviatorTicket", {
      amount: bidAmount[0],
    });

    // Add bet to history
    setUserHistoryAviatorBets((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substr(2, 9),
        amount: bidAmount[0],
        amountWon: bidAmount[0],
        outcome: "pending",
        crashMultiplier: 0,
        cashOutMultiplier: 0,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const handleCashOut = () => {
    if (!hasActiveBet || aviatorDrawResult?.status !== "ongoing") return;

    setHasActiveBet(false);

    sendMessage("cashOutAviatorTicket", {
      crashMultiplier: aviatorDrawResult?.crashMultiplier,
      roundId: aviatorDrawResult?.roundId,
    });
  };

  return (
    <Card className="glassmorphism">
      <CardContent className="p-4 space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Your Bet {hasActiveBet ? "Active" : "Not Placed"}</Label>
            <div className="flex items-center gap-2 font-bold text-primary">
              <Icons.gem className="h-5 w-5" />
              <span>{bidAmount[0].toLocaleString()} Coins</span>
            </div>
          </div>
          <Slider
            min={10}
            max={(user?.coins || 0) + (user?.winningAmount || 0)}
            step={10}
            value={bidAmount}
            onValueChange={setBidAmount}
            // ✅ disable once round started or bet placed
            disabled={hasActiveBet || aviatorDrawResult?.status === "ongoing"}
          />
          <div className="text-sm text-muted-foreground text-center">
            Available Coins:{" "}
            {((user?.coins || 0) + (user?.winningAmount || 0)).toLocaleString()}
          </div>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {quickBidOptions.map((amount) => (
              <Button
                key={amount}
                variant="outline"
                size="sm"
                onClick={() => setBidAmount([amount])}
                // ✅ disable once round started or bet placed
                disabled={
                  hasActiveBet || aviatorDrawResult?.status === "ongoing"
                }
              >
                {amount}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handlePlaceBet}
            // ✅ Place Bet disabled when round is ongoing or already placed
            disabled={hasActiveBet || aviatorDrawResult?.status === "ongoing"}
          >
            {hasActiveBet ? (
              <>
                <Icons.gem className="mr-2" />
                Bet Placed
              </>
            ) : (
              <>
                <Icons.handCoins className="mr-2" />
                Place Bet
              </>
            )}
          </Button>

          <Button
            onClick={handleCashOut}
            // ✅ Cash out only possible if round ongoing & user has bet
            disabled={!hasActiveBet || aviatorDrawResult?.status !== "ongoing"}
          >
            <Icons.zap className="mr-2" />
            Cash Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
