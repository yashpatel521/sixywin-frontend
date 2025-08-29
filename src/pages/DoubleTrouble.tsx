import { SEO } from "@/components/shared/seo";
import { SEO_CONFIGS } from "@/utils/seo-configs";

import { UserBetHistory } from "@/components/double-trouble/userBetHistory";
import { RangeBetPanel } from "@/components/double-trouble/RangeBetPanel";
import { NumberBetPanel } from "@/components/double-trouble/NumberBetPanel";

import { BannerDoubleTrouble } from "@/components/double-trouble/BannerDoubleTrouble";

export default function DoubleTroublePage() {
  return (
    <>
      <SEO {...SEO_CONFIGS.doubleTrouble} />
      <div className="container mx-auto p-4 md:p-8 space-y-8">
        {/* Header */}

        <BannerDoubleTrouble />
        {/* Betting Panels */}

        <>
          <div className="grid grid-cols-12 gap-3 items-start">
            <div className="col-span-12 md:col-span-5">
              <RangeBetPanel />
            </div>

            <div className="col-span-12 md:col-span-7">
              <NumberBetPanel />
            </div>
          </div>
          <UserBetHistory />
        </>
      </div>
    </>
  );
}
