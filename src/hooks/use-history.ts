
"use client";

import { useState, useCallback } from "react";
import { userTicketHistory } from "@/lib/dummy-data.tsx";
import { Ticket } from "@/lib/types";


export const useHistory = () => {
  const [history, setHistory] = useState<Ticket[]>(userTicketHistory);
  const [isLoaded] = useState(true);

  const addTicket = useCallback((ticketData: Omit<Ticket, "id" | "date">) => {
    setHistory((prevHistory) => {
      const newTicket: Ticket = {
        ...ticketData,
        id: new Date().toISOString() + Math.random(),
        date: new Date().toISOString(),
      };
      
      const updatedHistory = [newTicket, ...prevHistory];
      return updatedHistory;
    });
  }, []);
  
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  return { history, addTicket, isLoaded, clearHistory };
};
