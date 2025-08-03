import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import { Skeleton } from "@/components/ui/skeleton";
import { Icons } from "../shared/icons";
import { useMegaPot } from "@/hooks/use-megapot";

export function MegaPot() {
  // Use the new WebSocket hook for cleaner logic
  const { data, isLoading, error } = useMegaPot();

  // Extract values from data
  const amount = data?.amount || 0;
  const nextDrawDate = data?.nextDrawDate ? new Date(data.nextDrawDate) : null;

  return (
    <Card className="glassmorphism animation-all hover:shadow-2xl">
      <CardHeader className="p-4 md:p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center justify-items-center gap-4 md:gap-6 w-full">
          <div className="flex flex-col items-center justify-center text-center">
            <CardTitle className="font-headline text-xl md:text-2xl flex items-center gap-2">
              <Icons.layers className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              Mega Pot
            </CardTitle>
          </div>

          <div className="flex justify-center items-center gap-2 text-2xl md:text-4xl font-bold text-primary p-3 md:p-4 rounded-lg bg-primary/10 border-2 border-dashed border-primary/20 shadow-[0_0_15px_rgba(255,223,0,0.5)] drop-shadow-[0_2px_4px_hsl(var(--primary)/0.5)] transition-all duration-300">
            <Icons.gem className="h-6 w-6 md:h-9 md:w-9" />
            {isLoading ? (
              <Skeleton className="h-8 w-20 md:h-10 md:w-24" />
            ) : error ? (
              <span className="text-red-500 text-base md:text-lg">Error</span>
            ) : (
              <span className="text-sm md:text-base">
                {amount.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            <CountdownTimer
              nextDrawDate={nextDrawDate || new Date()}
              label="Next Draw"
            />
          </div>
        </div>
        <CardDescription className="text-center text-muted-foreground pt-2 text-sm md:text-base">
          The ultimate jackpot that increases with every ticket! Match all 6
          numbers to claim the entire mega pot. Fresh mega pot every day at 10
          AM.
          {nextDrawDate && (
            <span className="block text-xs md:text-sm mt-2">
              Next draw: {nextDrawDate.toLocaleString()}
            </span>
          )}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
