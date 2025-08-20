import { SEOProps } from "@/libs/interfaces";
import { useEffect } from "react";

export function SEO({
  title = "SixyWin - Free Virtual Lottery & Gaming Platform",
  description = "Experience the thrill of free virtual lottery gaming with SixyWin! Play daily draws, compete on leaderboards, win virtual coins, and enjoy exciting games. No risk, all fun!",
  keywords = "free virtual games, virtual lottery, online lottery games, crash games, virtual gaming platform, SixyWin",
  image = "https://sixywin.com/og-image.png",
  url = "https://sixywin.com",
  type = "website",
  structuredData,
  robots = "index, follow",
}: SEOProps) {
  const fullUrl = url.startsWith("http") ? url : `https://sixywin.com${url}`;
  const fullImageUrl = image.startsWith("http")
    ? image
    : `https://sixywin.com${image}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update or create meta tags
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);
    updateMetaTag("robots", robots);

    // Update Open Graph tags
    updateMetaProperty("og:type", type);
    updateMetaProperty("og:url", fullUrl);
    updateMetaProperty("og:title", title);
    updateMetaProperty("og:description", description);
    updateMetaProperty("og:image", fullImageUrl);
    updateMetaProperty("og:site_name", "SixyWin");

    // Update Twitter Card tags
    updateMetaProperty("twitter:card", "summary_large_image");
    updateMetaProperty("twitter:url", fullUrl);
    updateMetaProperty("twitter:title", title);
    updateMetaProperty("twitter:description", description);
    updateMetaProperty("twitter:image", fullImageUrl);

    // Update canonical link
    updateCanonicalLink(fullUrl);

    // Update structured data
    if (structuredData) {
      updateStructuredData(structuredData);
    }
  }, [
    title,
    description,
    keywords,
    fullUrl,
    fullImageUrl,
    type,
    structuredData,
    robots,
  ]);

  return null;
}

// Utility functions
function updateMetaTag(name: string, content: string) {
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", name);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

function updateMetaProperty(property: string, content: string) {
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("property", property);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

function updateCanonicalLink(href: string) {
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", href);
}

function updateStructuredData(data: object) {
  const existingScript = document.querySelector(
    'script[data-seo="structured-data"]'
  );
  if (existingScript) {
    existingScript.remove();
  }

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.setAttribute("data-seo", "structured-data");
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}
