import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/libs/utils";
import { Icons } from "@/components/ui/icons";
import { GameCardProps } from "@/libs/interfaces";
// import { TopBanner } from "@/components/ads/BannerAds";

const games = [
  {
    icon: <Icons.ticket className="h-8 w-8" />,
    title: "Play Lottery",
    description:
      "The classic SixyWin experience. Pick your six lucky numbers for the daily draw, place your bid, and hope for a big win from the Mega Pot!",
    href: "/play-lottery",
    disabled: false,
    buttonText: "Play Now",
  },
  {
    icon: <Icons.layers className="h-8 w-8" />,
    title: "Double Trouble",
    description:
      "A fast-paced betting game where a new number is drawn every 30 seconds. Bet on a specific number, or bet on whether the number will be over or under 25. Quick rounds, quick wins!",
    href: "/double-trouble",
    disabled: false,
    buttonText: "Play Now",
  },
  {
    icon: <Icons.rocket className="h-8 w-8" />,
    title: "Aviator",
    description:
      "A thrilling crash game where you bet on a rising multiplier. Cash out before the rocket flies away to secure your winnings. The higher it goes, the bigger the prize!",
    href: "/aviator",
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

function GameCard({
  icon,
  title,
  children,
  href,
  disabled,
  buttonText,
}: GameCardProps) {
  return (
    <Card
      className={cn(
        "text-center flex flex-col border-white/10 glassmorphism animation-all hover:shadow-2xl hover:-translate-y-2",
        disabled && "opacity-60"
      )}
    >
      <CardHeader>
        <div className="mx-auto bg-primary/20 text-primary rounded-full p-3 w-fit mb-4">
          {icon}
        </div>
        <CardTitle className="font-headline text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <p className="text-muted-foreground mb-6">{children}</p>
        <Button
          asChild
          variant="default"
          className={cn(
            "mt-auto animation-all hover:scale-105 active:scale-95",
            disabled && "cursor-not-allowed"
          )}
          disabled={disabled}
        >
          {disabled ? (
            <span>{buttonText}</span>
          ) : (
            <Link to={href}>
              {buttonText} <Icons.arrowRight className="ml-2 h-4 w-4" />
            </Link>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function GamesPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl font-bold flex items-center justify-center gap-3">
          <Icons.gamepad2 className="h-10 w-10 text-primary" />
          Choose Your Game
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Select one of the games below to start playing and winning!
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {games.map((game, index) => (
          <GameCard
            key={index}
            icon={game.icon}
            title={game.title}
            href={game.href}
            disabled={game.disabled}
            buttonText={game.buttonText}
          >
            {game.description}
          </GameCard>
        ))}
      </div>
      {/* <div className="my-12">
        <TopBanner title="Advertisement" className="max-w-4xl mx-auto" />
      </div> */}
    </div>
  );
}
