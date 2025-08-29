import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Navigate } from "react-router-dom";
import { useMemo } from "react";
import { getUserProfile } from "./storage";

export const ProtectedRoutes = ({
  children,
}: {
  children: React.ReactNode;
  isProtected?: boolean;
}) => {
  const userProfile = getUserProfile();
  const isAuthenticated = useMemo(() => !!userProfile?.user, [userProfile]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};
