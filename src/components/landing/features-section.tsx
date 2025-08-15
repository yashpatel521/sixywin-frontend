import React from "react";
import { Icons } from "@/components/ui/icons";
const sectionContent = {
  title: "Why You'll Love SixyWin",
  features: [
    {
      icon: <Icons.ticket className="h-8 w-8" />,
      title: "Daily Draws",
      description:
        "A new chance to win every single day! Submit your ticket and see if your lucky numbers come up.",
    },
    {
      icon: <Icons.gem className="h-8 w-8" />,
      title: "Win Virtual Coins",
      description:
        "Match numbers to win big! Use your coins to track your success and show off your luck.",
    },
    {
      icon: <Icons.trophy className="h-8 w-8" />,
      title: "Compete on Leaderboards",
      description:
        "See how you stack up against other players. Climb the ranks and become a SixyWin legend.",
    },
  ],
};

const FeatureCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-card/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6 text-center flex flex-col items-center animation-all hover:shadow-2xl hover:-translate-y-2 fade-in-up">
    <div className="bg-primary/20 text-primary rounded-full p-3 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold font-headline mb-2 text-foreground">
      {title}
    </h3>
    <p className="text-muted-foreground">{children}</p>
  </div>
);

export function FeaturesSection() {
  return (
    <section className="mt-20 md:mt-32">
      <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12 text-foreground">
        {sectionContent.title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sectionContent.features.map((feature, index) => (
          <FeatureCard key={index} icon={feature.icon} title={feature.title}>
            {feature.description}
          </FeatureCard>
        ))}
      </div>
    </section>
  );
}
