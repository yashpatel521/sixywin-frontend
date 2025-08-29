import { create } from "zustand";
import type {
  User,
  Ticket,
  UserProfile,
  latestDraw,
  AviatorDrawResult,
  AviatorCountdown,
  AviatorTicket,
  DoubleTroubleTicket,
  DoubleTroubleStatus,
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
  userProfile: UserProfile | null;
  errorMessage: string | null;

  // Lottery
  latestDraw: latestDraw | null;
  tickets: Ticket[];
  leaderboard: User[];

  // Double Trouble
  doubleTroubleHistory: DoubleTroubleStatus | null;
  doubleTroubleUserHistory: DoubleTroubleTicket[] | [];

  // Aviator
  aviatorDrawResult: AviatorDrawResult | null;
  aviatorCountdown: AviatorCountdown;
  userHistoryAviatorBets: AviatorTicket[];
  aviatorDrawHistory: AviatorDrawResult[];

  // WebSocket
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
  setLatestDraw: (latestDraw: latestDraw | null) => void;
  setDoubleTroubleHistory: (
    doubleTroubleHistory: DoubleTroubleStatus | null
  ) => void;
  setDoubleTroubleUserHistory: (
    updater:
      | DoubleTroubleTicket[]
      | ((prev: DoubleTroubleTicket[]) => DoubleTroubleTicket[])
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
    latestDraw: null,
    createTicket: null,
    doubleTroubleHistory: null,
    doubleTroubleUserHistory: [],
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
    setLatestDraw: (latestDraw: latestDraw | null) => set({ latestDraw }),
    setDoubleTroubleHistory: (
      doubleTroubleHistory: DoubleTroubleStatus | null
    ) => set({ doubleTroubleHistory }),
    setDoubleTroubleUserHistory: (updater) =>
      set((state) => {
        const newHistory =
          typeof updater === "function"
            ? (
                updater as (
                  prev: DoubleTroubleTicket[]
                ) => DoubleTroubleTicket[]
              )(state.doubleTroubleUserHistory)
            : updater;
        return {
          doubleTroubleUserHistory: newHistory.slice(0, 5),
        };
      }),
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
        userProfile: null,
        leaderboard: [],
        doubleTroubleHistory: null,
        aviatorDrawResult: null,
        aviatorCountdown: { countdown: AVIATOR_COUNTDOWN_TIMER },
        userHistoryAviatorBets: [],
        errorMessage: null,
      });
      clearUserProfile();
    },
  };
});
