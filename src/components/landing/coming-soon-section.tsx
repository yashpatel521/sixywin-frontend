import { IMAGES } from "@/libs/constants";
import { Icons } from "@/components/ui/icons";
import { FloatingCoins } from "@/components/ui/floating-coins";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

export function ComingSoonSection() {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <motion.section
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
      className="mt-20 md:mt-32 p-8 md:p-16 bg-gradient-to-r from-primary/80 to-accent/80 rounded-3xl text-foreground overflow-hidden relative"
    >
      <FloatingCoins count={15} />

      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center relative z-10"
      >
        <motion.div variants={itemVariants} className="relative group animation-all fade-in-up duration-700">
          <div
            className="relative rounded-2xl shadow-2xl overflow-hidden 
             bg-gradient-to-b from-yellow-400 via-yellow-300 to-yellow-500 transition-all duration-300 
             group-hover:scale-[1.02] group-hover:shadow-lg group-hover:border-primary"
          >
            <img
              src={sectionContent.image.src}
              alt={sectionContent.image.alt}
              width={sectionContent.image.width}
              height={sectionContent.image.height}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              data-ai-hint={sectionContent.image["data-ai-hint"]}
              loading="lazy"
            />

            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-600/40 via-transparent to-yellow-900/60 pointer-events-none transition-opacity duration-300 group-hover:opacity-80" />

            {/* Shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-6 animation-all fade-in-up duration-700">
          <h2 className="text-3xl md:text-4xl font-bold font-headline flex items-center gap-2">
            <Icons.gift className="h-8 w-8 text-accent animate-pulse" />
            {sectionContent.title}
          </h2>
          <p className="text-lg md:text-xl text-foreground/90">
            {sectionContent.description}
          </p>

          <div className="grid gap-3 md:gap-4">
            {sectionContent.extraInfo.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="glassmorphism p-3 md:p-4 flex items-center gap-2 shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer hover:shadow-xl"
              >
                <Icons.gift className="h-5 w-5 text-primary-foreground flex-shrink-0" />
                <span>{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
