import { SEO } from "@/components/shared/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Icons } from "@/components/ui/icons";
import { MAX_NUMBER_DOUBLE_TROUBLE } from "@/libs/constants";

const faqData = [
  {
    category: "General",
    questions: [
      {
        question: "What is SixyWin?",
        answer:
          "SixyWin is a free virtual lottery and gaming platform where you can play exciting games like virtual lottery, Aviator crash game, and Double Trouble. All games use virtual coins with no real money involved, making it completely safe and fun!",
      },
      {
        question: "Is SixyWin free to play?",
        answer:
          "Yes! SixyWin is completely free to play. There are no hidden fees, no in-app purchases, and no real money required. You start with virtual coins and can earn more by playing games.",
      },
      {
        question: "Is this real gambling?",
        answer:
          "No, SixyWin is NOT gambling. We use only virtual coins that have no real-world monetary value. This is purely for entertainment purposes, making it safe and legal for everyone to enjoy.",
      },
      {
        question: "How do I get started?",
        answer:
          "Simply create a free account, and you'll receive starting virtual coins. Then choose from our games: Virtual Lottery, Aviator, or Double Trouble. Each game has easy-to-follow instructions!",
      },
    ],
  },
  {
    category: "Virtual Lottery",
    questions: [
      {
        question: "How does the virtual lottery work?",
        answer:
          "Pick 6 numbers from 1-49, place your virtual coin bid, and wait for the daily draw. Match 3+ numbers to win! The more numbers you match, the bigger your virtual coin prize.",
      },
      {
        question: "When are lottery draws held?",
        answer:
          "Virtual lottery draws are held daily at scheduled times. You can see the next draw time on the Play Lottery page and submit tickets until the draw begins.",
      },
      {
        question: "What are the winning odds?",
        answer:
          "Odds vary by matches: 3 matches (5x your bid), 4 matches (50x), 5 matches (1,000x), 6 matches (100,000x). These are virtual rewards for entertainment only.",
      },
      {
        question: "Can I play multiple tickets?",
        answer:
          "Yes! You can submit multiple lottery tickets with different number combinations to increase your chances of winning virtual coins.",
      },
    ],
  },
  {
    category: "Aviator Crash Game",
    questions: [
      {
        question: "How do I play Aviator?",
        answer:
          "Place your virtual coin bet and watch the rocket fly! The multiplier increases as it goes higher. Cash out before it crashes to win your bet multiplied by the current multiplier.",
      },
      {
        question: "What's the maximum multiplier?",
        answer:
          "The rocket can reach very high multipliers, but it's unpredictable when it will crash. The key is timing your cash-out to maximize virtual coin winnings while avoiding the crash.",
      },
      {
        question: "Can I place multiple bets?",
        answer:
          "Yes, you can place multiple bets in each round and cash out each one independently, allowing for different strategies in the same game.",
      },
      {
        question: "Is the game fair?",
        answer:
          "Absolutely! Our Aviator game uses provably fair algorithms to ensure every round is random and unbiased. It's purely for virtual entertainment.",
      },
    ],
  },
  {
    category: "Double Trouble",
    questions: [
      {
        question: "What is Double Trouble?",
        answer: `Double Trouble is a fast-paced number prediction game. Every 30 seconds, a number is drawn. You can bet on specific numbers or whether the number will be over/under ${
          MAX_NUMBER_DOUBLE_TROUBLE / 2
        }.`,
      },
      {
        question: "How often are numbers drawn?",
        answer:
          "New numbers are drawn every 30 seconds, making it an exciting, fast-paced gaming experience with frequent opportunities to win virtual coins.",
      },
      {
        question: "What are the betting options?",
        answer: `You can bet on: specific numbers (1-30), 'Under ${
          MAX_NUMBER_DOUBLE_TROUBLE / 2
        }', 'Over ${MAX_NUMBER_DOUBLE_TROUBLE / 2}', or 'Exactly ${
          MAX_NUMBER_DOUBLE_TROUBLE / 2
        }'. Each option has different virtual coin payout rates.`,
      },
      {
        question: "Can I bet on multiple options?",
        answer:
          "Yes! You can place multiple bets on different options in the same round, allowing you to diversify your virtual coin strategy.",
      },
    ],
  },
  {
    category: "Virtual Coins & Rewards",
    questions: [
      {
        question: "What are virtual coins?",
        answer:
          "Virtual coins are the in-game currency used on SixyWin. They have no real-world value and are purely for entertainment and tracking your gaming progress.",
      },
      {
        question: "How do I earn more virtual coins?",
        answer:
          "Win virtual coins by playing games successfully! You can also earn daily bonuses, complete achievements, and participate in special events.",
      },
      {
        question: "Can I convert virtual coins to real money?",
        answer:
          "No, virtual coins cannot be converted to real money. However, you can redeem them for valuable coupons from brands like Amazon, Apple, and more as part of our rewards program.",
      },
      {
        question: "What rewards can I get?",
        answer:
          "You can redeem virtual coins for discount coupons, gift cards, and special offers from popular brands. Check our rewards section for current available offers.",
      },
    ],
  },
  {
    category: "Account & Technical",
    questions: [
      {
        question: "How do I create an account?",
        answer:
          "Click 'Register' and provide a username, email, and password. You can also sign up quickly using your Google account for convenience.",
      },
      {
        question: "Is my personal information safe?",
        answer:
          "Yes! We use industry-standard security measures to protect your data. Read our Privacy Policy for detailed information about how we handle your information.",
      },
      {
        question: "Can I play on mobile?",
        answer:
          "Absolutely! SixyWin is fully optimized for mobile devices. Play on your smartphone or tablet with the same great experience as desktop.",
      },
      {
        question: "What if I encounter technical issues?",
        answer:
          "Contact our support team through the Contact page. We're here to help resolve any technical issues quickly so you can get back to gaming!",
      },
    ],
  },
];

export default function FAQPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.flatMap((category) =>
      category.questions.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      }))
    ),
  };

  return (
    <>
      <SEO
        title="FAQ - Frequently Asked Questions | SixyWin Free Virtual Gaming"
        description="Get answers to common questions about SixyWin's free virtual lottery games, Aviator crash game, Double Trouble, virtual coins, and rewards. Learn how to play and win!"
        keywords="SixyWin FAQ, virtual lottery questions, free gaming help, Aviator game guide, Double Trouble help, virtual coins explained"
        url="/faq"
        structuredData={structuredData}
      />
      <div className="container mx-auto p-4 md:p-8">
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="font-headline text-3xl flex items-center gap-2">
              <Icons.alertCircle className="h-8 w-8 text-primary" />
              Frequently Asked Questions
            </CardTitle>
            <p className="text-muted-foreground">
              Find answers to common questions about SixyWin's free virtual
              gaming platform
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {faqData.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary flex items-center gap-2">
                  <Icons.layers className="h-6 w-6" />
                  {category.category}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem
                      key={faqIndex}
                      value={`${categoryIndex}-${faqIndex}`}
                    >
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}

            <div className="mt-8 p-6 bg-primary/10 rounded-lg">
              <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                <Icons.messageSquare className="h-5 w-5" />
                Still Have Questions?
              </h3>
              <p className="text-muted-foreground mb-4">
                Can't find what you're looking for? Our support team is here to
                help!
              </p>
              <a
                href="/contact-us"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Icons.mail className="h-4 w-4" />
                Contact Support
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
