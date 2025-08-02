import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Icons } from "./icons";

export function StickyAdBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 p-2 md:p-4 transition-transform duration-500 ease-in-out transform-gpu",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="container mx-auto">
        <div className="relative glassmorphism rounded-lg shadow-2xl p-2 pr-10 md:p-3 md:pr-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 md:gap-4">
            <img
              src="https://placehold.co/80x80.png"
              alt="Advertisement"
              width={50}
              height={50}
              className="rounded-md object-cover hidden sm:block"
              data-ai-hint="advertisement banner"
            />
            <div className="flex flex-col">
              <span className="text-sm md:text-base font-bold text-primary">
                Sponsored Content
              </span>
              <p className="text-xs md:text-sm text-muted-foreground">
                Check out this amazing offer from our partners!
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="animation-all hover:scale-105 active:scale-95"
          >
            Learn More
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6 rounded-full"
            onClick={() => setIsVisible(false)}
          >
            <Icons.x className="h-4 w-4" />
            <span className="sr-only">Close Ad</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
