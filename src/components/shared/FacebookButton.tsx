import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
// import { useWebSocketStore } from "@/store/websocketStore";

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

export default function FacebookButton() {
  //   const { sendMessage } = useWebSocketStore();
  const [fbLoaded, setFbLoaded] = useState(false);

  useEffect(() => {
    // Initialize fbAsyncInit
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: import.meta.env.VITE_FACEBOOK_APP_ID, // FB App ID from .env
        cookie: true,
        xfbml: false,
        version: "v17.0", // valid FB API version
      });
      setFbLoaded(true); // SDK is ready
    };

    // Load the SDK script
    if (!document.getElementById("facebook-jssdk")) {
      const js = document.createElement("script");
      js.id = "facebook-jssdk";
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      js.async = true;
      js.defer = true;
      document.body.appendChild(js);
    }
  }, []);

  const handleFBLogin = () => {
    if (!fbLoaded || !window.FB) {
      console.error("Facebook SDK not loaded yet");
      return;
    }

    window.FB.login(
      (response: any) => {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;

          window.FB.api(
            "/me",
            { fields: "id,name,email,picture", access_token: accessToken }, // Pass token here
            (profile: any) => {
              console.log("Profile info:", profile);
            }
          );
        }
      },
      { scope: "public_profile,email", return_scopes: true }
    );
  };

  return (
    <Button
      className="h-12 animation-all hover:scale-105 active:scale-95 bg-[#1877F2] text-white hover:bg-[#1877F2]/90"
      onClick={handleFBLogin}
      disabled={!fbLoaded} // wait until SDK is loaded
    >
      <Icons.facebook className="mr-2 h-5 w-5" />
      Facebook
    </Button>
  );
}
