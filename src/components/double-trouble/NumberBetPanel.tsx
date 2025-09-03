import { Target, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useWebSocketStore } from "@/store/websocketStore";
import { useEffect, useState } from "react";
import {
  MAX_NUMBER_DOUBLE_TROUBLE,
  doubleTroublePayouts,
} from "@/libs/constants";
import { saveUserProfile } from "@/utils/storage";
import { DoubleTroubleTicket } from "@/libs/interfaces";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/libs/utils";
import { useApiRequest } from "@/libs/apiRequest";

export function NumberBetPanel() {
  const { user, setDoubleTroubleUserHistory, updateUserData } =
    useWebSocketStore();
  const [numberBid, setNumberBid] = useState([10]);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  const totalNumbers = MAX_NUMBER_DOUBLE_TROUBLE;
  const numberGrid = Array.from({ length: totalNumbers }, (_, i) => i + 1);

  const handleNumberClick = (num: number) => {
    setSelectedNumber((prev) => (prev === num ? null : num));
  };

  const totalCoins = (user?.coins || 0) + (user?.winningAmount || 0);

  const { data, request, success } = useApiRequest<DoubleTroubleTicket>({
    url: "/doubleTrouble/create",
    method: "POST",
    isToken: true,
    data: {
      drawType: "Number",
      bidAmount: numberBid[0],
      userNumber: user?.id,
    },
  });

  const onPlaceBet = async () => {
    if (selectedNumber === null) return;

    const totalCost = numberBid[0];
    if (totalCost > totalCoins) {
      toast({
        variant: "destructive",
        title: "Insufficient Funds",
        description: `You need ${totalCost.toLocaleString()} coins to place this bet.`,
      });
      return;
    }

    await request();
  };

  useEffect(() => {
    if (success && data) {
      setDoubleTroubleUserHistory((prev) => [data, ...(prev || [])]);
      toast({
        variant: "success",
        title: "Bet Placed",
        description: `Bet placed successfully on number ${selectedNumber}.`,
      });

      // Deduct coins locally
      updateUserData(data.user);
      saveUserProfile(data.user); // Update stored user data
      setSelectedNumber(null);
      setNumberBid([10]);
    }
  }, [success, data]);

  return (
    <Card className="w-full glassmorphism hover:shadow-2xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2">
          <Target className="h-6 w-6" /> Bet on a Specific Number
        </CardTitle>
        <CardDescription className="text-center">
          Correctly guess the number and win a {doubleTroublePayouts.number}x
          Payout!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bid Section */}
        <div className="grid gap-2">
          <div className="flex justify-between items-center">
            <Label>Number Bid </Label>
            <div className="flex items-center gap-2 font-bold text-primary">
              <Gem className="h-5 w-5" />
              <span>{numberBid[0].toLocaleString()} Coins</span>
            </div>
          </div>
          <Slider
            min={10}
            max={totalCoins}
            step={10}
            value={numberBid}
            onValueChange={setNumberBid}
          />
          <p className="text-sm text-muted-foreground text-center">
            You have {totalCoins.toLocaleString()} Coins available.
          </p>
        </div>

        {/* Number Grid (single-select) */}
        <div className="grid grid-cols-10 gap-2">
          {numberGrid.map((num) => {
            const isSelected = selectedNumber === num;

            let bgClass = "bg-background/50 border";
            if (isSelected) {
              bgClass = "bg-accent text-accent-foreground shadow-md scale-110";
            }

            return (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                className={cn(
                  "h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium transition-all",
                  bgClass
                )}
              >
                {num}
              </button>
            );
          })}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={onPlaceBet}
          disabled={selectedNumber === null}
          className="w-full"
        >
          Place Number Bet
        </Button>
      </CardFooter>
    </Card>
  );
}
