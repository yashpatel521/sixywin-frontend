import { Link } from "react-router-dom";
import { cn } from "@/libs/utils";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const routes = [
    { href: "/games", label: "Games" },
    { href: "/leaderboard", label: "Leaderboard" },
  ];

  return (
    <nav
      className={cn(
        "flex items-start flex-col space-y-2 md:flex-row md:items-center md:space-x-4 md:space-y-0 lg:space-x-6",
        className
      )}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          to={route.href}
          className="text-lg md:text-sm font-medium transition-colors hover:text-primary text-foreground/60"
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
