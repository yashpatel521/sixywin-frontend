import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { Icons } from "@/components/ui/icons";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

const sectionContent = {
  title: "Try Our Games",
  games: [
    {
      icon: <Icons.ticket className="h-8 w-8" />,
      title: "Play Lottery",
      description:
        "The classic SixyWin experience. Pick your six lucky numbers for the daily draw, place your bid, and hope for a big win from the Mega Pot!",
      href: "/games/play-lottery",
      disabled: false,
    },
    {
      icon: <Icons.layers className="h-8 w-8" />,
      title: "Double Trouble",
      description:
        "A fast-paced betting game where a new number is drawn every 30 seconds. Bet on a specific number, or bet on whether the number will be over or under 25. Quick rounds, quick wins!",
      href: "/games/double-trouble",
      disabled: false,
    },
    {
      icon: <Icons.rocket className="h-8 w-8" />,
      title: "Aviator",
      description:
        "Fly high and watch out for the crash! The longer you stay in the air, the bigger your multiplier. Cash out before it's too late!",
      href: "/games/aviator",
      disabled: false,
    },
    // {
    //   icon: <Icons.puzzle className="h-8 w-8" />,
    //   title: "More Games On The Way!",
    //   description:
    //     "We're always working on new and exciting games to add to the SixyWin lineup. Check back soon for more ways to test your luck and win!",
    //   href: "#",
    //   disabled: true,
    // },
  ],
  buttonText: "Try Now",
  comingSoonText: "Coming Soon",
};

interface GameCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  href: string;
  disabled?: boolean;
}

function GameCard({ icon, title, children, href, disabled }: GameCardProps) {
  return (
    <Card
      className={`relative text-center flex flex-col border-2 border-primary/20 bg-[#0e0e12] bg-opacity-80 hover:bg-opacity-100 hover:border-primary/40 transition-all duration-300 h-full overflow-hidden group ${disabled ? "opacity-50" : ""}`}
    >
      <div className="absolute inset-0 bg-[url('/images/card-pattern.svg')] opacity-20 group-hover:opacity-30 transition-opacity"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-50"></div>
      
      {/* Decorative corner icons */}
      <Icons.club className="absolute top-2 left-2 h-6 w-6 text-primary/30 group-hover:text-primary/50 transition-colors" />
      <Icons.diamond className="absolute top-2 right-2 h-6 w-6 text-accent/30 group-hover:text-accent/50 transition-colors" />
      <Icons.spade className="absolute bottom-2 left-2 h-6 w-6 text-primary/30 group-hover:text-primary/50 transition-colors" />
      <Icons.heart className="absolute bottom-2 right-2 h-6 w-6 text-accent/30 group-hover:text-accent/50 transition-colors" />
      
      <CardHeader className="z-10 p-4">
        <div className="mx-auto bg-[#1a1a24] text-primary rounded-full p-4 w-fit mb-4 shadow-lg ring-2 ring-primary/30 group-hover:ring-primary/50 transition-all">
          {icon}
        </div>
        <CardTitle className="font-irish-grover text-2xl text-white">
          {title}
        </CardTitle>
        <CardDescription className="text-muted-foreground group-hover:text-foreground transition-colors">
          {children}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col items-center justify-end z-10 p-4 pt-0">
        <Button
          asChild
          variant="default"
          className={`mt-auto bg-primary hover:bg-primary/90 text-white text-sm py-2 px-4 w-fit ${disabled ? "cursor-not-allowed" : ""}`}
          disabled={disabled}
        >
          {disabled ? (
            <span>{sectionContent.comingSoonText}</span>
          ) : (
            <Link to={href}>
              {sectionContent.buttonText}{" "}
              <Icons.arrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </Button>
      </CardContent>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary opacity-80 group-hover:opacity-100 transition-opacity" />
    </Card>
  );
}

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

export function GamesSection() {
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
      {/* Floating casino elements */}
      <motion.div variants={itemVariants} className="absolute top-1/4 left-1/4 opacity-20">
        <Icons.sparkles className="h-16 w-16 text-primary animate-float-slow" />
      </motion.div>
      <motion.div variants={itemVariants} className="absolute top-1/3 right-1/4 opacity-20">
        <Icons.gem className="h-14 w-14 text-accent animate-float-medium" />
      </motion.div>
      <motion.div variants={itemVariants} className="absolute bottom-1/4 right-1/3 opacity-20">
        <Icons.sparkles className="h-12 w-12 text-primary animate-float-fast" />
      </motion.div>
      
      <motion.h2 
        variants={itemVariants}
        className="text-3xl md:text-4xl font-bold font-headline text-center mb-12 text-foreground relative z-10"
      >
        {sectionContent.title}
      </motion.h2>
      
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto relative z-10"
      >
        {sectionContent.games.map((game, index) => (
          <motion.div key={index} variants={itemVariants}>
            <GameCard
              icon={game.icon}
              title={game.title}
              href={game.href}
              disabled={game.disabled}
            >
              {game.description}
            </GameCard>
          </motion.div>
        ))}
      </motion.div>
      
      <style>
        {`
          @keyframes float-slow {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }

          @keyframes float-medium {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(-3deg); }
          }

          @keyframes float-fast {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
          .animate-float-medium { animation: float-medium 4s ease-in-out infinite; }
          .animate-float-fast { animation: float-fast 3s ease-in-out infinite; }
        `}
      </style>
    </motion.section>
  );
}
