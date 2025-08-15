import { useState, useCallback, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link, useParams } from "react-router-dom";
import TicketHistory from "@/components/shared/ticket-history";
import { TopBanner } from "@/components/ads/BannerAds";
import { useWebSocketStore } from "@/store/websocketStore";

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const { sendMessage, userProfile } = useWebSocketStore(); // Get tickets from Zustand store

  useEffect(() => {
    if (userId) {
      sendMessage("userProfile", { userId });
    }
  }, [userId, sendMessage]);

  const referralId = userProfile?.user?.referenceId
    ? `ref-${userProfile.user.referenceId.toLowerCase()}`
    : "";
  const referralLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/register?ref=${referralId}`
      : "";

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(referralLink);
    setIsCopied(true);
    toast({
      variant: "success",
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

  if (!userProfile) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <h1 className="text-2xl font-bold">User not found</h1>
        <p className="text-muted-foreground">
          The user {userId} does not exist.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      {/* User Details and Referral Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* User Profile Card */}
        <Card className="w-full glassmorphism animation-all hover:shadow-2xl">
          <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 border-4 border-primary animation-all hover:scale-110">
              <AvatarImage
                src={
                  userProfile?.user?.avatar ||
                  `https://i.pravatar.cc/150?u=${userProfile?.user?.username}`
                }
                data-ai-hint="person portrait"
                alt={userProfile?.user?.username}
              />
              <AvatarFallback>
                {userProfile?.user?.username.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-grow text-center sm:text-left">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <CardTitle className="font-headline text-3xl flex items-center gap-2">
                  <Icons.user className="h-8 w-8 text-primary" />
                  {userProfile?.user?.username}
                </CardTitle>
                <div className="flex items-center gap-2 text-xl font-semibold text-primary">
                  <Icons.gem className="h-6 w-6" />
                  <span>
                    {(userProfile?.user?.coins || 0) +
                      (userProfile?.user?.winningAmount || 0)}{" "}
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
                    {userProfile?.user?.winningAmount.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Ad Earnings
                  </div>
                  <div className="text-2xl font-bold flex items-center justify-center gap-2">
                    <Icons.gem className="h-6 w-6 text-primary/80" />
                    {(userProfile?.user?.adEarnings || 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Total Winnings
                  </div>
                  <div className="text-2xl font-bold flex items-center justify-center gap-2">
                    <Icons.award className="h-6 w-6 text-primary/80" />
                    {userProfile?.user?.totalWon.toLocaleString()}
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
              Referred Users ({userProfile?.referredUsers.length})
            </CardTitle>
            <CardDescription>
              Users referred by {userProfile?.user?.username}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userProfile?.referredUsers.length === 0 ? (
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
                    {userProfile?.referredUsers.map((referral) => (
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
                          {format(referral.createdAt, "MMM d, yyyy")}
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
      {userProfile?.user?.id && (
        <TicketHistory userId={Number(userProfile.user.id)} />
      )}

      <TopBanner title="Advertisement" className="max-w-4xl mx-auto" />
    </div>
  );
}
