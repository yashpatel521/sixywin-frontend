import { IMAGES } from "@/libs/constants";
import { Icons } from "@/components/ui/icons";

const sectionContent = {
  title: "Rewards Coming Soon!",
  description:
    "We're preparing exciting new ways for you to earn exclusive bonuses and perks. Stay tuned—something special is on the way!",
  image: {
    src: IMAGES.redeem,
    alt: "Rewards coming soon",
    width: 600,
    height: 400,
    "data-ai-hint": "coming soon, bonuses, perks, in-game rewards",
  },
  extraInfo: [
    "Exclusive bonus points",
    "Special in-game perks",
    "Limited-time events",
  ],
};

export function ComingSoonSection() {
  return (
    <section className="mt-20 md:mt-32 p-8 md:p-16 bg-gradient-to-r from-primary/80 to-accent/80 rounded-3xl text-foreground overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
        <div className="relative animation-all fade-in-up duration-700">
          <div
            className="relative rounded-2xl shadow-2xl border-2 border-primary overflow-hidden 
             bg-gradient-to-b from-yellow-400 via-yellow-300 to-yellow-500"
          >
            <img
              src={sectionContent.image.src}
              alt={sectionContent.image.alt}
              width={sectionContent.image.width}
              height={sectionContent.image.height}
              className="object-cover w-full h-full"
              data-ai-hint={sectionContent.image["data-ai-hint"]}
            />

            {/* Gradient overlay for smooth blending */}
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-600 via-transparent to-yellow-900 pointer-events-none" />
          </div>
        </div>

        <div className="space-y-6 animation-all fade-in-up duration-700">
          <h2 className="text-3xl md:text-4xl font-bold font-headline flex items-center gap-2">
            <Icons.gift className="h-8 w-8 text-accent" />
            {sectionContent.title}
          </h2>
          <p className="text-lg md:text-xl text-foreground/90">
            {sectionContent.description}
          </p>

          <div className="grid gap-3 md:gap-4">
            {sectionContent.extraInfo.map((item, index) => (
              <div
                key={index}
                className="glassmorphism p-3 md:p-4 flex items-center gap-2 shadow-lg hover:scale-105 transition-transform duration-300"
              >
                <Icons.gift className="h-5 w-5 text-primary-foreground flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
