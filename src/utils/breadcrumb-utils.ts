export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const pathMap: Record<string, string> = {
    "/": "Home",
    "/games": "Games",
    "/games/play-lottery": "Virtual Lottery",
    "/games/aviator": "Aviator",
    "/games/double-trouble": "Double Trouble",
    "/leaderboard": "Leaderboard",
    "/about-us": "About",
    "/contact-us": "Contact",
    "/faq": "FAQ",
    "/how-to-play": "How to Play",
    "/privacy-policy": "Privacy Policy",
    "/terms-of-service": "Terms of Service",
    "/login": "Login",
    "/register": "Register",
  };

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

  let currentPath = "";
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const label =
      pathMap[currentPath] ||
      segment.charAt(0).toUpperCase() + segment.slice(1);

    breadcrumbs.push({
      label,
      href: currentPath,
    });
  }

  return breadcrumbs;
}

// Structured data for breadcrumbs
export function generateBreadcrumbStructuredData(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href && { item: `https://sixywin.com${item.href}` }),
    })),
  };
}
