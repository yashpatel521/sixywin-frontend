import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { LatestDrawNumbers } from "./latest-draw";
import { MAX_NUMBERS, TOTAL_NUMBERS } from "@/lib/constants";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTicketSubmission } from "@/hooks/use-ticket-submission";
import type { User } from "@/lib/interfaces";
import { Icons } from "@/components/shared/icons";

// Dynamically import Confetti to reduce bundle size
const Confetti = React.lazy(() => import("react-confetti"));

export function TicketSubmission() {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [bidAmount, setBidAmount] = useState([10]);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isClient, setIsClient] = useState(false);
  const [user] = useLocalStorage<User | null>("user", null);

  // Use the new WebSocket hook for cleaner logic
  const { isSubmitting, submitTicket, showConfetti } = useTicketSubmission();

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

  // Handle bid amount changes with toast notification
  const handleBidChange = (value: number[]) => {
    setBidAmount(value);
  };

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
    const quickPickedNumbers = Array.from(numbers).sort((a, b) => a - b);
    setSelectedNumbers(quickPickedNumbers);
  };

  const handleSubmit = async () => {
    if (selectedNumbers.length !== MAX_NUMBERS) {
      return;
    }

    const success = await submitTicket(selectedNumbers, bidAmount[0]);
    if (success) {
      setSelectedNumbers([]);
    }
  };

  const numberGrid = useMemo(
    () => Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1),
    []
  );

  return (
    <>
      {isClient && showConfetti && (
        <React.Suspense fallback={null}>
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={400}
          />
        </React.Suspense>
      )}
      <Card className="w-full glassmorphism animation-all hover:shadow-2xl">
        <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-grow">
            <CardTitle className="font-headline text-3xl flex items-center gap-2">
              <Icons.ticket className="h-8 w-8 text-primary" />
              Pick Your Numbers
            </CardTitle>
            <CardDescription>
              Select {MAX_NUMBERS} numbers, place your bid, and submit your
              ticket.
            </CardDescription>
          </div>
          <LatestDrawNumbers />
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
                  <Icons.gem className="h-5 w-5" />
                  <span>{bidAmount[0].toLocaleString()} Coins</span>
                </div>
              </div>
              <Slider
                id="bid-slider"
                min={1}
                max={100}
                step={1}
                value={bidAmount}
                onValueChange={handleBidChange}
                className="w-full"
              />
              <div className="text-sm text-muted-foreground text-center">
                Available Coins:{" "}
                {(
                  (user?.coins || 0) + (user?.winningAmount || 0)
                ).toLocaleString()}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="outline"
                onClick={handleQuickPick}
                disabled={isSubmitting}
                className="w-full animation-all hover:scale-105 active:scale-95"
              >
                <Icons.dices className="mr-2 h-4 w-4" />
                Quick Pick
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  selectedNumbers.length !== MAX_NUMBERS || isSubmitting
                }
                className="w-full animation-all hover:scale-105 active:scale-95"
              >
                <Icons.sparkles className="mr-2 h-4 w-4" />
                {isSubmitting ? "Submitting..." : "Submit Ticket & Bid"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
