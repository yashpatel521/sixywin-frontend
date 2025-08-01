
import { Ticket, Leader, UserData, Referral, RedeemHistoryItem, Coupon } from "@/lib/types";
import { Icons } from "@/components/shared/icons";

export const currentUserData: UserData = {
    username: "Lucky Player",
    email: "player@lucky.break",
    coins: 30000,
    adEarnings: 150,
};

export const currentUserReferrals: Referral[] = [
    { username: "NewbieNick", joinDate: "2024-05-15T12:00:00Z" },
    { username: "CasualChris", joinDate: "2024-04-01T12:00:00Z" },
];

export const redeemHistory: RedeemHistoryItem[] = [
    { id: "redeem-1", date: "2024-07-15T10:00:00Z", brand: "Amazon", coupon: "$5 Gift Card", coinsSpent: 5000, icon: <Icons.amazon className="w-6 h-6" /> },
    { id: "redeem-2", date: "2024-07-10T14:30:00Z", brand: "Apple", coupon: "10% Off Purchase", coinsSpent: 10000, icon: <Icons.apple className="w-6 h-6" /> },
    { id: "redeem-3", date: "2024-06-25T18:00:00Z", brand: "Google Play", coupon: "$10 Credit", coinsSpent: 7500, icon: <Icons.googlePlay className="w-6 h-6" /> },
];

export const availableCoupons: Coupon[] = [
    { id: "coupon-1", brand: "Amazon", title: "$5 Gift Card", description: "Get a $5 gift card for your next Amazon purchase.", cost: 5000, icon: <Icons.amazon className="w-12 h-12" /> },
    { id: "coupon-2", brand: "Apple", title: "10% Off Purchase", description: "Save 10% on your next Apple Store purchase.", cost: 10000, icon: <Icons.apple className="w-12 h-12" /> },
    { id: "coupon-3", brand: "Google Play", title: "$10 Credit", description: "Enjoy $10 credit for apps, games, and more.", cost: 7500, icon: <Icons.googlePlay className="w-12 h-12" /> },
    { id: "coupon-4", brand: "Amazon", title: "$25 Gift Card", description: "A generous $25 gift card for anything on Amazon.", cost: 20000, icon: <Icons.amazon className="w-12 h-12" /> },
    { id: "coupon-5", brand: "Apple", title: "20% Off Accessories", description: "Get 20% off any accessory at the Apple Store.", cost: 15000, icon: <Icons.apple className="w-12 h-12" /> },
];

export const leaderboardData: Leader[] = [
  { id: "playerone", rank: 1, player: "PlayerOne", coins: 150230, todaysBid: 100 },
  { id: "luckylucy", rank: 2, player: "LuckyLucy", coins: 125800, todaysBid: 50 },
  { id: "jackpotjoe", rank: 3, player: "JackpotJoe", coins: 98450, todaysBid: 75 },
  { id: "winningwendy", rank: 4, player: "WinningWendy", coins: 75300, todaysBid: 25 },
  { id: "gamerguy", rank: 5, player: "GamerGuy", coins: 68900, todaysBid: 100 },
  { id: "topdog", rank: 6, player: "TopDog", coins: 51200, todaysBid: 10 },
  { id: "ladylucy", rank: 7, player: "LadyLuck", coins: 45670, todaysBid: 80 },
  { id: "highroller", rank: 8, player: "HighRoller", coins: 32100, todaysBid: 60 },
  { id: "newbienick", rank: 9, player: "NewbieNick", coins: 21000, todaysBid: 90 },
  { id: "casualchris", rank: 10, player: "CasualChris", coins: 15000, todaysBid: 40 },
];

export const userTicketHistory: Ticket[] = [
  {
    id: "ticket-1",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    userNumbers: [7, 13, 22, 31, 40, 48],
    winningNumbers: [5, 13, 22, 33, 40, 49],
    matches: 3,
    coinsWon: 50,
    bid: 10,
  },
  {
    id: "ticket-2",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    userNumbers: [1, 2, 3, 4, 5, 6],
    winningNumbers: [1, 2, 3, 4, 15, 16],
    matches: 4,
    coinsWon: 500,
    bid: 10,
  },
  {
    id: "ticket-3",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    userNumbers: [10, 20, 30, 40, 41, 42],
    winningNumbers: [11, 23, 30, 38, 41, 42],
    matches: 3,
    coinsWon: 250,
    bid: 50,
  },
  {
    id: "ticket-4",
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    userNumbers: [8, 16, 24, 32, 40, 48],
    winningNumbers: [9, 17, 25, 33, 41, 49],
    matches: 0,
    coinsWon: 0,
    bid: 20,
  },
   {
    id: "ticket-5",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    userNumbers: [5, 15, 25, 35, 45, 49],
    winningNumbers: [5, 15, 25, 35, 45, 49],
    matches: 6,
    coinsWon: 1000000,
    bid: 10,
  },
];

export const megaPot = 1250000;

export const leaderboardDataMap: {[key: string]: { username: string, coins: number, adEarnings: number }} = leaderboardData.reduce((acc, player) => {
    acc[player.player] = { username: player.player, coins: player.coins, adEarnings: Math.floor(player.coins / 100) };
    return acc;
}, {} as {[key: string]: { username: string, coins: number, adEarnings: number }});

export const referralData: {[key: string]: { username: string, joinDate: string }[]} = {
    "PlayerOne": [
        { username: "NewbieNick", joinDate: "2024-05-15T12:00:00Z" },
        { username: "CasualChris", joinDate: "2024-04-01T12:00:00Z" },
    ],
    "LuckyLucy": [
        { username: "GamerGuy", joinDate: "2024-03-20T12:00:00Z" },
    ],
    "JackpotJoe": [],
    "WinningWendy": [
        { username: "TopDog", joinDate: "2024-02-10T12:00:00Z" },
        { username: "LadyLuck", joinDate: "2024-01-05T12:00:00Z" },
    ],
    "GamerGuy": [],
    "TopDog": [],
    "LadyLuck": [],
    "HighRoller": [],
    "NewbieNick": [],
    "CasualChris": [],
};
