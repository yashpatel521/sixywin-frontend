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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { useTicketHistory } from "@/hooks/use-ticket-history";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { User } from "@/lib/interfaces";
import { Icons } from "./icons";

interface TicketHistoryProps {
  userId?: number; // Optional userId prop for viewing other users' tickets
}

export default function TicketHistory({ userId }: TicketHistoryProps) {
  const { history, isLoading, error, refreshTickets } =
    useTicketHistory(userId);
  const [currentUser] = useLocalStorage<User | null>("user", null);

  // Determine if we're viewing another user's tickets
  const isViewingOtherUser = userId && userId !== currentUser?.id;
  const titleText = isViewingOtherUser
    ? "User's Ticket History"
    : "Ticket History";
  const descriptionText = isViewingOtherUser
    ? "Review this user's past plays and winnings."
    : "Review your past plays and winnings.";

  const renderNumbers = (numbers: number[], userNumbers?: number[]) => (
    <div className="flex gap-1 flex-wrap max-w-xs">
      {numbers.map((num, i) => {
        const isMatch = userNumbers?.includes(num);
        return (
          <span
            key={i}
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold animation-all hover:scale-110",
              isMatch
                ? "bg-accent text-accent-foreground"
                : "bg-secondary text-secondary-foreground"
            )}
          >
            {num}
          </span>
        );
      })}
    </div>
  );

  const renderStatus = (result: string) => {
    const statusConfig = {
      win: {
        label: "Win",
        variant: "default" as const,
        className:
          "bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30",
      },
      loss: {
        label: "Loss",
        variant: "secondary" as const,
        className:
          "bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30",
      },
      pending: {
        label: "Pending",
        variant: "outline" as const,
        className:
          "bg-yellow-500/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/30",
      },
      megaPot: {
        label: "MegaPot",
        variant: "default" as const,
        className:
          "bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30",
      },
    };

    const config =
      statusConfig[result as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <Badge
        variant={config.variant}
        className={cn("animation-all hover:scale-110", config.className)}
      >
        {config.label}
      </Badge>
    );
  };

  return (
    <Card className="glassmorphism animation-all hover:shadow-2xl">
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <CardTitle className="font-headline text-3xl flex items-center gap-2">
            <Icons.history className="h-8 w-8 text-primary" />
            {titleText}
          </CardTitle>
          <CardDescription>{descriptionText}</CardDescription>
        </div>
        {!isViewingOtherUser && (
          <div className="flex items-center gap-2">
            <button
              onClick={refreshTickets}
              disabled={isLoading}
              className={cn(
                "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
                "h-9 px-3 bg-primary text-primary-foreground shadow hover:bg-primary/90",
                "animation-all hover:scale-105 active:scale-95",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            >
              <Icons.rotateCcw className="mr-2 h-4 w-4" />
              Refresh
            </button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full bg-muted/50" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-400">
            <div className="text-xl font-medium mb-2">
              Failed to load ticket history
            </div>
            <p className="text-sm text-muted-foreground">{error}</p>
            <button
              onClick={refreshTickets}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <div className="text-xl font-medium">
              No tickets found for this user.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Your Numbers</TableHead>
                  <TableHead>Winning Numbers</TableHead>
                  <TableHead className="text-center">Bid</TableHead>
                  <TableHead className="text-center">Matches</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Coins Won</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((ticket) => (
                  <TableRow key={ticket.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium whitespace-nowrap">
                      {format(
                        parseISO(
                          ticket.date ||
                            ticket.createdAt?.toString() ||
                            new Date().toISOString()
                        ),
                        "MMM d, yyyy"
                      )}
                    </TableCell>
                    <TableCell>
                      {renderNumbers(
                        ticket.userNumbers || ticket.numbers,
                        ticket.winningNumbers || []
                      )}
                    </TableCell>
                    <TableCell>
                      {ticket.winningNumbers &&
                      ticket.winningNumbers.length > 0 ? (
                        renderNumbers(
                          ticket.winningNumbers,
                          ticket.userNumbers || ticket.numbers
                        )
                      ) : (
                        <span className="text-muted-foreground text-sm">
                          No winning numbers matched
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {ticket.bid}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={
                          (ticket.matches || 0) > 0 ? "default" : "secondary"
                        }
                        className={cn(
                          (ticket.matches || 0) > 0 &&
                            "bg-accent text-accent-foreground hover:bg-accent/80 animation-all hover:scale-110"
                        )}
                      >
                        {ticket.matches || 0}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {renderStatus(ticket.result || "pending")}
                    </TableCell>
                    <TableCell className="text-right font-semibold flex items-center justify-end gap-1 whitespace-nowrap">
                      <Icons.gem className="h-4 w-4 text-primary" />
                      {ticket.coinsWon.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
