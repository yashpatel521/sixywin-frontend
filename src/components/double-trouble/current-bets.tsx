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

export function CurrentBets({ overUnderBets, numberBets }: CurrentBetsProps) {
  const noBetsPlaced = overUnderBets.length === 0 && numberBets.length === 0;

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
            {overUnderBets.length > 0 && (
              <div className="p-4 rounded-lg bg-secondary/30 space-y-2">
                <div className="flex items-center gap-3">
                  <Icons.arrowUp className="h-5 w-5 text-green-500" />
                  <Icons.arrowDown className="h-5 w-5 text-red-500" />
                  <p className="font-semibold">Range Bets</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {overUnderBets.map((bet, index) => (
                    <div
                      key={`range-${index}`}
                      className={`flex items-center gap-2 p-2 rounded-md
                        ${
                          bet.result === "win"
                            ? "bg-green-200"
                            : bet.result === "lose"
                            ? "bg-red-200"
                            : "bg-background/50"
                        }
                      `}
                    >
                      <Badge
                        variant="default"
                        className="text-md bg-accent text-accent-foreground capitalize"
                      >
                        {bet.direction} 25
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
            {numberBets.length > 0 && (
              <div className="p-4 rounded-lg bg-secondary/30 space-y-2">
                <div className="flex items-center gap-3">
                  <Icons.target className="h-6 w-6 text-blue-500" />
                  <p className="font-semibold">Number Bets</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {numberBets.map((bet, index) => (
                    <div
                      key={`number-${index}`}
                      className={`flex items-center gap-2 p-2 rounded-md
                        ${
                          bet.result === "win"
                            ? "bg-green-200"
                            : bet.result === "lose"
                            ? "bg-red-200"
                            : "bg-background/50"
                        }
                      `}
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
