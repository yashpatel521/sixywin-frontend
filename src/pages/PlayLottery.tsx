import { TicketSubmission } from "@/components/play-lottery/ticket-submission";
import { TopLeaders } from "@/components/shared/top-leaders";
import { MegaPot } from "@/components/play-lottery/mega-pot";

export default function PlayLotteryPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <MegaPot />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <TicketSubmission />
        </div>
        <div className="space-y-8">
          <TopLeaders />
        </div>
      </div>
    </div>
  );
}
