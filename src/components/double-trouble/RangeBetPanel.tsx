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
import { useWebSocketStore } from "@/store/websocketStore";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { useApiRequest } from "@/libs/apiRequest";
import { DoubleTroubleTicket } from "@/libs/interfaces";

export function RangeBetPanel() {
  const { user, setDoubleTroubleUserHistory } = useWebSocketStore();
  const [overUnderBid, setOverUnderBid] = useState([10]);
  const [betDirection, setBetDirection] = useState<drawType | null>(null);
  // API Call
  const { data, request } = useApiRequest<DoubleTroubleTicket>({
    url: "/doubleTrouble/create",
    method: "POST",
    isToken: true,
    data: {
      drawType: betDirection,
      bidAmount: overUnderBid[0],
      userNumber: user?.id,
    },
  });

  // When a ticket is created successfully, append it to the local user history
  useEffect(() => {
    if (data) {
      setDoubleTroubleUserHistory((prev) => [data, ...(prev || [])]);
    }
  }, [data, setDoubleTroubleUserHistory]);

  const handlePlaceOverUnderBet = async () => {
    if (!betDirection) {
      toast({
        variant: "destructive",
        title: "No Selection",
        description: 'Please select "Under", "Over", or "Exact" first.',
      });
      return;
    }

    await request();
    toast({
      variant: "success",
      title: "Bet Placed",
      description: "Your bet has been placed successfully.",
    });
    setBetDirection(null);
    setOverUnderBid([10]);
    console.log(data);
  };

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
            max={user?.coins || 0}
            step={10}
            value={overUnderBid}
            onValueChange={setOverUnderBid}
          />
          <p className="text-sm text-muted-foreground text-center">
            You have {user?.coins.toLocaleString()} Coins available.
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
        <Button
          onClick={handlePlaceOverUnderBet}
          disabled={overUnderBid[0] === 0 || !betDirection}
          className="w-full"
        >
          Place Range Bet
        </Button>
      </CardFooter>
    </Card>
  );
}
