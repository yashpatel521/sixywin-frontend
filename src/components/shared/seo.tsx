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
  const toAbsolute = (base: string, u: string) =>
    u.startsWith("http") ? u : `${base}${u.startsWith("/") ? u : `/${u}`}`;
  const fullUrl = toAbsolute("https://sixywin.com", url);
  const fullImageUrl = toAbsolute("https://sixywin.com", image);

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
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:url", fullUrl);
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:image", fullImageUrl);

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

function updateStructuredData(data: object | object[]) {
  // Remove any existing structured data blocks we previously added
  const existingScripts = document.querySelectorAll(
    'script[data-seo="structured-data"]'
  );
  existingScripts.forEach((s) => s.remove());

  const blocks = Array.isArray(data) ? data : [data];
  for (const block of blocks) {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo", "structured-data");
    script.textContent = JSON.stringify(block);
    document.head.appendChild(script);
  }
}

// JSON-LD helper builders
const BASE_URL = "https://sixywin.com";
const abs = (u: string) => (u?.startsWith("http") ? u : `${BASE_URL}${u?.startsWith("/") ? u : `/${u}`}`);

export function buildOrganizationLD(opts?: {
  name?: string;
  url?: string;
  logo?: string;
  sameAs?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: opts?.name ?? "SixyWin",
    url: abs(opts?.url ?? "/"),
    logo: abs(opts?.logo ?? "/logo/logo3.png"),
    sameAs: opts?.sameAs ?? [],
  };
}

export function buildWebSiteLD(opts?: { name?: string; url?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: opts?.name ?? "SixyWin",
    url: abs(opts?.url ?? "/"),
  };
}

export function buildBreadcrumbLD(items: Array<{ name: string; item: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: it.name,
      item: abs(it.item),
    })),
  };
}

export function buildFAQPageLD(qas: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qas.map((qa) => ({
      "@type": "Question",
      name: qa.question,
      acceptedAnswer: { "@type": "Answer", text: qa.answer },
    })),
  };
}

export function buildHowToLD(
  name: string,
  steps: Array<{ name: string; text: string }>,
  description?: string,
  image?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    image: image ? abs(image) : abs("/og-image.png"),
    step: steps.map((s) => ({ "@type": "HowToStep", name: s.name, text: s.text })),
  };
}
