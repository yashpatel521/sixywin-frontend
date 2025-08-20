import { SEO } from "@/components/shared/seo";
import { SEO_CONFIGS } from "@/utils/seo-configs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { IMAGES } from "@/libs/constants";

export default function ContactUsPage() {
  return (
    <>
      <SEO {...SEO_CONFIGS.contact} />
      <div className="container mx-auto p-4 md:p-8">
        <Card className="max-w-6xl mx-auto glassmorphism animation-all hover:shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-8 space-y-6">
              <CardHeader className="p-0 text-left">
                <CardTitle className="font-headline text-3xl flex items-center gap-2">
                  <Icons.mail className="h-8 w-8 text-primary" />
                  Get in Touch
                </CardTitle>
                <CardDescription>
                  Have a question or feedback? Fill out the form below to send
                  us a message.
                </CardDescription>
              </CardHeader>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <div className="relative">
                      <Icons.user className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your Name"
                        required
                        className="pl-10 h-12 rounded-lg animation-all focus:scale-[1.02]"
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Icons.mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        required
                        className="pl-10 h-12 rounded-lg animation-all focus:scale-[1.02]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <div className="relative">
                    <Icons.venetianMask className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="subject"
                      type="text"
                      placeholder="What is your message about?"
                      required
                      className="pl-10 h-12 rounded-lg animation-all focus:scale-[1.02]"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  <div className="relative">
                    <Icons.messageSquare className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                    <Textarea
                      id="message"
                      placeholder="Type your message here..."
                      required
                      className="pl-10 pt-3 min-h-[150px] animation-all focus:scale-[1.02]"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 rounded-lg text-base font-bold animation-all hover:scale-105 active:scale-95"
                >
                  Send Message
                </Button>
              </form>
            </div>
            <div className="relative bg-primary/10 hidden md:flex flex-col justify-between p-8">
              <img
                src={IMAGES.contactUsImage}
                alt="Customer support person"
                className="relative z-10 mx-auto  object-cover "
                data-ai-hint="customer support"
              />
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
