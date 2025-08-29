import {
  Card,
  CardDescription,
  CardTitle,
  CardHeader,
  CardContent,
} from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Button } from "../ui/button";
import { User } from "@/libs/interfaces";

export const ComminSoonSection = ({ user }: { user: User }) => {
  return (
    <Card className="w-full glassmorphism animation-all hover:shadow-2xl">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="font-headline text-xl md:text-2xl flex items-center gap-2">
          <Icons.gift className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          Redeem Coins
        </CardTitle>
        <CardDescription className="text-sm md:text-base">
          Convert your virtual coins into real-world coupons.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between p-3 md:p-4 rounded-lg bg-secondary/30 gap-3">
          <div className="flex items-center gap-2 text-base md:text-lg font-semibold text-primary">
            <Icons.gem className="h-5 w-5 md:h-6 md:w-6" />
            <span>
              {(user?.winningAmount || 0).toLocaleString()} Available Coins
            </span>
          </div>
          <Button
            disabled
            className="opacity-50 cursor-not-allowed w-full sm:w-auto"
          >
            Coming Soon
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
