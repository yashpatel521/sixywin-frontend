import type { LucideProps } from "lucide-react";
import {
  Ticket as TicketIcon,
  User,
  Lock,
  Facebook,
  ShoppingCart,
  Globe,
  Laptop,
} from "lucide-react";

export const Icons = {
  //logo image
  logo: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img src="/logo.png" alt="logo" {...props} className="w-10 h-10" />
  ),
  ticket: (props: LucideProps) => <TicketIcon {...props} />,
  user: (props: LucideProps) => <User {...props} />,
  password: (props: LucideProps) => <Lock {...props} />,
  google: (props: LucideProps) => <Globe {...props} />,
  facebook: (props: LucideProps) => <Facebook {...props} />,
  amazon: (props: LucideProps) => <ShoppingCart {...props} />,
  apple: (props: LucideProps) => <Laptop {...props} />,
  googlePlay: (props: LucideProps) => <Globe {...props} />,
};
