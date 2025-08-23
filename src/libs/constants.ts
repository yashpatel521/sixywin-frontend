export const IS_PRODUCTION = import.meta.env.PROD;

// Image assets with fallbacks for Vercel deployment
export const IMAGES = {
  logo: "/logo/logo7.png",
  hero: "/landing/landing1.png",
  redeem: "/img2.png",
  loginImage: "/auth/auth1.png",
  registerImage: "/auth/auth5.png",
  contactUsImage: "/others/contactUs3.png",
} as const;

export const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:5000"; // Replace with your WebSocket server URL
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const GOOGLE_ADSENSE_CLIENT =
  import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT || "";
export const ADS_ENABLED = import.meta.env.VITE_ADS_ENABLED === "true";
export const IS_DEVELOPMENT = import.meta.env.MODE === "development";
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

export const HMAC_SECRET =
  import.meta.env.VITE_HMAC_SECRET ||
  "sixywin-dev-secret-2025-change-in-production";

export const MAX_NUMBERS = 6;
export const TOTAL_NUMBERS = 49;
export const DRAW_INTERVAL_SECONDS = 30;
export const MAX_NUMBER_DOUBLE_TROUBLE = 30;
export const AVIATOR_COUNTDOWN_TIMER = 10;

export const AD_DURATION = 5; // seconds
export const REWARD_AMOUNT = 150;

export const prizes = [
  { value: 500, label: "500", text: "500" },
  { value: 0, label: "LOSE", text: "Oops" },
  { value: 100, label: "100", text: "100" },
  { value: 1000, label: "1000", text: "1000" },
  { value: 200, label: "200", text: "200" },
  { value: 100, label: "100", text: "100" },
  { value: 0, label: "LOSE", text: "Oops" },
  { value: 10000, label: "JACKPOT", text: "JACKPOT" },
];

export const segmentColors = ["#fde047", "#dc2626"];

/**
 * Application Version Information
 * Update this file on every release/deployment
 */

export const APP_VERSION = {
  VERSION: "1.4.0",

  BUILD_DATE: "2025-08-06",
  BUILD_NUMBER: "20250806-001",
  COMMIT_HASH: "latest", // Will be updated after push
  BRANCH: "development",
  ENVIRONMENT: import.meta.env.MODE || "development",
  WEBSOCKET_VERSION: "2.0", // Updated message type system
  API_VERSION: "v1",
  get FULL_VERSION() {
    return `${this.VERSION}-${this.BUILD_NUMBER}`;
  },

  get VERSION_INFO() {
    return {
      version: this.VERSION,
      buildDate: this.BUILD_DATE,
      environment: this.ENVIRONMENT,
      commit: this.COMMIT_HASH,
      websocketVersion: this.WEBSOCKET_VERSION,
    };
  },
} as const;
