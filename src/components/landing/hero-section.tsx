import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BouncingBalls } from "@/components/shared/bouncing-balls";
import { IMAGES } from "@/libs/constants";
import { Icons } from "@/components/ui/icons";
import { WINNING_MULTIPLIERS } from "@/libs/constants";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

const sectionContent = {
  welcome: "Welcome to",
  appName: "SixyWin",
  description:
    "Your daily dose of fun and excitement! Pick your lucky numbers, win virtual coins, and climb the leaderboard. No risk, all fun.",
  buttonText: "Get Started for Free",
  image: {
    src: IMAGES.hero,
    alt: "Joyful cartoon person celebrating with playing cards",
    width: 400,
    height: 400,
    "data-ai-hint": "cartoon winner",
  },
  tiers: [
    {
      title: "3 Matches",
      multiplier: WINNING_MULTIPLIERS[3],
      description: "Your Bid",
    },
    {
      title: "4 Matches",
      multiplier: WINNING_MULTIPLIERS[4],
      description: "Your Bid",
    },
    {
      title: "5 Matches",
      multiplier: WINNING_MULTIPLIERS[5],
      description: "Your Bid",
    },
    {
      title: "6 Matches",
      multiplier: WINNING_MULTIPLIERS[6],
      description: "Your Bid",
    },
  ],
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const TierCard = ({
  title,
  multiplier,
  description,
}: {
  title: string;
  multiplier: number;
  description: string;
}) => (
  <motion.div
    className="bg-card/50 backdrop-blur-lg border border-white/10 rounded-2xl p-4 text-center flex flex-col items-center justify-center hover:shadow-2xl hover:-translate-y-2"
    whileHover={{ y: -5, scale: 1.02 }}
  >
    <div className="bg-primary/20 text-primary rounded-full p-2 mb-2">
      <Icons.trophy className="h-5 w-5" />
    </div>
    <h4 className="text-md font-bold text-foreground">{title}</h4>
    <p className="text-2xl font-bold text-primary">
      {multiplier.toLocaleString()}x
    </p>
    <p className="text-sm text-muted-foreground">{description}</p>
  </motion.div>
);

export function HeroSection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mt-5"
    >
      <BouncingBalls />
      <motion.div
        variants={itemVariants}
        className="relative text-center lg:text-left lg:col-span-1"
      >
        <h1 className="text-4xl md:text-6xl font-bold font-irish-grover mb-4 text-foreground">
          {sectionContent.welcome}{" "}
          <span className="text-primary">{sectionContent.appName}</span>
        </h1>
        <p className="text-lg md:text-xl text-white font-irish-grover max-w-2xl mx-auto lg:mx-0 mb-8">
          {sectionContent.description}
        </p>
        <div className="flex justify-center lg:justify-start gap-4">
          <Button asChild size="lg" className="font-walter-turncoat text-white text-xl transition-all duration-300 hover:scale-105 active:scale-95">
            <Link to="/register">
              {sectionContent.buttonText}{" "}
              <Icons.arrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="hidden lg:flex justify-center items-center lg:col-span-1"
      >
        <img
          src={sectionContent.image.src}
          alt={sectionContent.image.alt}
          width={sectionContent.image.width}
          height={sectionContent.image.height}
          data-ai-hint={sectionContent.image["data-ai-hint"]}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="lg:col-span-1 space-y-4">
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 gap-4"
        >
          {sectionContent.tiers.map((tier, index) => (
            <motion.div key={index} variants={itemVariants}>
              <TierCard
                title={tier.title}
                multiplier={tier.multiplier}
                description={tier.description}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
