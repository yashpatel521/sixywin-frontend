"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Ticket, Dices, Sparkles, Gem } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHistory } from "@/hooks/use-history";
import { useToast } from "@/hooks/use-toast";
import Confetti from "react-confetti";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
// import { useMegaPot } from "@/hooks/use-mega-pot";
import { LatestDrawNumbers } from "./latest-draw";
import { Separator } from "@/components/ui/separator";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import { MAX_NUMBERS, TOTAL_NUMBERS } from "@/lib/constants";
import { TicketSubmissionProps } from "@/lib/types";

export function TicketSubmission({ nextDrawDate }: TicketSubmissionProps) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [bidAmount, setBidAmount] = useState([10]);
  const { addTicket } = useHistory();
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isClient, setIsClient] = useState(false);
  // const { pot, setPot, isLoaded } = useMegaPot();

  useEffect(() => {
    setIsClient(true);
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleNumberClick = (num: number) => {
    setSelectedNumbers((prev) => {
      if (prev.includes(num)) {
        return prev.filter((n) => n !== num);
      }
      if (prev.length < MAX_NUMBERS) {
        return [...prev, num].sort((a, b) => a - b);
      }
      return prev;
    });
  };

  const handleQuickPick = () => {
    const numbers = new Set<number>();
    while (numbers.size < MAX_NUMBERS) {
      numbers.add(Math.floor(Math.random() * TOTAL_NUMBERS) + 1);
    }
    setSelectedNumbers(Array.from(numbers).sort((a, b) => a - b));
  };

  const handleSubmit = () => {
    // This is where you would connect to your own backend.
    // For now, we'll simulate a draw result locally for demonstration.
    const winningNumbers = new Set<number>();
    while (winningNumbers.size < MAX_NUMBERS) {
      winningNumbers.add(Math.floor(Math.random() * TOTAL_NUMBERS) + 1);
    }
    const winningNumbersArray = Array.from(winningNumbers).sort(
      (a, b) => a - b
    );
    const matches = selectedNumbers.filter((num) =>
      winningNumbersArray.includes(num)
    ).length;
    const multipliers: { [key: number]: number } = {
      3: 5,
      4: 50,
      5: 1000,
      6: 100000,
    };
    const coinsWon = (multipliers[matches] || 0) * bidAmount[0];

    addTicket({
      userNumbers: selectedNumbers,
      winningNumbers: winningNumbersArray,
      matches,
      coinsWon,
      bid: bidAmount[0],
    });

    toast({
      title: "Ticket Submitted!",
      description: `You matched ${matches} numbers and won ${coinsWon.toLocaleString()} coins!`,
    });

    if (coinsWon > 0) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }

    setSelectedNumbers([]);
  };

  const numberGrid = useMemo(
    () => Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1),
    []
  );

  return (
    <>
      {isClient && showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={400}
        />
      )}
      <Card className="w-full glassmorphism animation-all hover:shadow-2xl">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-grow">
            <CardTitle className="font-headline text-3xl flex items-center gap-2">
              <Ticket className="h-8 w-8 text-primary" />
              Pick Your Numbers
            </CardTitle>
            <CardDescription>
              Select {MAX_NUMBERS} numbers, place your bid, and submit your
              ticket.
            </CardDescription>
          </div>
          <div className="flex-shrink-0 w-full md:w-auto">
            <div className="p-2 flex items-center gap-4">
              <CountdownTimer
                nextDrawDate={nextDrawDate}
                label="Next Draw In"
              />
              <Separator orientation="vertical" className="h-12" />
              <LatestDrawNumbers />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex p-4 justify-center items-center rounded-lg bg-secondary/30 border-2 border-dashed border-primary/20 min-h-[64px]">
            <div className="flex flex-wrap gap-2">
              {selectedNumbers.map((num) => (
                <div
                  key={`selected-${num}`}
                  className="h-12 w-12 flex items-center justify-center font-bold text-xl rounded-full bg-primary text-primary-foreground shadow-lg animate-in fade-in zoom-in-50"
                >
                  {num}
                </div>
              ))}
              {[...Array(MAX_NUMBERS - selectedNumbers.length)].map((_, i) => (
                <div
                  key={`placeholder-${i}`}
                  className="h-12 w-12 flex items-center justify-center rounded-full bg-background/50"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-7 md:grid-cols-10 gap-2 mb-6">
            {numberGrid.map((num) => {
              const isSelected = selectedNumbers.includes(num);
              return (
                <button
                  key={num}
                  onClick={() => handleNumberClick(num)}
                  disabled={
                    !isSelected && selectedNumbers.length >= MAX_NUMBERS
                  }
                  className={cn(
                    "h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 ease-in-out transform hover:scale-110 focus:ring-2 focus:ring-primary focus:z-10",
                    isSelected
                      ? "bg-accent text-accent-foreground shadow-md scale-110"
                      : "bg-background/50 border hover:bg-secondary disabled:opacity-50 disabled:transform-none disabled:hover:bg-background"
                  )}
                  aria-pressed={isSelected}
                >
                  {num}
                </button>
              );
            })}
          </div>

          <div className="space-y-6">
            <div className="grid gap-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="bid-slider">Your Bid</Label>
                <div className="flex items-center gap-2 font-bold text-primary">
                  <Gem className="h-5 w-5" />
                  <span>{bidAmount[0].toLocaleString()} Coins</span>
                </div>
              </div>
              <Slider
                id="bid-slider"
                min={1}
                max={100}
                step={1}
                value={bidAmount}
                onValueChange={setBidAmount}
                className="w-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                onClick={handleQuickPick}
                className="w-full animation-all hover:scale-105 active:scale-95"
              >
                <Dices className="mr-2 h-4 w-4" />
                Quick Pick
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={selectedNumbers.length !== MAX_NUMBERS}
                className="w-full animation-all hover:scale-105 active:scale-95"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Submit Ticket & Bid
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
