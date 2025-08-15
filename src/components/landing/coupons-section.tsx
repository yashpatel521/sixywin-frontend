import { Icons } from "@/components/ui/icons";
import React from "react";

const sectionContent = {
  title: "Coupons Coming Soon!",
  coupons: [
    {
      icon: <Icons.amazon className="h-8 w-8" />,
      title: "Amazon",
      description:
        "Get ready to redeem your coins for Amazon gift cards and shop millions of items.",
    },
    {
      icon: <Icons.apple className="h-8 w-8" />,
      title: "Apple",
      description:
        "Save up for the latest tech! Use your winnings to get discounts on Apple products.",
    },
    {
      icon: <Icons.googlePlay className="h-8 w-8" />,
      title: "Google Play",
      description:
        "Turn your lucky numbers into apps, games, movies, and more from the Google Play Store.",
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

export function CouponsSection() {
  return (
    <section className="mt-20 md:mt-32">
      <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12 text-foreground">
        {sectionContent.title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sectionContent.coupons.map((coupon, index) => (
          <FeatureCard key={index} icon={coupon.icon} title={coupon.title}>
            {coupon.description}
          </FeatureCard>
        ))}
      </div>
    </section>
  );
}
