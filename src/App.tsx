import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import { WebSocketProvider } from "./contexts/WebSocketContext";
import { ROUTES } from "./constants/routes";
import { Toaster } from "./components/ui/toaster";
import { Header } from "./components/layout/header";
import { Footer } from "./components/layout/footer";
import { VersionInfo } from "./components/shared/version-info";

// Lazy load pages for better performance
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const LandingPage = React.lazy(() => import("./pages/Landing"));
const AboutUsPage = React.lazy(() => import("./pages/AboutUs"));
const ContactUsPage = React.lazy(() => import("./pages/ContactUsPage"));
const PrivacyPolicyPage = React.lazy(() => import("./pages/Privacy"));
const TermsOfServicePage = React.lazy(
  () => import("./pages/TermsOfServicePage")
);
const GamesPage = React.lazy(() => import("./pages/Games"));
const PlayLotteryPage = React.lazy(() => import("./pages/PlayLottery"));
const DoubleTroublePage = React.lazy(() => import("./pages/DoubleTrouble"));
const LeaderboardPage = React.lazy(() => import("./pages/Learderboard"));
const ProfilePage = React.lazy(() => import("./pages/Profile"));
const UserProfilePage = React.lazy(() => import("./pages/UserProfile"));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
  </div>
);

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
    <HelmetProvider>
      <div className="fixed inset-0 -z-10 h-full w-full bg-gradient-to-br from-yellow-900/80 via-background/80 to-background" />
      <div className="relative flex min-h-dvh flex-col pb-24">
        <WebSocketProvider>
          <main className="flex-1">
            <Suspense fallback={<PageLoader />}>
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
            </Suspense>
          </main>
        </WebSocketProvider>
        <Toaster />
        {/* Development version info - only shows in development */}
        {import.meta.env.DEV && <VersionInfo />}
        {/* <StickyAdBanner /> */}
      </div>
    </HelmetProvider>
  );
};

export default App;
