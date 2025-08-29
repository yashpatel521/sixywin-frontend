import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import { Toaster } from "./components/ui/toaster";
import { ProtectedRoutes } from "./utils/ProtecedRoutes";
import { useWebSocketHandlers } from "./hooks/useWebSocketHandlers";
import { useEffect } from "react";
import { initPerformanceOptimizations } from "./utils/performance";

// Import all your pages
import AboutUsPage from "./pages/AboutUs";
import ContactUsPage from "./pages/ContactUsPage";
import LandingPage from "./pages/Landing";
import PrivacyPolicyPage from "./pages/Privacy";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import GamesPage from "./pages/Games";
import ProfilePage from "./pages/Profile";
import LeaderboardPage from "./pages/Leaderboard";
import UserProfilePage from "./pages/UserProfile";
import PlayLotteryPage from "./pages/PlayLottery";
import DoubleTroublePage from "./pages/DoubleTrouble";
import AviatorPage from "./pages/Aviator";
import FAQPage from "./pages/FAQ";
import HowToPlayPage from "./pages/HowToPlay";
// Import 404 page
import NotFoundPage from "./pages/NotFound";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Footer } from "./components/layout/footer";
import { Header } from "./components/layout/header";
import { GOOGLE_CLIENT_ID } from "./libs/constants";
// Define your route configs
const publicRoutes = [
  { path: "/", element: <LandingPage /> },
  { path: "/about-us", element: <AboutUsPage /> },
  { path: "/contact-us", element: <ContactUsPage /> },
  { path: "/privacy-policy", element: <PrivacyPolicyPage /> },
  { path: "/terms-of-service", element: <TermsOfServicePage /> },
  { path: "/faq", element: <FAQPage /> },
  { path: "/how-to-play", element: <HowToPlayPage /> },
];

const protectedRoutes = [
  { path: "/games", element: <GamesPage /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/leaderboard", element: <LeaderboardPage /> },
  { path: "/user/:userId", element: <UserProfilePage /> },
  { path: "/games/play-lottery", element: <PlayLotteryPage /> },
  { path: "/games/double-trouble", element: <DoubleTroublePage /> },
  { path: "/games/aviator", element: <AviatorPage /> },
];

// Special-case routes (login, register, etc.)
const authRoutes = [
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
];

function App() {
  useWebSocketHandlers(); // Initialize WebSocket handlers

  // Initialize performance monitoring
  useEffect(() => {
    initPerformanceOptimizations();
  }, []);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <WebSocketProvider>
          <div className="fixed inset-0 -z-10 h-full w-full bg-gradient-to-br from-yellow-900/80 via-background/80 to-background" />
          <div className="relative flex min-h-dvh flex-col">
            <main className="flex-1">
              <Routes>
                {authRoutes.map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))}

                {protectedRoutes.map(({ path, element }) => (
                  <Route
                    key={path}
                    path={path}
                    element={<ProtectedRoutes>{element}</ProtectedRoutes>}
                  />
                ))}

                {publicRoutes.map(({ path, element }) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <>
                        <Header />
                        {element}
                        <Footer />
                      </>
                    }
                  />
                ))}

                {/* 404 route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              <Toaster />
            </main>
          </div>
        </WebSocketProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
