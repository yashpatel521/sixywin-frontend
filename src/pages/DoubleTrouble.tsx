import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Hourglass } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { CurrentBets } from "@/components/double-trouble/current-bets";
import { CountdownTimer } from "@/components/double-trouble/CountdownTimer";
import { LastDrawHistory } from "@/components/double-trouble/LastDrawHistory";
import { RangeBetPanel } from "@/components/double-trouble/RangeBetPanel";
import { NumberBetPanel } from "@/components/double-trouble/NumberBetPanel";

import {
  PlacedBet,
  PlacedNumberBet,
  DoubleTroubleDrawResult,
  drawType,
} from "@/libs/interfaces";
import { MAX_NUMBER_DOUBLE_TROUBLE } from "@/libs/constants";
import { useWebSocketStore } from "@/store/websocketStore";

export default function DoubleTroublePage() {
  const { sendMessage, doubleTroubleDrawResult, user } = useWebSocketStore();
  const { toast } = useToast();

  const [overUnderBid, setOverUnderBid] = useState([10]);
  const [numberBid, setNumberBid] = useState([10]);
  const [betDirection, setBetDirection] = useState<drawType | null>(null);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);

  const [placedOverUnderBets, setPlacedOverUnderBets] = useState<PlacedBet[]>(
    []
  );
  const [placedNumberBets, setPlacedNumberBets] = useState<PlacedNumberBet[]>(
    []
  );

  const [drawHistory, setDrawHistory] = useState<DoubleTroubleDrawResult[]>([]);
  useEffect(() => {
    if (!doubleTroubleDrawResult) return;

    setDrawHistory((prev) => [doubleTroubleDrawResult, ...prev].slice(0, 10));

    const evaluateRangeBet = (
      bet: PlacedBet,
      draw: DoubleTroubleDrawResult
    ): "win" | "lose" => {
      if (bet.direction === "Under")
        return draw.winningNumbers < 15 ? "win" : "lose";
      if (bet.direction === "Over")
        return draw.winningNumbers > 15 ? "win" : "lose";
      if (bet.direction === "Exact")
        return draw.winningNumbers === 15 ? "win" : "lose";
      return "lose";
    };

    setPlacedOverUnderBets((bets) =>
      bets
        .map((bet) => ({
          ...bet,
          result: evaluateRangeBet(bet, doubleTroubleDrawResult) as
            | "win"
            | "lose",
          drawsRemaining: bet.drawsRemaining - 1,
        }))
        .filter((bet) => bet.drawsRemaining > 0)
    );

    setPlacedNumberBets((bets) =>
      bets
        .map((bet) => ({
          ...bet,
          result:
            bet.number === doubleTroubleDrawResult.winningNumbers
              ? ("win" as const)
              : ("lose" as const),
          drawsRemaining: bet.drawsRemaining - 1,
        }))
        .filter((bet) => bet.drawsRemaining > 0)
    );
    setSelectedNumbers([]);
  }, [doubleTroubleDrawResult]);

  const handlePlaceOverUnderBet = () => {
    if (!betDirection) {
      toast({
        variant: "destructive",
        title: "No Selection",
        description: 'Please select "Under", "Over", or "Exact" first.',
      });
      return;
    }

    const newBet: PlacedBet = {
      direction: betDirection,
      bid: overUnderBid[0],
      result: "pending",
      drawsRemaining: 2,
    };

    setPlacedOverUnderBets((prev) => [...prev, newBet]);

    sendMessage("createDoubleTroubleTicket", {
      drawType: betDirection,
      bidAmount: overUnderBid[0],
      userNumber: null, // No number selected for range bets
    });

    setBetDirection(null);
  };

  const handlePlaceNumberBet = () => {
    if (selectedNumbers.length === 0) {
      toast({
        variant: "destructive",
        title: "No Numbers Selected",
        description: "Please select one or more numbers from the grid.",
      });
      return;
    }

    const newBets: PlacedNumberBet[] = selectedNumbers.map((num) => ({
      number: num,
      bid: numberBid[0],
      result: "pending",
      drawsRemaining: 2,
    }));
    sendMessage("createDoubleTroubleTicket", {
      drawType: "Number",
      bidAmount: numberBid[0],
      userNumber: selectedNumbers[0], // Send selected numbers for number bets
    });
    setPlacedNumberBets((prev) => [...prev, ...newBets]);
    setSelectedNumbers([]);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      {/* Header */}
      <Card className="w-full glassmorphism">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl flex items-center justify-center gap-2">
            <Hourglass className="h-8 w-8 text-primary" />
            Double Trouble
          </CardTitle>
          <CardDescription>
            A new number is drawn every 30 seconds. Place your bets for the next
            round!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row justify-around items-center p-4 rounded-lg bg-secondary/30 gap-8 md:gap-4">
            {doubleTroubleDrawResult?.nextDrawTime ? (
              <CountdownTimer
                nextDrawTime={doubleTroubleDrawResult.nextDrawTime}
              />
            ) : (
              <div className="text-center text-lg text-muted-foreground">
                Game starts soon with a new number every 30 seconds!
              </div>
            )}
            <LastDrawHistory drawHistory={drawHistory} />
          </div>
        </CardContent>
      </Card>

      {/* Betting Panels */}
      {doubleTroubleDrawResult?.nextDrawTime && (
        <>
          <div className="grid grid-cols-12 gap-3 items-start">
            <div className="col-span-12 md:col-span-5">
              <RangeBetPanel
                betDirection={betDirection}
                setBetDirection={setBetDirection}
                overUnderBid={overUnderBid}
                setOverUnderBid={setOverUnderBid}
                onPlaceBet={handlePlaceOverUnderBet}
                userCoins={
                  (user?.coins || 0) + (user?.winningAmount || 0) || 10
                }
              />
            </div>

            <div className="col-span-12 md:col-span-7">
              <NumberBetPanel
                numberBid={numberBid}
                setNumberBid={setNumberBid}
                selectedNumbers={selectedNumbers}
                setSelectedNumbers={setSelectedNumbers}
                placedNumberBets={placedNumberBets}
                onPlaceBet={handlePlaceNumberBet}
                totalNumbers={MAX_NUMBER_DOUBLE_TROUBLE}
                singleSelect={true} // Allow multiple number selections
                userCoins={
                  (user?.coins || 0) + (user?.winningAmount || 0) || 10
                }
              />
            </div>
          </div>
          <CurrentBets
            overUnderBets={placedOverUnderBets}
            numberBets={placedNumberBets}
          />
        </>
      )}
    </div>
  );
}
