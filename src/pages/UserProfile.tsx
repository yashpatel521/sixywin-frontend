import React, { useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Gem,
  User,
  History as HistoryIcon,
  Calendar as CalendarIcon,
  Ticket,
  BarChart,
  Copy,
  Check,
  Users,
  Award,
} from "lucide-react";
import { useHistory } from "@/hooks/use-history";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO, startOfDay, endOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { leaderboardDataMap, referralData } from "@/lib/dummy-data.tsx";
import { Link, useParams } from "react-router-dom";

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const username = userId;
  if (!username) {
    return <div>No username provided</div>;
  }
  const userData = leaderboardDataMap[username];
  const userReferrals = referralData[username] || [];

  // NOTE: This uses the logged-in user's history for demonstration.
  // In a real app, you would fetch the specific user's history.
  const { history, isLoaded } = useHistory();
  const [date, setDate] = React.useState<Date | undefined>();
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const referralId = `ref-${username.toLowerCase()}`;
  const referralLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/signup?ref=${referralId}`
      : "";

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(referralLink);
    setIsCopied(true);
    toast({
      title: "Copied!",
      description: "Referral link copied to clipboard.",
    });
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }, [referralLink, toast]);

  const filteredHistory = history.filter((ticket) => {
    if (!date) return true;
    const ticketDate = parseISO(ticket.date);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    return ticketDate >= dayStart && ticketDate <= dayEnd;
  });

  const totalWinnings = history.reduce(
    (acc, ticket) => acc + ticket.coinsWon,
    0
  );
  const totalTickets = history.length;
  const totalEarnings = totalWinnings + (userData?.adEarnings || 0);

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

  if (!userData) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <h1 className="text-2xl font-bold">User not found</h1>
        <p className="text-muted-foreground">
          The user "{username}" does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
          <Card className="w-full glassmorphism animation-all hover:shadow-2xl">
            <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Avatar className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 border-4 border-primary animation-all hover:scale-110">
                <AvatarImage
                  src={`https://i.pravatar.cc/150?u=${username}`}
                  data-ai-hint="person portrait"
                  alt={username}
                />
                <AvatarFallback>
                  {username.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-grow text-center sm:text-left">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                  <CardTitle className="font-headline text-3xl flex items-center gap-2">
                    <User className="h-8 w-8 text-primary" />
                    {username}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-xl font-semibold text-primary">
                    <Gem className="h-6 w-6" />
                    <span>{userData.coins.toLocaleString()} Coins</span>
                  </div>
                </div>
                <CardDescription className="mt-1">
                  Public Profile
                </CardDescription>

                <div className="mt-4">
                  <Label
                    htmlFor="referral-id"
                    className="text-sm text-muted-foreground"
                  >
                    Referral Link
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="referral-id"
                      readOnly
                      value={referralLink}
                      className="bg-background/50"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={handleCopy}
                      className="animation-all hover:scale-105 active:scale-95"
                    >
                      {isCopied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      <span className="sr-only">Copy Referral Link</span>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center border-t mt-4 pt-4">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Tickets Played
                    </div>
                    <div className="text-2xl font-bold flex items-center justify-center gap-2">
                      <Ticket className="h-6 w-6 text-primary/80" />
                      {isLoaded ? (
                        totalTickets
                      ) : (
                        <Skeleton className="h-6 w-10" />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Winning Amount
                    </div>
                    <div className="text-2xl font-bold flex items-center justify-center gap-2">
                      <BarChart className="h-6 w-6 text-primary/80" />
                      {isLoaded ? (
                        totalWinnings.toLocaleString()
                      ) : (
                        <Skeleton className="h-6 w-24" />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Ad Earnings
                    </div>
                    <div className="text-2xl font-bold flex items-center justify-center gap-2">
                      <Gem className="h-6 w-6 text-primary/80" />
                      {isLoaded ? (
                        userData.adEarnings.toLocaleString()
                      ) : (
                        <Skeleton className="h-6 w-20" />
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Total Winnings
                    </div>
                    <div className="text-2xl font-bold flex items-center justify-center gap-2">
                      <Award className="h-6 w-6 text-primary/80" />
                      {isLoaded ? (
                        totalEarnings.toLocaleString()
                      ) : (
                        <Skeleton className="h-6 w-28" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <Card className="glassmorphism animation-all hover:shadow-2xl">
            <CardHeader>
              <CardTitle className="font-headline text-3xl flex items-center gap-2">
                <Users className="h-8 w-8 text-primary" />
                Referred Users ({userReferrals.length})
              </CardTitle>
              <CardDescription>Users referred by {username}.</CardDescription>
            </CardHeader>
            <CardContent>
              {userReferrals.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-lg font-medium">No referrals yet!</p>
                  <p className="text-sm">
                    Share the referral ID to bring friends.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Player</TableHead>
                        <TableHead className="text-right">Join Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userReferrals.map((referral) => (
                        <TableRow
                          key={referral.username}
                          className="hover:bg-muted/30"
                        >
                          <TableCell>
                            <Link
                              to={`/user/${referral.username}`}
                              className="flex items-center gap-3 group"
                            >
                              <Avatar className="animation-all group-hover:scale-110 h-9 w-9">
                                <AvatarImage
                                  src={`https://i.pravatar.cc/150?u=${referral.username}`}
                                  data-ai-hint="person avatar"
                                />
                                <AvatarFallback>
                                  {referral.username
                                    .substring(0, 2)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium group-hover:text-primary group-hover:underline">
                                {referral.username}
                              </span>
                            </Link>
                          </TableCell>
                          <TableCell className="text-right font-medium whitespace-nowrap">
                            {format(parseISO(referral.joinDate), "MMM d, yyyy")}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <Card className="glassmorphism animation-all hover:shadow-2xl">
          <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle className="font-headline text-3xl flex items-center gap-2">
                <HistoryIcon className="h-8 w-8 text-primary" />
                Ticket History
              </CardTitle>
              <CardDescription>
                Review {username}'s past plays and winnings.
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
                      <TableHead>Their Numbers</TableHead>
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
                          {renderNumbers(
                            ticket.userNumbers,
                            ticket.winningNumbers
                          )}
                        </TableCell>
                        <TableCell>
                          {renderNumbers(
                            ticket.winningNumbers,
                            ticket.userNumbers
                          )}
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                          {ticket.bid}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              ticket.matches > 0 ? "default" : "secondary"
                            }
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
      </div>
    </div>
  );
}
