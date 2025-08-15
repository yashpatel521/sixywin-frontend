import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Icons } from "@/components/ui/icons";

const sectionContent = {
  title: "Ready to Try Your Luck?",
  description:
    "Join thousands of players enjoying the daily draw. Your lucky numbers could be next!",
  buttonText: "Sign Up and Play Now",
};

export function CtaSection() {
  return (
    <section className="mt-20 md:mt-32 text-center bg-card/50 backdrop-blur-lg border border-white/10 rounded-2xl p-8 md:p-16">
      <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4 text-foreground">
        {sectionContent.title}
      </h2>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
        {sectionContent.description}
      </p>
      <Button
        asChild
        size="lg"
        className="animation-all hover:scale-105 active:scale-95"
      >
        <Link to="/register">
          {sectionContent.buttonText}{" "}
          <Icons.arrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
    </section>
  );
}
