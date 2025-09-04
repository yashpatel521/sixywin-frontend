import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@/libs/interfaces";
import { useToast } from "@/hooks/use-toast";
import { useApiRequest } from "@/libs/apiRequest";
import { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { saveUserProfile } from "@/utils/storage";
import { useWebSocketStore } from "@/store/websocketStore";
import { hashPassword } from "@/utils/hmac";

export const UpdateProfileCard = ({ user }: { user: User }) => {
  const { updateUserData } = useWebSocketStore();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
  });

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isCopied, setIsCopied] = useState(false);
  const referralId = user?.referenceId
    ? `${user.referenceId.toLowerCase()}`
    : "";
  const referralLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/register?ref=${referralId}`
      : "";

  const { request, loading, success, data } = useApiRequest<User>({
    url: "/user/update",
    method: "POST",
    isToken: true,
    data: {
      username: formData.username,
      newPassword: hashPassword(newPassword),
    },
  });

  const { toast } = useToast();

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(referralLink);
    setIsCopied(true);
    toast({
      variant: "success",
      title: "Copied!",
      description: "Referral link copied to clipboard.",
    });
    setTimeout(() => setIsCopied(false), 2000);
  }, [referralLink, toast]);

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Join me on SixyWin!",
          text: "Use my referral link to get started:",
          url: referralLink,
        });
      } else {
        handleCopy();
      }
    } catch (error) {
      handleCopy();
    }
  }, [referralLink, handleCopy]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    try {
      await request();

      setIsEditingUsername(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
      });
    }
  };

  useEffect(() => {
    if (success) {
      saveUserProfile(data);
      updateUserData(data);
      toast({
        variant: "success",
        title: "Success",
        description: "Profile updated successfully",
      });
    }
  }, [success, data]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords don't match",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password must be at least 8 characters",
      });
      return;
    }

    try {
      await request();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update password",
      });
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0)
      return { text: "", color: "text-muted-foreground" };
    if (password.length < 8) return { text: "Weak", color: "text-red-500" };
    if (
      /[A-Z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password)
    ) {
      return { text: "Strong", color: "text-green-500" };
    }
    return { text: "Medium", color: "text-yellow-500" };
  };

  return (
    <>
      <Card className="w-full glassmorphism animation-all hover:shadow-2xl flex flex-col h-full flex-1">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="font-headline text-xl md:text-2xl flex items-center gap-2">
            <Icons.settings className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 grid gap-2">
                <Label htmlFor="username">Username</Label>
                <div className="flex gap-2">
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                  />
                  <Button
                    type="submit"
                    variant="default"
                    disabled={loading}
                    className="w-24"
                    onClick={() => {
                      if (!isEditingUsername) {
                        setIsEditingUsername(true);
                      } else {
                        handleSubmit();
                        setTimeout(() => setIsEditingUsername(false), 2000);
                      }
                    }}
                  >
                    {loading
                      ? "Updating..."
                      : isEditingUsername
                      ? "Save"
                      : "Save"}
                  </Button>
                </div>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => setPasswordDialogOpen(true)}
              className="w-full"
            >
              Change Password
            </Button>

            <div className="flex-1 mt-4 md:mt-0">
              <Label className="text-xs md:text-sm text-muted-foreground">
                Your Referral Link
              </Label>
              <div className="flex flex-col sm:flex-row items-center gap-2 mt-1">
                <Input
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
                    className="h-8 w-8 md:h-10 md:w-10"
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
                    className="h-8 w-8 md:h-10 md:w-10"
                  >
                    <Icons.share2 className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="sr-only">Share Referral Link</span>
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handlePasswordChange}>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <Icons.eyeOff className="h-4 w-4" />
                  ) : (
                    <Icons.eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {newPassword && (
                <div
                  className={`text-xs ${
                    getPasswordStrength(newPassword).color
                  }`}
                >
                  Strength: {getPasswordStrength(newPassword).text}
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <Icons.eyeOff className="h-4 w-4" />
                  ) : (
                    <Icons.eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
