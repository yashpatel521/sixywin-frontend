import { useState, useEffect, type CSSProperties } from "react";

type Ball = {
  num: number;
  style: CSSProperties;
};

const animationNames = [
  "bounce-1",
  "bounce-2",
  "bounce-3",
  "bounce-4",
  "bounce-5",
  "bounce-6",
];

const BALL_COUNT = 6;
const MAX_NUMBER = 49;

export function BouncingBalls() {
  const [balls, setBalls] = useState<Ball[]>([]);

  useEffect(() => {
    const uniqueNumbers = new Set<number>();
    while (uniqueNumbers.size < BALL_COUNT) {
      uniqueNumbers.add(Math.floor(Math.random() * MAX_NUMBER) + 1);
    }

    const nums = Array.from(uniqueNumbers);
    const generated: Ball[] = Array.from({ length: BALL_COUNT }, (_, i) => ({
      num: nums[i],
      style: {
        top: `${Math.random() * 80}%`,
        left: `${Math.random() * 80}%`,
        animationName: animationNames[i % animationNames.length],
        animationDuration: `${Math.random() * 5 + 5}s`,
        animationDelay: `${Math.random() * 2}s`,
      },
    }));

    setBalls(generated);
  }, []);

  if (balls.length === 0) {
    return null;
  }

  return (
    <div className="absolute inset-0 -z-10 opacity-50">
      <div className="relative w-full h-full">
        {balls.map((ball) => (
          <div key={ball.num} className="bouncing-ball" style={ball.style}>
            {ball.num}
          </div>
        ))}
      </div>
    </div>
  );
}
