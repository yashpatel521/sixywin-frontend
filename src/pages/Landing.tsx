import { SEO, SEO_CONFIGS } from "../components/shared/seo";
import { HeroSection } from "../components/landing/hero-section";
import { GamesSection } from "../components/landing/games-section";
import { RedeemSection } from "../components/landing/redeem-section";
import { FeaturesSection } from "../components/landing/features-section";
import { HowItWorksSection } from "../components/landing/how-it-works-section";
import { CouponsSection } from "../components/landing/coupons-section";
import { CtaSection } from "../components/landing/cta-section";
import { TopBanner, ResponsiveBanner } from "../components/ads";

export default function LandingPage() {
  return (
    <>
      <SEO {...SEO_CONFIGS.home} />
      <main className="flex-1 pb-20">
        <div className="container mx-auto px-4">
          <HeroSection />

          {/* First ad after hero section */}
          <div className="my-12">
            <TopBanner title="Advertisement" className="max-w-4xl mx-auto" />
          </div>

          <GamesSection />
          <RedeemSection />
          <FeaturesSection />
          <HowItWorksSection />

          {/* Second ad before final sections */}
          <div className="my-12">
            <ResponsiveBanner
              title="Don't Miss Out"
              className="max-w-3xl mx-auto"
            />
          </div>

          <CouponsSection />
          <CtaSection />
        </div>
      </main>
    </>
  );
}
