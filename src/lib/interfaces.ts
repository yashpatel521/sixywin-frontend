// User-related interfaces and types

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
}

export interface Reference {
  id: number;
  referrer: User;
  referred: User;
  createdAt: Date;
}
export interface Ticket {
  id: number;
  numbers: number[];
  createdAt: Date;
  bid: number;
  result: "win" | "loss" | "pending";
  matchedNumbers?: number[];
  coinsWon: number;
  drawDate?: Date;
  user: User;
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
export interface BaseResponse {
  success: boolean;
  message: string;
  data?: unknown;
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

export interface UserProfileResponse extends BaseResponse {
  data: ApiUser;
}

// Leaderboard and game interfaces
export interface LeaderboardResponse extends BaseResponse {
  data: User[];
}

export interface TicketResponse extends BaseResponse {
  data: Ticket;
}

export interface TicketsResponse extends BaseResponse {
  data: Ticket[];
}

export interface GameResultResponse extends BaseResponse {
  data: {
    winningNumbers: number[];
    winners: User[];
    totalWinnings: number;
  };
}

export interface ReferralResponse extends BaseResponse {
  data: Array<{
    id: number;
    referred: User;
    createdAt: Date;
  }>;
}

// Stats interfaces
export interface TodayStatsResponse extends BaseResponse {
  data: {
    count: number;
    totalBid: number;
  };
}

export interface GlobalStatsResponse extends BaseResponse {
  data: {
    count: number;
    totalBid: number;
  };
}

// Draw interfaces
export interface DrawResult {
  id: number;
  winningNumbers: number[];
  drawDate: Date;
  createdAt: Date;
}

export interface LatestDrawResponse extends BaseResponse {
  data: DrawResult;
}
