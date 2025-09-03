import { SEO, buildBreadcrumbLD, buildHowToLD } from "@/components/shared/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  doubleTroublePayouts,
  MAX_NUMBER_DOUBLE_TROUBLE,
  WINNING_MULTIPLIERS,
} from "@/libs/constants";

export default function HowToPlayPage() {
  const structuredData = [
    buildBreadcrumbLD([
      { name: "Home", item: "/" },
      { name: "How to Play", item: "/how-to-play" },
    ]),
    buildHowToLD(
      "How to Play SixyWin Virtual Games",
      [
        {
          name: "Create Account",
          text: "Sign up for free and get starting virtual coins",
        },
        {
          name: "Choose Game",
          text: "Select from Virtual Lottery, Aviator, or Double Trouble",
        },
        {
          name: "Place Bets",
          text: "Use virtual coins to place bets and play games",
        },
        {
          name: "Win Rewards",
          text: "Win virtual coins and redeem for real rewards",
        },
      ],
      "Complete guide on how to play virtual lottery, Aviator crash game, and Double Trouble on SixyWin platform",
      "https://sixywin.com/guides/how-to-play.png"
    ),
  ];

  return (
    <>
      <SEO
        title="How to Play Guide - Virtual Lottery, Aviator & Double Trouble | SixyWin"
        description="Learn how to play SixyWin's free virtual games! Complete guides for Virtual Lottery, Aviator crash game, and Double Trouble with tips and strategies to win virtual coins."
        keywords="how to play virtual lottery, Aviator game guide, Double Trouble tutorial, virtual gaming strategies, SixyWin game rules"
        url="/how-to-play"
        structuredData={structuredData}
      />
      <div className="container mx-auto p-4 md:p-8">
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center gap-2">
              <Icons.info className="h-8 w-8 text-primary" />
              How to Play SixyWin Games
            </CardTitle>
            <p className="text-muted-foreground">
              Master all our virtual games with these comprehensive guides and
              strategies
            </p>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="lottery" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="lottery">Virtual Lottery</TabsTrigger>
                <TabsTrigger value="aviator">Aviator</TabsTrigger>
                <TabsTrigger value="double-trouble">Double Trouble</TabsTrigger>
              </TabsList>

              <TabsContent value="lottery" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icons.ticket className="h-6 w-6 text-primary" />
                        Virtual Lottery Basics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold">How to Play:</h4>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                          <li>Choose 6 numbers from 1 to 49</li>
                          <li>Set your virtual coin bid amount</li>
                          <li>Submit your ticket before draw time</li>
                          <li>Wait for the daily draw results</li>
                          <li>Win based on number matches!</li>
                        </ol>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Winning Tiers:</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>
                            • 1 match: {WINNING_MULTIPLIERS[1].toLocaleString()}
                            x your bid
                          </li>
                          <li>
                            • 2 matches:{" "}
                            {WINNING_MULTIPLIERS[2].toLocaleString()}x your bid
                          </li>
                          <li>
                            • 3 matches:{" "}
                            {WINNING_MULTIPLIERS[3].toLocaleString()}x your bid
                          </li>
                          <li>
                            • 4 matches:{" "}
                            {WINNING_MULTIPLIERS[4].toLocaleString()}x your bid
                          </li>
                          <li>
                            • 5 matches:{" "}
                            {WINNING_MULTIPLIERS[5].toLocaleString()}x your bid
                          </li>
                          <li>
                            • 6 matches:{" "}
                            {WINNING_MULTIPLIERS[6].toLocaleString()}x your bid
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icons.zap className="h-6 w-6 text-primary" />
                        Lottery Strategies
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold">Pro Tips:</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Mix high and low numbers (1-25, 26-49)</li>
                          <li>• Avoid consecutive numbers</li>
                          <li>
                            • Play multiple tickets with different combinations
                          </li>
                          <li>• Check number frequency in past draws</li>
                          <li>• Manage your virtual coin budget wisely</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Common Mistakes:</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Picking only birthdays (limits to 1-31)</li>
                          <li>• Using same numbers every time</li>
                          <li>• Betting all coins on one ticket</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center">
                  <Button asChild size="lg">
                    <Link to="/games/play-lottery">
                      <Icons.ticket className="mr-2 h-4 w-4" />
                      Start Playing Virtual Lottery
                    </Link>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="aviator" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icons.rocket className="h-6 w-6 text-primary" />
                        Aviator Game Basics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold">How to Play:</h4>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                          <li>Place your virtual coin bet before takeoff</li>
                          <li>Watch the rocket fly and multiplier increase</li>
                          <li>Click "Cash Out" before the rocket crashes</li>
                          <li>Win your bet × current multiplier</li>
                          <li>If you don't cash out before crash, you lose</li>
                        </ol>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Key Features:</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Real-time multiplier display</li>
                          <li>• Multiple bets per round</li>
                          <li>• Auto cash-out options</li>
                          <li>• Live player statistics</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icons.target className="h-6 w-6 text-primary" />
                        Aviator Strategies
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold">Winning Strategies:</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>
                            • Conservative: Cash out at 1.5x-2x consistently
                          </li>
                          <li>• Moderate: Target 3x-5x multipliers</li>
                          <li>• Aggressive: Wait for 10x+ (high risk)</li>
                          <li>
                            • Split betting: Multiple bets, different cash-outs
                          </li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Risk Management:</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Set auto cash-out limits</li>
                          <li>• Never bet more than 10% of coins</li>
                          <li>• Take breaks after big wins/losses</li>
                          <li>• Track your performance</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center">
                  <Button asChild size="lg">
                    <Link to="/games/aviator">
                      <Icons.rocket className="mr-2 h-4 w-4" />
                      Play Aviator Crash Game
                    </Link>
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="double-trouble" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icons.layers className="h-6 w-6 text-primary" />
                        Double Trouble Basics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold">How to Play:</h4>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                          <li>New number drawn every 30 seconds (1-30)</li>
                          <li>Choose your betting option before draw</li>
                          <li>Place virtual coin bets on your predictions</li>
                          <li>Win based on correct predictions</li>
                          <li>Multiple betting options available</li>
                        </ol>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Betting Options:</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Specific Number (1-30): Highest payout</li>
                          <li>
                            • Under {MAX_NUMBER_DOUBLE_TROUBLE / 2}: Numbers 1-
                            {MAX_NUMBER_DOUBLE_TROUBLE / 2}
                          </li>
                          <li>
                            • Over {MAX_NUMBER_DOUBLE_TROUBLE / 2}: Numbers
                            {MAX_NUMBER_DOUBLE_TROUBLE / 2 + 1}-
                            {MAX_NUMBER_DOUBLE_TROUBLE}
                          </li>
                          <li>
                            • Exactly {MAX_NUMBER_DOUBLE_TROUBLE / 2}: Number
                            {MAX_NUMBER_DOUBLE_TROUBLE / 2} only
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icons.trendingUp className="h-6 w-6 text-primary" />
                        Double Trouble Strategies
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-semibold">Smart Betting:</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Over/Under bets: Lower risk, steady wins</li>
                          <li>• Number betting: High risk, high reward</li>
                          <li>• Combination betting: Mix strategies</li>
                          <li>• Pattern analysis: Watch recent draws</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Payout Guide:</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>
                            • Under/Over {MAX_NUMBER_DOUBLE_TROUBLE / 2}:{" "}
                            {doubleTroublePayouts.over}x payout
                          </li>
                          <li>
                            • Exactly {MAX_NUMBER_DOUBLE_TROUBLE / 2}:{" "}
                            {doubleTroublePayouts.exact}x payout
                          </li>
                          <li>
                            • Specific number: {doubleTroublePayouts.number}x
                            payout
                          </li>
                          <li>• Multiple bets: Combine for bigger wins</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="text-center">
                  <Button asChild size="lg">
                    <Link to="/games/double-trouble">
                      <Icons.layers className="mr-2 h-4 w-4" />
                      Play Double Trouble
                    </Link>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Icons.sparkles className="h-5 w-5 text-primary" />
                Ready to Start Playing?
              </h3>
              <p className="text-muted-foreground mb-4">
                Now that you know how to play, create your free account and
                start winning virtual coins!
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <Link to="/register">
                    <Icons.user className="mr-2 h-4 w-4" />
                    Create Free Account
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/games">
                    <Icons.gamepad2 className="mr-2 h-4 w-4" />
                    Browse All Games
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
