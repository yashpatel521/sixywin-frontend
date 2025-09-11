import { SEO } from "@/components/shared/seo";
import { SEO_CONFIGS } from "@/utils/seo-configs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  imageUrl: string;
  tags: string[];
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Welcome to SixyWin: The Future of Virtual Gaming",
    excerpt:
      "Discover how SixyWin is revolutionizing the virtual gaming landscape with its unique approach to entertainment and community building.",
    date: "May 15, 2023",
    readTime: "5 min read",
    category: "Announcements",
    imageUrl: "",
    tags: ["welcome", "introduction", "virtual gaming"],
  },
  {
    id: "2",
    title: "Understanding the Aviator Game Mechanics",
    excerpt:
      "A deep dive into the exciting Aviator game and strategies to maximize your virtual winnings.",
    date: "April 28, 2023",
    readTime: "7 min read",
    category: "Game Guides",
    imageUrl: "",
    tags: ["aviator", "game guide", "strategy"],
  },
  {
    id: "3",
    title: "Community Spotlight: Top Players of the Month",
    excerpt:
      "Celebrating our most active players and their incredible achievements in the SixyWin universe.",
    date: "April 12, 2023",
    readTime: "4 min read",
    category: "Community",
    imageUrl: "",
    tags: ["community", "leaderboard", "spotlight"],
  },
  {
    id: "4",
    title: "New Features Coming Soon: What to Expect",
    excerpt:
      "Get a sneak peek at the exciting new features we're developing to enhance your SixyWin experience.",
    date: "March 30, 2023",
    readTime: "6 min read",
    category: "Updates",
    imageUrl: "",
    tags: ["updates", "features", "development"],
  },
  {
    id: "5",
    title: "Maximizing Your Earnings with Daily Rewards",
    excerpt:
      "Tips and tricks to make the most of our daily spin and ad reward systems.",
    date: "March 18, 2023",
    readTime: "3 min read",
    category: "Tips & Tricks",
    imageUrl: "",
    tags: ["rewards", "tips", "daily"],
  },
  {
    id: "6",
    title: "The Science Behind Fair Play in Virtual Gaming",
    excerpt:
      "How we ensure fairness and transparency in all our virtual gaming experiences.",
    date: "March 5, 2023",
    readTime: "8 min read",
    category: "Technology",
    imageUrl: "",
    tags: ["fair play", "technology", "transparency"],
  },
];

export default function BlogPage() {
  return (
    <>
      <SEO {...SEO_CONFIGS.blog} />
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-8 text-center">
          <h1 className="font-headline text-4xl md:text-5xl font-bold mb-4">
            SixyWin Blog
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest news, game guides, and community
            highlights from SixyWin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {blogPosts.map((post) => (
            <Card
              key={post.id}
              className="glassmorphism hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full">
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {post.readTime}
                  </span>
                </div>
                <CardTitle className="font-headline text-xl">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-secondary rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {post.date}
                  </span>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/blog/${post.id}`}>
                      Read More
                      <Icons.chevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <Icons.mail className="h-6 w-6 text-primary" />
              Stay Updated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Subscribe to our newsletter to receive the latest blog posts, game
              updates, and community news directly in your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-2 rounded-md border border-input bg-background text-foreground"
              />
              <Button>Subscribe</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
