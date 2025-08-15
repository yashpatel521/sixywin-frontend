/**
 * Advertisement Components Export
 */

export {
  GoogleAd,
  HeaderAd,
  SidebarAd,
  BannerAd,
  ResponsiveAd,
} from "./GoogleAd";

export {
  TopBanner,
  SidebarBanner,
  ContentBanner,
  FooterBanner,
  GamingBanner,
  CleanBanner,
  ResponsiveBanner,
  StickyFooterBanner,
} from "./BannerAds";

// Ad configuration constants
export const AD_CONFIG = {
  CLIENT_ID: "ca-pub-2204167319440199",
  SLOTS: {
    HEADER: "1234567890", // Replace with actual slot IDs from AdSense
    SIDEBAR: "0987654321",
    BANNER: "1122334455",
    RESPONSIVE: "5566778899",
    IN_ARTICLE: "6677889900",
    FOOTER: "7788990011",
    GAMING: "8899001122",
    CLEAN: "9900112233",
  },
} as const;
