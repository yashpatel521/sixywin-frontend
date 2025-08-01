import React from "react";
import { Routes, Route } from "react-router-dom";

import { WebSocketProvider } from "./contexts/WebSocketContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { ROUTES } from "./constants/routes";
import { Toaster } from "./components/ui/toaster";

import LandingPage from "./pages/Landing";
import AboutUsPage from "./pages/AboutUs";
import { Header } from "./components/layout/header";
import { Footer } from "./components/layout/footer";
import ContactUsPage from "./pages/ContactUsPage";
import PrivacyPolicyPage from "./pages/Privacy";
import TermsOfServicePage from "./pages/TermsOfServicePage";
import GamesPage from "./pages/Games";
import PlayLotteryPage from "./pages/PlayLottery";
import DoubleTroublePage from "./pages/DoubleTrouble";
import LeaderboardPage from "./pages/Learderboard";
import ProfilePage from "./pages/Profile";
import UserProfilePage from "./pages/UserProfile";

const layoutWithHeaderAndFooter = (children: React.ReactNode) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

const App: React.FC = () => {
  return (
    <>
      <div className="fixed inset-0 -z-10 h-full w-full bg-gradient-to-br from-yellow-900/80 via-background/80 to-background" />
      <div className="relative flex min-h-dvh flex-col">
        <WebSocketProvider>
          <main className="flex-1">
            <Routes>
              {/* Auth pages without header/footer */}
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.REGISTER} element={<Register />} />

              {/* Pages with header/footer */}
              <Route
                path={ROUTES.HOME}
                element={layoutWithHeaderAndFooter(<LandingPage />)}
              />
              <Route
                path={ROUTES.ABOUT}
                element={layoutWithHeaderAndFooter(<AboutUsPage />)}
              />
              <Route
                path={ROUTES.CONTACT}
                element={layoutWithHeaderAndFooter(<ContactUsPage />)}
              />
              <Route
                path={ROUTES.TermsOfServicePage}
                element={layoutWithHeaderAndFooter(<TermsOfServicePage />)}
              />
              <Route
                path={ROUTES.PrivacyPolicyPage}
                element={layoutWithHeaderAndFooter(<PrivacyPolicyPage />)}
              />
              <Route
                path={ROUTES.GAMES}
                element={layoutWithHeaderAndFooter(<GamesPage />)}
              />
              <Route
                path={ROUTES.PLAY_LOTTERY}
                element={layoutWithHeaderAndFooter(<PlayLotteryPage />)}
              />
              <Route
                path={ROUTES.DOUBLE_TROUBLE}
                element={layoutWithHeaderAndFooter(<DoubleTroublePage />)}
              />

              <Route
                path={ROUTES.LEADERBOARD}
                element={layoutWithHeaderAndFooter(<LeaderboardPage />)}
              />
              <Route
                path={ROUTES.PROFILE}
                element={layoutWithHeaderAndFooter(<ProfilePage />)}
              />
              <Route
                path={ROUTES.USER_PROFILE}
                element={layoutWithHeaderAndFooter(<UserProfilePage />)}
              />

              {/* Catch all route - redirect to home */}
              <Route path="*" element={<LandingPage />} />
            </Routes>
          </main>
        </WebSocketProvider>
        <Toaster />
        {/* <StickyAdBanner /> */}
      </div>
    </>
  );
};

export default App;
