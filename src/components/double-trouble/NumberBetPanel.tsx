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

export function NumberBetPanel({
  numberBid,
  setNumberBid,
  selectedNumbers,
  setSelectedNumbers,
  placedNumberBets,
  onPlaceBet,
  totalNumbers,
  singleSelect = false, // new prop for single selection
  userCoins,
}: {
  numberBid: number[];
  setNumberBid: (val: number[]) => void;
  selectedNumbers: number[];
  setSelectedNumbers: React.Dispatch<React.SetStateAction<number[]>>;
  placedNumberBets: { number: number }[];
  onPlaceBet: () => void;
  totalNumbers: number;
  singleSelect?: boolean;
  userCoins: number;
}) {
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
            max={userCoins}
            step={10}
            value={numberBid}
            onValueChange={setNumberBid}
          />
          <p className="text-sm text-muted-foreground text-center">
            You have {userCoins.toLocaleString()} Coins available.
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
