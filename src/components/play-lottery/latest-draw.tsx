
"use client";

import { useMemo } from "react";
import { useHistory } from "@/hooks/use-history";
import { Award } from "lucide-react";

export const LatestDrawNumbers = () => {
    const { history } = useHistory();
    const latestWinningNumbers = useMemo(() => history.length > 0 ? history[0].winningNumbers : [5, 12, 23, 31, 42, 49], [history]);

    return (
        <div className="flex-1 text-center">
            <div className="text-sm font-semibold text-muted-foreground flex items-center justify-center gap-2">
                <Award className="h-4 w-4" />
                Latest Winning Numbers
            </div>
            <div className="flex justify-center gap-2 mt-2">
                {latestWinningNumbers.map((num, i) => (
                    <div key={i} className="h-8 w-8 flex items-center justify-center font-bold text-sm rounded-full bg-secondary text-secondary-foreground shadow-inner">
                        {num}
                    </div>
                ))}
            </div>
        </div>
    )
}
