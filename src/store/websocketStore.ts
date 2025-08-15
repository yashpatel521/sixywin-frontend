import { create } from "zustand";
import type {
  User,
  Ticket,
  UserProfile,
  MegaPot,
  latestDraw,
  CreateTicket,
  DoubleTroubleDrawResult,
  RegisterResponsePayload,
  AviatorDrawResult,
  AviatorCountdown,
  AviatorTicket,
} from "../libs/interfaces";
import { AVIATOR_COUNTDOWN_TIMER } from "@/libs/constants";

interface WebSocketState {
  isConnected: boolean;
  lastMessage: string | null;
  messages: string[];
  user: User | null;
  token: string | null;
  tickets: Ticket[]; // New state for tickets
  leaderboard: User[]; // New state for leaderboard
  userProfile: UserProfile | null;
  megaPot: MegaPot | null;
  latestDraw: latestDraw | null;
  createTicket: CreateTicket | null;
  doubleTroubleDrawResult: DoubleTroubleDrawResult | null; // New state for double trouble draw result
  register: RegisterResponsePayload | null;
  errorMessage: string | null;
  aviatorDrawResult: AviatorDrawResult | null;
  aviatorCountdown: AviatorCountdown;
  userHistoryAviatorBets: AviatorTicket[];
  connect: () => void;
  disconnect: () => void;
  sendMessage: (type: string, payload: unknown) => void;
  setConnected: (connected: boolean) => void;
  setLastMessage: (message: string | null) => void;
  addMessage: (message: string) => void;
  messageHandlers: Map<string, (payload: unknown) => void>;
  registerHandler: (type: string, handler: (payload: unknown) => void) => void;
  setRegister: (register: RegisterResponsePayload | null) => void; // New action for register
  setUserData: (user: User | null, token: string | null) => void;
  updateUserData: (user: User | null) => void;
  setTickets: (tickets: Ticket[]) => void; // New action for tickets
  setLeaderboard: (leaderboard: User[]) => void; // New action for leaderboard
  setUserProfile: (profile: UserProfile | null) => void;
  setMegaPot: (megaPot: MegaPot | null) => void; // New action for megaPot
  setLatestDraw: (latestDraw: latestDraw | null) => void; // New action for latestDraw
  setCreateTicket: (createTicket: CreateTicket | null) => void; // New action for createTicket
  setDoubleTroubleDrawResult: (
    doubleTroubleDrawResult: DoubleTroubleDrawResult | null
  ) => void; // New action for doubleTroubleDrawResult
  setAviatorDrawResult: (aviatorDrawResult: AviatorDrawResult | null) => void;
  setAviatorCountdown: (aviatorCountdown: AviatorCountdown) => void;
  setUserHistoryAviatorBets: (
    updater: AviatorTicket[] | ((prev: AviatorTicket[]) => AviatorTicket[])
  ) => void;
  setErrorMessage: (errorMessage: string | null) => void; // New action for errorMessage
  logout: () => void;
}

export const useWebSocketStore = create<WebSocketState>((set) => {
  const initialUser = localStorage.getItem("user");
  const initialToken = localStorage.getItem("token");

  return {
    isConnected: false,
    lastMessage: null,
    messages: [],
    tickets: [], // Initialize tickets state
    user: initialUser ? JSON.parse(initialUser) : null,
    token: initialToken,
    messageHandlers: new Map(),
    leaderboard: [],
    userProfile: null,
    megaPot: null,
    latestDraw: null,
    createTicket: null,
    doubleTroubleDrawResult: null,
    register: null,
    errorMessage: null,
    aviatorDrawResult: null,
    aviatorCountdown: { countdown: AVIATOR_COUNTDOWN_TIMER },
    userHistoryAviatorBets: [],
    connect: () => {
      // This will be handled by react-use-websocket
    },
    disconnect: () => {
      // This will be handled by react-use-websocket
    },
    sendMessage: () => {
      // This will be handled by react-use-websocket
      // before sending clear errorMessage
      useWebSocketStore.getState().setErrorMessage(null);
    },
    setConnected: (connected: boolean) => set({ isConnected: connected }),
    setLastMessage: (message: string | null) => set({ lastMessage: message }),
    addMessage: (message: string) =>
      set((state) => ({ messages: [...state.messages, message] })),
    registerHandler: (type: string, handler: (payload: unknown) => void) =>
      set((state) => {
        const newHandlers = new Map(state.messageHandlers);
        newHandlers.set(type, handler);
        return { messageHandlers: newHandlers };
      }),
    setUserData: (user: User | null, token: string | null) => {
      set({ user, token });
      if (user && token) {
        //store user without password
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user;
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
        localStorage.setItem("token", token);
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    },
    updateUserData: (user: User | null) => {
      set({ user });
      if (user) {
        //store user without password
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPassword } = user;
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    },
    setTickets: (tickets: Ticket[]) => set({ tickets }), // Implement setTickets
    setLeaderboard: (leaderboard: User[]) => set({ leaderboard }), // Implement setLeaderboard
    setUserProfile: (profile: UserProfile | null) =>
      set({ userProfile: profile }), // Implement setUserProfile
    setMegaPot: (megaPot: MegaPot | null) => set({ megaPot }), // Implement setMegaPot
    setLatestDraw: (latestDraw: latestDraw | null) => set({ latestDraw }), // Implement setLatestDraw
    setCreateTicket: (createTicket: CreateTicket | null) =>
      set({ createTicket }), // Implement setCreateTicket
    setDoubleTroubleDrawResult: (
      doubleTroubleDrawResult: DoubleTroubleDrawResult | null
    ) => set({ doubleTroubleDrawResult }), // Implement setDoubleTroubleDrawResult
    setRegister: (register: RegisterResponsePayload | null) =>
      set({ register }), // Implement setRegister
    setErrorMessage: (errorMessage: string | null) => set({ errorMessage }), // Implement setErrorMessage
    setAviatorDrawResult: (aviatorDrawResult: AviatorDrawResult | null) =>
      set({ aviatorDrawResult }),
    setAviatorCountdown: (aviatorCountdown: AviatorCountdown) =>
      set({ aviatorCountdown }),
    setUserHistoryAviatorBets: (
      updater: AviatorTicket[] | ((prev: AviatorTicket[]) => AviatorTicket[])
    ) =>
      set((state) => {
        const newHistory =
          typeof updater === "function"
            ? (updater as (prev: AviatorTicket[]) => AviatorTicket[])(
                state.userHistoryAviatorBets
              )
            : updater;

        return { userHistoryAviatorBets: newHistory.slice(-5) }; // keep last 5
      }),
    logout: () => {
      set({
        user: null,
        token: null,
        register: null,
        tickets: [],
        createTicket: null,
        latestDraw: null,
        megaPot: null,
        userProfile: null,
        leaderboard: [],
        doubleTroubleDrawResult: null,
        aviatorDrawResult: null,
        aviatorCountdown: { countdown: AVIATOR_COUNTDOWN_TIMER },
        userHistoryAviatorBets: [],
        errorMessage: null,
      }); // Clear tickets on logout
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  };
});
