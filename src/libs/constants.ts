export const IS_PRODUCTION = import.meta.env.PROD;

// Image assets with fallbacks for Vercel deployment
export const IMAGES = {
  thumbnail: "/logo/logo10.png",
  logo: "/logo/logo7.png",
  hero: "/landing/landing7.png",
  redeem: "/landing/lottery2.png",
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
export const MEGAPOT_AMOUNT = +import.meta.env.VITE_MEGAPOT_AMOUNT || 10;

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

// Double Trouble Payouts
export const doubleTroublePayouts = {
  exact: 50,
  over: 2,
  under: 2,
  number: 10,
};

// Winning multipliers for matches
export const WINNING_MULTIPLIERS: Record<number, number> = {
  6: 100000,
  5: 1000,
  4: 50,
  3: 5,
  2: 2,
};
