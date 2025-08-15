import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AD_DURATION, REWARD_AMOUNT } from "@/libs/constants";
import { Icons } from "@/components/ui/icons";
import { toast } from "@/hooks/use-toast";

export function WatchAd() {
  const [adState, setAdState] = useState<"idle" | "playing" | "finished">(
    "idle"
  );
  const [progress, setProgress] = useState(0);

  const handleWatchAd = () => {
    setAdState("playing");
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 100 / AD_DURATION;
        if (newProgress >= 100) {
          clearInterval(interval);
          setAdState("finished");
          toast({
            title: "Reward Claimed!",
            description: `You've earned ${REWARD_AMOUNT.toLocaleString()} coins!`,
          });
          return 100;
        }
        return newProgress;
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-6 text-center">
      <div className="relative w-full aspect-video rounded-lg bg-black overflow-hidden flex items-center justify-center border-2 border-primary/50 shadow-lg">
        {adState === "idle" && (
          <div className="text-center text-white">
            <Icons.playCircle className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-bold">Ad Ready to Play</h3>
          </div>
        )}
        {adState === "playing" && (
          <>
            <img
              src="https://placehold.co/1280x720.png"
              alt="Ad placeholder"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 right-2">
              <Progress value={progress} className="w-full h-2" />
            </div>
          </>
        )}
        {adState === "finished" && (
          <div className="text-center text-white">
            <Icons.checkCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
            <h3 className="text-xl font-bold">Ad Finished!</h3>
            <p className="text-muted-foreground">Your reward has been added.</p>
          </div>
        )}
      </div>

      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 text-lg font-semibold text-primary mb-4">
          <Icons.gem className="h-6 w-6" />
          <span>Earn {REWARD_AMOUNT.toLocaleString()} Coins</span>
        </div>
        <Button
          onClick={handleWatchAd}
          disabled={adState !== "idle"}
          size="lg"
          className="w-full animation-all hover:scale-105 active:scale-95 text-lg font-bold py-6"
        >
          {adState === "idle" && (
            <>
              <Icons.film className="mr-2 h-5 w-5" /> Watch Ad
            </>
          )}
          {adState === "playing" && (
            <>
              <Icons.hourglass className="mr-2 h-5 w-5 animate-spin" />{" "}
              Watching...
            </>
          )}
          {adState === "finished" && (
            <>
              <Icons.checkCircle className="mr-2 h-5 w-5" /> Reward Claimed
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
