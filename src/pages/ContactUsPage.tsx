import { useEffect, useState } from "react";
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
import { useApiRequest } from "@/libs/apiRequest";
import { toast } from "@/hooks/use-toast";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const { success, request, error } = useApiRequest({
    url: "/contactus/create",
    method: "POST",
    isToken: true,
    data: formData,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await request();
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (success) {
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
        variant: "success",
      });
      setFormData({ name: "", email: "", title: "", description: "" });
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description:
          error?.toString() || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }, [error]);

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

              <form className="space-y-6" onSubmit={handleSubmit}>
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
                        value={formData.name}
                        onChange={handleChange}
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
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 h-12 rounded-lg animation-all focus:scale-[1.02]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="title">Subject</Label>
                  <div className="relative">
                    <Icons.venetianMask className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="title"
                      type="text"
                      placeholder="What is your message about?"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className="pl-10 h-12 rounded-lg animation-all focus:scale-[1.02]"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Message</Label>
                  <div className="relative">
                    <Icons.messageSquare className="absolute left-3 top-4 h-5 w-5 text-muted-foreground" />
                    <Textarea
                      id="description"
                      placeholder="Type your message here..."
                      required
                      value={formData.description}
                      onChange={handleChange}
                      className="pl-10 pt-3 min-h-[150px] animation-all focus:scale-[1.02]"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-lg text-base font-bold animation-all hover:scale-105 active:scale-95"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </div>

            <div className="relative bg-primary/10 hidden md:flex flex-col justify-between p-8">
              <img
                src={IMAGES.contactUsImage}
                alt="Customer support person"
                className="relative z-10 mx-auto object-cover"
                data-ai-hint="customer support"
              />
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
