import { SEO } from "@/components/shared/seo";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function NotFoundPage() {
  return (
    <>
      <SEO
        title="Page Not Found - SixyWin Free Virtual Gaming"
        description="The page you're looking for doesn't exist. Return to SixyWin's free virtual gaming platform with lottery games, crash games, and more."
        robots="noindex, follow"
      />
      <Header />
      <div className="container mx-auto px-4 py-20 text-center min-h-[60vh] flex flex-col justify-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-muted-foreground mb-8">
            Oops! The page you're looking for doesn't exist. Let's get you back
            to the gaming action!
          </p>

          <div className="space-y-4">
            <Link
              to="/"
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Go Home
            </Link>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Link
                to="/games/play-lottery"
                className="text-primary hover:text-primary/80 underline"
              >
                Play Lottery
              </Link>
              <Link
                to="/games/aviator"
                className="text-primary hover:text-primary/80 underline"
              >
                Aviator Game
              </Link>
              <Link
                to="/games/double-trouble"
                className="text-primary hover:text-primary/80 underline"
              >
                Double Trouble
              </Link>
              <Link
                to="/leaderboard"
                className="text-primary hover:text-primary/80 underline"
              >
                Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
