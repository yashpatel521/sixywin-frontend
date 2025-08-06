import { useState, useEffect } from "react";
import { wsClient } from "@/websocket";
import { MESSAGE_TYPES } from "@/websocket/constants";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { User } from "@/lib/interfaces";

// Define the ticket interface to match server response
interface ServerTicket {
  id: number;
  numbers: number[];
  createdAt: string;
  bid: number;
  result: "win" | "loss" | "pending" | "megaPot";
  matchedNumbers?: number[];
  coinsWon: number;
  drawDate?: string;
  drawResult?: {
    id: number;
    winningNumbers: number[];
    drawDate: string;
    nextDrawDate: string;
    createdAt: string;
  };
}

// Convert server ticket to frontend format
interface TicketHistory {
  id: string;
  date: string;
  userNumbers: number[];
  winningNumbers: number[];
  matches: number;
  coinsWon: number;
  bid: number;
  result: "win" | "loss" | "pending" | "megaPot";
  drawId?: number;
  drawDate?: string;
}

export const useTicketHistory = (targetUserId?: number) => {
  const [tickets, setTickets] = useState<TicketHistory[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user] = useLocalStorage<User | null>("user", null);

  // Determine which user ID to use
  const effectiveUserId = targetUserId || user?.id;

  // Convert server ticket format to frontend format
  const convertServerTicket = (serverTicket: ServerTicket): TicketHistory => {
    const winningNumbers =
      serverTicket.drawResult?.winningNumbers ||
      serverTicket.matchedNumbers ||
      [];

    return {
      id: serverTicket.id.toString(),
      date: serverTicket.createdAt,
      userNumbers: serverTicket.numbers,
      winningNumbers: winningNumbers,
      matches: serverTicket.matchedNumbers?.length || 0,
      coinsWon: serverTicket.coinsWon,
      bid: serverTicket.bid,
      result: serverTicket.result,
      drawId: serverTicket.drawResult?.id,
      drawDate: serverTicket.drawResult?.drawDate,
    };
  };

  // Fetch tickets function - SIMPLE with retry limit
  const fetchTickets = (retryCount = 0) => {
    if (!effectiveUserId) {
      setTickets([]);
      setIsLoaded(true);
      return;
    }

    if (!wsClient.isConnected()) {
      if (retryCount < 3) {
        setTimeout(() => {
          fetchTickets(retryCount + 1);
        }, 1000);
      } else {
        setTickets([]);
        setIsLoaded(true);
      }
      return;
    }

    setIsLoaded(false);

    const requestId = Math.random().toString(36).substring(7);

    // One-time response handler
    const handleResponse = (message: any) => {
      if (
        message.type === "getTickets_response" &&
        message.requestId === requestId
      ) {
        wsClient.off("getTickets_response", handleResponse);

        const serverTickets = message.payload;

        if (Array.isArray(serverTickets)) {
          const convertedTickets = serverTickets.map(convertServerTicket);
          setTickets(convertedTickets);
        } else {
          setTickets([]);
        }
        setIsLoaded(true);
      }
    };

    wsClient.on("getTickets_response", handleResponse);

    // Send request
    wsClient.send({
      type: MESSAGE_TYPES.GET_TICKETS,
      requestId,
      payload: { userId: effectiveUserId },
      timestamp: new Date().toISOString(),
    });

    // Timeout cleanup
    setTimeout(() => {
      wsClient.off("getTickets_response", handleResponse);
      setIsLoaded(true);
    }, 10000);
  };

  // Refresh function - SIMPLE
  const refreshTickets = () => {
    fetchTickets();
  };

  // Load tickets when user changes - ONLY HERE
  useEffect(() => {
    if (effectiveUserId) {
      // Add a small delay to ensure WebSocket is connected on initial load
      setTimeout(() => {
        fetchTickets();
      }, 100);
    }
  }, [effectiveUserId]);

  // Event listeners - SIMPLE
  useEffect(() => {
    const handleUserDataChanged = () => {
      setTimeout(refreshTickets, 100);
    };

    const handleTicketSubmitted = () => {
      setTimeout(refreshTickets, 500);
    };

    window.addEventListener("userDataChanged", handleUserDataChanged);
    window.addEventListener("ticketSubmitted", handleTicketSubmitted);

    return () => {
      window.removeEventListener("userDataChanged", handleUserDataChanged);
      window.removeEventListener("ticketSubmitted", handleTicketSubmitted);
    };
  }, []);

  return {
    history: tickets,
    isLoaded,
    refreshTickets,
  };
};
