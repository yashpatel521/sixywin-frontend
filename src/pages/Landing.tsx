import { motion, Variants, Transition } from "framer-motion";
import { SEO } from "@/components/shared/seo";
import { SEO_CONFIGS } from "@/utils/seo-configs";
import { HeroSection } from "../components/landing/hero-section";
import { GamesSection } from "../components/landing/games-section";
import { FeaturesSection } from "../components/landing/features-section";
import { HowItWorksSection } from "../components/landing/how-it-works-section";
import { CtaSection } from "../components/landing/cta-section";
import { ComingSoonSection } from "@/components/landing/coming-soon-section";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const transition: Transition = {
  type: "spring",
  stiffness: 100,
  damping: 10,
};

const sectionVariants: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition,
  },
};

export default function LandingPage() {
  return (
    <>
      <SEO {...SEO_CONFIGS.home} />
      <main className="flex-1 pb-20">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="container mx-auto px-4 md:px-6 lg:px-8"
        >
          <motion.div variants={sectionVariants}>
            <HeroSection />
          </motion.div>

          <motion.div variants={sectionVariants}>
            <ComingSoonSection />
          </motion.div>

          <motion.div variants={sectionVariants}>
            <GamesSection />
          </motion.div>

          <motion.div variants={sectionVariants}>
            <FeaturesSection />
          </motion.div>

          <motion.div variants={sectionVariants}>
            <HowItWorksSection />
          </motion.div>

          <motion.div variants={sectionVariants}>
            <CtaSection />
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}
