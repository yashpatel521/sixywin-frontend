import { useState, useEffect } from "react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { wsClient } from "@/websocket";
import { UserType } from "@/types/interfaces";

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
  leader: UserType & { rank: number };
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
            <Crown className={cn("h-8 w-8", getRankClasses(leader.rank))} />
          </div>
        </div>
        <span className="font-bold text-lg group-hover:text-primary group-hover:underline">
          {leader.username}
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

export function TopLeaders() {
  const [leaders, setLeaders] = useState<(UserType & { rank: number })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let handleLeaderboardResponse: (message: any) => void;

    const fetchTopLeaders = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const requestId = Math.random().toString(36).substring(7);

        // Wait for WebSocket connection if not connected
        if (!wsClient.isConnected()) {
          setError("Connecting to server...");

          const connectionTimeout = setTimeout(() => {
            setError("Connection failed. Please refresh the page.");
            setIsLoading(false);
          }, 5000);

          const connectionCheckInterval = setInterval(() => {
            if (wsClient.isConnected()) {
              clearTimeout(connectionTimeout);
              clearInterval(connectionCheckInterval);
              setError(null);
              sendLeaderboardRequest(requestId);
            }
          }, 100);

          return;
        }

        sendLeaderboardRequest(requestId);
      } catch (err) {
        setError("Failed to connect to server");
        setIsLoading(false);
      }
    };

    const sendLeaderboardRequest = (requestId: string) => {
      wsClient.send({
        type: "leaderboard",
        requestId,
        payload: { limit: 3 }, // Limit to top 3 leaders
        timestamp: new Date().toISOString(),
      });

      handleLeaderboardResponse = (message: any) => {
        if (
          message.type === "leaderboard_response" &&
          message.requestId === requestId
        ) {
          // Clear the timeout since we got a response
          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          if (message.payload.success) {
            // Add rank to each leader based on their position
            const serverData: UserType[] = message.payload.data || [];
            const leadersWithRank = serverData.map((leader, index) => ({
              ...leader,
              rank: index + 1,
            }));
            setLeaders(leadersWithRank);
          } else {
            setError(message.payload.message || "Failed to fetch leaderboard");
          }
          setIsLoading(false);
        }
      };

      wsClient.on("leaderboard_response", handleLeaderboardResponse);

      timeoutId = setTimeout(() => {
        setError("Request timeout. Please try again.");
        setIsLoading(false);
      }, 10000);
    };

    fetchTopLeaders();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (handleLeaderboardResponse) {
        wsClient.off("leaderboard_response", handleLeaderboardResponse);
      }
    };
  }, []);

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
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive text-center text-sm">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-3 items-end gap-4">
            {[2, 1, 3].map((rank) => (
              <div
                key={rank}
                className="flex flex-col items-center gap-2 p-4 rounded-lg"
              >
                <Skeleton className="h-20 w-20 rounded-full" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-16" />
                <Skeleton
                  className={cn(
                    "w-full rounded-t-md",
                    rank === 1 ? "h-24" : "h-16"
                  )}
                />
              </div>
            ))}
          </div>
        ) : leaders.length === 0 ? (
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
