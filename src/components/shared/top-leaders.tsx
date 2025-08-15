import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/libs/utils";
import { Icons } from "@/components/ui/icons";
import { useWebSocketStore } from "@/store/websocketStore";
import { useEffect } from "react";

const getRankClasses = (rank: number) => {
  if (rank === 1) return "text-yellow-400";
  if (rank === 2) return "text-gray-400";
  if (rank === 3) return "text-orange-400";
  return "text-muted-foreground";
};

const PodiumPlace = ({
  leader,
  rank,
}: {
  leader: {
    id: number;
    username: string;
    avatar: string;
    coins: number;
    rank: number;
  };
  rank: number;
}) => {
  const isFirst = rank === 1;
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 p-4 rounded-lg",
        isFirst ? "order-first" : "order-last"
      )}
    >
      <Link
        to={`/user/${leader.id}`}
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
              src={
                leader.avatar ||
                `https://i.pravatar.cc/150?u=${leader.username}`
              }
              data-ai-hint="person avatar"
            />
            <AvatarFallback>
              {leader.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -top-3 -right-3">
            <Icons.crown
              className={cn("h-8 w-8", getRankClasses(leader.rank))}
            />
          </div>
        </div>
        <div className="flex flex-col items-center text-center">
          <h3 className="font-semibold text-sm">{leader.username}</h3>
          <p className="text-xs text-muted-foreground">Rank #{leader.rank}</p>
        </div>
      </Link>
      <div className="flex items-center gap-1 text-sm text-primary font-semibold">
        <Icons.gem className="h-4 w-4" />
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

export function TopLeaders() {
  // Get top 3 players and add rank
  const { sendMessage, leaderboard } = useWebSocketStore(); // Get tickets from Zustand store
  useEffect(() => {
    sendMessage("leaderboard", { limit: 3 });
  }, [sendMessage]);
  const topThree = leaderboard.slice(0, 3).map((player, index) => ({
    ...player,
    rank: index + 1,
  }));

  const first = topThree.find((l) => l.rank === 1);
  const second = topThree.find((l) => l.rank === 2);
  const third = topThree.find((l) => l.rank === 3);

  return (
    <Card className="glassmorphism animation-all hover:shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-2xl flex items-center justify-center gap-2">
          <Icons.trophy className="h-6 w-6 text-primary" />
          Top Leaders
        </CardTitle>
        <CardDescription>The top players this week.</CardDescription>
      </CardHeader>
      <CardContent>
        {topThree.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-lg font-medium">No leaders found</p>
            <p className="text-sm">Start playing to see the top players!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 items-end gap-4">
            {second && <PodiumPlace leader={second} rank={2} />}
            {first && <PodiumPlace leader={first} rank={1} />}
            {third && <PodiumPlace leader={third} rank={3} />}
          </div>
        )}

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
