import { SEO } from "@/components/shared/seo";
import { SEO_CONFIGS } from "@/utils/seo-configs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import {
  WINNING_MULTIPLIERS,
  doubleTroublePayouts,
  MAX_NUMBER_DOUBLE_TROUBLE,
  AD_DURATION,
  REWARD_AMOUNT,
} from "@/libs/constants";

export default function AboutUsPage() {
  return (
    <>
      <SEO {...SEO_CONFIGS.about} />
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
                SixyWin delivers a fun, engaging, and risk‑free experience. Enjoy
                the thrill of the draw and celebrate lucky guesses with virtual
                rewards—no real‑money gambling involved.
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Icons.ticket className="h-6 w-6" />
                Games We Offer
              </h2>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>
                  <strong>Lottery:</strong> Pick 6 numbers out of 49, place a bid,
                  and match the draw to win based on tiers.
                </li>
                <li>
                  <strong>Double Trouble:</strong> Bet on a specific number, or on
                  whether the draw will be Under/Over/Exactly {MAX_NUMBER_DOUBLE_TROUBLE / 2}.
                </li>
                <li>
                  <strong>Aviator:</strong> Join a round and cash out before the
                  crash multiplier hits. The longer you wait, the higher the
                  risk—and the potential reward.
                </li>
                <li>
                  <strong>Spin & Daily Rewards:</strong> Enjoy a daily spin and
                  optional rewarded ads to earn bonus virtual coins.
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Icons.gem className="h-6 w-6" />
                Lottery Winning Rules
              </h2>
              <p>
                The more numbers you match, the more virtual coins you win! Your
                prize is your original bid multiplied by the tier you hit:
              </p>
              <ul className="list-disc list-inside space-y-1 pl-4">
                {[3, 4, 5, 6].map((k) => (
                  <li key={k}>
                    <strong>{k} Matches:</strong> {WINNING_MULTIPLIERS[k].toLocaleString()}x Your Bid
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Icons.target className="h-6 w-6" />
                Double Trouble at a Glance
              </h2>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>
                  <strong>Under {MAX_NUMBER_DOUBLE_TROUBLE / 2} / Over {MAX_NUMBER_DOUBLE_TROUBLE / 2}:</strong>
                  {" "}{doubleTroublePayouts.over}x payout
                </li>
                <li>
                  <strong>Exact {MAX_NUMBER_DOUBLE_TROUBLE / 2}:</strong> {doubleTroublePayouts.exact}x payout
                </li>
                <li>
                  <strong>Specific Number:</strong> {doubleTroublePayouts.number}x payout
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Icons.rocket className="h-6 w-6" />
                Aviator at a Glance
              </h2>
              <p>
                A round starts with a multiplier climbing upward. Cash out your
                virtual coins before the round crashes to secure your payout.
                Wait longer for bigger multipliers—but risk losing the round if it
                crashes first.
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Icons.handCoins className="h-6 w-6" />
                Rewards & Extras
              </h2>
              <ul className="list-disc list-inside space-y-1 pl-4">
                <li>
                  <strong>Daily Spin:</strong> Try your luck for bonus virtual
                  coins.
                </li>
                <li>
                  <strong>Ad Rewards:</strong> Watch a short ad (~{AD_DURATION}s)
                  to earn about {REWARD_AMOUNT.toLocaleString()} coins.
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Icons.users className="h-6 w-6" />
                Leaderboards & Referrals
              </h2>
              <p>
                Compete on global leaderboards and invite friends with your
                referral link to grow the community and earn recognition.
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Icons.checkCircle className="h-6 w-6" />
                Fair Play & Safety
              </h2>
              <p>
                SixyWin is not a gambling application. Virtual coins have no
                real‑world cash value. Numbers are drawn server‑side and delivered
                to your device in real time.
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Icons.history className="h-6 w-6" />
                Real‑time & Profile
              </h2>
              <p>
                Live updates are powered by WebSockets for instant results.
                Review your recent performance and past tickets anytime on your
                profile page.
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Icons.gift className="h-6 w-6" />
                No Gambling, Just Fun and Coupons
              </h2>
              <p>
                SixyWin is not a gambling application. Virtual coins have no
                real‑world cash value and are for entertainment and leaderboard
                bragging rights. As a thank‑you, you can convert winnings into
                coupons from top brands like Amazon and Apple.
              </p>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                Join the Fun!
              </h2>
              <p>
                Create an account, pick your numbers, and see how high you can
                climb the leaderboard. Good luck—and have fun!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
