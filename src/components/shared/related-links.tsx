import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { RelatedLink } from "./related-links-data";

interface RelatedLinksProps {
  title?: string;
  links: RelatedLink[];
  className?: string;
}

export function RelatedLinks({
  title = "Related Pages",
  links,
  className = "",
}: RelatedLinksProps) {
  return (
    <Card className={`glassmorphism ${className}`}>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Icons.arrowRight className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {links.map((link, index) => (
            <Link
              key={index}
              to={link.href}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/20 transition-colors group"
            >
              <div className="text-primary group-hover:scale-110 transition-transform">
                {link.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold group-hover:text-primary transition-colors">
                  {link.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {link.description}
                </p>
              </div>
              <Icons.arrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
