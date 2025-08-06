/**
 * Google AdSense Advertisement Component
 * Reusable component for displaying Google Ads throughout the website
 * Works with Google's built-in consent management
 */

import { useEffect, useRef } from "react";

interface GoogleAdProps {
  adSlot: string;
  adFormat?: "auto" | "rectangle" | "vertical" | "horizontal";
  style?: React.CSSProperties;
  className?: string;
  adTest?: "on" | "off";
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

// Get AdSense configuration from environment variables
const getAdSenseConfig = () => ({
  clientId:
    import.meta.env.VITE_GOOGLE_ADSENSE_CLIENT || "ca-pub-2204167319440199",
  adsEnabled: import.meta.env.VITE_ADS_ENABLED === "true",
  isDevelopment: import.meta.env.MODE === "development",
});

export function GoogleAd({
  adSlot,
  adFormat = "auto",
  style = { display: "block" },
  className = "",
  adTest = "off",
}: GoogleAdProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const { clientId, adsEnabled, isDevelopment } = getAdSenseConfig();

  useEffect(() => {
    // Don't load ads if disabled or in development mode
    if (!adsEnabled && !isDevelopment) {
      return;
    }

    try {
      // Check if adsbygoogle is available and the ad hasn't been loaded yet
      if (
        typeof window !== "undefined" &&
        window.adsbygoogle &&
        adRef.current
      ) {
        // Check if this ad element already has ads loaded
        const hasAds = adRef.current.querySelector("ins[data-ad-status]");
        if (!hasAds) {
          // Push the ad for rendering only if not already loaded
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      }
    } catch (error) {
      console.error("Error loading Google Ad:", error);
    }
  }, [adsEnabled, isDevelopment, adSlot]); // Add adSlot to dependencies

  // Don't render ads if disabled
  if (!adsEnabled && !isDevelopment) {
    return null;
  }

  // Show placeholder in development mode
  if (isDevelopment) {
    return (
      <div
        className={`google-ad-placeholder border-2 border-dashed border-gray-300 bg-gray-100 flex items-center justify-center ${className}`}
        style={style}
      >
        <div className="text-gray-500 text-center">
          <div className="text-sm font-medium">Google Ad Placeholder</div>
          <div className="text-xs">Slot: {adSlot}</div>
          <div className="text-xs">Format: {adFormat}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`google-ad-container ${className}`} ref={adRef}>
      <ins
        key={`ad-${adSlot}-${Date.now()}`} // Unique key to prevent reuse
        className="adsbygoogle"
        style={style}
        data-ad-client={clientId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-ad-test={adTest}
        data-full-width-responsive="true"
      />
    </div>
  );
}

// Pre-configured ad components for common placements
export function HeaderAd({ className }: { className?: string }) {
  return (
    <GoogleAd
      adSlot="1234567890" // Replace with your actual ad slot ID from AdSense
      adFormat="horizontal"
      className={className}
      style={{ display: "block", width: "100%", height: "90px" }}
    />
  );
}

export function SidebarAd({ className }: { className?: string }) {
  return (
    <GoogleAd
      adSlot="0987654321" // Replace with your actual ad slot ID from AdSense
      adFormat="vertical"
      className={className}
      style={{ display: "block", width: "300px", height: "250px" }}
    />
  );
}

export function BannerAd({ className }: { className?: string }) {
  return (
    <GoogleAd
      adSlot="1122334455" // Replace with your actual ad slot ID from AdSense
      adFormat="rectangle"
      className={className}
      style={{
        display: "block",
        width: "728px",
        height: "90px",
        margin: "0 auto",
      }}
    />
  );
}

export function ResponsiveAd({ className }: { className?: string }) {
  return (
    <GoogleAd
      adSlot="5566778899" // Replace with your actual ad slot ID from AdSense
      adFormat="auto"
      className={className}
      style={{ display: "block" }}
    />
  );
}
