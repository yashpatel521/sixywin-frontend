import React from "react";
import { Icons } from "@/components/ui/icons";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

const sectionContent = {
  title: "Why You'll Love SixyWin",
  features: [
    {
      icon: <Icons.ticket className="h-8 w-8 text-primary-foreground" />,
      title: "Daily Draws",
      description:
        "A new chance to win every single day! Submit your ticket and see if your lucky numbers come up.",
    },
    {
      icon: <Icons.gem className="h-8 w-8 text-primary-foreground" />,
      title: "Win Virtual Coins",
      description:
        "Match numbers to win big! Use your coins to track your success and show off your luck.",
    },
    {
      icon: <Icons.trophy className="h-8 w-8 text-primary-foreground" />,
      title: "Compete on Leaderboards",
      description:
        "See how you stack up against other players. Climb the ranks and become a SixyWin legend.",
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

const FeatureCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="relative bg-card/50 backdrop-blur-lg border-2 border-primary/30 rounded-2xl p-8 text-center flex flex-col items-center transition-all hover:shadow-primary/30 hover:-translate-y-1 duration-300 h-full overflow-hidden group hover:border-primary/60">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50 group-hover:opacity-70 transition-opacity"></div>
    <div className="absolute inset-0 opacity-10 flex items-center justify-center">
      <Icons.dices className="h-32 w-32 text-primary animate-spin-slow" />
    </div>
    <div className="bg-gradient-to-tr from-primary/60 to-accent/60 rounded-full p-4 mb-6 flex items-center justify-center shadow-lg z-10 ring-2 ring-white/50 group-hover:ring-white/80 group-hover:scale-110 transition-all">
      {icon}
    </div>
    <h3 className="text-xl font-bold font-irish-grover mb-3 z-10 text-white">
      {title}
    </h3>
    <p className="text-muted-foreground z-10 group-hover:text-foreground transition-colors">{children}</p>
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-80 group-hover:opacity-100 group-hover:h-1.5 transition-all"></div>
  </div>
);

export function FeaturesSection() {
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
      className="md:mt-16 relative"
    >
      <div className="absolute inset-0 bg-[url('/images/casino-pattern.svg')] opacity-5 -z-10"></div>
      
      <motion.h2 
        variants={itemVariants}
        className="text-3xl md:text-4xl font-bold font-irish-grover text-center mb-12 text-foreground"
      >
        {sectionContent.title}
      </motion.h2>
      
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {sectionContent.features.map((feature, index) => (
          <motion.div key={index} variants={itemVariants}>
            <FeatureCard icon={feature.icon} title={feature.title}>
              {feature.description}
            </FeatureCard>
          </motion.div>
        ))}
      </motion.div>
      
      <style>
        {`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
          }
        `}
      </style>
    </motion.section>
  );
}
