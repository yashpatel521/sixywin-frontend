import TicketHistory from "@/components/shared/ticket-history";
import { useWebSocketStore } from "@/store/websocketStore";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { UpdateProfileCard } from "@/components/profile/UpdateProfileCard";
import { Referrals } from "@/components/profile/referrals";

export default function ProfilePage() {
  const { user } = useWebSocketStore(); // Get user from Zustand store

  if (!user) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <p className="text-lg md:text-xl text-muted-foreground">
          Loading profile...
        </p>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6 md:space-y-8">
      <div className="flex flex-col lg:flex-row gap-6 md:gap-8 items-stretch">
        {/* ProfileCard takes 40% on large screens */}
        <div className="w-full lg:w-2/5 flex flex-col">
          <ProfileCard user={user} />
        </div>

        {/* UpdateProfileCard takes remaining 60% */}
        <div className="w-full lg:w-3/5 flex flex-col">
          <UpdateProfileCard user={user} />
        </div>
      </div>

      <div className="flex flex-wrap gap-6 md:gap-8">
        <div className="flex-1 min-w-[250px]">
          <Referrals user={user} />
        </div>
      </div>

      {user && <TicketHistory userId={user?.id} />}
    </div>
  );
}
