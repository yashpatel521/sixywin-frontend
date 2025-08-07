import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Gem,
  ArrowDown,
  ArrowUp,
  Hourglass,
  Timer,
  Target,
  Dot,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Confetti from "react-confetti";
import { cn } from "@/lib/utils";
import { CurrentBets } from "@/components/double-trouble/current-bets";
import {
  PlacedBet,
  PlacedNumberBet,
  BetDirection,
  DoubleTroubleDrawResult,
} from "@/lib/interfaces";
import { TOTAL_NUMBERS, DRAW_INTERVAL_SECONDS } from "@/lib/constants";

const initialHistory: DoubleTroubleDrawResult[] = [
  { number: 12, outcome: "win" },
  { number: 35, outcome: "loss" },
  { number: 25, outcome: "win" },
  { number: 4, outcome: "win" },
  { number: 48, outcome: "loss" },
  { number: 18, outcome: "win" },
  { number: 29, outcome: "loss" },
  { number: 41, outcome: "loss" },
  { number: 3, outcome: "win" },
  { number: 22, outcome: "win" },
];

const numberGrid = Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1);

export default function DoubleTroublePage() {
  const [overUnderBid, setOverUnderBid] = useState([10]);
  const [numberBid, setNumberBid] = useState([10]);
  const [betDirection, setBetDirection] = useState<BetDirection | null>(null);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);

  const [placedOverUnderBets, setPlacedOverUnderBets] = useState<PlacedBet[]>([
    { direction: "over", bid: 25 },
  ]);
  const [placedNumberBets, setPlacedNumberBets] = useState<PlacedNumberBet[]>([
    { number: 42, bid: 50 },
    { number: 13, bid: 20 },
  ]);

  const [drawHistory, setDrawHistory] =
    useState<DoubleTroubleDrawResult[]>(initialHistory);
  const [showConfetti, setShowConfetti] = useState(false);
  const [countdown, setCountdown] = useState(DRAW_INTERVAL_SECONDS);

  const { toast } = useToast();

  const currentPlacedOverUnderBets = useRef(placedOverUnderBets);
  const currentPlacedNumberBets = useRef(placedNumberBets);

  useEffect(() => {
    currentPlacedOverUnderBets.current = placedOverUnderBets;
    currentPlacedNumberBets.current = placedNumberBets;
  }, [placedOverUnderBets, placedNumberBets]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          // Time to draw a new number
          const drawnNumber = Math.floor(Math.random() * TOTAL_NUMBERS) + 1;
          let outcome: "win" | "loss" | "jackpot" = "loss";

          const userOverUnderBets = currentPlacedOverUnderBets.current;
          const userNumberBets = currentPlacedNumberBets.current;

          if (userOverUnderBets && userOverUnderBets.length > 0) {
            for (const bet of userOverUnderBets) {
              if (
                (bet.direction === "under" && drawnNumber < 15) ||
                (bet.direction === "over" && drawnNumber > 15)
              ) {
                outcome = "win";
              } else if (bet.direction === "exact" && drawnNumber === 15) {
                outcome = "jackpot";
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 5000);
                break;
              }
            }
          }

          if (userNumberBets && userNumberBets.length > 0) {
            const winningBet = userNumberBets.find(
              (bet) => bet.number === drawnNumber
            );
            if (winningBet) {
              if (outcome === "loss") outcome = "win";
            }
          }

          const newResult: DoubleTroubleDrawResult = {
            number: drawnNumber,
            outcome,
          };
          setDrawHistory((prevHistory) =>
            [newResult, ...prevHistory].slice(0, 10)
          );

          // Reset placed bets after draw
          setPlacedOverUnderBets([]);
          setPlacedNumberBets([]);

          return DRAW_INTERVAL_SECONDS; // Reset countdown
        }
        return prevCountdown - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handlePlaceOverUnderBet = () => {
    if (!betDirection) {
      toast({
        variant: "destructive",
        title: "No Selection",
        description: 'Please select "Under", "Over", or "Exact" first.',
      });
      return;
    }
    const newBet = { direction: betDirection, bid: overUnderBid[0] };
    setPlacedOverUnderBets((prev) => [...prev, newBet]);
    setBetDirection(null);
  };

  const handleNumberClick = (num: number) => {
    setSelectedNumbers((prev) => {
      if (prev.includes(num)) {
        return prev.filter((n) => n !== num);
      }
      return [...prev, num];
    });
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
    const newBets = selectedNumbers.map((num) => ({
      number: num,
      bid: numberBid[0],
    }));
    setPlacedNumberBets((prev) => [...prev, ...newBets]);
    setSelectedNumbers([]);
  };

  const lastDraw = drawHistory.length > 0 ? drawHistory[0] : null;
  const previousDraws = drawHistory.length > 1 ? drawHistory.slice(1, 10) : [];

  return (
    <>
      {showConfetti && <Confetti recycle={false} numberOfPieces={600} />}
      <div className="container mx-auto p-4 md:p-8 space-y-8">
        <Card className="w-full glassmorphism">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl flex items-center justify-center gap-2">
              <Hourglass className="h-8 w-8 text-primary" />
              Double Trouble
            </CardTitle>
            <CardDescription>
              A new number is drawn every 30 seconds. Place your bets for the
              next round!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-around items-center p-4 rounded-lg bg-secondary/30 gap-8 md:gap-4">
              <div className="flex flex-col items-center gap-2">
                <div className="text-sm text-muted-foreground">
                  Next draw in...
                </div>
                <div className="flex items-center gap-2 text-6xl">
                  <Timer className="h-14 w-14 animate-pulse text-primary" />
                  <span className="font-bold text-primary">{countdown}</span>
                </div>
              </div>

              <div className="text-center animate-in fade-in flex items-center gap-4">
                {lastDraw && (
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-muted-foreground">Last Draw</p>
                    <div
                      className={cn(
                        "h-20 w-20 flex items-center justify-center rounded-full text-3xl font-bold animation-all",
                        lastDraw.outcome === "jackpot"
                          ? "bg-yellow-400 text-black"
                          : lastDraw.number < 15
                          ? "bg-red-500/80 text-white"
                          : lastDraw.number > 15
                          ? "bg-green-500/80 text-white"
                          : "bg-blue-500/80 text-white"
                      )}
                    >
                      {lastDraw.number}
                    </div>
                  </div>
                )}
                {previousDraws.length > 0 && (
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-muted-foreground">Previous</p>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {previousDraws.map((result, index) => (
                        <div
                          key={index}
                          className={cn(
                            "h-8 w-8 flex items-center justify-center rounded-full text-xs font-semibold animation-all",
                            result.outcome === "jackpot"
                              ? "bg-yellow-400 text-black"
                              : result.number < 15
                              ? "bg-red-500/80 text-white"
                              : result.number > 15
                              ? "bg-green-500/80 text-white"
                              : "bg-blue-500/80 text-white"
                          )}
                        >
                          {result.number}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <Card className="w-full glassmorphism animation-all hover:shadow-2xl lg:col-span-1">
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
                  id="bid-slider-range"
                  min={1}
                  max={100}
                  step={1}
                  value={overUnderBid}
                  onValueChange={setOverUnderBid}
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={betDirection === "under" ? "default" : "outline"}
                  onClick={() => setBetDirection("under")}
                  className="h-16 text-base flex-col animation-all hover:scale-105 active:scale-95"
                >
                  <ArrowDown className="mb-1" /> Under 15
                </Button>
                <Button
                  variant={betDirection === "exact" ? "default" : "outline"}
                  onClick={() => setBetDirection("exact")}
                  className="h-16 text-base flex-col animation-all hover:scale-105 active:scale-95"
                >
                  <Dot className="mb-1" /> Exact 15
                </Button>
                <Button
                  variant={betDirection === "over" ? "default" : "outline"}
                  onClick={() => setBetDirection("over")}
                  className="h-16 text-base flex-col animation-all hover:scale-105 active:scale-95"
                >
                  <ArrowUp className="mb-1" /> Over 15
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handlePlaceOverUnderBet}
                className="w-full animation-all hover:scale-105 active:scale-95"
              >
                Place Range Bet
              </Button>
            </CardFooter>
          </Card>

          <Card className="w-full glassmorphism animation-all hover:shadow-2xl lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2">
                <Target className="h-6 w-6" />
                Bet on a Specific Number
              </CardTitle>
              <CardDescription className="text-center">
                Correctly guess the number and win a 10x Payout!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="bid-slider-number">
                    Number Bid (per number)
                  </Label>
                  <div className="flex items-center gap-2 font-bold text-primary">
                    <Gem className="h-5 w-5" />
                    <span>{numberBid[0].toLocaleString()} Coins</span>
                  </div>
                </div>
                <Slider
                  id="bid-slider-number"
                  min={1}
                  max={100}
                  step={1}
                  value={numberBid}
                  onValueChange={setNumberBid}
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-10 gap-2">
                {numberGrid.map((num) => {
                  const isSelected = selectedNumbers.includes(num);
                  const isPlaced = placedNumberBets.some(
                    (bet) => bet.number === num
                  );
                  return (
                    <button
                      key={num}
                      onClick={() => handleNumberClick(num)}
                      className={cn(
                        "h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 ease-in-out transform hover:scale-110 focus:ring-2 focus:ring-primary focus:z-10",
                        isSelected
                          ? "bg-accent text-accent-foreground shadow-md scale-110"
                          : "bg-background/50 border hover:bg-secondary",
                        isPlaced && "bg-secondary"
                      )}
                      aria-pressed={isSelected}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handlePlaceNumberBet}
                className="w-full animation-all hover:scale-105 active:scale-95"
                disabled={selectedNumbers.length === 0}
              >
                Place Number Bet
              </Button>
            </CardFooter>
          </Card>
        </div>
        <CurrentBets
          overUnderBets={placedOverUnderBets}
          numberBets={placedNumberBets}
        />
      </div>
    </>
  );
}
