import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/ui/icons";
import { User } from "@/libs/interfaces";

export const Referrals = ({ user }: { user: User }) => {
  return (
    <Card className="glassmorphism animation-all hover:shadow-2xl">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="font-headline text-xl md:text-2xl flex items-center gap-2">
          <Icons.users className="h-5 w-5 md:h-6 md:w-6 text-primary" />
          Your Referred Users ({user?.referrals?.length || 0})
        </CardTitle>
        <CardDescription className="text-sm md:text-base">
          Users you've successfully referred.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 md:p-6 overflow-x-auto">
        {user?.referrals && user.referrals.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-muted-foreground/30">
                <th className="px-3 py-2 text-sm md:text-base">User</th>
                <th className="px-3 py-2 text-sm md:text-base">Joined</th>
                <th className="px-3 py-2 text-sm md:text-base">Coins</th>
                <th className="px-3 py-2 text-sm md:text-base">Winnings</th>
                <th className="px-3 py-2 text-sm md:text-base">Today's Bids</th>
              </tr>
            </thead>
            <tbody>
              {user.referrals.map((referral) => {
                const refUser = referral.referred;
                return (
                  <tr
                    key={referral.id}
                    className="hover:bg-muted/10 transition-all"
                  >
                    <td className="px-3 py-2 flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={
                            refUser.avatar ||
                            `https://ui-avatars.com/api/?name=${refUser.username}&background=random`
                          }
                          alt={refUser.username || "Referred User"}
                        />
                        <AvatarFallback>
                          {refUser.username?.substring(0, 2).toUpperCase() ||
                            "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm md:text-base font-medium">
                        {refUser.username}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm md:text-base text-muted-foreground">
                      {new Date(referral.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2 text-sm md:text-base font-medium text-primary">
                      {refUser.coins || 0}
                    </td>
                    <td className="px-3 py-2 text-sm md:text-base font-medium text-primary">
                      {refUser.winningAmount || 0}
                    </td>
                    <td className="px-3 py-2 text-sm md:text-base font-medium text-primary">
                      {refUser.todaysBids || 0}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-6 md:py-8 text-muted-foreground">
            <p className="text-base md:text-lg font-medium">
              No referrals yet!
            </p>
            <p className="text-xs md:text-sm">
              Share your referral ID to bring friends.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
