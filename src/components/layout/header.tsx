import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { SpinWheel } from "../shared/spin-wheel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Icons } from "@/components/ui/icons";
import { useWebSocketStore } from "@/store/websocketStore";
import { useApiRequest } from "@/libs/apiRequest";
import { User } from "@/libs/interfaces";
import { useEffect } from "react";

// -------------------------
// Constants for links with icons
// -------------------------
const GAMES = [
  {
    label: "All Games",
    path: "/games",
    icon: (
      <Icons.gamepad2 className="h-4 w-4 mr-2 text-yellow-400 hover:text-black" />
    ),
  },
  {
    label: "Lottery",
    path: "/games/play-lottery",
    icon: (
      <Icons.ticket className="h-4 w-4 mr-2 text-yellow-400 hover:text-black" />
    ),
  },
  {
    label: "Aviator",
    path: "/games/aviator",
    icon: (
      <Icons.rocket className="h-4 w-4 mr-2 text-yellow-400 hover:text-black" />
    ),
  },
  {
    label: "Double Trouble",
    path: "/games/double-trouble",
    icon: (
      <Icons.layers className="h-4 w-4 mr-2 text-yellow-400 hover:text-black" />
    ),
  },
];

const PROFILE_LINKS = [
  {
    label: "Profile",
    path: "/profile",
    icon: <Icons.user className="h-4 w-4 mr-2" />,
  },
  {
    label: "Leaderboard",
    path: "/leaderboard",
    icon: <Icons.barChart className="h-4 w-4 mr-2" />,
  },
  {
    label: "FAQ",
    path: "/faq",
    icon: <Icons.info className="h-4 w-4 mr-2" />,
  },
];

export function Header() {
  const navigate = useNavigate();
  const { user, updateUserData } = useWebSocketStore();
  const isLoggedIn = !!user;

  const {
    data = {} as User,
    success,
    request,
  } = useApiRequest({
    url: "/user/me",
    method: "GET",
    isToken: true,
  });

  useEffect(() => {
    if (isLoggedIn) {
      request();
    }
  }, []);

  useEffect(() => {
    if (success) {
      updateUserData(data.user);
    }
  }, [data, success, updateUserData]);
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card/50 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo + Main Nav */}
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <Icons.logo className="h-6 w-6" />
          </Link>

          {/* Desktop MainNav */}
          {isLoggedIn && (
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              {/* Games with submenu */}
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-foreground/60 hover:text-primary transition-colors">
                  Games
                  <Icons.chevronDown className="h-4 w-4 mt-1" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glassmorphism">
                  {GAMES.map((game) => (
                    <DropdownMenuItem
                      key={game.path}
                      asChild
                      className="text-foreground/60 hover:text-primary transition-colors flex items-center"
                    >
                      <Link to={game.path}>
                        {game.icon}
                        {game.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Leaderboard */}
              <Link
                to="/leaderboard"
                className="text-foreground/60 hover:text-primary transition-colors flex items-center"
              >
                <Icons.barChart className="h-4 w-4 mr-2" />
                Leaderboard
              </Link>
            </nav>
          )}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              {/* Coins */}
              <div className="flex items-center gap-2 rounded-full border border-secondary bg-background/50 px-3 py-1 text-sm font-semibold text-primary">
                <Icons.gem className="h-4 w-4" />
                <span>{(user?.coins || 0) + (user?.winningAmount || 0)}</span>
              </div>

              {/* Watch & Earn */}
              {/* <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:scale-105 active:scale-95 transition-all"
                  >
                    <Icons.film className="h-4 w-4" />
                    <span className="sr-only">Watch and Earn</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="glassmorphism">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-headline flex items-center justify-center gap-2">
                      <Icons.film className="h-6 w-6 text-primary" />
                      Watch & Earn
                    </DialogTitle>
                    <DialogDescription className="text-center">
                      Watch a short ad to earn a guaranteed coin reward.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog> */}

              {/* Spin Wheel */}
              {!user?.isSpinned && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex items-center gap-2 bg-accent text-accent-foreground hover:bg-accent/90 hover:scale-105 active:scale-95 transition-all"
                    >
                      <Icons.gift className="h-4 w-4" />
                      Spin to Win
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glassmorphism">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-headline flex items-center justify-center gap-2">
                        <Icons.gift className="h-6 w-6 text-primary" />
                        Daily Bonus Wheel
                      </DialogTitle>
                      <DialogDescription className="text-center">
                        Spin the wheel to win extra coins! You get one free spin
                        per day.
                      </DialogDescription>
                    </DialogHeader>
                    <SpinWheel />
                  </DialogContent>
                </Dialog>
              )}

              {/* Avatar + Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="h-9 w-9 rounded-full hover:scale-110 transition-all">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={user.avatar}
                        alt={`@${user?.username || "user"}`}
                      />
                      <AvatarFallback>
                        {user?.username?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-56 glassmorphism"
                  align="end"
                  forceMount
                >
                  {/* User info */}
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user?.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Profile links */}
                  {PROFILE_LINKS.map((link) => (
                    <DropdownMenuItem
                      key={link.path}
                      asChild
                      className="flex items-center"
                    >
                      <Link to={link.path}>
                        {link.icon}
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator />

                  {/* Logout */}
                  <DropdownMenuItem asChild>
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => {
                        useWebSocketStore.getState().logout();
                        navigate("/login");
                      }}
                    >
                      Log out
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="flex md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Icons.menu />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs glassmorphism">
              <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
              <Link to="/" className="mb-8 flex items-center space-x-2">
                <Icons.logo className="h-6 w-6" />
              </Link>

              {isLoggedIn && (
                <nav className="flex flex-col space-y-4">
                  {/* Games list (mobile) */}
                  <div className="flex flex-col space-y-2">
                    <span className="font-semibold">Games</span>
                    {GAMES.map((game) => (
                      <Link
                        key={game.path}
                        to={game.path}
                        className="ml-2 text-foreground/60 hover:text-primary flex items-center"
                      >
                        {game.icon}
                        {game.label}
                      </Link>
                    ))}
                  </div>

                  {/* Profile links (mobile) */}
                  {PROFILE_LINKS.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      className="text-foreground/60 hover:text-primary flex items-center"
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  ))}
                </nav>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
