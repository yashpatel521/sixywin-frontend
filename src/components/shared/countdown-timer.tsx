import { useState, useEffect } from "react";
import { differenceInSeconds } from "date-fns";
import { CountdownTimerProps } from "@/libs/interfaces";

const formatTime = (time: number) => time.toString().padStart(2, "0");

export const CountdownTimer = ({
  nextDrawDate,
  label,
}: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const secondsTotal = differenceInSeconds(nextDrawDate, now);

      if (secondsTotal <= 0) {
        return { hours: 0, minutes: 0, seconds: 0 };
      }

      const hours = Math.floor(secondsTotal / 3600);
      const minutes = Math.floor((secondsTotal % 3600) / 60);
      const seconds = secondsTotal % 60;

      return { hours, minutes, seconds };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [nextDrawDate]);

  return (
    <div className="flex-1 text-center">
      {label && (
        <div className="text-sm font-semibold text-muted-foreground mb-1">
          {label}
        </div>
      )}

      <div className="flex justify-center items-center gap-1 mt-1 md:mt-2">
        <span className="h-6 w-6 md:h-8 md:w-8 flex items-center justify-center font-bold text-xs md:text-sm rounded-full bg-secondary text-secondary-foreground shadow-inner">
          {formatTime(timeLeft.hours)}
        </span>
        <span className="font-bold text-primary text-xs md:text-sm">:</span>
        <span className="h-6 w-6 md:h-8 md:w-8 flex items-center justify-center font-bold text-xs md:text-sm rounded-full bg-secondary text-secondary-foreground shadow-inner">
          {formatTime(timeLeft.minutes)}
        </span>
        <span className="font-bold text-primary text-xs md:text-sm">:</span>
        <span className="h-6 w-6 md:h-8 md:w-8 flex items-center justify-center font-bold text-xs md:text-sm rounded-full bg-secondary text-secondary-foreground shadow-inner">
          {formatTime(timeLeft.seconds)}
        </span>
      </div>
    </div>
  );
};
