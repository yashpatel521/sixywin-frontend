import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";

export default function AboutUsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="font-headline text-3xl flex items-center gap-2">
            <Icons.users className="h-8 w-8 text-primary" />
            About SixyWin
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Our Mission
            </h2>
            <p>
              At SixyWin, our mission is to provide a fun and engaging
              entertainment experience where users can test their luck in a
              friendly, risk-free environment. We believe in the thrill of the
              draw and the joy of a lucky guess, all without any of the risks
              associated with real gambling.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Icons.ticket className="h-6 w-6" />
              How It Works
            </h2>
            <p>
              Our platform is simple. Users can log in daily to pick their lucky
              numbers, place a bid, and submit a ticket. We then hold a draw
              with winning numbers, and users win virtual coins based on how
              many numbers they match and the size of their bid. It's all about
              the fun of participation and the excitement of the win!
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Icons.gem className="h-6 w-6" />
              Winning Rules
            </h2>
            <p>
              The more numbers you match, the more virtual coins you win! The
              prize is your original bid multiplied by the tier you hit:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>
                <strong>3 Matches:</strong> 5x Your Bid
              </li>
              <li>
                <strong>4 Matches:</strong> 50x Your Bid
              </li>
              <li>
                <strong>5 Matches:</strong> 1,000x Your Bid
              </li>
              <li>
                <strong>6 Matches:</strong> 100,000x Your Bid
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Icons.history className="h-6 w-6" />
              Your Game History
            </h2>
            <p>
              You can review your performance and past tickets on your profile
              page. To keep things fresh and speedy, we only display your last 7
              days of ticket history.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Icons.gift className="h-6 w-6" />
              No Gambling, Just Fun and Coupons
            </h2>
            <p>
              We want to be crystal clear: SixyWin is NOT a gambling
              application. The virtual coins you win have no real-world monetary
              value and cannot be exchanged for cash. They are purely for
              entertainment and tracking your success on the leaderboard. As a
              thank you for playing, you can convert your winnings into valuable
              coupons from top brands like Amazon, Apple, and more. These are
              our way of adding a little extra perk to your lucky break!
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Join the Fun!
            </h2>
            <p>
              Create an account today, start picking your numbers, and see if
              you have what it takes to top the leaderboard. Good luck, and have
              fun!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
