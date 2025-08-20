// SEO configurations for different pages
export const SEO_CONFIGS = {
  home: {
    title: "Free Virtual Lottery Games Online - Play Free Lottery | SixyWin",
    description:
      "Play free lottery games online with SixyWin! No download required. Experience virtual lottery gaming with daily draws and virtual coins. Start playing now!",
    keywords:
      "free lottery games, virtual lottery simulator, online lottery games free, lottery number generator, virtual coin games, SixyWin",
    type: "website" as const,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "SixyWin - Free Virtual Lottery Games",
      url: "https://sixywin.com",
      description: "The Ultimate Free Virtual Lottery & Gaming Platform",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://sixywin.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  },

  playLottery: {
    title:
      "Virtual Lottery Simulator - Realistic Free Lottery Gaming | SixyWin",
    description:
      "Experience realistic virtual lottery simulation with SixyWin. Practice lottery strategies, learn number patterns, and enjoy risk-free lottery gaming with daily draws.",
    keywords:
      "virtual lottery simulator, free lottery games, lottery number generator, virtual lottery, daily draws, lottery strategies, SixyWin lottery",
    url: "/games/play-lottery",
    type: "game" as const,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Game",
      name: "SixyWin Virtual Lottery Simulator",
      description:
        "Realistic virtual lottery gaming platform with daily draws and strategy learning",
      url: "https://sixywin.com/games/play-lottery",
      gameType: "Lottery Simulator",
      genre: "Virtual Gaming",
      applicationCategory: "Game",
      operatingSystem: "Web Browser",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    },
  },

  aviator: {
    title: "Aviator Crash Game Online - Play Free Crash Games | SixyWin",
    description:
      "Play Aviator crash game online for free! Cash out before the rocket crashes and win virtual coins. Best crash game experience with strategic timing on SixyWin.",
    keywords:
      "aviator game, crash game online, virtual crash game, rocket game, SixyWin aviator, free crash games, multiplier game",
    url: "/games/aviator",
    type: "game" as const,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Game",
      name: "Aviator Crash Game",
      description:
        "Strategic crash game with multiplier mechanics and rocket theme",
      url: "https://sixywin.com/games/aviator",
      gameType: "Crash Game",
      genre: "Strategy Gaming",
      applicationCategory: "Game",
      operatingSystem: "Web Browser",
    },
  },

  doubleTrouble: {
    title: "Double Trouble Strategy Game - Virtual Betting Game | SixyWin",
    description:
      "Play Double Trouble on SixyWin! An exciting virtual strategy game with betting mechanics and real-time competition. Win virtual coins and climb the leaderboard.",
    keywords:
      "double trouble game, virtual betting games, strategy game, SixyWin games, virtual coins, leaderboard game",
    url: "/games/double-trouble",
    type: "game" as const,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Game",
      name: "Double Trouble Strategy Game",
      description:
        "Strategic virtual gaming with betting mechanics and competitive leaderboard",
      url: "https://sixywin.com/games/double-trouble",
      gameType: "Strategy",
      genre: "Virtual Gaming",
    },
  },

  leaderboard: {
    title: "Gaming Leaderboard - Top Players & Virtual Coin Winners | SixyWin",
    description:
      "Check out the top players on SixyWin leaderboard! See who's winning the most virtual coins in our free lottery games, crash games, and strategy games.",
    keywords:
      "gaming leaderboard, top players, virtual coins, SixyWin leaderboard, gaming competition, lottery winners",
    url: "/leaderboard",
    type: "website" as const,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "SixyWin Gaming Leaderboard",
      description: "Top players and winners on SixyWin virtual gaming platform",
      url: "https://sixywin.com/leaderboard",
    },
  },

  games: {
    title: "Free Virtual Games - Lottery, Crash & Strategy Games | SixyWin",
    description:
      "Discover all free virtual games on SixyWin! Play lottery simulator, Aviator crash game, Double Trouble strategy game. No download, no risk, all fun!",
    keywords:
      "free virtual games, virtual gaming platform, lottery simulator, crash games, strategy games, SixyWin games",
    url: "/games",
    type: "website" as const,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "SixyWin Free Virtual Games",
      description:
        "Collection of free virtual games including lottery, crash, and strategy games",
      url: "https://sixywin.com/games",
    },
  },

  about: {
    title: "About SixyWin - Free Virtual Gaming Platform | Safe & Fun",
    description:
      "Learn about SixyWin, the ultimate free virtual lottery and gaming platform. Discover our mission to provide safe, fun, and exciting virtual gaming experiences.",
    keywords:
      "about SixyWin, virtual gaming platform, free lottery games, safe gaming, virtual gaming mission",
    url: "/about-us",
    type: "website" as const,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "SixyWin",
      description: "Free virtual lottery and gaming platform",
      url: "https://sixywin.com",
      foundingDate: "2024",
    },
  },

  contact: {
    title: "Contact SixyWin - Gaming Support & Feedback | Free Virtual Games",
    description:
      "Contact SixyWin for support, feedback, or questions about our free virtual lottery and gaming platform. We're here to help you have the best gaming experience.",
    keywords:
      "contact SixyWin, gaming support, virtual gaming support, SixyWin feedback, free games support",
    url: "/contact-us",
    type: "website" as const,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Contact SixyWin",
      description:
        "Get in touch with SixyWin support team for gaming assistance",
      url: "https://sixywin.com/contact-us",
    },
  },

  privacy: {
    title: "Privacy Policy - SixyWin Free Virtual Gaming Platform",
    description:
      "Read SixyWin's privacy policy to understand how we protect your data and ensure your privacy while using our free virtual lottery and gaming platform.",
    keywords:
      "privacy policy, SixyWin privacy, data protection, virtual gaming privacy, free games privacy",
    url: "/privacy-policy",
    type: "website" as const,
    robots: "noindex, follow",
  },

  terms: {
    title: "Terms of Service - SixyWin Free Virtual Gaming Platform",
    description:
      "Read SixyWin's terms of service to understand the rules and guidelines for using our free virtual lottery and gaming platform.",
    keywords:
      "terms of service, SixyWin terms, virtual gaming terms, free games terms, platform rules",
    url: "/terms-of-service",
    type: "website" as const,
    robots: "noindex, follow",
  },

  faq: {
    title: "FAQ - Frequently Asked Questions | SixyWin Free Virtual Gaming",
    description:
      "Get answers to common questions about SixyWin's free virtual lottery games, Aviator crash game, Double Trouble, virtual coins, and rewards. Learn how to play and win!",
    keywords:
      "SixyWin FAQ, virtual lottery questions, free gaming help, Aviator game guide, Double Trouble help, virtual coins explained",
    url: "/faq",
    type: "website" as const,
  },

  howToPlay: {
    title:
      "How to Play Guide - Virtual Lottery, Aviator & Double Trouble | SixyWin",
    description:
      "Learn how to play SixyWin's free virtual games! Complete guides for Virtual Lottery, Aviator crash game, and Double Trouble with tips and strategies to win virtual coins.",
    keywords:
      "how to play virtual lottery, Aviator game guide, Double Trouble tutorial, virtual gaming strategies, SixyWin game rules",
    url: "/how-to-play",
    type: "website" as const,
  },
};
