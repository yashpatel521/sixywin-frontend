import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";

export const Reedeem = () => {
  return (
    <Card className="glassmorphism animation-all hover:shadow-2xl">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="font-headline text-xl md:text-2xl flex items-center gap-2">
          <Icons.shoppingCart className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          Redeem History
        </CardTitle>
        <CardDescription className="text-sm md:text-base">
          Your history of redeemed coupons.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <div className="text-center py-6 md:py-8 text-muted-foreground">
          <p className="text-base md:text-lg font-medium">
            No redeem history yet!
          </p>
          <p className="text-xs md:text-sm">
            Start redeeming coins to see your history here.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
