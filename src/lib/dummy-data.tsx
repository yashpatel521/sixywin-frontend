import { Ticket, Coupon } from "@/lib/types";
import { Icons } from "@/components/shared/icons";

export const availableCoupons: Coupon[] = [
  {
    id: "coupon-1",
    brand: "Amazon",
    title: "$5 Gift Card",
    description: "Get a $5 gift card for your next Amazon purchase.",
    cost: 5000,
    icon: <Icons.amazon className="w-12 h-12" />,
  },
  {
    id: "coupon-2",
    brand: "Apple",
    title: "10% Off Purchase",
    description: "Save 10% on your next Apple Store purchase.",
    cost: 10000,
    icon: <Icons.apple className="w-12 h-12" />,
  },
  {
    id: "coupon-3",
    brand: "Google Play",
    title: "$10 Credit",
    description: "Enjoy $10 credit for apps, games, and more.",
    cost: 7500,
    icon: <Icons.googlePlay className="w-12 h-12" />,
  },
  {
    id: "coupon-4",
    brand: "Amazon",
    title: "$25 Gift Card",
    description: "A generous $25 gift card for anything on Amazon.",
    cost: 20000,
    icon: <Icons.amazon className="w-12 h-12" />,
  },
  {
    id: "coupon-5",
    brand: "Apple",
    title: "20% Off Accessories",
    description: "Get 20% off any accessory at the Apple Store.",
    cost: 15000,
    icon: <Icons.apple className="w-12 h-12" />,
  },
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
