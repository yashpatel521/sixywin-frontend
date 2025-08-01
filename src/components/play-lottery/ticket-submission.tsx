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
import { LatestDrawNumbers } from "./latest-draw";
import { Separator } from "@/components/ui/separator";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import { MAX_NUMBERS, TOTAL_NUMBERS } from "@/lib/constants";
import { TicketSubmissionProps } from "@/lib/types";
import { wsClient } from "@/websocket";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { User } from "@/lib/interfaces";

export function TicketSubmission({ nextDrawDate }: TicketSubmissionProps) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [bidAmount, setBidAmount] = useState([10]);
  const { addTicket } = useHistory();
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isClient, setIsClient] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useLocalStorage<User | null>("user", null);

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
    if (!user) {
      return;
    }

    if (selectedNumbers.length !== MAX_NUMBERS) {
      return;
    }

    // Check if user has enough coins
    const totalFunds = (user.coins || 0) + (user.winningAmount || 0);
    if (totalFunds < bidAmount[0]) {
      return;
    }

    toast({
      title: "🎫 Ticket Submitted!",
      description: `Your ticket with numbers [${selectedNumbers.join(
        ", "
      )}] and bid of ${bidAmount[0].toLocaleString()} coins has been submitted successfully!`,
      className:
        "bg-green-500/20 backdrop-blur-md border-green-500/30 text-green-100 shadow-lg shadow-green-500/25",
    });

    setIsSubmitting(true);

    try {
      const requestId = Math.random().toString(36).substring(7);

      // Wait for WebSocket connection if not connected
      if (!wsClient.isConnected()) {
        toast({
          title: "Connection Error",
          description: "Connecting to server...",
          variant: "destructive",
        });

        const connectionTimeout = setTimeout(() => {
          toast({
            title: "Connection Failed",
            description: "Please refresh the page and try again.",
            variant: "destructive",
          });
          setIsSubmitting(false);
        }, 5000);

        const connectionCheckInterval = setInterval(() => {
          if (wsClient.isConnected()) {
            clearTimeout(connectionTimeout);
            clearInterval(connectionCheckInterval);
            sendTicketRequest(requestId);
          }
        }, 100);

        return;
      }

      sendTicketRequest(requestId);
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  const sendTicketRequest = (requestId: string) => {
    let handleCreateTicketResponse: (message: any) => void;
    let timeoutId: NodeJS.Timeout;

    const ticketData = {
      numbers: selectedNumbers,
      bid: bidAmount[0],
      userId: user?.id,
    };

    wsClient.send({
      type: "createTicket",
      requestId,
      payload: ticketData,
      timestamp: new Date().toISOString(),
    });

    handleCreateTicketResponse = (message: any) => {
      if (
        message.type === "createTicket_response" &&
        message.requestId === requestId
      ) {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        if (message.payload.success) {
          const ticketData = message.payload.data;

          // Update user data if provided in response
          if (message.payload.user) {
            setUser(message.payload.user);
          }

          // Add ticket to local history
          const historyTicket = {
            userNumbers: selectedNumbers,
            winningNumbers: ticketData.winningNumbers || [],
            matches: ticketData.matchedNumbers?.length || 0,
            coinsWon: ticketData.coinsWon || 0,
            bid: bidAmount[0],
          };

          addTicket(historyTicket);

          if (ticketData.coinsWon > 0) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
          }

          setSelectedNumbers([]);
        }

        setIsSubmitting(false);
      }
    };

    wsClient.on("createTicket_response", handleCreateTicketResponse);

    timeoutId = setTimeout(() => {
      setIsSubmitting(false);
    }, 10000);

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (handleCreateTicketResponse) {
        wsClient.off("createTicket_response", handleCreateTicketResponse);
      }
    };
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
                <Dices className="mr-2 h-4 w-4" />
                Quick Pick
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={
                  selectedNumbers.length !== MAX_NUMBERS || isSubmitting
                }
                className="w-full animation-all hover:scale-105 active:scale-95"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                {isSubmitting ? "Submitting..." : "Submit Ticket & Bid"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
