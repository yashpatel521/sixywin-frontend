import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { HistoryDisplay } from "@/components/aviator/HistoryPanel";
import { Controls } from "@/components/aviator/BidControls";
import { GameDisplay } from "@/components/aviator/GameDisplay";

export default function AviatorPage() {
  return (
    <>
      <div className="container mx-auto p-4 md:p-8 space-y-8">
        <Card className="w-full glassmorphism">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-3xl flex items-center justify-center gap-2">
              Aviator
            </CardTitle>
            <CardDescription>
              Cash out before the rocket flies away! The higher it goes, the
              more you win.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <GameDisplay />
              <div className="lg:col-span-2 space-y-6">
                <Controls />
                <HistoryDisplay />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
