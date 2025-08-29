import { cn } from "@/libs/utils";
import { prizes, segmentColors } from "@/libs/constants";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useWebSocketStore } from "@/store/websocketStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export function SpinWheel() {
  const { user, sendMessage } = useWebSocketStore(); // Get user from Zustand store

  // fake state
  const [rotation, setRotation] = useState(0);
  const [hasspinToday, setHasspinToday] = useState<boolean>(
    Boolean(user?.isSpinned)
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false); // Placeholder for actual spinning state

  const spin = (value: number) => {
    // stop spinning
    setHasspinToday(true);
    setIsSpinning(false);
    const payload = { amount: value };
    sendMessage("spinWheel", payload);
  };

  const handleSpin = () => {
    // First, calculate the target segment and prize
    const segmentAngle = 360 / prizes.length;
    const randomSegment = Math.floor(Math.random() * prizes.length);

    // Calculate the angle where this segment should stop under the pointer
    // The pointer is at the top (0 degrees), so we want the CENTER of the target segment there
    const segmentCenter = randomSegment * segmentAngle + segmentAngle / 2;

    // Calculate final rotation (multiple full spins + adjustment to land on target)
    const extraSpins = Math.floor(Math.random() * 5) + 5; // 5-10 full rotations
    // We need to rotate so the segment center ends up at 0 degrees (top)
    // Since we're rotating the wheel clockwise, we subtract the segment center angle
    const finalRotation = rotation + 360 * extraSpins + (360 - segmentCenter);

    // Get the prize value for this segment
    const prize = prizes[randomSegment];

    // Start the visual rotation and animation state
    setIsAnimating(true);
    setRotation(finalRotation);

    // Wait for the rotation animation to complete before calling the server
    setTimeout(() => {
      spin(prize.value);
    }, 4000); // Match the animation duration

    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 4200); // Slightly longer than animation to ensure it completes
  };

  if (user?.isSpinned) return null;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="flex items-center gap-2 bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-105 active:scale-95 transition-all"
        >
          <Icons.gift className="h-4 w-4" />
          Spin to Win
        </Button>
      </DialogTrigger>
      <DialogContent className="glassmorphism">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline flex items-center justify-center gap-2">
            <Icons.gift className="h-6 w-6 text-primary" />
            Daily Bonus Wheel
          </DialogTitle>
          <DialogDescription className="text-center">
            Spin the wheel to win extra coins! You get one free spin per day.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-4 space-y-8">
          <div className="relative w-80 h-80 flex items-center justify-center">
            {/* Pointer make it inverse of the wheel bring it little bit down */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2  w-0 h-0 border-l-[15px] border-r-[15px] border-b-[25px] border-l-transparent border-r-transparent border-b-white z-20 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] rotate-180 translate-y-2 shadow-inner" />

            {/* Wheel */}
            <div
              className={cn(
                "relative w-72 h-72 rounded-full border-[5px] border-red-500 bg-yellow-400 shadow-[inset_0_0_10px_rgba(0,0,0,0.5),0_0_20px_rgba(255,255,0,0.5)] transition-transform ease-out overflow-hidden",
                isAnimating && "duration-4000"
              )}
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {/* Segments */}
              <div className="absolute w-full h-full">
                {prizes.map((_, index) => {
                  const angle = (360 / prizes.length) * index;
                  const segmentColor = segmentColors[index % 2];
                  return (
                    <div
                      key={`segment-${index}`}
                      className="absolute w-1/2 h-1/2 origin-bottom-right"
                      style={{
                        transform: `rotate(${angle}deg)`,
                        clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 0)`,
                      }}
                    >
                      <div
                        className="absolute w-full h-full"
                        style={{
                          background: segmentColor,
                          transform: "rotate(22.5deg) scale(1.5)",
                        }}
                      />
                    </div>
                  );
                })}
              </div>
              {/* Labels */}
              <div className="absolute w-full h-full z-10">
                {prizes.map((prize, index) => {
                  const angle =
                    (360 / prizes.length) * index + 360 / prizes.length / 2;
                  const labelColor = index % 2 != 0 ? "#dc2626" : "#fde047";
                  return (
                    <div
                      key={`label-${index}`}
                      className="absolute w-full h-full flex items-start justify-center"
                      style={{
                        transform: `rotate(${angle}deg)`,
                      }}
                    >
                      {/* make label little bit inside the segment */}
                      <span
                        className="text-md font-bold"
                        style={{
                          color: labelColor,
                          textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                          paddingTop: "1.5rem",
                          display: "inline-block",
                          transform: `rotate(-${angle}deg)`,
                        }}
                      >
                        {prize.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Center Hub */}
            <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5),inset_0_2px_2px_rgba(255,255,255,0.5)] border-4 border-yellow-300 z-10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-inner" />
            </div>
          </div>

          <div className="w-full max-w-sm space-y-3">
            <Button
              onClick={handleSpin}
              disabled={isSpinning || hasspinToday || isAnimating}
              size="lg"
              className="w-full animation-all hover:scale-105 active:scale-95 text-lg font-bold py-6"
            >
              {isSpinning || isAnimating ? (
                <Icons.rotateCcw className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Icons.gift className="mr-2 h-5 w-5" />
              )}
              {hasspinToday
                ? "Already spin Today"
                : isAnimating
                ? "Spinning..."
                : "Spin to Win!"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
