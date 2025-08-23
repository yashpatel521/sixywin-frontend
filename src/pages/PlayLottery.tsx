import { SEO } from "@/components/shared/seo";
import { SEO_CONFIGS } from "@/utils/seo-configs";
import { TicketSubmission } from "@/components/play-lottery/ticket-submission";
import { TopLeaders } from "@/components/play-lottery/top-leaders";
import { MegaPot } from "@/components/play-lottery/mega-pot";
import { RelatedLinks } from "@/components/shared/related-links";
import { Icons } from "@/components/ui/icons";

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
          </div>
        </div>

        {/* Related Links */}
        <div className="mt-8">
          <RelatedLinks
            title="Other Games & Guides"
            links={[
              {
                title: "How to Play Virtual Lottery",
                description: "Learn strategies and tips for winning",
                href: "/how-to-play",
                icon: <Icons.info className="h-5 w-5" />,
              },
              {
                title: "Aviator Crash Game",
                description: "Try our exciting crash game",
                href: "/games/aviator",
                icon: <Icons.rocket className="h-5 w-5" />,
              },
              {
                title: "Double Trouble",
                description: "Fast-paced number prediction game",
                href: "/games/double-trouble",
                icon: <Icons.layers className="h-5 w-5" />,
              },
              {
                title: "Gaming FAQ",
                description: "Get answers to common questions",
                href: "/faq",
                icon: <Icons.alertCircle className="h-5 w-5" />,
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}
