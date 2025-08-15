import { useState, useEffect } from "react";
import { Timer } from "lucide-react";

export function CountdownTimer({ nextDrawTime }: { nextDrawTime: string }) {
  const calculateSecondsLeft = () => {
    const now = new Date();
    const target = new Date(nextDrawTime);
    const diffMs = target.getTime() - now.getTime();
    return diffMs > 0 ? Math.floor(diffMs / 1000) : 0;
  };

  const [secondsLeft, setSecondsLeft] = useState(calculateSecondsLeft());

  useEffect(() => {
    setSecondsLeft(calculateSecondsLeft()); // reset when nextDrawTime changes

    const interval = setInterval(() => {
      setSecondsLeft(calculateSecondsLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [nextDrawTime]);

  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-sm text-muted-foreground">Next draw in...</div>
      <div className="flex items-center gap-2 text-6xl">
        <Timer className="h-14 w-14 animate-pulse text-primary" />
        <span className="font-bold text-primary">{seconds}</span>
      </div>
    </div>
  );
}
