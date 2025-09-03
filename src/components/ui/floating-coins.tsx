import { useEffect, useState } from "react";

type CoinStyle = {
  left: string;
  top: string;
  animationDuration: string;
  animationDelay: string;
};

export function FloatingCoins({ count = 15 }: { count?: number }) {
  const [coins, setCoins] = useState<CoinStyle[]>([]);

  useEffect(() => {
    const newCoins = Array.from({ length: count }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 5 + 5}s`,
      animationDelay: `${Math.random() * 2}s`,
    }));
    setCoins(newCoins);
  }, [count]);

  return (
    <>
      {coins.map((style, i) => (
        <div 
          key={i}
          className="absolute w-4 h-4 rounded-full bg-yellow-400 shadow-md animate-float"
          style={style}
        />
      ))}
    </>
  );
}
