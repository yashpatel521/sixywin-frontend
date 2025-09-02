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

const sectionContent = {
  title: "Try Our Games",
  games: [
    {
      icon: <Icons.ticket className="h-8 w-8" />,
      title: "Play Lottery",
      description:
        "The classic SixyWin experience. Pick your six lucky numbers for the daily draw, place your bid, and hope for a big win from the Mega Pot!",
      href: "/games/play",
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
      className={`text-center flex flex-col border-white/10 bg-card/50 backdrop-blur-lg animation-all hover:shadow-2xl hover:-translate-y-2 fade-in-up ${
        disabled ? "opacity-50" : ""
      }`}
    >
      <CardHeader>
        <div className="mx-auto bg-primary/20 text-primary rounded-full p-3 w-fit mb-4">
          {icon}
        </div>
        <CardTitle className="font-headline text-xl">{title}</CardTitle>
        <CardDescription>{children}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-end">
        <Button
          asChild
          variant="outline"
          className={`mt-auto animation-all hover:scale-105 active:scale-95 ${
            disabled ? "cursor-not-allowed" : ""
          }`}
          disabled={disabled}
        >
          {disabled ? (
            <span>{sectionContent.comingSoonText}</span>
          ) : (
            <Link to={href}>
              {sectionContent.buttonText}{" "}
              <Icons.arrowRight className="ml-2 h-4 w-4" />
            </Link>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export function GamesSection() {
  return (
    <section className="mt-20 md:mt-32">
      <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-12 text-foreground">
        {sectionContent.title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {sectionContent.games.map((game, index) => (
          <GameCard
            key={index}
            icon={game.icon}
            title={game.title}
            href={game.href}
            disabled={game.disabled}
          >
            {game.description}
          </GameCard>
        ))}
      </div>
    </section>
  );
}
