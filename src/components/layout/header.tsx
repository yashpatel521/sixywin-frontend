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

import { MainNav } from "./main-nav";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { SpinWheel } from "../shared/spin-wheel"; // Commented out due to missing file
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
// import { WatchAd } from "../shared/watch-ad-modal"; // Commented out due to missing file
import { Icons } from "@/components/ui/icons";
import { useWebSocketStore } from "@/store/websocketStore"; // Import useWebSocketStore

export function Header() {
  const navigate = useNavigate();
  const { user } = useWebSocketStore(); // Get user from Zustand store
  const isLoggedIn = !!user; // Derive isLoggedIn from user state

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card/50 backdrop-blur-lg">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Icons.logo />
          </Link>
          {isLoggedIn && (
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <MainNav />
            </nav>
          )}
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex-1 md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Icons.menu />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-full max-w-xs glassmorphism"
              >
                <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                <Link to="/" className="mb-8 flex items-center space-x-2">
                  <Icons.logo className="h-6 w-6" />
                  <span className="font-headline font-bold">SixyWin</span>
                </Link>
                {isLoggedIn && (
                  <nav className="flex flex-col space-y-4">
                    <MainNav />
                  </nav>
                )}
              </SheetContent>
            </Sheet>
          </div>
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 rounded-full border border-secondary bg-background/50 px-3 py-1 text-sm font-semibold text-primary">
                <Icons.gem className="h-4 w-4" />
                <span>{(user?.coins || 0) + (user?.winningAmount || 0)}</span>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full animation-all hover:scale-105 active:scale-95"
                  >
                    <Icons.film className="h-4 w-4" />
                    <span className="sr-only">Watch and Earn</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="glassmorphism">
                  <DialogHeader>
                    <DialogTitle className="font-headline text-2xl flex items-center justify-center gap-2">
                      <Icons.film className="h-6 w-6 text-primary" />
                      Watch & Earn
                    </DialogTitle>
                    <DialogDescription className="text-center">
                      Watch a short ad to earn a guaranteed coin reward.
                    </DialogDescription>
                  </DialogHeader>
                  {/* <WatchAd /> */}{" "}
                  {/* Commented out due to missing component */}
                </DialogContent>
              </Dialog>
              {user?.isSpinned ? (
                <></>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="animation-all hover:scale-105 active:scale-95 bg-accent text-accent-foreground hover:bg-accent/90"
                      >
                        <Icons.gift className="mr-2 h-4 w-4" />
                        Spin to Win
                      </Button>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="glassmorphism">
                    <DialogHeader>
                      <DialogTitle className="font-headline text-2xl flex items-center justify-center gap-2">
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full animation-all hover:scale-110"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={user?.avatar || "https://i.pravatar.cc/150"}
                        data-ai-hint="person portrait"
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
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.username || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/games">Games</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/leaderboard">Leaderboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
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
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
