
"use client";

import { useState, useEffect } from "react";
import { differenceInSeconds } from "date-fns";
import { Timer } from "lucide-react";
import { CountdownTimerProps } from "@/lib/types";

const formatTime = (time: number) => time.toString().padStart(2, '0');

export const CountdownTimer = ({ nextDrawDate, label }: CountdownTimerProps) => {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

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
            <div className="text-sm font-semibold text-muted-foreground flex items-center justify-center gap-2">
                <Timer className="h-4 w-4" />
                {label}
            </div>
            <div className="flex justify-center items-center gap-1 mt-2">
                <span className="h-8 w-8 flex items-center justify-center font-bold text-sm rounded-full bg-secondary text-secondary-foreground shadow-inner">{formatTime(timeLeft.hours)}</span>
                <span className="font-bold text-primary">:</span>
                <span className="h-8 w-8 flex items-center justify-center font-bold text-sm rounded-full bg-secondary text-secondary-foreground shadow-inner">{formatTime(timeLeft.minutes)}</span>
                <span className="font-bold text-primary">:</span>
                <span className="h-8 w-8 flex items-center justify-center font-bold text-sm rounded-full bg-secondary text-secondary-foreground shadow-inner">{formatTime(timeLeft.seconds)}</span>
            </div>
        </div>
    )
}
