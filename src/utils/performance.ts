// Type definitions for Performance API entries
interface LayoutShiftEntry extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

interface FirstInputEntry extends PerformanceEntry {
  processingStart: number;
}

interface LargestContentfulPaintEntry extends PerformanceEntry {
  renderTime: number;
  loadTime: number;
}

// Performance monitoring and Core Web Vitals tracking
export function initPerformanceMonitoring() {
  // Core Web Vitals tracking
  if (typeof window !== "undefined") {
    // Track Largest Contentful Paint (LCP)
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries() as LargestContentfulPaintEntry[];
      const lastEntry = entries[entries.length - 1];

      // Log LCP for monitoring
      console.log("LCP:", lastEntry.startTime);

      // Send to analytics if needed
      if (window.gtag) {
        window.gtag("event", "web_vitals", {
          name: "LCP",
          value: Math.round(lastEntry.startTime),
          event_category: "Web Vitals",
        });
      }
    });

    try {
      observer.observe({ entryTypes: ["largest-contentful-paint"] });
    } catch (e) {
      // Fallback for browsers that don't support LCP
      console.log("LCP monitoring not supported", e);
    }

    // Track Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries() as LayoutShiftEntry[];
      for (const entry of entries) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }

      console.log("CLS:", clsValue);

      if (window.gtag) {
        window.gtag("event", "web_vitals", {
          name: "CLS",
          value: Math.round(clsValue * 1000),
          event_category: "Web Vitals",
        });
      }
    });

    try {
      clsObserver.observe({ entryTypes: ["layout-shift"] });
    } catch (e) {
      console.log("CLS monitoring not supported", e);
    }

    // Track First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries() as FirstInputEntry[];
      for (const entry of entries) {
        const fid = entry.processingStart - entry.startTime;
        console.log("FID:", fid);

        if (window.gtag) {
          window.gtag("event", "web_vitals", {
            name: "FID",
            value: Math.round(fid),
            event_category: "Web Vitals",
          });
        }
      }
    });

    try {
      fidObserver.observe({ entryTypes: ["first-input"] });
    } catch (e) {
      console.log("FID monitoring not supported", e);
    }
  }
}

// Image lazy loading utility
export function setupLazyLoading() {
  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove("lazy");
            observer.unobserve(img);
          }
        }
      });
    });

    // Observe all images with data-src attribute
    document.querySelectorAll("img[data-src]").forEach((img) => {
      imageObserver.observe(img);
    });
  }
}

// Preload critical resources
export function preloadCriticalResources() {
  const criticalResources = [
    "/logo/logo3.png",
    // Add other critical resources
  ];

  criticalResources.forEach((resource) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = resource;
    link.as =
      resource.endsWith(".png") || resource.endsWith(".jpg")
        ? "image"
        : "fetch";
    document.head.appendChild(link);
  });
}

// Service Worker registration for caching
export function registerServiceWorker() {
  if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("SW registered: ", registration);
        })
        .catch((registrationError) => {
          console.log("SW registration failed: ", registrationError);
        });
    });
  }
}

// Initialize all performance optimizations
export function initPerformanceOptimizations() {
  initPerformanceMonitoring();
  setupLazyLoading();
  preloadCriticalResources();
  registerServiceWorker();
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
