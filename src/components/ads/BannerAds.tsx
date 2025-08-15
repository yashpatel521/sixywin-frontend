/**
 * Styled Banner Ad Components
 * Beautiful banner designs that integrate seamlessly with the website
 */

import { GoogleAd } from "./GoogleAd";

interface BannerAdProps {
  className?: string;
  title?: string;
  subtitle?: string;
}

// Top banner with gradient background
export function TopBanner({
  className = "",
  title = "Advertisement",
}: BannerAdProps) {
  return (
    <div
      className={`w-full bg-gradient-to-r from-yellow-100 to-amber-100 border border-yellow-200 rounded-lg shadow-sm ${className}`}
    >
      <div className="text-center py-2">
        <p className="text-xs text-gray-500 mb-2">{title}</p>
        <GoogleAd
          adSlot="1234567890" // Replace with your actual ad slot ID
          adFormat="horizontal"
          style={{ display: "block", width: "100%", minHeight: "90px" }}
        />
      </div>
    </div>
  );
}

// Sidebar banner with card design
export function SidebarBanner({
  className = "",
  title = "Sponsored",
}: BannerAdProps) {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden ${className}`}
    >
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2">
        <h3 className="text-white text-sm font-medium">{title}</h3>
      </div>
      <div className="p-4">
        <GoogleAd
          adSlot="0987654321" // Replace with your actual ad slot ID
          adFormat="vertical"
          style={{ display: "block", width: "100%", minHeight: "250px" }}
        />
      </div>
    </div>
  );
}

// Content banner that blends with articles
export function ContentBanner({
  className = "",
  title = "Recommended",
}: BannerAdProps) {
  return (
    <div
      className={`border-l-4 border-yellow-400 bg-yellow-50 p-4 my-8 rounded-r-lg ${className}`}
    >
      <div className="flex items-center mb-3">
        <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
        <span className="text-sm text-gray-600 font-medium">{title}</span>
      </div>
      <GoogleAd
        adSlot="1122334455" // Replace with your actual ad slot ID
        adFormat="rectangle"
        style={{ display: "block", width: "100%", minHeight: "120px" }}
      />
    </div>
  );
}

// Footer banner with dark theme
export function FooterBanner({
  className = "",
  title = "Partners",
}: BannerAdProps) {
  return (
    <div
      className={`bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden ${className}`}
    >
      <div className="px-6 py-3 border-b border-gray-700">
        <h3 className="text-sm font-medium text-gray-300">{title}</h3>
      </div>
      <div className="p-6">
        <GoogleAd
          adSlot="7788990011" // Replace with your actual ad slot ID
          adFormat="horizontal"
          style={{ display: "block", width: "100%", minHeight: "100px" }}
        />
      </div>
    </div>
  );
}

// Gaming-themed banner with icons
export function GamingBanner({
  className = "",
  title = "Gaming Zone",
}: BannerAdProps) {
  return (
    <div
      className={`bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-xl shadow-xl overflow-hidden border border-purple-300 ${className}`}
    >
      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute top-2 left-2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
        <div
          className="absolute top-2 right-2 w-2 h-2 bg-pink-400 rounded-full animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>

        <div className="px-6 py-4">
          <div className="flex items-center justify-center mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-400 text-lg">🎮</span>
              <h3 className="text-white text-sm font-bold">{title}</h3>
              <span className="text-yellow-400 text-lg">🎯</span>
            </div>
          </div>

          <GoogleAd
            adSlot="5566778899" // Replace with your actual ad slot ID
            adFormat="auto"
            style={{ display: "block", width: "100%", minHeight: "120px" }}
          />
        </div>
      </div>
    </div>
  );
}

// Minimal clean banner
export function CleanBanner({
  className = "",
  title = "Advertisement",
}: BannerAdProps) {
  return (
    <div
      className={`border border-gray-200 bg-gray-50 rounded-lg ${className}`}
    >
      <div className="text-center py-1">
        <span className="text-xs text-gray-400 uppercase tracking-wide">
          {title}
        </span>
      </div>
      <div className="px-4 pb-4">
        <GoogleAd
          adSlot="6677889900" // Replace with your actual ad slot ID
          adFormat="auto"
          style={{ display: "block", width: "100%", minHeight: "100px" }}
        />
      </div>
    </div>
  );
}

// Responsive banner that adapts to screen size
export function ResponsiveBanner({
  className = "",
  title = "Sponsored Content",
}: BannerAdProps) {
  return (
    <div
      className={`bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-yellow-400 transition-colors duration-300 ${className}`}
    >
      <div className="p-4 md:p-6">
        <div className="text-center mb-4">
          <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
          <div className="w-12 h-0.5 bg-gradient-to-r from-yellow-400 to-amber-500 mx-auto"></div>
        </div>

        <GoogleAd
          adSlot="8899001122" // Replace with your actual ad slot ID
          adFormat="auto"
          style={{ display: "block", width: "100%", minHeight: "120px" }}
        />
      </div>
    </div>
  );
}

// Sticky footer banner that stays at bottom of screen
export function StickyFooterBanner({
  className = "",
  title = "Advertisement",
}: BannerAdProps) {
  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg ${className}`}
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{title}</span>
          <button
            onClick={() => {
              const banner = document.querySelector("[data-sticky-banner]");
              if (banner) {
                (banner as HTMLElement).style.display = "none";
              }
            }}
            className="text-gray-400 hover:text-gray-600 text-lg font-bold px-2"
            aria-label="Close ad"
          >
            ×
          </button>
        </div>
        <div className="pb-2">
          <GoogleAd
            adSlot="9988776655" // Replace with your actual ad slot ID
            adFormat="horizontal"
            style={{ display: "block", width: "100%", minHeight: "70px" }}
          />
        </div>
      </div>
    </div>
  );
}
