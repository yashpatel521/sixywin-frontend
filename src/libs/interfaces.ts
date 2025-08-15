import { ReactNode } from "react";

export type ProtectedRoutesProps = {
  children: React.ReactNode;
  isProtected?: boolean;
};

export interface WebSocketMessage<T = unknown> {
  type: string;
  payload: T;
}

export interface UserUpdatePayload {
  userId: string;
  newStatus: string;
}

export interface ChatMessagePayload {
  sender: string;
  message: string;
  timestamp: number;
}

export interface User {
  id: number;
  email: string;
  username: string;
  password?: string;
  avatar: string;
  referenceId: string;
  coins: number;
  totalWon: number;
  winningAmount: number;
  isBot: boolean;
  isSpinned?: boolean;
  createdAt: string;
  updatedAt: string;
  token?: string;
  referrals?: Referral[];
  // Leaderboard-specific fields
  todayTicketBuy?: string | number;
  todayBid?: string | number;
  // Legacy support
  adEarnings?: number;
}

export interface LoginRequestPayload {
  emailOrUsername?: string;
  password?: string;
}

export interface Referral {
  id: number;
  createdAt: string;
  referred: User;
}

export interface LoginResponsePayload {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface RegisterResponsePayload {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface SpinWheelResponsePayload {
  success: boolean;
  message: string;
  data: User & { amount: number };
}

export interface CountdownTimerProps {
  nextDrawDate: string | Date;
  label?: string;
}

export interface Ticket {
  id: number;
  numbers: number[];
  createdAt: string;
  result: "win" | "loss" | "pending";
  matchedNumbers: number[];
  bid: number;
  coinsWon: number;
  drawDate: string;
  drawResult?: {
    winningNumbers?: number[];
  };
}

export interface GetTicketsResponsePayload {
  success: boolean;
  message?: string;
  data: Ticket[];
}

export interface GetLeaderboardResponsePayload {
  success: boolean;
  message?: string;
  data: User[];
}

export interface UserProfile {
  user: User;
  referredUsers: User[];
}

export interface GetUserProfileResponsePayload {
  success: boolean;
  message?: string;
  data: UserProfile;
}

export interface MegaPot {
  amount: number;
  createdAt: string;
  id: number;
  isActive: boolean;
  isWon: boolean;
  nextDrawDate: string;
  todayBids: number;
  todayWinnings: number;
  updatedAt: string;
  winnerId: number;
}

export interface GetMegaPotResponsePayload {
  success: boolean;
  message?: string;
  data: MegaPot;
}

export interface latestDraw {
  createdAt: string;
  drawDate: string;
  id: number;
  nextDrawDate: string;
  nextDrawTime: string;
  totalPrize: number;
  totalWinners: number;
  winningNumbers: number[];
}

export interface GetLatestDrawResponsePayload {
  success: boolean;
  message?: string;
  data: latestDraw;
}

export interface CreateTicket {
  bid: number;
  ticket: Ticket;
  user: User;
}

export interface CreateTicketResponsePayload {
  success: boolean;
  message?: string;
  data?: CreateTicket;
}

export interface GameCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  href: string;
  disabled?: boolean;
  buttonText: string;
}

export type PlacedBet = {
  direction: drawType | null;
  bid: number;
  result?: "win" | "lose" | "pending"; // add this
  drawsRemaining: number; // add this property
};

export type PlacedNumberBet = {
  number: number;
  bid: number;
  result?: "win" | "lose" | "pending"; // add this
  drawsRemaining: number; // add this property
};

export interface CurrentBetsProps {
  overUnderBets: PlacedBet[];
  numberBets: PlacedNumberBet[];
}

export type GameResult = "win" | "loss" | "pending" | "megaPot";
export type drawType = "Under" | "Over" | "Exact" | "Number";

export interface DoubleTroubleDrawResult {
  createdAt: string;
  id: number;
  nextDrawTime: string;
  winningNumbers: number;
}

export interface DoubleTroubleDrawResultPayload {
  success: boolean;
  message?: string;
  data: DoubleTroubleDrawResult;
}

export interface DoubleTroubleTicket {
  bidAmount: number;
  createdAt: string;
  drawType: string;
  id: number;
  status: string;
  updatedAt: string;
}

export interface CreateDoubleTroubleTicketResponsePayload {
  success: boolean;
  message?: string;
  data?: {
    ticket: DoubleTroubleTicket;
    user: User;
  };
}

export interface UpdatedUserResponsePayload {
  success: boolean;
  message?: string;
  data: {
    user: User;
  };
}

// =================================================================
// Aviator Game Types
// =================================================================

export interface AviatorDrawResult {
  id: number;
  roundId: string; // Unique identifier for the round
  crashMultiplier: number | null; // Set at end of round
  startedAt: string; // Start time of the round
  status: "ongoing" | "finished"; // Current status of the draw
  endedAt: string | null; // End time of the round, null if ongoing
  createdAt: string; // Creation time of the draw
}

export interface AviatorDrawResultResponsePayload {
  success: boolean;
  message?: string;
  data: AviatorDrawResult;
}

export interface AviatorCountdown {
  countdown: number;
}

export interface AviatorCountdownResponsePayload {
  success: boolean;
  message?: string;
  data: AviatorCountdown;
}

export interface AviatorTicket {
  id: string;
  amountWon: number;
  cashOutMultiplier: number;
  outcome: "win" | "loss" | "pending";
  createdAt: string;
}

export interface CashOutAviatorTicketResponsePayload {
  success: boolean;
  message?: string;
  data: {
    user: User;
    aviatorBidSave: AviatorTicket;
  };
}
