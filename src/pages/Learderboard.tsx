import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Crown, Gem, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { wsClient } from "@/websocket";
import { Skeleton } from "@/components/ui/skeleton";
import { useWebSocket } from "@/contexts/WebSocketContext";

interface LeaderboardPlayer {
  id: number;
  username: string;
  avatar: string;
  coins: number;
  totalWon: number;
  todayBid: string;
  todayTicketBuy: string;
}

const getRankClasses = (rank: number) => {
  if (rank === 1) return "text-yellow-400";
  if (rank === 2) return "text-gray-400";
  if (rank === 3) return "text-orange-400";
  return "text-muted-foreground";
};

export default function LeaderboardPage() {
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isConnected } = useWebSocket();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let handleLeaderboardResponse: (message: any) => void;

    const fetchLeaderboard = async () => {
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
        payload: { limit: 10 },
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
            setPlayers(message.payload.data);
            setError(null);
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

    fetchLeaderboard();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (handleLeaderboardResponse) {
        wsClient.off("leaderboard_response", handleLeaderboardResponse);
      }
    };
  }, [isConnected]);

  const renderSkeletonRows = () => {
    return Array.from({ length: 10 }).map((_, index) => (
      <TableRow key={index}>
        <TableCell className="text-center">
          <Skeleton className="h-6 w-6 mx-auto" />
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-4 w-16 ml-auto" />
        </TableCell>
        <TableCell className="text-right">
          <Skeleton className="h-4 w-20 ml-auto" />
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="glassmorphism animation-all hover:shadow-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            Top Players Leaderboard
          </CardTitle>
          <CardDescription>
            See who's leading the pack in the quest for virtual riches!
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-center">{error}</p>
              <div className="mt-2 text-center space-x-2">
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  size="sm"
                >
                  Refresh Page
                </Button>
                <Button
                  onClick={() => {
                    setError(null);
                    setIsLoading(true);
                    setPlayers([]);
                  }}
                  variant="outline"
                  size="sm"
                >
                  Retry Request
                </Button>
              </div>
            </div>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-center">Rank</TableHead>
                <TableHead>Player</TableHead>
                <TableHead className="text-right">Today's Bid</TableHead>
                <TableHead className="text-right">Total Winnings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                renderSkeletonRows()
              ) : players.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No players found
                  </TableCell>
                </TableRow>
              ) : (
                players.map((player, index) => {
                  const rank = index + 1;
                  const todayBid = parseFloat(player.todayBid || "0");

                  return (
                    <TableRow
                      key={player.id}
                      className={cn(
                        "hover:bg-muted/30",
                        rank <= 3 && "bg-secondary/20"
                      )}
                    >
                      <TableCell className="font-bold text-lg text-center">
                        <div className="flex items-center justify-center">
                          {rank <= 3 ? (
                            <Crown
                              className={cn(
                                "h-6 w-6 animation-all hover:scale-125",
                                getRankClasses(rank)
                              )}
                            />
                          ) : (
                            rank
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/user/${player.id}`}
                          className="flex items-center gap-3 group"
                        >
                          <Avatar className="animation-all group-hover:scale-110">
                            <AvatarImage
                              src={
                                player.avatar ||
                                `https://i.pravatar.cc/150?u=${player.username}`
                              }
                              data-ai-hint="person avatar"
                            />
                            <AvatarFallback>
                              {player.username.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium group-hover:text-primary group-hover:underline">
                            {player.username}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 font-semibold">
                          <Gem className="h-4 w-4 text-primary/70" />
                          {todayBid.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2 font-bold text-lg text-primary">
                          <Gem className="h-5 w-5" />
                          {(player.totalWon || 0).toLocaleString()}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
