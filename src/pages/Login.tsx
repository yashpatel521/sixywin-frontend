import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Icons } from "@/components/ui/icons";
import { useState, useEffect } from "react";
import { IMAGES } from "@/libs/constants";
import { GoogleButton } from "@/components/shared/GoogleButton";
import { useApiRequest } from "@/libs/apiRequest"; // centralized API hook
import { hashPassword } from "@/utils/hmac";
import {
  clearCredentials,
  getCredentials,
  getUserProfile,
  saveCredentials,
  saveUserProfile,
} from "@/utils/storage";
import { useWebSocketStore } from "@/store/websocketStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const [rememberMeChecked, setRememberMeChecked] = useState(false);
  const { setUserData, sendMessage } = useWebSocketStore();
  // check user is already logged in
  const localData = getUserProfile();
  const isLoggedIn = !!localData?.user;
  if (isLoggedIn) {
    navigate("/games");
  }

  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });

  // Use centralized API request
  const { loading, data, error, message, request, success } = useApiRequest({
    url: "/user/login",
    data: {
      email: formData.emailOrUsername,
      password: hashPassword(formData.password),
    },
    isToken: false,
  });

  // Auto-fill remember me
  useEffect(() => {
    const rememberMeCredentials = getCredentials();
    if (rememberMeCredentials) {
      setFormData({
        emailOrUsername: rememberMeCredentials.emailOrUsername,
        password: rememberMeCredentials.password,
      });
      setRememberMeChecked(true);
    }
  }, []);

  // Redirect on successful login
  useEffect(() => {
    if (success) {
      saveUserProfile(data.user, data.token);
      setUserData(data.user, data.token);
      sendMessage("addUserToConnections", {});
      navigate("/games");
    }
  }, [data, success, navigate, setUserData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await request();
    // Save credentials if remember me is checked
    if (rememberMeChecked) {
      saveCredentials(formData.emailOrUsername, formData.password);
    }
  };

  const rememberMeFunc = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRememberMeChecked(e.target.checked);
    if (!e.target.checked) clearCredentials();
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center p-4 bg-gradient-to-br from-yellow-900/80 via-background/80 to-background">
      <Card className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl glassmorphism border-none">
        <div className="hidden md:flex flex-col justify-center items-center p-12 bg-primary/10 relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-yellow-900/50 opacity-50 shapes" />
          <img
            src={IMAGES.loginImage}
            alt="Joyful cartoon person celebrating with playing cards"
            className=" object-cover"
          />
          <p className="text-muted-foreground mt-2 max-w-sm">
            Welcome back to SixyWin! Log in to spin, earn coins, and track your
            lucky streak.
          </p>
        </div>
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <CardContent className="p-0">
            <Link
              to="/"
              className="flex justify-center items-center gap-3 mb-6"
            >
              <Icons.logo />
            </Link>
            <h2 className="text-sm font-semibold uppercase text-muted-foreground mb-4 text-center">
              Login to Your Account
            </h2>
            <form onSubmit={handleSubmit} className="grid gap-6">
              <div className="relative">
                <Icons.user className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="emailOrUsername"
                  type="text"
                  placeholder="Email or Username"
                  required
                  name="emailOrUsername"
                  value={formData.emailOrUsername}
                  onChange={handleChange}
                  className="pl-10 h-12 rounded-lg animation-all focus:scale-[1.02]"
                />
              </div>
              <div className="relative">
                <Icons.lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 h-12 rounded-lg animation-all focus:scale-[1.02]"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm mt-1 ml-3">{error}</p>
              )}
              {message && (
                <p className="text-green-500 text-sm mt-1 ml-3">{message}</p>
              )}

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    onChange={rememberMeFunc}
                    checked={rememberMeChecked}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="remember">Remember me</Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="underline text-muted-foreground hover:text-primary"
                >
                  Forgot your password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-lg text-base font-bold animation-all hover:scale-105 active:scale-95"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid ">
              <GoogleButton />
            </div>
            <div className="mt-6 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="font-semibold text-primary">
                Sign up
              </Link>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
