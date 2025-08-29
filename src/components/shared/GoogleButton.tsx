import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "../ui/button";
import { Icons } from "../ui/icons";
import { GooglePayload } from "@/libs/interfaces";
import { useApiRequest } from "@/libs/apiRequest";
import { useEffect } from "react";
import { saveUserProfile } from "@/utils/storage";
import { useWebSocketStore } from "@/store/websocketStore";
import { useNavigate } from "react-router-dom";

export const GoogleButton = () => {
  const referralId = new URLSearchParams(window.location.search).get(
    "referralId"
  );
  const { setUserData, sendMessage } = useWebSocketStore();
  const navigate = useNavigate();

  // Initialize API request hook (data will be passed at call time)
  const {
    data,
    request: sendSocialLogin,
    loading,
    success,
  } = useApiRequest<GooglePayload>({
    url: "/user/socialLogin",
    method: "POST",
    isToken: false,
  });

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const res = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`
      );
      const profile = await res.json();

      const userData: GooglePayload = {
        email: profile.email,
        username: profile.name,
        avatar: profile.picture,
        googleId: profile.sub,
        referralId: referralId || undefined,
      };

      console.log("Google user data:", userData);

      // Send data to backend
      await sendSocialLogin(userData);
    },
    onError: () => console.log("Google login failed"),
  });

  useEffect(() => {
    if (success) {
      saveUserProfile(data.user, data.token);
      setUserData(data.user, data.token);
      sendMessage("addUserToConnections", {});
      navigate("/games");
    }
  }, [success, data]);

  return (
    <Button
      onClick={() => handleGoogleLogin()}
      className="h-12 animation-all hover:scale-105 active:scale-95 bg-red-600 text-white hover:bg-red-600/90"
      disabled={loading}
    >
      <Icons.google className="mr-2 h-5 w-5" />
      {loading ? "Loading..." : "Google"}
    </Button>
  );
};
