import { useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import TicketHistory from "@/components/shared/ticket-history";
import { TopBanner } from "@/components/ads";
import { useWebSocketStore } from "@/store/websocketStore";

export default function ProfilePage() {
  const { user } = useWebSocketStore(); // Get user from Zustand store
  const [isCopied, setIsCopied] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { toast } = useToast();

  const referralId = user?.referenceId
    ? `${user.referenceId.toLowerCase()}`
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

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share && navigator.canShare) {
        // Check if sharing is supported and available
        const shareData = {
          title: "Join me on SixyWin!",
          text: "Use my referral link to get started:",
          url: referralLink,
        };

        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
        } else {
          handleCopy();
        }
      } else {
        handleCopy();
      }
    } catch (error) {
      // User cancelled sharing or sharing failed
      console.log("Sharing cancelled or failed:", error);
      handleCopy(); // Fallback to copy
    }
  }, [referralLink, handleCopy]);

  const totalTickets = 0; // Will be handled by TicketHistory component
  const totalEarnings = 0; // Will be handled by TicketHistory component

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 md:space-y-8">
      {/* User Profile and Redeem Coins Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* User Details Card */}
        <Card className="w-full glassmorphism animation-all hover:shadow-2xl">
          <div className="p-4 md:p-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 shrink-0 border-4 border-primary animation-all hover:scale-110">
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
                <CardTitle className="font-headline text-2xl md:text-3xl flex items-center gap-2">
                  <Icons.user className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                  {user?.username || "User"}
                </CardTitle>
                <div className="flex items-center gap-2 text-lg md:text-xl font-semibold text-primary">
                  <Icons.gem className="h-5 w-5 md:h-6 md:w-6" />
                  <span>
                    {(user?.coins || 0) + (user?.winningAmount || 0)} Coins
                  </span>
                </div>
              </div>
              <CardDescription className="mt-1 text-sm md:text-base">
                {user?.email || "user@example.com"}
              </CardDescription>
              <div className="grid grid-cols-2 gap-3 md:gap-4 text-center border-t mt-4 pt-4">
                <div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    Tickets Played
                  </div>
                  <div className="text-lg md:text-2xl font-bold flex items-center justify-center gap-1 md:gap-2">
                    <Icons.ticket className="h-4 w-4 md:h-6 md:w-6 text-primary/80" />
                    {totalTickets}
                  </div>
                </div>
                <div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    Winning Amount
                  </div>
                  <div className="text-lg md:text-2xl font-bold flex items-center justify-center gap-1 md:gap-2">
                    <Icons.barChart className="h-4 w-4 md:h-6 md:w-6 text-primary/80" />
                    {(user?.winningAmount || 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    Ad Earnings
                  </div>
                  <div className="text-lg md:text-2xl font-bold flex items-center justify-center gap-1 md:gap-2">
                    <Icons.gem className="h-4 w-4 md:h-6 md:w-6 text-primary/80" />
                    {(user?.winningAmount || 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    Total Winnings
                  </div>
                  <div className="text-lg md:text-2xl font-bold flex items-center justify-center gap-1 md:gap-2">
                    <Icons.award className="h-4 w-4 md:h-6 md:w-6 text-primary/80" />
                    {totalEarnings.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Redeem Coins Card */}
        <Card className="w-full glassmorphism animation-all hover:shadow-2xl">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="font-headline text-xl md:text-2xl flex items-center gap-2">
              <Icons.gift className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              Redeem Coins
            </CardTitle>
            <CardDescription className="text-sm md:text-base">
              Convert your virtual coins into real-world coupons.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between p-3 md:p-4 rounded-lg bg-secondary/30 gap-3">
              <div className="flex items-center gap-2 text-base md:text-lg font-semibold text-primary">
                <Icons.gem className="h-5 w-5 md:h-6 md:w-6" />
                <span>
                  {(user?.winningAmount || 0).toLocaleString()} Available Coins
                </span>
              </div>
              <Button
                disabled
                className="opacity-50 cursor-not-allowed w-full sm:w-auto"
              >
                Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Settings, Referrals, and Redeem History Side by Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Profile Settings Card */}
        <Card className="w-full glassmorphism animation-all hover:shadow-2xl">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="font-headline text-xl md:text-2xl flex items-center gap-2">
              <Icons.settings className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              Profile Settings
            </CardTitle>
            <CardDescription className="text-sm md:text-base">
              Manage your account details and password.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <form className="space-y-4 md:space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="username" className="text-sm md:text-base">
                  Username
                </Label>
                <Input
                  id="username"
                  defaultValue={user?.username || ""}
                  className="animation-all focus:scale-105 text-sm md:text-base"
                />
              </div>
              <div className="mt-4">
                <Label
                  htmlFor="referral-id"
                  className="text-xs md:text-sm text-muted-foreground"
                >
                  Your Referral Link
                </Label>
                <div className="flex flex-col sm:flex-row items-center gap-2 mt-1">
                  <Input
                    id="referral-id"
                    readOnly
                    value={referralLink}
                    className="bg-background/50 text-xs md:text-sm"
                  />
                  <div className="flex gap-1">
                    <Button
                      size="icon"
                      type="button"
                      variant="outline"
                      onClick={handleCopy}
                      className="animation-all hover:scale-105 active:scale-95 h-8 w-8 md:h-10 md:w-10"
                    >
                      {isCopied ? (
                        <Icons.check className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                      ) : (
                        <Icons.copy className="h-3 w-3 md:h-4 md:w-4" />
                      )}
                      <span className="sr-only">Copy Referral Link</span>
                    </Button>
                    <Button
                      size="icon"
                      type="button"
                      variant="outline"
                      onClick={handleShare}
                      className="animation-all hover:scale-105 active:scale-95 h-8 w-8 md:h-10 md:w-10"
                    >
                      <Icons.share2 className="h-3 w-3 md:h-4 md:w-4" />
                      <span className="sr-only">Share Referral Link</span>
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid gap-2">
                  <Label
                    htmlFor="current-password"
                    className="text-sm md:text-base"
                  >
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="animation-all focus:scale-105 pr-10 text-sm md:text-base"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-2 md:px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <Icons.eyeOff className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                      ) : (
                        <Icons.eye className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
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
                  <Label
                    htmlFor="new-password"
                    className="text-sm md:text-base"
                  >
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="animation-all focus:scale-105 pr-10 text-sm md:text-base"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-2 md:px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <Icons.eyeOff className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                      ) : (
                        <Icons.eye className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
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
                className="w-full opacity-50 cursor-not-allowed text-sm md:text-base"
              >
                Coming Soon
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Your Referred Users Card */}
        <Card className="glassmorphism animation-all hover:shadow-2xl">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="font-headline text-xl md:text-2xl flex items-center gap-2">
              <Icons.users className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              Your Referred Users ({user?.referrals?.length || 0})
            </CardTitle>
            <CardDescription className="text-sm md:text-base">
              Users you've successfully referred.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            {user?.referrals && user.referrals.length > 0 ? (
              <div className="space-y-3">
                {user.referrals.map((referral, index) => (
                  <div
                    key={referral.id || index}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={`https://ui-avatars.com/api/?name=${referral.referred.username}&background=random`}
                          alt={referral.referred.username || "Referred User"}
                        />
                        <AvatarFallback>
                          {referral.referred.username
                            ?.substring(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {referral.referred.username}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Joined{" "}
                          {new Date(referral.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-primary font-medium">
                      Active
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 md:py-8 text-muted-foreground">
                <p className="text-base md:text-lg font-medium">
                  No referrals yet!
                </p>
                <p className="text-xs md:text-sm">
                  Share your referral ID to bring friends.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Redeem History Card */}
        <Card className="glassmorphism animation-all hover:shadow-2xl">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="font-headline text-xl md:text-2xl flex items-center gap-2">
              <Icons.shoppingCart className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              Redeem History
            </CardTitle>
            <CardDescription className="text-sm md:text-base">
              Your history of redeemed coupons.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="text-center py-6 md:py-8 text-muted-foreground">
              <p className="text-base md:text-lg font-medium">
                No redeem history yet!
              </p>
              <p className="text-xs md:text-sm">
                Start redeeming coins to see your history here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ticket History - Using Shared Component */}
      {user && <TicketHistory userId={user?.id} />}
      <TopBanner title="Advertisement" className="max-w-4xl mx-auto" />
    </div>
  );
}
