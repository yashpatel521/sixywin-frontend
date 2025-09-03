import React from "react";
import { Icons } from "@/components/ui/icons";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
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
      duration: 0.5,
    },
  },
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
  <motion.div
    className="relative bg-card/50 backdrop-blur-lg border-2 border-primary/30 rounded-2xl p-8 flex flex-col items-center text-center shadow-lg hover:shadow-primary/30 transition-all duration-300 overflow-hidden group hover:border-primary/60"
    whileHover={{ y: -5, scale: 1.02 }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50 group-hover:opacity-70 transition-opacity"></div>
    <div className="absolute inset-0 opacity-10 flex items-center justify-center">
      <Icons.dices className="h-32 w-32 text-primary animate-spin-slow" />
    </div>
    <div className="relative mb-6">
      <div className="bg-primary/20 text-primary rounded-full p-5 shadow-inner group-hover:bg-primary/30 transition-colors">
        {icon}
      </div>
      <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground rounded-full h-10 w-10 flex items-center justify-center font-bold border-2 border-background shadow-lg group-hover:scale-110 transition-transform">
        {step}
      </div>
    </div>
    <h3 className="text-2xl font-bold font-headline mb-3 text-foreground relative z-10 group-hover:text-primary transition-colors">
      {title}
    </h3>
    <p className="text-muted-foreground relative z-10 group-hover:text-foreground transition-colors">{children}</p>
    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80 group-hover:opacity-100 group-hover:h-1.5 transition-all" />
  </motion.div>
);

export function HowItWorksSection() {
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
      className="mt-20 md:mt-32 py-20"
    >
      <motion.h2
        variants={itemVariants}
        className="text-4xl md:text-5xl font-bold font-headline text-center mb-16 text-foreground"
      >
        {sectionContent.title}
      </motion.h2>
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {sectionContent.steps.map((step, index) => (
            <motion.div key={index} variants={itemVariants}>
              <StepCard icon={step.icon} title={step.title} step={index + 1}>
                {step.description}
              </StepCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
