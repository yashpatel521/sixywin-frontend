import { cn } from "@/libs/utils";

export function NumberGrid({
  numberGrid,
  selectedNumbers,
  placedNumberBets,
  onNumberClick,
}: {
  numberGrid: number[];
  selectedNumbers: number[];
  placedNumberBets: { number: number; result?: string }[];
  onNumberClick: (num: number) => void;
}) {
  return (
    <div className="grid grid-cols-10 gap-2">
      {numberGrid.map((num) => {
        const isSelected = selectedNumbers.includes(num);
        // Only consider bets that are still pending
        const isPlaced = placedNumberBets.some(
          (bet) => bet.number === num && bet.result === "pending"
        );

        let bgClass = "bg-background/50 border";
        if (isSelected) {
          bgClass = "bg-accent text-accent-foreground shadow-md scale-110";
        } else if (isPlaced) {
          bgClass = "bg-secondary";
        }

        return (
          <button
            key={num}
            onClick={() => onNumberClick(num)}
            className={cn(
              "h-10 w-10 flex items-center justify-center rounded-full text-sm font-medium transition-all",
              bgClass
            )}
          >
            {num}
          </button>
        );
      })}
    </div>
  );
}
