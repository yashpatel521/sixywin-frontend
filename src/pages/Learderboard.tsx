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
import { Crown, Gem, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { leaderboardData } from "@/lib/dummy-data.tsx";

const getRankClasses = (rank: number) => {
  if (rank === 1) return "text-yellow-400";
  if (rank === 2) return "text-gray-400";
  if (rank === 3) return "text-orange-400";
  return "text-muted-foreground";
};

export default function LeaderboardPage() {
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
              {leaderboardData.map((player) => (
                <TableRow
                  key={player.rank}
                  className={cn(
                    "hover:bg-muted/30",
                    player.rank <= 3 && "bg-secondary/20"
                  )}
                >
                  <TableCell className="font-bold text-lg text-center">
                    <div className="flex items-center justify-center">
                      {player.rank <= 3 ? (
                        <Crown
                          className={cn(
                            "h-6 w-6 animation-all hover:scale-125",
                            getRankClasses(player.rank)
                          )}
                        />
                      ) : (
                        player.rank
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/user/${player.player}`}
                      className="flex items-center gap-3 group"
                    >
                      <Avatar className="animation-all group-hover:scale-110">
                        <AvatarImage
                          src={`https://i.pravatar.cc/150?u=${player.player}`}
                          data-ai-hint="person avatar"
                        />
                        <AvatarFallback>
                          {player.player.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium group-hover:text-primary group-hover:underline">
                        {player.player}
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 font-semibold">
                      <Gem className="h-4 w-4 text-primary/70" />
                      {player.todaysBid.toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2 font-bold text-lg text-primary">
                      <Gem className="h-5 w-5" />
                      {player.coins.toLocaleString()}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
