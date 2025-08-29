import { SEO } from "@/components/shared/seo";
import { SEO_CONFIGS } from "@/utils/seo-configs";
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
import { Icons } from "@/components/ui/icons";
import { cn } from "@/libs/utils";
import { Link } from "react-router-dom";
import { useApiRequest } from "@/libs/apiRequest";
import { User } from "@/libs/interfaces";
import { useEffect } from "react";

const getRankClasses = (rank: number) => {
  if (rank === 1) return "text-yellow-400";
  if (rank === 2) return "text-gray-400";
  if (rank === 3) return "text-orange-400";
  return "text-muted-foreground";
};

export default function LeaderboardPage() {
  // Use centralized API request
  const { loading, data, error, message, request } = useApiRequest({
    url: "/user/leaderboard",
    method: "GET",
    isToken: true,
    params: { limit: 10 },
  });

  useEffect(() => {
    request();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const leaderboard: User[] = data || [];

  return (
    <>
      <SEO {...SEO_CONFIGS.leaderboard} />
      <div className="container mx-auto p-4 md:p-8">
        <Card className="glassmorphism animation-all hover:shadow-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center gap-2">
              <Icons.trophy className="h-8 w-8 text-primary" />
              Top Players Leaderboard
            </CardTitle>
            <CardDescription>
              See who's leading the pack in the quest for virtual riches!
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && (
              <p className="text-center text-muted-foreground">Loading...</p>
            )}
            {error && (
              <p className="text-center text-red-500">
                {message || "Failed to load leaderboard"}
              </p>
            )}
            {!loading && !error && (
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
                  {leaderboard.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No players found
                      </TableCell>
                    </TableRow>
                  ) : (
                    leaderboard.map((player: User, index: number) => {
                      const rank = index + 1;

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
                                <Icons.crown
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
                                  {player.username
                                    .substring(0, 2)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium group-hover:text-primary group-hover:underline">
                                {player.username}
                              </span>
                            </Link>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2 font-semibold">
                              <Icons.gem className="h-4 w-4 text-primary/70" />
                              {player.todaysBids}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2 font-bold text-lg text-primary">
                              <Icons.gem className="h-5 w-5" />
                              {(player.totalWon || 0).toLocaleString()}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
