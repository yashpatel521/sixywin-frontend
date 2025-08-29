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
import { User } from "@/libs/interfaces";
import { useToast } from "@/hooks/use-toast";
import { useCallback, useState } from "react";
export const UpdateProfileCard = ({ user }: { user: User }) => {
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

  return (
    <Card className="w-full glassmorphism animation-all hover:shadow-2xl flex flex-col h-full flex-1">
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
          <div className="flex flex-col md:flex-row gap-4">
            {/* Username Field */}
            <div className="flex-1 grid gap-2">
              <Label htmlFor="username" className="text-sm md:text-base">
                Username
              </Label>
              <Input
                id="username"
                defaultValue={user?.username || ""}
                className="animation-all focus:scale-105 text-sm md:text-base"
              />
            </div>

            {/* Referral Section */}
            <div className="flex-1 mt-4 md:mt-0">
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
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 grid gap-2">
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
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <Icons.eyeOff className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                  ) : (
                    <Icons.eye className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">
                    {showCurrentPassword ? "Hide password" : "Show password"}
                  </span>
                </Button>
              </div>
            </div>

            <div className="flex-1 grid gap-2">
              <Label htmlFor="new-password" className="text-sm md:text-base">
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
  );
};
