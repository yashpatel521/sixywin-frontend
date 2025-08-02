import { SEO, SEO_CONFIGS } from "../components/shared/seo";
import { HeroSection } from "../components/landing/hero-section";
import { GamesSection } from "../components/landing/games-section";
import { RedeemSection } from "../components/landing/redeem-section";
import { FeaturesSection } from "../components/landing/features-section";
import { HowItWorksSection } from "../components/landing/how-it-works-section";
import { CouponsSection } from "../components/landing/coupons-section";
import { CtaSection } from "../components/landing/cta-section";

export default function LandingPage() {
  return (
    <>
      <SEO {...SEO_CONFIGS.home} />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <HeroSection />
          <GamesSection />
          <RedeemSection />
          <FeaturesSection />
          <HowItWorksSection />
          <CouponsSection />
          <CtaSection />
        </div>
      </main>
    </>
  );
}
