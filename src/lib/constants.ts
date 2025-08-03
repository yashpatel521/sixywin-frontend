export const MAX_NUMBERS = 6;
export const TOTAL_NUMBERS = 49;
export const DRAW_INTERVAL_SECONDS = 30;

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

// Image assets
export const IMAGES = {
  logo: "/logo.png",
  hero: "/img1.png",
  redeem: "/img2.png",
  loginImage: "/img1.png",
} as const;
