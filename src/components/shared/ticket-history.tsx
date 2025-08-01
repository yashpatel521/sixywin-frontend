import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO, startOfDay, endOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import {
  History as HistoryIcon,
  Calendar as CalendarIcon,
  Gem,
} from "lucide-react";
import { useHistory } from "@/hooks/use-history";

export default function TicketHistory() {
  const { history, isLoaded } = useHistory();
  const [date, setDate] = useState<Date | undefined>();

  const filteredHistory = history.filter((ticket) => {
    if (!date) return true;
    const ticketDate = parseISO(ticket.date);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    return ticketDate >= dayStart && ticketDate <= dayEnd;
  });

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

  return (
    <Card className="glassmorphism animation-all hover:shadow-2xl">
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <CardTitle className="font-headline text-3xl flex items-center gap-2">
            <HistoryIcon className="h-8 w-8 text-primary" />
            Ticket History
          </CardTitle>
          <CardDescription>
            Review your past plays and winnings.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full sm:w-[240px] justify-start text-left font-normal animation-all hover:scale-105 active:scale-95",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={{ after: new Date() }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent>
        {!isLoaded ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full bg-muted/50" />
            ))}
          </div>
        ) : filteredHistory.length === 0 ? (
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
                  <TableHead className="text-right">Coins Won</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((ticket) => (
                  <TableRow key={ticket.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium whitespace-nowrap">
                      {format(parseISO(ticket.date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      {renderNumbers(ticket.userNumbers, ticket.winningNumbers)}
                    </TableCell>
                    <TableCell>
                      {renderNumbers(ticket.winningNumbers, ticket.userNumbers)}
                    </TableCell>
                    <TableCell className="text-center font-semibold">
                      {ticket.bid}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={ticket.matches > 0 ? "default" : "secondary"}
                        className={cn(
                          ticket.matches > 0 &&
                            "bg-accent text-accent-foreground hover:bg-accent/80 animation-all hover:scale-110"
                        )}
                      >
                        {ticket.matches}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold flex items-center justify-end gap-1 whitespace-nowrap">
                      <Gem className="h-4 w-4 text-primary" />
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
