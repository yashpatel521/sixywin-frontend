import { SEO } from "@/components/shared/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  imageUrl: string;
  tags: string[];
}

const samplePosts: BlogPost[] = [
  {
    id: "1",
    title: "Welcome to SixyWin: The Future of Virtual Gaming",
    date: "May 15, 2023",
    readTime: "5 min read",
    category: "Announcements",
    imageUrl: "/landing/landing1.png",
    tags: ["welcome", "introduction", "virtual gaming"],
    content: `
      <p>Welcome to SixyWin, where virtual gaming meets community and excitement! We're thrilled to introduce you to a new era of online entertainment that combines the thrill of chance with the joy of social interaction.</p>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">Our Vision</h2>
      <p>At SixyWin, we believe that gaming should be accessible, fun, and rewarding for everyone. Our platform is designed to provide a safe, engaging environment where players can enjoy various games without the risks associated with traditional gambling.</p>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">What Sets Us Apart</h2>
      <p>Unlike traditional gaming platforms, SixyWin focuses on virtual rewards and community building. Our unique approach includes:</p>
      <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
        <li>Virtual coin economy with no real-money gambling</li>
        <li>Engaging games like Aviator, Double Trouble, and our signature lottery</li>
        <li>Community features including leaderboards and referral bonuses</li>
        <li>Daily rewards and special events to keep the excitement going</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">Join Our Growing Community</h2>
      <p>Since our launch, we've welcomed thousands of players from around the world. Our community is passionate, supportive, and always eager to share tips, celebrate wins, and help newcomers get started.</p>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">What's Next</h2>
      <p>We're constantly working to improve SixyWin with new features, games, and community enhancements. Keep an eye on our blog for updates about upcoming releases and special events.</p>
      
      <p className="mt-6">Thank you for being part of the SixyWin family. We can't wait to see what the future holds!</p>
    `,
  },
  {
    id: "2",
    title: "Understanding the Aviator Game Mechanics",
    date: "April 28, 2023",
    readTime: "7 min read",
    category: "Game Guides",
    imageUrl: "/landing/landing4.png",
    tags: ["aviator", "game guide", "strategy"],
    content: `
      <p>The Aviator game has quickly become one of the most popular attractions on SixyWin. Its simple yet thrilling mechanics make it appealing to both newcomers and seasoned players. Let's dive deep into how the game works and some strategies to enhance your experience.</p>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">How Aviator Works</h2>
      <p>In Aviator, a multiplier starts at 1x and continuously increases until it "crashes" at a random point. Players place bets before each round and can cash out at any time before the crash. The longer you wait, the higher your potential payout, but you risk losing everything if the crash happens before you cash out.</p>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">Key Strategies</h2>
      <p>While Aviator is ultimately a game of chance, there are some approaches that can help you manage your virtual coins more effectively:</p>
      
      <h3 className="text-xl font-semibold mt-4 mb-2">1. Set a Cash-Out Target</h3>
      <p>Decide in advance at what multiplier you'll cash out. For example, consistently cashing out at 2x can be a safe strategy that ensures steady, if modest, returns.</p>
      
      <h3 className="text-xl font-semibold mt-4 mb-2">2. Manage Your Bets</h3>
      <p>Never bet more than you're willing to lose in a single round. A common approach is to bet a small percentage of your total coins each round.</p>
      
      <h3 className="text-xl font-semibold mt-4 mb-2">3. Watch the Patterns</h3>
      <p>While each round is independent, some players enjoy tracking multipliers to identify patterns. Remember that past results don't influence future rounds, but pattern recognition can be part of the fun!</p>
      
      <h3 className="text-xl font-semibold mt-4 mb-2">4. Take Breaks</h3>
      <p>Aviator can be exciting and fast-paced. Taking regular breaks helps maintain a clear head and prevents impulsive decisions.</p>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">Advanced Tips</h2>
      <p>For more experienced players, consider these advanced strategies:</p>
      <ul className="list-disc list-inside ml-4 mt-2 space-y-2">
        <li>Use the auto-cashout feature to lock in profits without constant attention</li>
        <li>Track your session statistics to identify your most successful strategies</li>
        <li>Set daily limits to ensure responsible play</li>
      </ul>
      
      <p className="mt-6">Remember, Aviator is designed for entertainment. Play responsibly and enjoy the excitement!</p>
    `,
  },
  // Additional posts would be added here
];

export default function BlogPostPage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    // In a real app, this would be an API call
    const foundPost = samplePosts.find((post) => post.id === id);
    setPost(foundPost || null);
  }, [id]);

  if (!post) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Card className="glassmorphism">
          <CardContent className="p-8 text-center">
            <Icons.alertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Post Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The blog post you're looking for doesn't exist or has been moved.
            </p>
            <Button asChild>
              <Link to="/blog">Back to Blog</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={post.title}
        description={
          post.content.replace(/<[^>]*>/g, "").substring(0, 160) + "..."
        }
      />
      <div className="container mx-auto p-4 md:p-8">
        <Button variant="ghost" className="mb-6 pl-0" asChild>
          <Link to="/blog">
            <Icons.chevronLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>

        <Card className="glassmorphism">
          <CardHeader>
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <span className="text-sm font-semibold px-2 py-1 bg-primary/10 text-primary rounded-full">
                  {post.category}
                </span>
                <CardTitle className="font-headline text-3xl md:text-4xl mt-3">
                  {post.title}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-secondary rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8">
              {post.imageUrl && (
                <div className="md:w-1/3">
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-64 object-contain rounded-lg"
                  />
                </div>
              )}
              <div className={post.imageUrl ? "md:w-2/3" : "w-full"}>
                <div
                  className="prose prose-headings:font-headline max-w-none text-foreground"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Icons.heart className="mr-2 h-4 w-4" />
                    Like
                  </Button>
                  <Button variant="outline" size="sm">
                    <Icons.share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  {post.date} · {post.readTime}
                </div>
                <Button variant="ghost" asChild>
                  <Link to="/blog">
                    <Icons.chevronLeft className="mr-2 h-4 w-4" />
                    Back to Blog
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
