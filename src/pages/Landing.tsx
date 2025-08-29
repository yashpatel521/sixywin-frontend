import { SEO } from "@/components/shared/seo";
import { SEO_CONFIGS } from "@/utils/seo-configs";
import { HeroSection } from "../components/landing/hero-section";
import { GamesSection } from "../components/landing/games-section";
import { FeaturesSection } from "../components/landing/features-section";
import { HowItWorksSection } from "../components/landing/how-it-works-section";
import { CtaSection } from "../components/landing/cta-section";
import { ComingSoonSection } from "@/components/landing/coming-soon-section";

export default function LandingPage() {
  return (
    <>
      <SEO {...SEO_CONFIGS.home} />
      <main className="flex-1 pb-20">
        <div className="container mx-auto px-4">
          <HeroSection />

          <ComingSoonSection />
          <GamesSection />
          <FeaturesSection />
          <HowItWorksSection />
          <CtaSection />
        </div>
      </main>
    </>
  );
}
