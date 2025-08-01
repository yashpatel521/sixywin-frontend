
import type { LucideProps } from 'lucide-react';

// =================================================================
// App Data
// =================================================================

export interface Ticket {
  id: string;
  date: string;
  userNumbers: number[];
  winningNumbers: number[];
  matches: number;
  coinsWon: number;
  bid: number;
}

export interface Leader {
  id: string;
  rank: number;
  player: string;
  coins: number;
  todaysBid: number;
}

export interface UserData {
    username: string,
    email: string,
    coins: number,
    adEarnings: number,
}

export interface Referral {
    username: string;
    joinDate: string;
}

export interface RedeemHistoryItem {
    id: string;
    date: string;
    brand: string;
    coupon: string;
    coinsSpent: number;
    icon: React.ReactNode;
}

export interface Coupon {
    id: string;
    brand: string;
    title: string;
    description: string;
    cost: number;
    icon: React.ReactNode;
}

// =================================================================
// Component Props
// =================================================================

export interface TopLeadersProps {
  leaders: Leader[];
}

export interface MegaPotProps {
  nextDrawDate: Date;
}

export interface TicketSubmissionProps {
    nextDrawDate: Date;
}

export interface CountdownTimerProps {
    nextDrawDate: Date;
    label: string;
}

export interface HeaderProps {
    isAuthenticated?: boolean;
}

// =================================================================
// Double Trouble Game Types
// =================================================================
export type BetDirection = "under" | "over";

export type DrawResult = { number: number; outcome: "win" | "loss" | "jackpot" };

export type PlacedBet = {
    direction: BetDirection | null;
    bid: number;
}
export type PlacedNumberBet = {
    number: number;
    bid: number;
}

export interface CurrentBetsProps {
    overUnderBets: PlacedBet[];
    numberBets: PlacedNumberBet[];
}

    
