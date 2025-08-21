import { create } from "zustand";
import type {
  User,
  Ticket,
  UserProfile,
  MegaPot,
  latestDraw,
  DoubleTroubleDrawResult,
  AviatorDrawResult,
  AviatorCountdown,
  AviatorTicket,
} from "../libs/interfaces";
import { AVIATOR_COUNTDOWN_TIMER } from "@/libs/constants";
import {
  clearUserProfile,
  getUserProfile,
  saveUserProfile,
} from "@/utils/storage";

interface WebSocketState {
  isConnected: boolean;
  lastMessage: string | null;
  messages: string[];
  user: User | null;
  token: string | null;
  tickets: Ticket[];
  leaderboard: User[];
  userProfile: UserProfile | null;
  megaPot: MegaPot | null;
  latestDraw: latestDraw | null;
  doubleTroubleDrawResult: DoubleTroubleDrawResult | null;
  errorMessage: string | null;
  aviatorDrawResult: AviatorDrawResult | null;
  aviatorCountdown: AviatorCountdown;
  userHistoryAviatorBets: AviatorTicket[];
  aviatorDrawHistory: AviatorDrawResult[];
  connect: () => void;
  disconnect: () => void;
  sendMessage: (type: string, payload: unknown) => void;
  setConnected: (connected: boolean) => void;
  setLastMessage: (message: string | null) => void;
  addMessage: (message: string) => void;
  messageHandlers: Map<string, (payload: unknown) => void>;
  registerHandler: (type: string, handler: (payload: unknown) => void) => void;
  setUserData: (user: User | null, token: string | null) => void;
  updateUserData: (user: User | null, token?: string) => void;
  setTickets: (tickets: Ticket[]) => void;
  setLeaderboard: (leaderboard: User[]) => void;
  setUserProfile: (profile: UserProfile | null) => void;
  setMegaPot: (megaPot: MegaPot | null) => void;
  setLatestDraw: (latestDraw: latestDraw | null) => void;
  setDoubleTroubleDrawResult: (
    doubleTroubleDrawResult: DoubleTroubleDrawResult | null
  ) => void;
  setAviatorDrawResult: (aviatorDrawResult: AviatorDrawResult | null) => void;
  setAviatorCountdown: (aviatorCountdown: AviatorCountdown) => void;
  setUserHistoryAviatorBets: (
    updater: AviatorTicket[] | ((prev: AviatorTicket[]) => AviatorTicket[])
  ) => void;
  setAviatorDrawHistory: (
    updater:
      | AviatorDrawResult[]
      | ((prev: AviatorDrawResult[]) => AviatorDrawResult[])
  ) => void;
  setErrorMessage: (errorMessage: string | null) => void;
  logout: () => void;
}

export const useWebSocketStore = create<WebSocketState>((set) => {
  const savedProfile = getUserProfile();

  return {
    isConnected: false,
    lastMessage: null,
    messages: [],
    tickets: [],
    user: savedProfile?.user || null,
    token: savedProfile?.token || null,
    leaderboard: [],
    userProfile: null,
    megaPot: null,
    latestDraw: null,
    createTicket: null,
    doubleTroubleDrawResult: null,
    errorMessage: null,
    aviatorDrawResult: null,
    aviatorCountdown: { countdown: AVIATOR_COUNTDOWN_TIMER },
    userHistoryAviatorBets: [],
    aviatorDrawHistory: [],
    messageHandlers: new Map(),
    connect: () => {},
    disconnect: () => {},
    sendMessage: () => set({ errorMessage: null }),
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
        saveUserProfile(userWithoutPassword, token);
      } else {
        clearUserProfile();
      }
    },
    updateUserData: (user: User | null, token?: string) =>
      set((state) => {
        const newToken = token ?? state.token;
        if (user && newToken) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...userWithoutPassword } = user;
          saveUserProfile(userWithoutPassword, newToken);
        }
        return { user, token: newToken };
      }),
    setTickets: (tickets: Ticket[]) => set({ tickets }),
    setLeaderboard: (leaderboard: User[]) => set({ leaderboard }),
    setUserProfile: (profile: UserProfile | null) =>
      set({ userProfile: profile }),
    setMegaPot: (megaPot: MegaPot | null) => set({ megaPot }),
    setLatestDraw: (latestDraw: latestDraw | null) => set({ latestDraw }),
    setDoubleTroubleDrawResult: (
      doubleTroubleDrawResult: DoubleTroubleDrawResult | null
    ) => set({ doubleTroubleDrawResult }),
    setAviatorDrawResult: (aviatorDrawResult: AviatorDrawResult | null) =>
      set({ aviatorDrawResult }),
    setAviatorCountdown: (aviatorCountdown: AviatorCountdown) =>
      set({ aviatorCountdown }),
    setUserHistoryAviatorBets: (updater) =>
      set((state) => {
        const newHistory =
          typeof updater === "function"
            ? (updater as (prev: AviatorTicket[]) => AviatorTicket[])(
                state.userHistoryAviatorBets
              )
            : updater;
        return {
          userHistoryAviatorBets: newHistory.slice(-5),
        };
      }),
    setAviatorDrawHistory: (updater) =>
      set((state) => {
        const newHistory =
          typeof updater === "function"
            ? (updater as (prev: AviatorDrawResult[]) => AviatorDrawResult[])(
                state.aviatorDrawHistory
              )
            : updater;
        return {
          aviatorDrawHistory: newHistory.slice(-5),
        };
      }),

    setErrorMessage: (errorMessage: string | null) => set({ errorMessage }),
    logout: () => {
      set({
        user: null,
        token: null,
        tickets: [],
        latestDraw: null,
        megaPot: null,
        userProfile: null,
        leaderboard: [],
        doubleTroubleDrawResult: null,
        aviatorDrawResult: null,
        aviatorCountdown: { countdown: AVIATOR_COUNTDOWN_TIMER },
        userHistoryAviatorBets: [],
        errorMessage: null,
      });
      clearUserProfile();
    },
  };
});
