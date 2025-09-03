import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { Icons } from "@/components/ui/icons";
import { motion, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";

const sectionContent = {
  title: "Ready to Try Your Luck?",
  description:
    "Join thousands of players enjoying the daily draw. Your lucky numbers could be next!",
  buttonText: "Sign Up and Play Now",
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      duration: 0.5,
    },
  },
};

export function CtaSection() {
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
      className="mt-20 md:mt-32 text-center bg-gradient-to-r from-yellow-400/10 via-yellow-600/10 to-yellow-400/10 backdrop-blur-lg border border-yellow-400/20 rounded-3xl p-8 md:p-16 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <motion.div
        className="absolute -top-20 -left-20 w-40 h-40 bg-yellow-400/10 rounded-full filter blur-xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div variants={itemVariants}>
        <h2 className="text-3xl md:text-5xl font-bold font-headline mb-4 text-white dark:text-white tracking-tight drop-shadow-md">
          {sectionContent.title}
        </h2>
      </motion.div>

      <motion.div variants={itemVariants}>
        <p className="text-lg md:text-xl text-white/90 dark:text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
          {sectionContent.description}
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button
          asChild
          size="lg"
          className="relative overflow-hidden bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white shadow-lg hover:shadow-yellow-500/30 transition-all duration-300 group"
        >
          <Link to="/register">
            {sectionContent.buttonText}
            <Icons.arrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </motion.div>

      <motion.div
        className="absolute -bottom-20 -right-20 w-60 h-60 bg-yellow-500/10 rounded-full filter blur-xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </motion.section>
  );
}
