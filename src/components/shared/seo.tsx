import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "game";
  structuredData?: object;
}

export function SEO({
  title = "SixyWin",
  description = "Experience the thrill of virtual lottery gaming with SixyWin! Play daily draws, compete on leaderboards, win virtual coins, and enjoy exciting games like Double Trouble. No risk, all fun!",
  keywords = "virtual lottery, online lottery, lottery games, virtual coins, gaming platform, daily draws, leaderboard, SixyWin, lottery simulator, virtual gaming",
  image = "https://sixywin.com/og-image.png",
  url = "https://sixywin.com",
  type = "website",
  structuredData,
}: SEOProps) {
  const fullUrl = url.startsWith("http") ? url : `https://sixywin.com${url}`;
  const fullImageUrl = image.startsWith("http")
    ? image
    : `https://sixywin.com${image}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute("content", keywords);
    }
  }, [title, description, keywords]);

  return (
    <>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:site_name" content="SixyWin" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImageUrl} />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </>
  );
}

// Predefined SEO configurations for different pages
export const SEO_CONFIGS = {
  home: {
    title: "SixyWin",
    description:
      "Experience the thrill of virtual lottery gaming with SixyWin! Play daily draws, compete on leaderboards, win virtual coins, and enjoy exciting games like Double Trouble. No risk, all fun!",
    keywords:
      "virtual lottery, online lottery, lottery games, virtual coins, gaming platform, daily draws, leaderboard, SixyWin, lottery simulator, virtual gaming",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "SixyWin",
      url: "https://sixywin.com",
      description: "The Ultimate Virtual Lottery & Gaming Platform",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://sixywin.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  },

  playLottery: {
    title: "SixyWin - Play Lottery",
    description:
      "Play virtual lottery with SixyWin! Join daily draws, compete for the mega pot, and win virtual coins. Experience the excitement of lottery gaming without any risk.",
    keywords:
      "play lottery, virtual lottery, daily draws, mega pot, lottery games, win coins, SixyWin lottery",
    url: "/play-lottery",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Game",
      name: "SixyWin Virtual Lottery",
      description:
        "Virtual lottery gaming platform with daily draws and mega pot",
      url: "https://sixywin.com/play-lottery",
      gameType: "Lottery",
      genre: "Gambling Simulation",
    },
  },

  doubleTrouble: {
    title: "SixyWin - Double Trouble",
    description:
      "Play Double Trouble on SixyWin! An exciting virtual gaming experience with strategic betting and real-time competition. Win virtual coins and climb the leaderboard.",
    keywords:
      "double trouble game, virtual gaming, strategic betting, SixyWin games, virtual coins",
    url: "/double-trouble",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Game",
      name: "Double Trouble",
      description: "Strategic virtual gaming with betting mechanics",
      url: "https://sixywin.com/double-trouble",
      gameType: "Strategy",
      genre: "Virtual Gaming",
    },
  },

  leaderboard: {
    title: "SixyWin - Leaderboard",
    description:
      "Check out the top players on SixyWin leaderboard! See who's winning the most virtual coins and competing for the top spots in our virtual lottery and gaming platform.",
    keywords:
      "leaderboard, top players, virtual coins, SixyWin leaderboard, gaming competition",
    url: "/leaderboard",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "SixyWin Leaderboard",
      description: "Top players on SixyWin virtual gaming platform",
      url: "https://sixywin.com/leaderboard",
    },
  },

  about: {
    title: "SixyWin - About",
    description:
      "Learn about SixyWin, the ultimate virtual lottery and gaming platform. Discover our mission to provide safe, fun, and exciting virtual gaming experiences.",
    keywords:
      "about SixyWin, virtual gaming platform, lottery simulator, gaming mission, SixyWin about",
    url: "/about",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "SixyWin",
      description: "Virtual lottery and gaming platform",
      url: "https://sixywin.com",
      sameAs: ["https://twitter.com/sixywin", "https://facebook.com/sixywin"],
    },
  },

  contact: {
    title: "SixyWin - Contact",
    description:
      "Contact SixyWin for support, feedback, or questions about our virtual lottery and gaming platform. We're here to help you have the best gaming experience.",
    keywords:
      "contact SixyWin, support, feedback, virtual gaming support, SixyWin contact",
    url: "/contact",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact SixyWin",
      description: "Get in touch with SixyWin support team",
      url: "https://sixywin.com/contact",
    },
  },

  privacy: {
    title: "SixyWin - Privacy Policy",
    description:
      "Read SixyWin's privacy policy to understand how we protect your data and ensure your privacy while using our virtual lottery and gaming platform.",
    keywords:
      "privacy policy, SixyWin privacy, data protection, virtual gaming privacy",
    url: "/privacy",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Privacy Policy",
      description: "SixyWin privacy policy and data protection",
      url: "https://sixywin.com/privacy",
    },
  },

  terms: {
    title: "SixyWin - Terms of Service",
    description:
      "Read SixyWin's terms of service to understand the rules and guidelines for using our virtual lottery and gaming platform.",
    keywords:
      "terms of service, SixyWin terms, virtual gaming terms, platform rules",
    url: "/terms",
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Terms of Service",
      description: "SixyWin terms of service and platform rules",
      url: "https://sixywin.com/terms",
    },
  },
};
