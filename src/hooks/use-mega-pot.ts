
"use client";

import { useState, useCallback } from "react";
import { megaPot as initialPotValue } from "@/lib/dummy-data";

export const useMegaPot = () => {
  const [pot, setPot] = useState<number>(initialPotValue);
  const [isLoaded, setIsLoaded] = useState(true);

  const setPotValue = useCallback((newPot: number) => {
    setPot(newPot);
  }, []);

  return { pot, setPot: setPotValue, isLoaded };
};
