import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "../ui/button";
import { Icons } from "../ui/icons";
import { useWebSocketStore } from "@/store/websocketStore";
import { GooglePayload } from "@/libs/interfaces";

export const GoogleButton = () => {
  const { sendMessage } = useWebSocketStore();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(false);
      const res = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`
      );
      const profile = await res.json();
      const userData: GooglePayload = {
        email: profile.email,
        username: profile.name,
        avatar: profile.picture,
        googleId: profile.sub,
      };
      sendMessage("googleLogin", userData);
    },
    onError: (error) => {
      setLoading(false);
      console.log("Google login failed", error);
    },
  });

  return (
    <Button
      onClick={() => {
        setLoading(true);
        handleGoogleLogin();
      }}
      className="h-12 animation-all hover:scale-105 active:scale-95 bg-red-600 text-white hover:bg-red-600/90"
      disabled={loading}
    >
      <Icons.google className="mr-2 h-5 w-5" />
      {loading ? "Loading..." : "Google"}
    </Button>
  );
};
