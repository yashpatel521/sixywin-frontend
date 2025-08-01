import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, Gem, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leader, TopLeadersProps } from "@/lib/types";

const getRankClasses = (rank: number) => {
  if (rank === 1) return "text-yellow-400";
  if (rank === 2) return "text-gray-400";
  if (rank === 3) return "text-orange-400";
  return "text-muted-foreground";
};

const PodiumPlace = ({ leader, rank }: { leader: Leader; rank: number }) => {
  const isFirst = rank === 1;
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 p-4 rounded-lg",
        isFirst ? "order-first" : "order-last"
      )}
    >
      <Link
        to={`/user/${leader.player}`}
        className="flex flex-col items-center gap-2 group"
      >
        <div className="relative">
          <Avatar
            className={cn(
              "h-20 w-20 border-4 animation-all group-hover:scale-110",
              isFirst ? "border-yellow-400" : "border-gray-400"
            )}
          >
            <AvatarImage
              src={`https://i.pravatar.cc/150?u=${leader.player}`}
              data-ai-hint="person avatar"
            />
            <AvatarFallback>
              {leader.player.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -top-3 -right-3">
            <Crown className={cn("h-8 w-8", getRankClasses(leader.rank))} />
          </div>
        </div>
        <span className="font-bold text-lg group-hover:text-primary group-hover:underline">
          {leader.player}
        </span>
      </Link>
      <div className="flex items-center gap-1 text-sm text-primary font-semibold">
        <Gem className="h-4 w-4" />
        {leader.coins.toLocaleString()}
      </div>
      <div
        className={cn(
          "w-full text-center text-white font-bold rounded-t-md",
          isFirst ? "h-24 bg-yellow-400 pt-4" : "h-16 bg-gray-400 pt-2"
        )}
      >
        <span className="text-4xl">{leader.rank}</span>
      </div>
    </div>
  );
};

export function TopLeaders({ leaders }: TopLeadersProps) {
  const first = leaders.find((l) => l.rank === 1);
  const second = leaders.find((l) => l.rank === 2);
  const third = leaders.find((l) => l.rank === 3);

  return (
    <Card className="glassmorphism animation-all hover:shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2">
          <Trophy className="h-6 w-6 text-primary" />
          Top Leaders
        </CardTitle>
        <CardDescription>The top players this week.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 items-end gap-4">
          {second && <PodiumPlace leader={second} rank={2} />}
          {first && <PodiumPlace leader={first} rank={1} />}
          {third && <PodiumPlace leader={third} rank={3} />}
        </div>
        <Button
          variant="outline"
          className="w-full mt-6 animation-all hover:scale-105 active:scale-95"
          asChild
        >
          <Link to="/leaderboard">View Full Leaderboard</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
