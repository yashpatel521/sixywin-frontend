import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DataDeletionPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">
            Data Deletion Instructions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-muted-foreground">
          <div className="space-y-2">
            <p>
              You have the right to request deletion of your personal data
              associated with SixyWin. To do so:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-4">
              <li>
                Email us at <strong>support@sixywin.app</strong> with your
                account details and request data deletion.
              </li>
              <li>
                If you have an account, you can also delete your account
                directly from your profile page in the app.
              </li>
            </ul>
            <p>
              Once your request is received, we will process it within a
              reasonable timeframe and confirm that your data has been deleted.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
