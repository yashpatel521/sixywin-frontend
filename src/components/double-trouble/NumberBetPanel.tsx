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
import { NumberGrid } from "./NumberGrid";
import { useWebSocketStore } from "@/store/websocketStore";
import { useState } from "react";
import { MAX_NUMBER_DOUBLE_TROUBLE, API_URL } from "@/libs/constants";
import axios from "axios";
import { getUserProfile } from "@/utils/storage";
import { DoubleTroubleTicket } from "@/libs/interfaces";
import { toast } from "@/hooks/use-toast";

export function NumberBetPanel() {
  const { user, setDoubleTroubleUserHistory } = useWebSocketStore();
  const [numberBid, setNumberBid] = useState([10]);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [singleSelect] = useState(false);
  const totalNumbers = MAX_NUMBER_DOUBLE_TROUBLE;
  const numberGrid = Array.from({ length: totalNumbers }, (_, i) => i + 1);

  const handleNumberClick = (num: number) => {
    if (singleSelect) {
      setSelectedNumbers([num]); // Only one number at a time
    } else {
      setSelectedNumbers((prev: number[]) =>
        prev.includes(num)
          ? prev.filter((n: number) => n !== num)
          : [...prev, num]
      );
    }
  };
  const totalCoins = (user?.coins || 0) + (user?.winningAmount || 0);
  const placedNumberBets = selectedNumbers.map((n) => ({
    number: n,
    result: "pending" as const,
  }));

  const onPlaceBet = async () => {
    if (selectedNumbers.length === 0) return;

    const totalCost = numberBid[0] * selectedNumbers.length;
    if (totalCost > totalCoins) {
      toast({
        variant: "destructive",
        title: "Insufficient Funds",
        description: `You need ${totalCost.toLocaleString()} coins to place these bets.`,
      });
      return;
    }

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const token = getUserProfile()?.token;
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const successes: DoubleTroubleTicket[] = [];
    const failures: number[] = [];

    for (const num of selectedNumbers) {
      try {
        const res = await axios.post(
          `${API_URL}/doubleTrouble/create`,
          {
            drawType: "Number",
            bidAmount: numberBid[0],
            userNumber: num,
          },
          { headers }
        );
        const payload = res.data as { success: boolean; data: DoubleTroubleTicket; message?: string };
        if (payload?.success && payload.data) {
          successes.push(payload.data);
        } else {
          failures.push(num);
        }
      } catch {
        failures.push(num);
      }
    }

    if (successes.length) {
      setDoubleTroubleUserHistory((prev) => [...successes, ...(prev || [])]);
      toast({
        variant: "success",
        title: "Bet(s) Placed",
        description: `${successes.length} number bet${successes.length > 1 ? "s" : ""} placed successfully.`,
      });
    }
    if (failures.length) {
      toast({
        variant: "destructive",
        title: "Some Bets Failed",
        description: `Failed for numbers: ${failures.join(", ")}.`,
      });
    }

    // Reset selection and bid
    setSelectedNumbers([]);
    setNumberBid([10]);
  };

  return (
    <Card className="w-full glassmorphism hover:shadow-2xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2">
          <Target className="h-6 w-6" /> Bet on a Specific Number
        </CardTitle>
        <CardDescription className="text-center">
          Correctly guess the number and win a 10x Payout!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
        <NumberGrid
          numberGrid={numberGrid}
          selectedNumbers={selectedNumbers}
          placedNumberBets={placedNumberBets}
          onNumberClick={handleNumberClick}
        />
      </CardContent>
      <CardFooter>
        <Button
          onClick={onPlaceBet}
          disabled={selectedNumbers.length === 0}
          className="w-full"
        >
          Place Number Bet
        </Button>
      </CardFooter>
    </Card>
  );
}
