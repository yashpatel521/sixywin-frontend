import { Icons } from "@/components/ui/icons";

export interface RelatedLink {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

// Predefined link sets for different pages
export const GAME_LINKS: RelatedLink[] = [
  {
    title: "Virtual Lottery",
    description: "Play daily lottery draws with virtual coins",
    href: "/games/play-lottery",
    icon: <Icons.ticket className="h-5 w-5" />,
  },
  {
    title: "Aviator Crash Game",
    description: "Cash out before the rocket crashes",
    href: "/games/aviator",
    icon: <Icons.rocket className="h-5 w-5" />,
  },
  {
    title: "Double Trouble",
    description: "Fast-paced number prediction game",
    href: "/games/double-trouble",
    icon: <Icons.layers className="h-5 w-5" />,
  },
];

export const HELP_LINKS: RelatedLink[] = [
  {
    title: "How to Play Guide",
    description: "Learn strategies for all our games",
    href: "/how-to-play",
    icon: <Icons.info className="h-5 w-5" />,
  },
  {
    title: "Frequently Asked Questions",
    description: "Get answers to common questions",
    href: "/faq",
    icon: <Icons.alertCircle className="h-5 w-5" />,
  },
  {
    title: "Contact Support",
    description: "Get help from our support team",
    href: "/contact-us",
    icon: <Icons.messageSquare className="h-5 w-5" />,
  },
];

export const INFO_LINKS: RelatedLink[] = [
  {
    title: "About SixyWin",
    description: "Learn about our gaming platform",
    href: "/about-us",
    icon: <Icons.info className="h-5 w-5" />,
  },
  {
    title: "Gaming Leaderboard",
    description: "See top players and winners",
    href: "/leaderboard",
    icon: <Icons.trophy className="h-5 w-5" />,
  },
  {
    title: "All Games",
    description: "Browse our complete game collection",
    href: "/games",
    icon: <Icons.gamepad2 className="h-5 w-5" />,
  },
];
