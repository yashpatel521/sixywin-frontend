import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Wheel } from "react-custom-roulette";
import { prizes } from "@/lib/constants";
import { Icons } from "@/components/shared/icons";

export function SpinWheel() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [spun, setSpun] = useState(false);
  const { toast } = useToast();

  // Transform prizes data to match react-custom-roulette format
  const wheelData = prizes.map((prize, index) => ({
    option: prize.label,
    style: {
      backgroundColor: index % 2 === 0 ? "#fde047" : "#dc2626",
      textColor: index % 2 === 0 ? "#dc2626" : "#fde047",
      fontSize: prize.label === "JACKPOT" ? 16 : 18,
      fontWeight: "bold",
    },
  }));

  const handleSpinClick = () => {
    if (spun) {
      toast({
        variant: "destructive",
        title: "Already Spun!",
        description: "You can spin the wheel once per day. Come back tomorrow!",
      });
      return;
    }

    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * prizes.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  const handleStopSpinning = () => {
    setMustSpin(false);
    setSpun(true);

    const prize = prizes[prizeNumber];

    if (prize.value > 0) {
      toast({
        title: "You Won!",
        description: `Congratulations! You won ${
          prize.label === "JACKPOT" ? "the JACKPOT" : ""
        } ${prize.value.toLocaleString()} coins.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "So close!",
        description: "Better luck next time. Try again tomorrow!",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-8">
      <div className="relative flex items-center justify-center">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={wheelData}
          onStopSpinning={handleStopSpinning}
          backgroundColors={["#fde047", "#dc2626"]}
          textColors={["#dc2626", "#fde047"]}
          outerBorderColor="#fbbf24"
          outerBorderWidth={8}
          innerRadius={15}
          innerBorderColor="#fbbf24"
          innerBorderWidth={4}
          radiusLineColor="#fbbf24"
          radiusLineWidth={3}
          fontFamily="Inter, system-ui, sans-serif"
          fontSize={18}
          fontWeight="bold"
          perpendicularText={false}
          textDistance={70}
          spinDuration={0.8}
          disableInitialAnimation={false}
          pointerProps={{
            style: {
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
            },
          }}
        />
      </div>

      <div className="w-full max-w-sm">
        <Button
          onClick={handleSpinClick}
          disabled={mustSpin || spun}
          size="lg"
          className="w-full animation-all hover:scale-105 active:scale-95 text-lg font-bold py-6"
        >
          {mustSpin ? (
            <Icons.rotateCcw className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Icons.gift className="mr-2 h-5 w-5" />
          )}
          {spun ? "Spun Today" : "Spin to Win!"}
        </Button>
      </div>
    </div>
  );
}
