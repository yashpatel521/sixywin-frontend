import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface BallStyle {
  top: string;
  left: string;
  animationName: string;
  animationDuration: string;
  animationDelay: string;
}

const animationNames = [
  "bounce-1",
  "bounce-2",
  "bounce-3",
  "bounce-4",
  "bounce-5",
  "bounce-6",
];

export function BouncingBalls() {
  const [isMounted, setIsMounted] = useState(false);
  const [ballStyles, setBallStyles] = useState<BallStyle[]>([]);
  const [ballNumbers, setBallNumbers] = useState<number[]>([]);

  useEffect(() => {
    setIsMounted(true);

    const styles: BallStyle[] = [];
    const numbers = new Set<number>();

    while (numbers.size < 6) {
      numbers.add(Math.floor(Math.random() * 49) + 1);
    }
    setBallNumbers(Array.from(numbers));

    for (let i = 0; i < 6; i++) {
      styles.push({
        top: `${Math.random() * 80}%`,
        left: `${Math.random() * 80}%`,
        animationName: animationNames[i % animationNames.length],
        animationDuration: `${Math.random() * 5 + 5}s`,
        animationDelay: `${Math.random() * 2}s`,
      });
    }
    setBallStyles(styles);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="absolute inset-0 -z-10 opacity-50">
      <div className="relative w-full h-full">
        {ballStyles.map((style, i) => (
          <div key={i} className={cn("bouncing-ball")} style={style}>
            {ballNumbers[i]}
          </div>
        ))}
      </div>
    </div>
  );
}
