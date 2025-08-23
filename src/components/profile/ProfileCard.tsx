import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/ui/icons";
import { User } from "@/libs/interfaces";

export const ProfileCard = ({ user }: { user: User }) => {
  const totalTickets = 0; // Will be handled by TicketHistory component
  const totalEarnings = 0; // Will be handled by TicketHistory component
  return (
    <Card className="w-full glassmorphism animation-all hover:shadow-2xl flex flex-col h-full flex-1">
      <div className="p-4 md:p-6">
        <div className="flex-grow text-center sm:text-left">
          <div className="flex flex-col sm:flex-row justify-between items-center  ">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 shrink-0 border-4 border-primary animation-all hover:scale-110">
              <AvatarImage
                src={user?.avatar || "https://i.pravatar.cc/150"}
                data-ai-hint="person portrait"
                alt={user?.username || "User"}
              />
              <AvatarFallback>
                {user?.username?.substring(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-grow mt-3 sm:mt-0 sm:ml-6 flex flex-col justify-center items-center sm:items-start gap-2">
              <CardTitle className="font-headline text-2xl md:text-3xl flex items-center gap-2">
                <Icons.user className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                {user?.username || "User"}
              </CardTitle>{" "}
              <CardDescription className="mt-1 text-sm md:text-base">
                {user?.email || "user@example.com"}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-lg md:text-xl font-semibold text-primary">
              <Icons.gem className="h-5 w-5 md:h-6 md:w-6" />
              <span>
                {(user?.coins || 0) + (user?.winningAmount || 0)} Coins
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 md:gap-4 text-center border-t mt-4 pt-4">
            <div>
              <div className="text-xs md:text-sm text-muted-foreground">
                Tickets Played
              </div>
              <div className="text-lg md:text-2xl font-bold flex items-center justify-center gap-1 md:gap-2">
                <Icons.ticket className="h-4 w-4 md:h-6 md:w-6 text-primary/80" />
                {totalTickets}
              </div>
            </div>
            <div>
              <div className="text-xs md:text-sm text-muted-foreground">
                Winning Amount
              </div>
              <div className="text-lg md:text-2xl font-bold flex items-center justify-center gap-1 md:gap-2">
                <Icons.barChart className="h-4 w-4 md:h-6 md:w-6 text-primary/80" />
                {(user?.winningAmount || 0).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs md:text-sm text-muted-foreground">
                Ad Earnings
              </div>
              <div className="text-lg md:text-2xl font-bold flex items-center justify-center gap-1 md:gap-2">
                <Icons.gem className="h-4 w-4 md:h-6 md:w-6 text-primary/80" />
                {(user?.winningAmount || 0).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs md:text-sm text-muted-foreground">
                Total Winnings
              </div>
              <div className="text-lg md:text-2xl font-bold flex items-center justify-center gap-1 md:gap-2">
                <Icons.award className="h-4 w-4 md:h-6 md:w-6 text-primary/80" />
                {totalEarnings.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
