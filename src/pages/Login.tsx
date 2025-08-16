import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Icons } from "@/components/ui/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IMAGES } from "@/libs/constants";
import { useWebSocketStore } from "@/store/websocketStore";
import type { LoginRequestPayload } from "@/libs/interfaces";
import { hashPassword } from "@/utils/hmac";
import FacebookButton from "@/components/shared/FacebookButton";
import { GoogleButton } from "@/components/shared/GoogleButton";

export default function LoginPage() {
  const navigate = useNavigate();
  const { sendMessage, user, errorMessage } = useWebSocketStore();
  useEffect(() => {
    if (user) {
      navigate("/games");
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const hashedPassword = hashPassword(formData.password);
    const loginPayload: LoginRequestPayload = {
      emailOrUsername: formData.emailOrUsername,
      password: hashedPassword,
    };
    sendMessage("login", loginPayload);
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
            data-ai-hint="cartoon winner"
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
            <div className="grid gap-6">
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
              {errorMessage && (
                <p className="text-red-500 text-sm mt-1 ml-3">{errorMessage}</p>
              )}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    onChange={() => {}}
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
                onClick={(e) =>
                  handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
                }
              >
                Login
              </Button>
            </div>
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
            <div className="grid grid-cols-2 gap-4">
              <GoogleButton />
              <FacebookButton />
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
