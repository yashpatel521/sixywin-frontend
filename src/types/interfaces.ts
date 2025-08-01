// User related interfaces
export interface UserType {
  id: string;
  username: string;
  email: string;
  coins: number;
  totalWon: number;
  winningAmount: number;
  refernceId: string;
  avatar?: string;
  createdAt: string;
}

// Auth related interfaces
export interface AuthState {
  user: UserType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
}

export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

// API related interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// WebSocket related interfaces
export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
  requestId?: string;
}
