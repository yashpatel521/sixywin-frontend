import { Coupon } from "@/lib/interfaces";
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
