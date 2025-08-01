
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gift, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { prizes, segmentColors } from "@/lib/constants";

export function SpinWheel() {
    const [isSpinning, setIsSpinning] = useState(false);
    const [spun, setSpun] = useState(false);
    const [rotation, setRotation] = useState(0);
    const { toast } = useToast();

    const handleSpin = () => {
        if (spun) {
            toast({
                variant: "destructive",
                title: "Already Spun!",
                description: "You can spin the wheel once per day. Come back tomorrow!",
            });
            return;
        }

        const spinDegrees = Math.floor(Math.random() * 360) + 360 * 5; // Spin at least 5 times
        const finalRotation = rotation + spinDegrees;

        setIsSpinning(true);
        setRotation(finalRotation);

        setTimeout(() => {
            const segmentAngle = 360 / prizes.length;
            const normalizedRotation = finalRotation % 360;
            const pointerAngle = (270 - normalizedRotation + 360) % 360;
            const segmentIndex = Math.floor(pointerAngle / segmentAngle);
            const prize = prizes[segmentIndex];

            setIsSpinning(false);
            setSpun(true);
            
            if (prize.value > 0) {
                toast({
                    title: "You Won!",
                    description: `Congratulations! You won ${prize.label === 'JACKPOT' ? 'the JACKPOT' : ''} ${prize.value.toLocaleString()} coins.`,
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "So close!",
                    description: "Better luck next time. Try again tomorrow!",
                });
            }
        }, 4000);
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 space-y-8">
            <div className="relative w-80 h-80 flex items-center justify-center">
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 w-0 h-0 border-l-[15px] border-r-[15px] border-b-[25px] border-l-transparent border-r-transparent border-b-primary z-20 drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]" />
                
                {/* Wheel */}
                <div
                    className={cn(
                        "relative w-72 h-72 rounded-full border-[10px] border-yellow-300 bg-yellow-400 shadow-[inset_0_0_10px_rgba(0,0,0,0.5),0_0_20px_rgba(255,255,0,0.5)] transition-transform ease-out overflow-hidden",
                        isSpinning && 'duration-4000'
                    )}
                    style={{ transform: `rotate(${rotation}deg)` }}
                >
                    {/* Segments */}
                    <div className="absolute w-full h-full">
                        {prizes.map((_, index) => {
                            const angle = (360 / prizes.length) * index;
                            const segmentColor = segmentColors[index % 2];
                            return (
                                <div
                                    key={`segment-${index}`}
                                    className="absolute w-1/2 h-1/2 origin-bottom-right"
                                    style={{
                                        transform: `rotate(${angle}deg)`,
                                        clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 0)`,
                                    }}
                                >
                                    <div
                                        className="absolute w-full h-full"
                                        style={{
                                            background: segmentColor,
                                            transform: 'rotate(22.5deg) scale(1.5)',
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                     {/* Labels */}
                     <div className="absolute w-full h-full z-10">
                        {prizes.map((prize, index) => {
                            const angle = (360 / prizes.length) * index + (360 / prizes.length / 2);
                            const labelColor = index % 2 === 0 ? "#dc2626" : "#fde047";
                            return (
                                <div
                                    key={`label-${index}`}
                                    className="absolute w-full h-full flex items-start justify-center"
                                    style={{
                                        transform: `rotate(${angle}deg)`,
                                    }}
                                >
                                    <span
                                        className="text-lg font-bold"
                                        style={{
                                            color: labelColor,
                                            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                                            paddingTop: '1.5rem',
                                            display: 'inline-block',
                                            transform: `rotate(-${angle}deg)`
                                        }}
                                    >
                                        {prize.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Center Hub */}
                 <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5),inset_0_2px_2px_rgba(255,255,255,0.5)] border-4 border-yellow-300 z-10">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-inner" />
                </div>
            </div>

            <div className="w-full max-w-sm">
                <Button onClick={handleSpin} disabled={isSpinning || spun} size="lg" className="w-full animation-all hover:scale-105 active:scale-95 text-lg font-bold py-6">
                    {isSpinning ? <RefreshCw className="mr-2 h-5 w-5 animate-spin" /> : <Gift className="mr-2 h-5 w-5" />}
                    {spun ? "Spun Today" : "Spin to Win!"}
                </Button>
            </div>
        </div>
    );
}
