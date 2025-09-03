import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/libs/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";

const games = [
  {
    icon: <Icons.ticket className="h-8 w-8" />,
    title: "Play Lottery",
    description:
      "The classic SixyWin experience. Pick your six lucky numbers for the daily draw, place your bid, and hope for a big win from the Mega Pot!",
    href: "/games/play-lottery",
    disabled: false,
    buttonText: "Play Now",
  },
  {
    icon: <Icons.layers className="h-8 w-8" />,
    title: "Double Trouble",
    description:
      "A fast-paced betting game where a new number is drawn every 30 seconds. Bet on a specific number, or bet on whether the number will be over or under 25. Quick rounds, quick wins!",
    href: "/games/double-trouble",
    disabled: false,
    buttonText: "Play Now",
  },
  {
    icon: <Icons.rocket className="h-8 w-8" />,
    title: "Aviator",
    description:
      "A thrilling crash game where you bet on a rising multiplier. Cash out before the rocket flies away to secure your winnings. The higher it goes, the bigger the prize!",
    href: "/games/aviator",
    disabled: false,
    buttonText: "Play Now",
  },
  {
    icon: <Icons.puzzle className="h-8 w-8" />,
    title: "More Games On The Way!",
    description:
      "We're always working on new and exciting games to add to the SixyWin lineup. Check back soon for more ways to test your luck and win!",
    href: "#",
    disabled: true,
    buttonText: "Coming Soon",
  },
];

export interface GameCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  disabled: boolean;
  buttonText: string;
}

function GameCard({
  icon,
  title,
  description,
  href,
  disabled,
  buttonText,
}: GameCardProps) {
  return (
    <motion.div whileHover={{ y: -5 }} className="relative group h-full">
      <Card
        className={cn(
          "h-full text-center flex flex-col border border-white/10 bg-gradient-to-b from-background to-muted/5 hover:to-primary/5 rounded-xl overflow-hidden transition-all duration-300",
          disabled && "opacity-60"
        )}
      >
        <CardHeader className="pb-0">
          <div className="mx-auto bg-gradient-to-br from-primary to-secondary p-3 rounded-xl w-fit mb-4 shadow-lg">
            {icon}
          </div>
          <CardTitle className="font-bungee text-2xl text-white drop-shadow-md tracking-wider">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col justify-between pt-0">
          <p className="font-sans text-white/90 mb-6 px-4 tracking-normal text-base leading-relaxed">
            {description}
          </p>
          <div className="flex flex-col items-center gap-3 px-4 pb-4">
            <Button
              asChild
              variant="default"
              className={cn(
                "w-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-primary/40 hover:brightness-110 transition-all duration-300 relative overflow-hidden",
                disabled && "cursor-not-allowed"
              )}
              disabled={disabled}
            >
              <Link
                to={href}
                className="flex items-center justify-center gap-2"
              >
                {buttonText}
                <Icons.arrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <motion.div
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{
                y: [0, -5, 0],
              }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Icons.handMetal className="h-6 w-6 text-primary" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function GamesPage() {
  return (
    <div className="min-h-screen">
      <div className="container py-12 px-4 sm:px-6 lg:px-8 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <motion.h1
            className="font-luckiest-guy text-4xl md:text-5xl uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-4"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
          >
            OUR GAMES
          </motion.h1>
          <motion.p
            className="font-anton text-muted-foreground max-w-2xl mx-auto text-lg tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ letterSpacing: "0.1em" }}
          >
            Choose your game and start winning today!
          </motion.p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {games.map((game, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GameCard {...game} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-muted-foreground mb-4">
            More exciting games coming soon!
          </p>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent my-8" />
        </motion.div>
      </div>
    </div>
  );
}
