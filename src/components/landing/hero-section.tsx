import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BouncingBalls } from "@/components/shared/bouncing-balls";
import { IMAGES } from "@/libs/constants";
import { Icons } from "@/components/ui/icons";
import { WINNING_MULTIPLIERS } from "@/libs/constants";

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

const TierCard = ({
  title,
  multiplier,
  description,
}: {
  title: string;
  multiplier: number;
  description: string;
}) => (
  <div className="bg-card/50 backdrop-blur-lg border border-white/10 rounded-2xl p-4 text-center flex flex-col items-center justify-center animation-all hover:shadow-2xl hover:-translate-y-2 fade-in-up">
    <div className="bg-primary/20 text-primary rounded-full p-2 mb-2">
      <Icons.trophy className="h-5 w-5" />
    </div>
    <h4 className="text-md font-bold text-foreground">{title}</h4>
    <p className="text-2xl font-bold text-primary">
      {multiplier.toLocaleString()}x
    </p>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export function HeroSection() {
  return (
    <section className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 items-center mt-5">
      <div className="relative text-center lg:text-left lg:col-span-1">
        <BouncingBalls />
        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 text-foreground animation-all animate-in fade-in slide-in-from-top-4 duration-500">
          {sectionContent.welcome}{" "}
          <span className="text-primary">{sectionContent.appName}</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-8 animation-all animate-in fade-in slide-in-from-top-6 duration-700">
          {sectionContent.description}
        </p>
        <div className="flex justify-center lg:justify-start gap-4 animation-all animate-in fade-in slide-in-from-bottom-8 duration-900">
          <Button
            asChild
            size="lg"
            className="animation-all hover:scale-105 active:scale-95"
          >
            <Link to="/register">
              {sectionContent.buttonText}{" "}
              <Icons.arrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
      <div className="hidden lg:flex justify-center items-center lg:col-span-1">
        <img
          src={sectionContent.image.src}
          alt={sectionContent.image.alt}
          width={sectionContent.image.width}
          height={sectionContent.image.height}
          data-ai-hint={sectionContent.image["data-ai-hint"]}
        />
      </div>
      <div className="lg:col-span-1 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {sectionContent.tiers.map((tier, index) => (
            <TierCard
              key={index}
              title={tier.title}
              multiplier={tier.multiplier}
              description={tier.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
