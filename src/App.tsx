import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WebSocketProvider } from "./contexts/WebSocketContext";
import { Toaster } from "./components/ui/toaster";
import { ProtectedRoutes } from "./utils/ProtecedRoutes";
import { useWebSocketHandlers } from "./hooks/useWebSocketHandlers";

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
// Optionally, import your 404 page
// import NotFoundPage from "./pages/NotFound";
import { GoogleOAuthProvider } from "@react-oauth/google";
import DataDeletionPage from "./pages/DataDeletionPage";
// Define your route configs
const publicRoutes = [
  { path: "/", element: <LandingPage /> },
  // Example React route
  { path: "/about-us", element: <AboutUsPage /> },
  { path: "/contact-us", element: <ContactUsPage /> },
  { path: "/privacy-policy", element: <PrivacyPolicyPage /> },
  { path: "/terms-of-service", element: <TermsOfServicePage /> },
  { path: "/data-deletion", element: <DataDeletionPage /> },
];

const protectedRoutes = [
  { path: "/games", element: <GamesPage /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/leaderboard", element: <LeaderboardPage /> },
  { path: "/user/:userId", element: <UserProfilePage /> },
  { path: "/play-lottery", element: <PlayLotteryPage /> },
  { path: "/double-trouble", element: <DoubleTroublePage /> },
  { path: "/aviator", element: <AviatorPage />, checklogin: false },
  { path: "/about-us", element: <AboutUsPage />, checklogin: false },
  { path: "/contact-us", element: <ContactUsPage />, checklogin: false },
  {
    path: "/privacy-policy",
    element: <PrivacyPolicyPage />,
    checklogin: false,
  },
  {
    path: "/terms-of-service",
    element: <TermsOfServicePage />,
    checklogin: false,
  },
  {
    path: "/data-deletion",
    element: <DataDeletionPage />,
    checklogin: false,
  },
];

// Special-case routes (login, register, etc.)
const authRoutes = [
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> }, // Can use a prop to distinguish
];

function App() {
  useWebSocketHandlers(); // Initialize WebSocket handlers

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <WebSocketProvider>
          <div className="fixed inset-0 -z-10 h-full w-full bg-gradient-to-br from-yellow-900/80 via-background/80 to-background" />
          <div className="relative flex min-h-dvh flex-col">
            <main className="flex-1">
              <Routes>
                {authRoutes.map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))}

                {protectedRoutes.map(({ path, element, checklogin }) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <ProtectedRoutes
                        isProtected={true}
                        checklogin={checklogin}
                      >
                        {element}
                      </ProtectedRoutes>
                    }
                  />
                ))}

                {publicRoutes.map(({ path, element }) => (
                  <Route
                    key={path}
                    path={path}
                    element={
                      <ProtectedRoutes isProtected={false}>
                        {element}
                      </ProtectedRoutes>
                    }
                  />
                ))}

                {/* Optional 404 route */}
                {/* <Route path="*" element={<NotFoundPage />} /> */}
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
