
import { TicketSubmission } from "@/components/play-lottery/ticket-submission";
import { TopLeaders } from "@/components/shared/top-leaders";
import { leaderboardData } from "@/lib/dummy-data.tsx";
import { addMinutes } from "date-fns";
import { MegaPot } from "@/components/play-lottery/mega-pot";

export default function PlayLotteryPage() {
  const topLeaders = leaderboardData.slice(0, 3);
  const nextDrawDate = addMinutes(new Date(), 1);

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <MegaPot nextDrawDate={nextDrawDate} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <TicketSubmission nextDrawDate={nextDrawDate} />
        </div>
        <div className="space-y-8">
          <TopLeaders leaders={topLeaders} />
        </div>
      </div>
    </div>
  );
}
