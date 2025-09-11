import { Link } from "react-router-dom";
import { Icons } from "@/components/ui/icons";

export function Footer() {
  return (
    <footer className="w-full border-t bg-card/50 backdrop-blur-lg mt-auto">
      <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <Link to="/" className="flex items-center space-x-2">
          <Icons.logo />
        </Link>
        <p className="text-sm text-muted-foreground text-center md:text-left">
          © {new Date().getFullYear()} SixyWin. All rights reserved.
          <br className="sm:hidden" />
          For entertainment purposes only.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 text-center">
          <Link
            to="/how-to-play"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            How to Play
          </Link>
          <Link
            to="/faq"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            FAQ
          </Link>
          <Link
            to="/about-us"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            About Us
          </Link>
          <Link
            to="/contact-us"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Contact Us
          </Link>
          <Link
            to="/privacy-policy"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms-of-service"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Terms of Service
          </Link>
          <Link
            to="/blog"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Blog
          </Link>
        </div>
      </div>
    </footer>
  );
}
