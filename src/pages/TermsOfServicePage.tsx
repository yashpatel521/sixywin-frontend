import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">
            Terms of Service
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              1. Agreement to Terms
            </h2>
            <p>
              By using our application, SixyWin (the "Service"), you agree to be
              bound by these Terms of Service ("Terms"). If you disagree with
              any part of the terms, then you do not have permission to access
              the Service.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              2. Accounts
            </h2>
            <p>
              When you create an account with us, you guarantee that you are
              above the age of 18, and that the information you provide us is
              accurate, complete, and current at all times. Inaccurate,
              incomplete, or obsolete information may result in the immediate
              termination of your account on the Service.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              3. User Conduct
            </h2>
            <p>
              You agree not to use the Service for any unlawful purpose or any
              purpose prohibited under this clause. You agree not to use the
              Service in any way that could damage the Service, the services, or
              the general business of SixyWin.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              4. Intellectual Property
            </h2>
            <p>
              The Service and its original content, features, and functionality
              are and will remain the exclusive property of SixyWin and its
              licensors. The Service is protected by copyright, trademark, and
              other laws of both the United States and foreign countries.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              5. Termination
            </h2>
            <p>
              We may terminate or suspend your account immediately, without
              prior notice or liability, for any reason whatsoever, including
              without limitation if you breach the Terms.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              6. Limitation Of Liability
            </h2>
            <p>
              In no event shall SixyWin, nor its directors, employees, partners,
              agents, suppliers, or affiliates, be liable for any indirect,
              incidental, special, consequential or punitive damages, including
              without limitation, loss of profits, data, use, goodwill, or other
              intangible losses, resulting from your access to or use of or
              inability to access or use the Service.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              7. No Gambling Disclaimer
            </h2>
            <p>
              SixyWin is for entertainment purposes only and is not a gambling
              application. The virtual coins used in the app have no real-world
              value and cannot be redeemed for cash, prizes, or any other items
              of monetary value. We may provide coupons or other rewards as part
              of our entertainment service, which are subject to their own terms
              and conditions.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              8. Changes to Terms
            </h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace
              these Terms at any time. We will provide at least 30 days' notice
              prior to any new terms taking effect. What constitutes a material
              change will be determined at our sole discretion.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              9. Contact Us
            </h2>
            <p>
              If you have any questions about these Terms, please contact us at
              support@sixywin.app.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
