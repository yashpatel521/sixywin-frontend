import React from "react";
import { Icons } from "@/components/ui/icons";
const sectionContent = {
  title: "How It Works",
  steps: [
    {
      icon: <Icons.users className="h-8 w-8" />,
      title: "Sign Up Free",
      description:
        "Create your account in seconds. All you need is an email to get started on your winning journey.",
    },
    {
      icon: <Icons.checkCircle className="h-8 w-8" />,
      title: "Pick Your Numbers",
      description:
        'Choose your 6 lucky numbers from the grid, or use our "Quick Pick" feature for a random selection.',
    },
    {
      icon: <Icons.arrowRight className="h-8 w-8" />,
      title: "Submit Your Ticket",
      description:
        "Place your bid and submit your ticket for the daily draw. Watch the countdown and cross your fingers!",
    },
  ],
};

const StepCard = ({
  icon,
  title,
  children,
  step,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  step: number;
}) => (
  <div className="bg-card/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6 flex flex-col items-center text-center animation-all hover:shadow-2xl hover:-translate-y-2 fade-in-up">
    <div className="relative mb-4">
      <div className="bg-primary/20 text-primary rounded-full p-4">{icon}</div>
      <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold border-2 border-background">
        {step}
      </div>
    </div>
    <h3 className="text-xl font-bold font-headline mb-2 text-foreground">
      {title}
    </h3>
    <p className="text-muted-foreground">{children}</p>
  </div>
);

export function HowItWorksSection() {
  return (
    <section className="mt-20 md:mt-32">
      <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12 text-foreground">
        {sectionContent.title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sectionContent.steps.map((step, index) => (
          <StepCard
            key={index}
            icon={step.icon}
            title={step.title}
            step={index + 1}
          >
            {step.description}
          </StepCard>
        ))}
      </div>
    </section>
  );
}
