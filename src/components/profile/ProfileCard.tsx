import { useState, useEffect } from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/ui/icons";
import { User } from "@/libs/interfaces";
import { useApiRequest } from "@/libs/apiRequest";
import { saveUserProfile } from "@/utils/storage";
import { toast } from "@/hooks/use-toast";
import { useWebSocketStore } from "@/store/websocketStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export const ProfileCard = ({ user }: { user: User }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || "");
  const [previewAvatar, setPreviewAvatar] = useState(user?.avatar || "");
  const { updateUserData } = useWebSocketStore();
  const totalTickets = 0;
  const totalEarnings = 0;

  const { request, data, success } = useApiRequest<User>({
    url: "/user/update",
    method: "POST",
    isToken: true,
  });

  const handleUpdate = async () => {
    if (!previewAvatar) return;
    try {
      await request({ avatar: previewAvatar });
      setSelectedAvatar(previewAvatar);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update avatar",
      });
    }
  };

  useEffect(() => {
    if (success && data) {
      setSelectedAvatar(data.avatar || previewAvatar);
      saveUserProfile(data);
      updateUserData(data);
      setIsEditModalOpen(false);
      toast({
        variant: "success",
        title: "Success",
        description: "Avatar updated successfully",
      });
    }
  }, [success, data]);

  const avatars = [
    "/avatars/avatar1.png",
    "/avatars/avatar2.png",
    "/avatars/avatar3.png",
    "/avatars/avatar4.png",
    "/avatars/avatar5.png",
    "/avatars/avatar6.png",
    "/avatars/avatar7.png",
    "/avatars/avatar8.png",
    "/avatars/avatar9.png",
    "/avatars/avatar10.png",
    "/avatars/avatar11.png",
    "/avatars/avatar12.png",
    "/avatars/avatar13.png",
    "/avatars/avatar14.png",
    "/avatars/avatar15.png",
    "/avatars/avatar16.png",
    "/avatars/avatar17.png",
    "/avatars/avatar18.png",
    "/avatars/avatar19.png",
    "/avatars/avatar20.png",
  ];

  return (
    <>
      <Card className="w-full glassmorphism animation-all hover:shadow-2xl flex flex-col h-full flex-1">
        <div className="p-4 md:p-6">
          <div className="flex-grow text-center sm:text-left">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="relative">
                <Avatar className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 shrink-0 border-4 border-primary animation-all hover:scale-110">
                  <AvatarImage
                    src={selectedAvatar || "https://i.pravatar.cc/150"}
                    alt={user?.username || "User"}
                  />
                  <AvatarFallback>
                    {user?.username?.substring(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="absolute top-2 -right-2 bg-primary rounded-full p-2 hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
                >
                  <Icons.pencil className="h-4 w-4 text-white" />
                </button>
              </div>

              <div className="flex-grow mt-3 sm:mt-0 sm:ml-6 flex flex-col justify-center items-center sm:items-start gap-2">
                <CardTitle className="font-headline text-2xl md:text-3xl flex items-center gap-2">
                  <Icons.user className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                  {user?.username || "User"}
                </CardTitle>
                <CardDescription className="mt-1 text-sm md:text-base">
                  {user?.email || "user@example.com"}
                </CardDescription>
              </div>

              <div className="flex items-center gap-2 text-lg md:text-xl font-semibold text-primary">
                <Icons.gem className="h-5 w-5 md:h-6 md:w-6" />
                <span>
                  {(user?.coins || 0) + (user?.winningAmount || 0)} Coins
                </span>
              </div>
            </div>

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

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-center">
              Choose Your Avatar
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-4 gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {avatars.map((avatar) => (
              <button
                key={avatar}
                onClick={() => setPreviewAvatar(avatar)}
                className={`block w-20 h-20 rounded-full overflow-hidden p-0 ${
                  previewAvatar === avatar
                    ? "ring-2 ring-primary scale-105"
                    : ""
                } transition-all`}
              >
                <Avatar className="w-full h-full">
                  <AvatarImage
                    src={avatar}
                    className="object-cover w-full h-full"
                  />
                </Avatar>
              </button>
            ))}
          </div>

          <DialogFooter className="sm:justify-center">
            <Button
              onClick={handleUpdate}
              disabled={!previewAvatar}
              className="w-full max-w-xs"
            >
              Update Avatar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
