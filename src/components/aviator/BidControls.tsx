import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "../ui/card";
import { Icons } from "../ui/icons";
import { useEffect, useState } from "react";
import { useWebSocketStore } from "@/store/websocketStore";
import { useApiRequest } from "@/libs/apiRequest";
import { toast } from "@/hooks/use-toast";
import { saveUserProfile } from "@/utils/storage";

export function Controls() {
  const { aviatorDrawResult, user, setUserHistoryAviatorBets, updateUserData } =
    useWebSocketStore();

  const quickBidOptions = [10, 20, 50, 100];
  const [bidAmount, setBidAmount] = useState([10]);
  const [hasActiveBet, setHasActiveBet] = useState(false);

  // Place Bet API
  const {
    data: placeBetData,
    success: placeBetSuccess,
    request: placeBetRequest,
  } = useApiRequest({
    url: "/aviator/create",
    method: "POST",
    isToken: true,
    data: { amount: bidAmount[0] },
  });

  // Cash Out API
  const {
    data: cashOutData,
    success: cashOutSuccess,
    request: cashOutRequest,
  } = useApiRequest({
    url: "/aviator/cashout",
    method: "POST",
    isToken: true,
    data: {
      roundId: aviatorDrawResult?.roundId,
      crashMultiplier: aviatorDrawResult?.crashMultiplier,
    },
  });

  // Reset bet when round ends
  useEffect(() => {
    if (aviatorDrawResult?.status === "finished") {
      setHasActiveBet(false);
    }
  }, [aviatorDrawResult?.status]);

  // Place Bet handler
  const handlePlaceBet = async () => {
    if (hasActiveBet || aviatorDrawResult?.status !== "finished") return;

    setHasActiveBet(true);
    await placeBetRequest();

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

  // Update user after Place Bet success
  useEffect(() => {
    if (placeBetSuccess) {
      saveUserProfile(placeBetData.user);
      updateUserData(placeBetData.user);
      toast({
        title: "Bet Placed",
        description: `You have placed a bet of ${bidAmount[0]} coins.`,
        variant: "success",
      });
      setBidAmount([10]);
    }
  }, [placeBetSuccess, placeBetData, updateUserData]);

  // Cash Out handler
  const handleCashOut = async () => {
    if (!hasActiveBet || aviatorDrawResult?.status !== "ongoing") return;
    setHasActiveBet(false);
    await cashOutRequest();
  };

  useEffect(() => {
    if (cashOutSuccess) {
      saveUserProfile(cashOutData.user);
      updateUserData(cashOutData.user);

      toast({
        title: "Cashed Out",
        description: `You cashed out ${cashOutData.aviatorBidSave.amountWon} coins with a multiplier of ${cashOutData.aviatorBidSave.cashOutMultiplier}.`,
        variant: "success",
      });

      // Update bet history
      setUserHistoryAviatorBets((prev) =>
        prev.map((bet) =>
          bet.outcome === "pending"
            ? {
                ...bet,
                outcome: "win",
                cashOutMultiplier: cashOutData.aviatorBidSave.cashOutMultiplier,
                amountWon: cashOutData.aviatorBidSave.amountWon,
              }
            : bet
        )
      );
    }
  }, [cashOutSuccess, cashOutData, updateUserData]);

  return (
    <Card className="glassmorphism">
      <CardContent className="p-4 space-y-4">
        {/* Bet Slider */}
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
                disabled={
                  hasActiveBet || aviatorDrawResult?.status === "ongoing"
                }
              >
                {amount}
              </Button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handlePlaceBet}
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
