import { SEO, SEO_CONFIGS } from "@/components/shared/seo";
import { TicketSubmission } from "@/components/play-lottery/ticket-submission";
import { TopLeaders } from "@/components/shared/top-leaders";
import { MegaPot } from "@/components/play-lottery/mega-pot";
import { TopBanner } from "@/components/ads/BannerAds";

export default function PlayLotteryPage() {
  return (
    <>
      <SEO {...SEO_CONFIGS.playLottery} />
      <div className="container mx-auto p-4 md:p-8 space-y-8">
        <MegaPot />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <TicketSubmission />
          </div>
          <div className="space-y-8">
            <TopLeaders />
            <div className="my-12">
              <TopBanner title="Advertisement" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
