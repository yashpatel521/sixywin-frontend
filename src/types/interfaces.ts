// User related interfaces
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

// Auth related interfaces
export interface AuthState {
  user: User | null;
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

// Navigation interfaces
export interface NavItem {
  label: string;
  path: string;
  icon?: string;
  requiresAuth?: boolean;
}
