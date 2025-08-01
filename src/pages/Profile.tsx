import { useState, useCallback } from "react";
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
  User as UserIcon,
  Gift,
  Settings,
  Users,
  ShoppingCart,
  Ticket,
  BarChart,
  Award,
  Copy,
  Check,
  Share2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import TicketHistory from "@/components/shared/ticket-history";
import type { User } from "@/lib/interfaces";

export default function ProfilePage() {
  const [user] = useLocalStorage<User | null>("user", null);
  const [isCopied, setIsCopied] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { toast } = useToast();

  const referralId = user?.refernceId
    ? `ref-${user.refernceId.toLowerCase()}`
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

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: "Join me on SixyWin!",
        text: "Use my referral link to get started:",
        url: referralLink,
      });
    } else {
      handleCopy();
    }
  }, [referralLink, handleCopy]);

  const totalTickets = 0; // Will be handled by TicketHistory component
  const totalEarnings = 0; // Will be handled by TicketHistory component

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      {/* User Profile and Redeem Coins Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Details Card */}
        <Card className="w-full glassmorphism animation-all hover:shadow-2xl">
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
                    {totalTickets}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Winning Amount
                  </div>
                  <div className="text-2xl font-bold flex items-center justify-center gap-2">
                    <BarChart className="h-6 w-6 text-primary/80" />
                    {(user?.winningAmount || 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Ad Earnings
                  </div>
                  <div className="text-2xl font-bold flex items-center justify-center gap-2">
                    <Gem className="h-6 w-6 text-primary/80" />
                    {(user?.winningAmount || 0).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    Total Winnings
                  </div>
                  <div className="text-2xl font-bold flex items-center justify-center gap-2">
                    <Award className="h-6 w-6 text-primary/80" />
                    {totalEarnings.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Redeem Coins Card */}
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
      </div>

      {/* Profile Settings, Referrals, and Redeem History Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Settings Card */}
        <Card className="w-full glassmorphism animation-all hover:shadow-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <Settings className="h-6 w-6 text-primary" />
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
              <div className="grid grid-cols-1 gap-4">
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

        {/* Your Referred Users Card */}
        <Card className="glassmorphism animation-all hover:shadow-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
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

        {/* Redeem History Card */}
        <Card className="glassmorphism animation-all hover:shadow-2xl">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <ShoppingCart className="h-6 w-6 text-primary" />
              Redeem History
            </CardTitle>
            <CardDescription>Your history of redeemed coupons.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-lg font-medium">No redeem history yet!</p>
              <p className="text-sm">
                Start redeeming coins to see your history here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ticket History - Using Shared Component */}
      <TicketHistory />
    </div>
  );
}
