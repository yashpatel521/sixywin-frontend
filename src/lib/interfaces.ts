// =================================================================
// Base Types and Enums
// =================================================================

export type GameResult = "win" | "loss" | "pending" | "megaPot";
export type BetDirection = "under" | "over";

// =================================================================
// Core User and Game Interfaces
// =================================================================

// Base user structure - reusable across all interfaces
export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  avatar: string;
  refernceId: string;
  coins: number;
  totalWon: number;
  winningAmount: number;
  isBot: boolean;
  isSpinned?: boolean;
  createdAt: Date;
  updatedAt: Date;
  token?: string;
  // Leaderboard-specific fields
  todayTicketBuy?: string | number;
  todayBid?: string | number;
  referrals?: Reference[];
  // Legacy support
  adEarnings?: number;
}

// Simplified user for leaderboard display (combines User + LeaderboardPlayer + UserData)
export interface LeaderboardUser {
  id: number;
  username: string;
  avatar: string;
  coins: number;
  totalWon: number;
  todayBid: string | number;
  todayTicketBuy: string | number;
  rank?: number; // For ranked displays
}

export interface Reference {
  id: number;
  referrer: User;
  referred: User;
  createdAt: Date;
  // Legacy support
  username?: string;
  joinDate?: string;
}

// Unified ticket interface (combines Ticket + LegacyTicket + ServerTicket)
export interface GameTicket {
  id: number | string;
  numbers: number[];
  userNumbers?: number[]; // Legacy support
  createdAt: Date | string;
  date?: string; // Legacy support
  bid: number;
  result: GameResult;
  matchedNumbers?: number[];
  winningNumbers?: number[]; // For legacy compatibility
  matches?: number; // For legacy compatibility
  coinsWon: number;
  drawDate?: Date | string;
  drawId?: number;
  user?: User;
  drawResult?: {
    id: number;
    winningNumbers: number[];
    drawDate: string;
    nextDrawDate: string;
    createdAt: string;
  };
}

// User without isBot field for API responses
export type ApiUser = Omit<User, "isBot">;

// Form data interfaces
export interface LoginFormData {
  emailOrUsername: string;
  password: string;
  remember?: boolean;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  referralId?: string;
}

// Hook return type interfaces
// Base hook return pattern
export interface BaseHookReturn {
  isLoading: boolean;
  error: string | null;
}

export interface BaseHookWithDataReturn<T> extends BaseHookReturn {
  data: T | null;
  refetch: () => void;
}

export interface UseLoginReturn extends BaseHookReturn {
  error: string; // Override to make non-nullable for login
  login: (formData: LoginFormData, rememberMe: boolean) => Promise<boolean>;
}

export interface UseRegisterReturn extends BaseHookReturn {
  error: string; // Override to make non-nullable for register
  isPasswordValid: boolean;
  register: (formData: RegisterFormData) => Promise<boolean>;
  validatePasswords: (password: string, confirmPassword: string) => void;
}

export interface UseUserProfileReturn extends BaseHookReturn {
  userData: User | null;
  referredUsers: User[];
  isUserNotFound: boolean;
  refetch: () => void;
}

export interface UseTicketSubmissionReturn extends BaseHookReturn {
  isSubmitting: boolean;
  submitTicket: (numbers: number[], bidAmount: number) => Promise<boolean>;
  showConfetti: boolean;
  setShowConfetti: (show: boolean) => void;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

// Base response interface
export interface BaseResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

// Auth response interfaces
export interface LoginResponse extends BaseResponse {
  data: {
    token: string;
    user: ApiUser;
  };
}

export interface RegisterResponse extends BaseResponse {
  data: {
    token: string;
    user: ApiUser;
  };
}

// Leaderboard and game interfaces
export interface LeaderboardResponse extends BaseResponse {
  data: User[];
}

export interface TicketResponse extends BaseResponse {
  data: GameTicket;
}

export interface TicketsResponse extends BaseResponse {
  data: GameTicket[];
}

export interface GameResultResponse extends BaseResponse {
  data: {
    winningNumbers: number[];
    winners: User[];
    totalWinnings: number;
  };
}

// Draw interfaces
export interface DrawResult {
  id: number;
  winningNumbers: number[];
  drawDate: Date;
  createdAt: Date;
}

export interface LatestDrawData {
  winningNumbers: number[];
  drawDate: string;
  totalWinners: number;
  totalPrize: number;
  nextDrawTime: string | Date;
}

export interface CountdownState {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface UseLatestDrawReturn
  extends BaseHookWithDataReturn<LatestDrawData> {
  latestDraw: LatestDrawData | null; // Keep for backward compatibility
  countdown: CountdownState;
}

// MegaPot related interfaces
export interface MegaPotData {
  id: number;
  amount: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isWon: boolean;
  winnerId: number;
  nextDrawDate: string;
}

export interface UseMegaPotReturn extends BaseHookWithDataReturn<MegaPotData> {
  // All properties inherited from BaseHookWithDataReturn
}

// Leaderboard related interfaces
export interface UseLeaderboardReturn extends BaseHookReturn {
  players: LeaderboardUser[];
  isUpdating: boolean;
  refetch: () => void;
}

// Ticket History related interfaces
export interface UseTicketHistoryReturn extends BaseHookReturn {
  history: GameTicket[];
  refreshTickets: () => void;
}

export interface UseSpinWheelReturn extends BaseHookReturn {
  isSpinning: boolean;
  rotation: number;
  user: User | null;
  hasSpunToday: boolean;
  spin: (prizeValue: number) => void;
  setRotation: (rotation: number) => void;
}

// WebSocket related interfaces
export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
  requestId?: string;
}

// =================================================================
// Component Props and Double Trouble Game Types
// =================================================================

export interface CountdownTimerProps {
  nextDrawDate: Date;
  label: string;
}

export type LegacyDrawResult = {
  number: number;
  outcome: "win" | "loss" | "jackpot";
};

export type PlacedBet = {
  direction: BetDirection | null;
  bid: number;
};

export type PlacedNumberBet = {
  number: number;
  bid: number;
};

export interface CurrentBetsProps {
  overUnderBets: PlacedBet[];
  numberBets: PlacedNumberBet[];
}

// =================================================================
// Legacy Type Aliases (for backward compatibility)
// =================================================================

// These provide backward compatibility for components using old interface names
export type Ticket = GameTicket;
export type TicketHistory = GameTicket;
export type ServerTicket = GameTicket;
export type LegacyTicket = GameTicket;
export type LeaderboardPlayer = LeaderboardUser;
export type Leader = LeaderboardUser;
export type UserData = User;
export type Referral = Reference;

// Legacy interfaces for external components (e.g., redemption system)
export interface Coupon {
  id: string;
  brand: string;
  title: string;
  description: string;
  cost: number;
  icon: React.ReactNode;
}
