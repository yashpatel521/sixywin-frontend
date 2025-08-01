import React, { useCallback, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Award,
  BarChart,
  Calendar as CalendarIcon,
  Check,
  Copy,
  Eye,
  EyeOff,
  Gem,
  Gift,
  History as HistoryIcon,
  Share2,
  ShoppingCart,
  Ticket,
  User as UserIcon,
  Users,
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

import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { User } from "@/lib/interfaces";

export default function ProfilePage() {
  const { history, isLoaded } = useHistory();
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [isCopied, setIsCopied] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [user] = useLocalStorage<User | null>("user", null);

  const referralId = user
    ? `ref-${user.refernceId.toLowerCase().replace(" ", "")}`
    : "";
  const referralLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/signup?ref=${referralId}`
      : "";

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(referralLink);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  }, [referralLink]);

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on SixyWin!",
          text: `Use my referral ID to get started: ${referralId}`,
          url: referralLink,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      handleCopy();
    }
  }, [referralId, referralLink, handleCopy]);

  const filteredHistory = history.filter((ticket) => {
    if (!date) return true;
    const ticketDate = parseISO(ticket.date);
    const dayStart = startOfDay(date);
    const dayEnd = endOfDay(date);
    return ticketDate >= dayStart && ticketDate <= dayEnd;
  });

  const totalTickets = history.length;
  const totalEarnings = user?.totalWon || 0;

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
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <Card className="w-full lg:col-span-3 glassmorphism animation-all hover:shadow-2xl">
          <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 border-4 border-primary animation-all hover:scale-110">
              <AvatarImage
                src={user?.avatar || "https://i.pravatar.cc/150"}
                data-ai-hint="person portrait"
                alt={user?.username || "User"}
              />
              <AvatarFallback>
                {user?.username?.substring(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-grow text-center sm:text-left">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <CardTitle className="font-headline text-3xl flex items-center gap-2">
                  <UserIcon className="h-8 w-8 text-primary" />
                  {user?.username || "User"}
                </CardTitle>
                <div className="flex items-center gap-2 text-xl font-semibold text-primary">
                  <Gem className="h-6 w-6" />
                  <span>
                    {(user?.coins || 0) + (user?.winningAmount || 0)} Coins
                  </span>
                </div>
              </div>
              <CardDescription className="mt-1">
                {user?.email || "user@example.com"}
              </CardDescription>
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
                      (user?.winningAmount || 0).toLocaleString()
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
                      (user?.winningAmount || 0).toLocaleString()
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

        <Card className="w-full glassmorphism animation-all hover:shadow-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <Gift className="h-6 w-6 text-primary" />
              Redeem Coins
            </CardTitle>
            <CardDescription>
              Convert your virtual coins into real-world coupons.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                <Gem className="h-6 w-6" />
                <span>
                  {(user?.winningAmount || 0).toLocaleString()} Available Coins
                </span>
              </div>
              <Button disabled className="opacity-50 cursor-not-allowed">
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="w-full glassmorphism animation-all hover:shadow-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              Profile Settings
            </CardTitle>
            <CardDescription>
              Manage your account details and password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  defaultValue={user?.username || ""}
                  className="animation-all focus:scale-105"
                />
              </div>
              <div className="mt-4">
                <Label
                  htmlFor="referral-id"
                  className="text-sm text-muted-foreground"
                >
                  Your Referral Link
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
                    type="button"
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
                  <Button
                    size="icon"
                    type="button"
                    variant="outline"
                    onClick={handleShare}
                    className="animation-all hover:scale-105 active:scale-95"
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share Referral Link</span>
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="animation-all focus:scale-105 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">
                        {showCurrentPassword
                          ? "Hide password"
                          : "Show password"}
                      </span>
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="animation-all focus:scale-105 pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="sr-only">
                        {showNewPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
              <Button
                type="button"
                disabled
                className="w-full opacity-50 cursor-not-allowed"
              >
                Coming Soon
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="glassmorphism animation-all hover:shadow-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              Your Referred Users (0)
            </CardTitle>
            <CardDescription>
              Users you've successfully referred.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-lg font-medium">No referrals yet!</p>
              <p className="text-sm">
                Share your referral ID to bring friends.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glassmorphism animation-all hover:shadow-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center gap-2">
            <ShoppingCart className="h-8 w-8 text-primary" />
            Redeem History
          </CardTitle>
          <CardDescription>Your history of redeemed coupons.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-xl font-medium">No redemption history yet.</p>
          </div>
        </CardContent>
      </Card>

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
                No tickets found for this period.
              </div>
              <p className="text-sm">
                Try selecting a different date or clearing the filter.
              </p>
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
    </div>
  );
}
