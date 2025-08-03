import { useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/shared/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useUserProfile } from "@/hooks/use-user-profile";
import { Link, useParams } from "react-router-dom";
import TicketHistory from "@/components/shared/ticket-history";

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  // Use the new WebSocket hook for cleaner logic
  const { userData, referredUsers, isLoading, error, isUserNotFound, refetch } =
    useUserProfile(userId);

  const referralId = userData?.refernceId
    ? `ref-${userData.refernceId.toLowerCase()}`
    : "";
  const referralLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/register?ref=${referralId}`
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

  const totalTickets = 0; // Will be handled by TicketHistory component

  if (!userId) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <h1 className="text-2xl font-bold">No username provided</h1>
      </div>
    );
  }

  if (isUserNotFound) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <h1 className="text-2xl font-bold">User not found</h1>
        <p className="text-muted-foreground">
          The user {userId} does not exist.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
          <div className="space-y-8">
            <Card className="w-full glassmorphism animation-all hover:shadow-2xl">
              <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-full" />
                <div className="flex-grow space-y-4">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="text-center">
                        <Skeleton className="h-4 w-20 mx-auto mb-2" />
                        <Skeleton className="h-6 w-16 mx-auto" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
            <Card className="glassmorphism animation-all hover:shadow-2xl">
              <CardHeader>
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-48" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="glassmorphism animation-all hover:shadow-2xl">
            <CardHeader>
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <h1 className="text-2xl font-bold">Failed to load user</h1>
        <p className="text-muted-foreground">
          {error || "Unable to load user profile"}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
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
                refetch();
              }}
              variant="outline"
              size="sm"
            >
              Retry Request
            </Button>
          </div>
        </div>
      )}

      {/* User Details and Referral Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* User Profile Card */}
        <Card className="w-full glassmorphism animation-all hover:shadow-2xl">
          <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 border-4 border-primary animation-all hover:scale-110">
              <AvatarImage
                src={
                  userData.avatar ||
                  `https://i.pravatar.cc/150?u=${userData.username}`
                }
                data-ai-hint="person portrait"
                alt={userData.username}
              />
              <AvatarFallback>
                {userData.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-grow text-center sm:text-left">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <CardTitle className="font-headline text-3xl flex items-center gap-2">
                  <Icons.user className="h-8 w-8 text-primary" />
                  {userData.username}
                </CardTitle>
                <div className="flex items-center gap-2 text-xl font-semibold text-primary">
                  <Icons.gem className="h-6 w-6" />
                  <span>
                    {(userData.coins || 0) + (userData.winningAmount || 0)}{" "}
                    Coins
                  </span>
                </div>
              </div>
              <CardDescription className="mt-1">Public Profile</CardDescription>

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
                      <Icons.check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Icons.copy className="h-4 w-4" />
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
                    <Icons.ticket className="h-6 w-6 text-primary/80" />
                    {totalTickets}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Winning Amount
                  </div>
                  <div className="text-2xl font-bold flex items-center justify-center gap-2">
                    <Icons.barChart className="h-6 w-6 text-primary/80" />
                    {userData.winningAmount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Ad Earnings
                  </div>
                  <div className="text-2xl font-bold flex items-center justify-center gap-2">
                    <Icons.gem className="h-6 w-6 text-primary/80" />
                    {(userData.winningAmount || 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Total Winnings
                  </div>
                  <div className="text-2xl font-bold flex items-center justify-center gap-2">
                    <Icons.award className="h-6 w-6 text-primary/80" />
                    {userData.totalWon.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Referred Users Card */}
        <Card className="glassmorphism animation-all hover:shadow-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center gap-2">
              <Icons.users className="h-8 w-8 text-primary" />
              Referred Users ({referredUsers.length})
            </CardTitle>
            <CardDescription>
              Users referred by {userData.username}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {referredUsers.length === 0 ? (
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
                    {referredUsers.map((referral) => (
                      <TableRow key={referral.id} className="hover:bg-muted/30">
                        <TableCell>
                          <Link
                            to={`/user/${referral.username}`}
                            className="flex items-center gap-3 group"
                          >
                            <Avatar className="animation-all group-hover:scale-110 h-9 w-9">
                              <AvatarImage
                                src={
                                  referral.avatar ||
                                  `https://i.pravatar.cc/150?u=${referral.username}`
                                }
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
                          {format(parseISO(referral.createdAt), "MMM d, yyyy")}
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

      {/* Ticket History - Using Shared Component */}
      <TicketHistory />
    </div>
  );
}
