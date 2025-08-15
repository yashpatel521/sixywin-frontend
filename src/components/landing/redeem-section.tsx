import { IMAGES } from "@/libs/constants";
import { Icons } from "@/components/ui/icons";

const sectionContent = {
  title: "Redeem Your Coins",
  description:
    "Turn your virtual winnings into real-world rewards! You can exchange the coins you win for valuable coupons from top brands like Amazon, Apple, and more.",
  image: {
    src: IMAGES.redeem,
    alt: "Gift cards and coupons",
    width: 600,
    height: 400,
    "data-ai-hint": "gift cards rewards",
  },
};

export function RedeemSection() {
  return (
    <section className="mt-20 md:mt-32 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
      <div className="animation-all animate-in fade-in slide-in-from-left-8 duration-700">
        <img
          src={sectionContent.image.src}
          alt={sectionContent.image.alt}
          width={sectionContent.image.width}
          height={sectionContent.image.height}
          className="rounded-2xl object-cover shadow-2xl"
          data-ai-hint={sectionContent.image["data-ai-hint"]}
        />
      </div>
      <div className="animation-all animate-in fade-in slide-in-from-right-8 duration-700">
        <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4 text-foreground flex items-center gap-2">
          <Icons.gift className="h-8 w-8 text-primary" />
          {sectionContent.title}
        </h2>
        <p className="text-lg text-muted-foreground">
          {sectionContent.description}
        </p>
      </div>
    </section>
  );
}
