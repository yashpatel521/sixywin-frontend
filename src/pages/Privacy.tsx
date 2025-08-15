import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">
            Privacy Policy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              1. Introduction
            </h2>
            <p>
              Welcome to SixyWin. We are committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our application. By using
              SixyWin, you agree to the collection and use of information in
              accordance with this policy.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              2. Information We Collect
            </h2>
            <p>
              We may collect information about you in a variety of ways. The
              information we may collect on the Service includes:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>
                <strong>Personal Data:</strong> Personally identifiable
                information, such as your name, email address, that you
                voluntarily give to us when you register with the Service.
              </li>
              <li>
                <strong>Usage Data:</strong> Information that your browser sends
                whenever you visit our Service or when you access the Service by
                or through a mobile device. This may include your IP address,
                browser type, and version.
              </li>
              <li>
                <strong>Game Data:</strong> We collect data related to your game
                activity, such as tickets played, numbers chosen, coins won, and
                leaderboard status.
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              3. Use of Your Information
            </h2>
            <p>
              Having accurate information about you permits us to provide you
              with a smooth, efficient, and customized experience. Specifically,
              we may use information collected about you via the Service to:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>Create and manage your account.</li>
              <li>Operate and maintain the game.</li>
              <li>Display your profile and game activity to other users.</li>
              <li>
                Compile anonymous statistical data and analysis for use
                internally.
              </li>
              <li>
                Monitor and analyze usage and trends to improve your experience
                with the Service.
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              4. Disclosure of Your Information
            </h2>
            <p>
              We do not share, sell, rent, or trade your information with third
              parties for their commercial purposes. We may share information we
              have collected about you in certain situations, such as with other
              players on the leaderboard or on your public profile page.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              5. Security of Your Information
            </h2>
            <p>
              We use administrative, technical, and physical security measures
              to help protect your personal information. While we have taken
              reasonable steps to secure the personal information you provide to
              us, please be aware that despite our efforts, no security measures
              are perfect or impenetrable, and no method of data transmission
              can be guaranteed against any interception or other type of
              misuse.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              6. Your Rights
            </h2>
            <p>
              You have the right to access, update, or delete the information we
              have on you. You can update your account information at any time
              by logging into your account and visiting your profile page.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              7. No In-App Purchases
            </h2>
            <p>
              SixyWin is a free-to-play application. There are no in-app
              purchases or any requirements to spend real money to use the
              Service or participate in any of the games.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              8. Contact Us
            </h2>
            <p>
              If you have questions or comments about this Privacy Policy,
              please contact us at support@sixywin.app.
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              9. No Gambling Disclaimer
            </h2>
            <p>
              SixyWin is not a gambling application. The virtual coins used in
              the app have no real-world value and cannot be exchanged for cash
              or any other items of monetary value. We provide coupons and other
              rewards as part of our entertainment service. All activities
              within the app are for entertainment purposes only.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
