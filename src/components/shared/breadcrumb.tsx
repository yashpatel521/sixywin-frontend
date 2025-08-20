import { Link, useLocation } from "react-router-dom";
import { Icons } from "@/components/ui/icons";
import { BreadcrumbItem, generateBreadcrumbs } from "@/utils/breadcrumb-utils";

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  const location = useLocation();

  // Auto-generate breadcrumbs if not provided
  const breadcrumbItems = items || generateBreadcrumbs(location.pathname);

  if (breadcrumbItems.length <= 1) return null;

  return (
    <nav
      className={`flex items-center space-x-2 text-sm text-muted-foreground mb-6 ${className}`}
    >
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <Icons.chevronRight className="h-4 w-4 mx-2" />}
          {item.href && index < breadcrumbItems.length - 1 ? (
            <Link
              to={item.href}
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={
                index === breadcrumbItems.length - 1
                  ? "text-foreground font-medium"
                  : ""
              }
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
