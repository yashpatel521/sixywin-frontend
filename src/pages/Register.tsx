import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/shared/icons";
import { User, Lock, Gift, Eye, EyeOff } from "lucide-react";
import { wsClient } from "@/websocket";
import { UserType } from "@/types/interfaces";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { tokenStorage, userStorage } from "@/lib/localStorage";
import { IMAGES } from "@/lib/constants";

export default function SignupPage() {
  // if the user is already logged in, redirect to the home page
  const [user] = useLocalStorage<UserType | null>("user", null);
  const navigate = useNavigate();
  if (user) {
    navigate("/games");
  }

  const query = new URLSearchParams(useLocation().search);
  const ref = query.get("ref");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  // see password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    if (userData.password === "" || userData.confirmPassword === "") {
      setIsPasswordValid(true);
      return;
    }
    if (userData.password !== userData.confirmPassword) {
      setIsPasswordValid(false);
    } else {
      setIsPasswordValid(true);
    }
  }, [userData.password, userData.confirmPassword]);

  // take all the data from the form and send it to the backend
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (!isPasswordValid) {
      return; // Password validation error is handled by the form
    }

    setIsLoading(true);
    const requestId = Date.now().toString();

    // Set up response handler
    const handleResponse = (message: any) => {
      if (message.requestId === requestId) {
        wsClient.off("register_response", handleResponse);
        setIsLoading(false);

        if (message.payload.success) {
          // Registration successful
          tokenStorage.setToken(message.payload.data.token);
          userStorage.setUser(message.payload.data.user);
          navigate("/games");
        } else {
          // Registration failed
          setError(message.payload.message);
        }
      }
    };

    // Listen for response
    wsClient.on("register_response", handleResponse);

    // Send register request via WebSocket
    wsClient.send({
      type: "register",
      payload: {
        username: userData.username,
        email: userData.email,
        password: userData.password,
      },
      requestId: requestId,
      timestamp: new Date().toISOString(),
    });

    // Timeout after 10 seconds
    setTimeout(() => {
      wsClient.off("register_response", handleResponse);
      setIsLoading(false);
      setError("Registration timeout. Please try again.");
    }, 10000);
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
                <span className="font-headline text-2xl font-bold">
                  SixyWin
                </span>
              </div>
            </Link>
            <h2 className="text-sm font-semibold uppercase text-muted-foreground mb-4 text-center">
              Sign Up
            </h2>
            <div className="grid gap-6">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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
                  <Eye className="h-5 w-5" />
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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
                  <EyeOff className="h-5 w-5" />
                </button>
              </div>
              {!isPasswordValid &&
                userData.password &&
                userData.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1 ml-3">
                    Passwords do not match
                  </p>
                )}
              {error && (
                <p className="text-red-500 text-sm mt-1 ml-3">{error}</p>
              )}
              <div className="relative">
                <Gift className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-12 animation-all hover:scale-105 active:scale-95 bg-white text-black hover:bg-gray-200"
              >
                <Icons.google className="mr-2 h-5 w-5" />
                Google
              </Button>
              <Button className="h-12 animation-all hover:scale-105 active:scale-95 bg-[#1877F2] text-white hover:bg-[#1877F2]/90">
                <Icons.facebook className="mr-2 h-5 w-5" />
                Facebook
              </Button>
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
            className="rounded-full object-cover mb-6 shadow-2xl animation-all hover:scale-105"
            data-ai-hint="cartoon winner"
          />
          <h1 className="font-headline text-4xl font-bold text-foreground">
            Create Your Account
          </h1>
          <p className="text-muted-foreground mt-2 max-w-sm">
            Register to play daily, pick your lucky numbers, and win virtual
            coins!
            <br />
            Join the fun, compete on the leaderboard, and enjoy the thrill of
            the draw every day. Sign up now and see if today is your lucky day!
          </p>
        </div>
      </Card>
    </div>
  );
}
