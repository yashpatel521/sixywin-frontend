import { ArrowDown, ArrowUp, Dot, Gem } from "lucide-react";
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
import { drawType } from "@/libs/interfaces";

export function RangeBetPanel({
  betDirection,
  setBetDirection,
  overUnderBid,
  setOverUnderBid,
  onPlaceBet,
  userCoins,
}: {
  betDirection: drawType | null;
  setBetDirection: (dir: drawType) => void;
  overUnderBid: number[];
  setOverUnderBid: (val: number[]) => void;
  userCoins: number;
  onPlaceBet: () => void;
}) {
  return (
    <Card className="w-full glassmorphism hover:shadow-2xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2">
          <ArrowDown className="h-6 w-6" />
          <ArrowUp className="h-6 w-6" />
          Bet on the Range
        </CardTitle>
        <CardDescription className="text-center">
          Win 2x for a correct range, or 50x for an exact guess of 15!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="bid-slider-range">Range Bid</Label>
            <div className="flex items-center gap-2 font-bold text-primary">
              <Gem className="h-5 w-5" />
              <span>{overUnderBid[0].toLocaleString()} Coins</span>
            </div>
          </div>
          <Slider
            min={10}
            max={userCoins}
            step={10}
            value={overUnderBid}
            onValueChange={setOverUnderBid}
          />
          <p className="text-sm text-muted-foreground text-center">
            You have {userCoins.toLocaleString()} Coins available.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={betDirection === "Under" ? "default" : "outline"}
            onClick={() => setBetDirection("Under")}
          >
            <ArrowDown className="mb-1" /> Under 15
          </Button>
          <Button
            variant={betDirection === "Exact" ? "default" : "outline"}
            onClick={() => setBetDirection("Exact")}
          >
            <Dot className="mb-1" /> Exact 15
          </Button>
          <Button
            variant={betDirection === "Over" ? "default" : "outline"}
            onClick={() => setBetDirection("Over")}
          >
            <ArrowUp className="mb-1" /> Over 15
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onPlaceBet} className="w-full">
          Place Range Bet
        </Button>
      </CardFooter>
    </Card>
  );
}
