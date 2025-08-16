import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { IMAGES } from "@/libs/constants";
import { useWebSocketStore } from "@/store/websocketStore";
import { hashPassword } from "@/utils/hmac";
import { GoogleButton } from "@/components/shared/GoogleButton";

export default function SignupPage() {
  const navigate = useNavigate();
  // if the user is already logged in, redirect to the home page
  const { sendMessage, errorMessage, user } = useWebSocketStore();
  useEffect(() => {
    if (user) {
      navigate("/games");
    }
  }, [user, navigate]);
  const query = new URLSearchParams(useLocation().search);
  const ref = query.get("ref");

  // see password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralId: ref || "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // check if the password and confirm password are the same
  useEffect(() => {
    setIsPasswordValid(userData.password === userData.confirmPassword);
  }, [userData.password, userData.confirmPassword]);

  // take all the data from the form and send it to the backend
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const hashedPassword = hashPassword(userData.password);
    sendMessage("register", { ...userData, password: hashedPassword });
    setIsLoading(false);
  };

  return (
    <div className="relative flex min-h-dvh items-center justify-center p-4 bg-gradient-to-br from-yellow-900/80 via-background/80 to-background">
      <Card className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl glassmorphism border-none">
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <CardContent className="p-0">
            <Link
              to="/"
              className="flex justify-center items-center gap-3 mb-6"
            >
              <div className="flex items-center space-x-2">
                <Icons.logo className="h-8 w-8" />
              </div>
            </Link>
            <h2 className="text-sm font-semibold uppercase text-muted-foreground mb-4 text-center">
              Sign Up
            </h2>
            <div className="grid gap-6">
              {/* First row - Username and Email in two columns on large screens */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="relative">
                  <Icons.user className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Username"
                    required
                    className="pl-10 h-12 rounded-lg animation-all focus:scale-[1.02]"
                    name="username"
                    value={userData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="relative">
                  <Icons.user className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    required
                    className="pl-10 h-12 rounded-lg animation-all focus:scale-[1.02]"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Second row - Password and Confirm Password in two columns on large screens */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="relative">
                  <Icons.lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    className="pl-10 pr-10 h-12 rounded-lg animation-all focus:scale-[1.02]"
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground hover:text-foreground"
                  >
                    <Icons.eye className="h-5 w-5" />
                  </button>
                </div>
                <div className="relative">
                  <Icons.lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    required
                    className="pl-10 pr-10 h-12 rounded-lg animation-all focus:scale-[1.02]"
                    name="confirmPassword"
                    value={userData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground hover:text-foreground"
                  >
                    <Icons.eyeOff className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Password validation error */}
              {!isPasswordValid &&
                userData.password &&
                userData.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1 ml-3">
                    Passwords do not match
                  </p>
                )}
              {errorMessage && (
                <p className="text-red-500 text-sm mt-1 ml-3">{errorMessage}</p>
              )}

              {/* Referral ID - Full width */}
              <div className="relative">
                <Icons.gift className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="referral-id"
                  type="text"
                  placeholder="Referral ID (Optional)"
                  className="pl-10 h-12 rounded-lg animation-all focus:scale-[1.02]"
                  name="referralId"
                  value={userData.referralId}
                  onChange={handleChange}
                />
              </div>

              {/* Submit Button - Full width */}
              <Button
                onClick={(e) =>
                  handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
                }
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Create Account"}
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
            <div className="grid ">
              <GoogleButton />
            </div>
            <div className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-primary">
                Login
              </Link>
            </div>
          </CardContent>
        </div>
        <div className="hidden md:flex flex-col justify-center items-center p-12 bg-primary/10 relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 to-yellow-900/50 opacity-50 shapes" />
          <img
            src={IMAGES.loginImage}
            alt="Joyful cartoon person celebrating with playing cards"
            className="object-cover"
            data-ai-hint="cartoon winner"
          />
          <p className="text-muted-foreground mt-2 max-w-sm">
            Join SixyWin and start spinning! Pick your lucky numbers, earn
            coins, and climb the leaderboard — all for free.
          </p>
        </div>
      </Card>
    </div>
  );
}
