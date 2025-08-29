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
import { format, parseISO } from "date-fns";
import { cn } from "@/libs/utils";
import { Icons } from "@/components/ui/icons";
import { useApiRequest } from "@/libs/apiRequest";
import { Ticket } from "@/libs/interfaces";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export default function TicketHistory({ userId }: { userId: number }) {
  const [pageNo, setPageNo] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  // const [tic]
  const { data, request } = useApiRequest({
    url: `/ticket/userTickets/${userId}`,
    method: "GET",
    isToken: true,
    data: {
      pageNo,
    },
  });
  useEffect(() => {
    request();
  }, []);

  const loadMoreTickets = async () => {
    setIsLoading(true);
    setPageNo((prev) => prev + 1);
    setIsLoading(false);
  };

  const tickets: Ticket[] = data || [];
  // console.log(tickets);

  const renderNumbers = (numbers: number[], matchedNumbers?: number[]) => (
    <div className="flex gap-1 flex-wrap max-w-xs">
      {numbers.map((num, i) => {
        const isMatch = matchedNumbers?.includes(num);
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
            Ticket History
          </CardTitle>
          <CardDescription>
            View your past lottery tickets and results.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {tickets.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <div className="text-xl font-medium">
              No tickets found for this user.
            </div>
          </div>
        ) : (
          <>
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
                  {tickets.map((ticket: Ticket) => (
                    <TableRow key={ticket.id} className="hover:bg-muted/30">
                      <TableCell className="font-medium whitespace-nowrap">
                        {format(parseISO(ticket.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        {renderNumbers(ticket.numbers, ticket.matchedNumbers)}
                      </TableCell>
                      <TableCell>
                        {ticket.drawResult?.winningNumbers?.length ? (
                          renderNumbers(
                            ticket.drawResult.winningNumbers,
                            ticket.numbers
                          )
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            No winning numbers yet
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {ticket.bid}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            (ticket.matchedNumbers?.length || 0) > 0
                              ? "default"
                              : "secondary"
                          }
                          className={cn(
                            (ticket.matchedNumbers?.length || 0) > 0 &&
                              "bg-accent text-accent-foreground hover:bg-accent/80 animation-all hover:scale-110"
                          )}
                        >
                          {ticket.matchedNumbers?.length || 0}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {renderStatus(ticket.result)}
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

            {/* Load More Button */}
            <div className="flex justify-center mt-4">
              <Button onClick={loadMoreTickets} disabled={isLoading}>
                {isLoading ? "Loading..." : "Load More"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
