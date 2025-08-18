import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CurrentBetsProps } from "@/libs/interfaces";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/libs/utils";

export function CurrentBets({ overUnderBets, numberBets }: CurrentBetsProps) {
  const noBetsPlaced = overUnderBets.length === 0 && numberBets.length === 0;

  const getBetBg = (result?: "win" | "lose" | "pending") => {
    switch (result) {
      case "win":
        return "bg-[hsl(var(--success)/0.2)] text-white [box-shadow:inset_0_0_10px_rgba(22,163,74,0.6)] rounded-md";
      case "lose":
        return "bg-[hsl(var(--destructive)/0.2)] text-white [box-shadow:inset_0_0_10px_rgba(255,77,77,0.6)] rounded-md";
      case "pending":
        return "bg-gray-500/20 text-white [box-shadow:inset_0_0_8px_rgba(128,128,128,0.5)] rounded-md";
      case undefined:
      default:
        return "glassmorphism text-white rounded-md";
    }
  };

  const getDirectionIcon = (direction: string) => {
    if (direction.toLowerCase() === "under")
      return <Icons.arrowUp className="h-5 w-5 text-[hsl(var(--success))]" />;
    if (direction.toLowerCase() === "over")
      return (
        <Icons.arrowDown className="h-5 w-5 text-[hsl(var(--destructive))]" />
      );
    if (direction.toLowerCase() === "exact")
      return <Icons.target className="h-5 w-5 text-[hsl(var(--info))]" />;
    return null;
  };

  return (
    <Card className="w-full glassmorphism animation-all hover:shadow-2xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Icons.listChecks className="h-6 w-6 text-primary" />
          Your Bets for Next Round
        </CardTitle>
        <CardDescription>
          Your locked-in bets for the upcoming draw. Bets will be cleared when
          the next round starts.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {noBetsPlaced ? (
          <div className="flex flex-col items-center justify-center text-center p-8 rounded-lg bg-secondary/30">
            <Icons.info className="h-10 w-10 text-muted-foreground mb-4" />
            <p className="font-semibold text-lg">No Bets Placed</p>
            <p className="text-muted-foreground">
              Use the controls above to place your bets before the next draw!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Over/Under Bets */}
            {overUnderBets.length > 0 && (
              <div className="p-4 rounded-lg bg-secondary/30 space-y-2">
                <div className="flex items-center gap-3">
                  <p className="font-semibold">Range Bets</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {overUnderBets.map((bet, index) => (
                    <div
                      key={`range-${index}`}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-md transition-all hover:scale-105",
                        getBetBg(bet.result)
                      )}
                    >
                      {getDirectionIcon(bet.direction || "")}
                      <div className="flex items-center gap-1 font-semibold text-primary text-sm">
                        <Icons.gem className="h-4 w-4" />
                        <span>{bet.bid.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Number Bets */}
            {numberBets.length > 0 && (
              <div className="p-4 rounded-lg bg-secondary/30 space-y-2">
                <div className="flex items-center gap-3">
                  <Icons.target className="h-6 w-6 text-[hsl(var(--info))]" />
                  <p className="font-semibold">Number Bets</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {numberBets.map((bet, index) => (
                    <div
                      key={`number-${index}`}
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-md transition-all hover:scale-105",
                        getBetBg(bet.result)
                      )}
                    >
                      <Badge
                        variant="default"
                        className="text-md bg-accent text-accent-foreground"
                      >
                        {bet.number}
                      </Badge>
                      <div className="flex items-center gap-1 font-semibold text-primary text-sm">
                        <Icons.gem className="h-4 w-4" />
                        <span>{bet.bid.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
