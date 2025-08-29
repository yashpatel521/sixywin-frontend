import { ReactNode } from "react";

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "game";
  structuredData?: object;
  robots?: string;
}

export interface WebSocketMessage<T = unknown> {
  type: string;
  payload: T;
}

export interface User {
  id: number;
  email: string;
  username: string;
  password?: string;
  googleId?: string;
  avatar: string;
  referenceId: string;
  coins: number;
  totalWon: number;
  winningAmount: number;
  todaysBids: number;
  isBot: boolean;
  isSpinned?: boolean;
  createdAt: string;
  updatedAt: string;
  token?: string;
  referrals?: Referral[];
  todayTicketBuy?: string | number;
  todayBid?: string | number;
  adEarnings?: number;
}

export type GooglePayload = {
  email: string;
  username: string;
  avatar: string;
  googleId: string; // Google user ID
};

export interface Referral {
  id: number;
  createdAt: string;
  referred: User;
}

export interface SpinWheelResponsePayload {
  success: boolean;
  message: string;
  data: User & { amount: number };
}

export interface UserProfile {
  user: User;
  referredUsers: User[];
}

export interface UpdatedUserResponsePayload {
  success: boolean;
  message?: string;
  data: {
    user: User;
  };
}

export interface GetUserProfileResponsePayload {
  success: boolean;
  message?: string;
  data: UserProfile;
}

export interface GameCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  href: string;
  disabled?: boolean;
  buttonText: string;
}

// Lottery Ticket Interface
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

export interface latestDraw {
  id: number;
  totalPrize: number;
  totalWinners: number;
  winningNumbers: number[];
  nextDrawDate: string | Date;
  drawDate: string | Date;
  createdAt: string | Date;
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

// DoubleTrouble Ticket Interface
export type GameResult = "win" | "loss" | "pending" | "megaPot";
export type drawType = "Under" | "Over" | "Exact" | "Number";

export interface DoubleTroubleDraw {
  id: number;
  winningNumbers: number;
  nextDrawTime: string | Date;
  createdAt: string | Date;
}

export interface DoubleTroubleStatus {
  current: DoubleTroubleDraw | null;
  history: DoubleTroubleDraw[];
}

export interface DoubleTroubleStatusResponsePayload {
  success: boolean;
  message?: string;
  data: DoubleTroubleStatus;
}

export interface DoubleTroubleTicket {
  id: number;
  drawType: drawType;
  bidAmount: number;
  number: number;
  status: GameResult;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Aviator Ticket Interface
export interface AviatorTicket {
  id: string;
  amount: number;
  amountWon: number;
  cashOutMultiplier: number;
  outcome: "win" | "loss" | "pending";
  createdAt: string | Date;
}

export interface AviatorDrawResult {
  id: number;
  roundId: string; // Unique identifier for the round
  crashMultiplier: number | null; // Set at end of round
  status: "ongoing" | "finished"; // Current status of the draw
  startedAt: string | Date; // Start time of the round
  endedAt: string | Date | null; // End time of the round, null if ongoing
  createdAt: string | Date; // Creation time of the draw
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

export interface CashOutAviatorTicketResponsePayload {
  success: boolean;
  message?: string;
  data: {
    user: User;
    aviatorBidSave: AviatorTicket;
  };
}
