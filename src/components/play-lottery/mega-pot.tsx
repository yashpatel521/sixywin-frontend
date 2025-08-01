import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Gem, Layers } from "lucide-react";
import { useMegaPot } from "@/hooks/use-mega-pot";
import { CountdownTimer } from "@/components/shared/countdown-timer";
import { Separator } from "@/components/ui/separator";
import { MegaPotProps } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export function MegaPot({ nextDrawDate }: MegaPotProps) {
  const { pot, isLoading, error } = useMegaPot();

  return (
    <Card className="glassmorphism animation-all hover:shadow-2xl">
      <CardHeader className="p-4 space-y-2">
        <div className="flex flex-col md:flex-row items-center justify-around gap-4">
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Layers className="h-6 w-6 text-primary" />
            Mega Pot
          </CardTitle>

          <Separator orientation="vertical" className="h-12 hidden md:block" />

          <div className="flex justify-center items-center gap-2 text-4xl font-bold text-primary p-2 md:p-0 rounded-lg bg-primary/10 md:bg-transparent border-2 border-dashed border-primary/20 md:border-none shadow-[0_0_15px_rgba(255,223,0,0.5)] md:shadow-none drop-shadow-[0_2px_4px_hsl(var(--primary)/0.5)]">
            <Gem className="h-9 w-9" />
            {isLoading ? (
              <Skeleton className="h-10 w-24" />
            ) : error ? (
              <span className="text-red-500 text-lg">Error</span>
            ) : (
              <span>{pot.toLocaleString()}</span>
            )}
          </div>

          <Separator orientation="vertical" className="h-12 hidden md:block" />

          <CountdownTimer nextDrawDate={nextDrawDate} label="Pot Resets In" />
        </div>
        <CardDescription className="text-center text-muted-foreground pt-2">
          The grand prize that grows with every non-winning ticket! Win it all
          by matching all 6 numbers.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
